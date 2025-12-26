// server/index.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// --- ИМПОРТЫ СЕРВИСОВ ---
import pool from './db.js'; 
import { 
    findOrCreateUser, 
    createOrder, 
    createPayment, 
    updateOrderStatus, 
    updateUserExternalIds,
    registerUser, 
    loginUser, 
    processCommissions, 
    getUserDashboard 
} from './services/dbService.js';
import { addUserToCourse } from './services/skillspaceService.js';
import { sendWelcomeEmail } from './services/emailService.js';
import { sendUdsPurchase } from './services/udsService.js';
import { verifyToken } from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==========================================
// 1. АВТОРИЗАЦИЯ (AUTH)
// ==========================================

// Регистрация (Создание пароля)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, phone, password, referrer_code } = req.body;
        
        // Очистка телефона
        let cleanedPhone = phone.replace(/[^\d+]/g, '');
        if (cleanedPhone.startsWith('8')) cleanedPhone = '+7' + cleanedPhone.slice(1);
        if (cleanedPhone.startsWith('7') && !cleanedPhone.startsWith('+7')) cleanedPhone = '+' + cleanedPhone;

        const user = await registerUser(email, cleanedPhone, name, password, referrer_code);
        
        // Создаем токен (действует 30 дней)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        
        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (e) {
        console.error('Ошибка регистрации:', e);
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);

        if (!user) return res.status(400).json({ error: 'Неверный email или пароль' });
        if (user === 'no_password') return res.status(400).json({ error: 'Аккаунт существует, но пароль не задан. Восстановите доступ.' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (e) {
        console.error('Ошибка входа:', e);
        res.status(500).json({ error: 'Ошибка входа' });
    }
});

// Данные Личного Кабинета (Защищено)
app.get('/api/dashboard', verifyToken, async (req, res) => {
    try {
        const data = await getUserDashboard(req.user.id);
        res.json(data);
    } catch (e) {
        console.error('Ошибка дашборда:', e);
        res.status(500).json({ error: 'Ошибка получения данных' });
    }
});

// ==========================================
// 2. ОПЛАТА (PAYMENT) - ЮКасса
// ==========================================

// Создание платежа
app.post('/api/payment/create', async (req, res) => {
    try {
        const { email, phone, name, amount, tariff, referrer_code } = req.body;
        
        // Очистка телефона
        let cleanedPhone = phone.replace(/[^\d+]/g, '');
        if (cleanedPhone.startsWith('8')) cleanedPhone = '+7' + cleanedPhone.slice(1);
        if (cleanedPhone.startsWith('7') && !cleanedPhone.startsWith('+7')) cleanedPhone = '+' + cleanedPhone;

        console.log('📦 Новый заказ:', { email, amount, tariff, phone: cleanedPhone, ref: referrer_code });

        // 1. Сохраняем пользователя и реферальный код в базу
        const user = await findOrCreateUser(email, cleanedPhone, name, referrer_code);
        
        // 2. Создаем заказ
        const order = await createOrder(user.id, amount, tariff);

        // 3. Данные для ЮКассы
        const idempotenceKey = uuidv4();
        const auth = Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64');

        const response = await axios.post('https://api.yookassa.ru/v3/payments', {
            amount: { value: amount, currency: 'RUB' },
            capture: true,
            confirmation: {
                type: 'redirect',
                return_url: `https://silavdele.ru/payment/success?order_id=${order.id}`
            },
            description: `Оплата тарифа ${tariff} (${email})`,
            metadata: { 
                order_id: order.id,
                referrer_code: referrer_code || '' 
            },
            receipt: {
                customer: { email: email, phone: cleanedPhone },
                items: [{
                    description: `Курс: ${tariff}`,
                    quantity: "1.00",
                    amount: { value: amount, currency: "RUB" },
                    vat_code: "1",
                    payment_mode: "full_payment",
                    payment_subject: "service"
                }]
            }
        }, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Idempotence-Key': idempotenceKey,
                'Content-Type': 'application/json'
            }
        });

        const paymentData = response.data;
        await createPayment(order.id, paymentData.id, amount, paymentData.status);
        
        res.json({ confirmation_url: paymentData.confirmation.confirmation_url });

    } catch (error) {
        console.error('❌ Ошибка создания платежа:', error.response?.data || error.message);
        res.status(500).json({ error: 'Не удалось создать платеж' });
    }
});

// Вебхук ЮКассы (Главная логика после оплаты на сайте)
app.post('/api/payment/webhook', async (req, res) => {
    try {
        const { event, object } = req.body;
        
        if (event !== 'payment.succeeded') {
            return res.status(200).send('OK');
        }

        const yookassaId = object.id;
        const status = object.status;
        const amountVal = Number(object.amount.value); 
        const metaOrderId = object.metadata?.order_id;
        const referrerCode = object.metadata?.referrer_code;

        console.log(`💰 Webhook ЮКасса: Оплата прошла! ID: ${metaOrderId}`);

        // 1. Обновляем статус заказа в БД
        const orderId = await updateOrderStatus(yookassaId, status, metaOrderId);

        if (orderId) {
            // Получаем полные данные пользователя
            const orderRes = await pool.query(
                `SELECT o.tariff_code, u.id as user_id, u.email, u.name, u.phone 
                 FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = $1`, 
                [orderId]
            );

            if (orderRes.rows.length > 0) {
                const data = orderRes.rows[0];
                console.log(`🚀 Обработка для: ${data.email}`);

                // --- A. SKILLSPACE ---
                let loginLink = null;
                try {
                    loginLink = await addUserToCourse(data.email, data.name, data.phone, data.tariff_code);
                    console.log('✅ Skillspace OK');
                } catch (err) {
                    console.error('❌ Skillspace Error:', err.message);
                }

                // --- B. UDS ---
                sendUdsPurchase(data.phone, amountVal, referrerCode)
                    .then(async (res) => {
                        if (res.success) {
                            console.log('✅ UDS Sync Complete');
                            if (res.udsClientId) {
                                await updateUserExternalIds(data.user_id, null, res.udsClientId);
                            }
                        }
                    })
                    .catch(err => {
                        console.error('⚠️ UDS Error:', err.message);
                    });
                
                // --- C. EMAIL ---
                if (loginLink) {
                    await sendWelcomeEmail(data.email, data.name, loginLink, referrerCode);
                }

                // --- D. НАЧИСЛЕНИЕ КОМИССИЙ ---
                await processCommissions(orderId, data.user_id, amountVal);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('❌ Критическая ошибка вебхука ЮКассы:', error);
        res.status(500).send('Error');
    }
});

// Проверка статуса (для фронтенда)
app.get('/api/payment/check/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await pool.query('SELECT status FROM orders WHERE id = $1', [orderId]);
        if (result.rows.length > 0) {
            res.json({ status: result.rows[0].status });
        } else {
            res.status(404).json({ error: 'Заказ не найден' });
        }
    } catch (error) {
        console.error('Ошибка проверки:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ==========================================
// 3. ВЕБХУКИ UDS (Входящие данные)
// ==========================================

// А. Новая операция (Оплата в UDS на кассе или в приложении)
app.post('/api/webhooks/uds/operation', async (req, res) => {
    try {
        // UDS присылает данные о покупке
        const { action, customer, total } = req.body;
        
        // Нам интересны только покупки (PURCHASE) на сумму больше 0
        if (action === 'PURCHASE' && total > 0 && customer) {
            console.log(`💎 UDS Webhook: Операция на сумму ${total}`);

            const phone = customer.phone;
            const email = customer.email; 
            const name = customer.displayName || 'Ученик из UDS';
            const uid = customer.uid;

            if (phone) {
                // Очистка телефона
                let cleanedPhone = phone.replace(/[^\d+]/g, '');
                if (cleanedPhone.startsWith('8')) cleanedPhone = '+7' + cleanedPhone.slice(1);
                if (cleanedPhone.startsWith('7') && !cleanedPhone.startsWith('+7')) cleanedPhone = '+' + cleanedPhone;

                // 1. Ищем или создаем юзера в нашей базе
                // Если email нет, создаем временный (чтобы база пропустила)
                const userEmail = email || `no-email-${cleanedPhone.replace('+', '')}@silavdele.temp`;
                
                const user = await findOrCreateUser(userEmail, cleanedPhone, name);
                
                // Сохраняем UDS ID, раз он пришел
                if (uid) {
                    await updateUserExternalIds(user.id, null, uid);
                }

                // 2. Создаем заказ в нашей базе (чтобы видеть в статистике)
                const order = await createOrder(user.id, total, 'uds_purchase');
                // Сразу помечаем как оплаченный, так как это данные по факту оплаты
                await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['paid', order.id]);

                // 3. Если есть Email — выдаем доступ к курсу и шлем письмо
                if (email) {
                    console.log(`🚀 Выдаем доступ для ${email} (источник: UDS)`);
                    
                    // Skillspace
                    const loginLink = await addUserToCourse(email, name, cleanedPhone, "Базовый (UDS)");
                    
                    // Письмо
                    await sendWelcomeEmail(email, name, loginLink, user.referrer_code);
                } else {
                    console.log('⚠️ Email не указан в UDS. Доступ к Skillspace выдать нельзя.');
                }

                // 4. Начисляем комиссии (если у этого юзера есть реферер)
                await processCommissions(order.id, user.id, total);
            }
        }

        res.status(200).send('OK');
    } catch (e) {
        console.error('❌ Ошибка вебхука UDS Operation:', e);
        // Отвечаем 200, чтобы UDS не слал повторы бесконечно, даже если у нас ошибка
        res.status(200).send('Error processed');
    }
});

// Б. Новый клиент (Вступил в компанию через приложение)
app.post('/api/webhooks/uds/client', async (req, res) => {
    try {
        const { uid, phone, email, displayName } = req.body;
        
        console.log(`👤 UDS Webhook: Новый клиент ${displayName}`);

        if (phone) {
            let cleanedPhone = phone.replace(/[^\d+]/g, '');
            if (cleanedPhone.startsWith('8')) cleanedPhone = '+7' + cleanedPhone.slice(1);
            if (cleanedPhone.startsWith('7') && !cleanedPhone.startsWith('+7')) cleanedPhone = '+' + cleanedPhone;
            
            const userEmail = email || `no-email-${cleanedPhone.replace('+', '')}@silavdele.temp`;

            // Просто сохраняем в базу, чтобы он у нас был
            const user = await findOrCreateUser(userEmail, cleanedPhone, displayName);
            
            // Сохраняем связь с UDS
            if (uid) {
                await updateUserExternalIds(user.id, null, uid);
            }
        }

        res.status(200).send('OK');
    } catch (e) {
        console.error('❌ Ошибка вебхука UDS Client:', e);
        res.status(200).send('Error processed');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
