// server/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// --- ИМПОРТЫ СЕРВИСОВ ---
import pool from './db.js'; 
// ВАЖНО: Добавили updateUserExternalIds в импорт
import { findOrCreateUser, createOrder, createPayment, updateOrderStatus, updateUserExternalIds } from './services/dbService.js';
import { addUserToCourse } from './services/skillspaceService.js';
import { sendWelcomeEmail } from './services/emailService.js';
import { sendUdsPurchase } from './services/udsService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- 1. СОЗДАНИЕ ПЛАТЕЖА ---
app.post('/api/payment/create', async (req, res) => {
    try {
        const { email, phone, name, amount, tariff, referrer_code } = req.body;
        
        // Очистка телефона (превращаем 89... и 79... в +79...)
        let cleanedPhone = phone.replace(/[^\d+]/g, '');
        if (cleanedPhone.startsWith('8')) cleanedPhone = '+7' + cleanedPhone.slice(1);
        if (cleanedPhone.startsWith('7') && !cleanedPhone.startsWith('+7')) cleanedPhone = '+' + cleanedPhone;

        console.log('📦 Новый заказ:', { email, amount, tariff, phone: cleanedPhone, ref: referrer_code });

        // 1. Сохраняем пользователя (и реферала, если есть)
        const user = await findOrCreateUser(email, cleanedPhone, name, referrer_code);
        
        // 2. Создаем заказ
        const order = await createOrder(user.id, amount, tariff);

        // 3. Формируем запрос в ЮКассу
        const idempotenceKey = uuidv4();
        const shopId = process.env.YOOKASSA_SHOP_ID;
        const secretKey = process.env.YOOKASSA_SECRET_KEY;
        const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64');

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

// --- 2. ВЕБХУК (ОРКЕСТРАЦИЯ ВСЕХ СИСТЕМ) ---
app.post('/api/payment/webhook', async (req, res) => {
    try {
        const { event, object } = req.body;
        
        // Обрабатываем только успешные оплаты
        if (event !== 'payment.succeeded') {
            return res.status(200).send('OK');
        }

        const yookassaId = object.id;
        const status = object.status;
        const amountVal = object.amount.value; 
        
        // Достаем данные из metadata
        const metaOrderId = object.metadata?.order_id;
        const referrerCode = object.metadata?.referrer_code;

        console.log(`💰 Webhook: Оплата прошла! ID: ${metaOrderId}, Ref: ${referrerCode}`);

        // 1. Обновляем статус заказа в БД
        const orderId = await updateOrderStatus(yookassaId, status, metaOrderId);

        if (orderId) {
            // Получаем полные данные пользователя
            // Нам нужен user_id, чтобы потом обновить external_ids
            const orderRes = await pool.query(
                `SELECT o.tariff_code, u.id as user_id, u.email, u.name, u.phone 
                 FROM orders o 
                 JOIN users u ON o.user_id = u.id 
                 WHERE o.id = $1`, 
                [orderId]
            );

            if (orderRes.rows.length > 0) {
                const data = orderRes.rows[0];
                console.log(`🚀 Начинаем обработку для: ${data.email}`);

                // --- A. SKILLSPACE (ОБУЧЕНИЕ) ---
                console.log('👉 1. Skillspace...');
                let loginLink = null;
                try {
                    loginLink = await addUserToCourse(data.email, data.name, data.phone, data.tariff_code);
                    console.log('✅ Skillspace OK');
                    // Если вдруг Skillspace когда-то начнет возвращать ID, можно сохранить:
                    // await updateUserExternalIds(data.user_id, studentId, null);
                } catch (err) {
                    console.error('❌ Skillspace Error:', err.message);
                }

                // --- B. UDS (МАРКЕТИНГ) ---
                console.log('👉 2. UDS...');
                // Запускаем UDS и обрабатываем результат, чтобы сохранить ID
                sendUdsPurchase(data.phone, amountVal, referrerCode)
                    .then(async (res) => {
                        if (res.success) {
                            console.log('✅ UDS Sync Complete');
                            // Если UDS вернул ID клиента, сохраняем его в нашу базу навсегда
                            if (res.udsClientId) {
                                await updateUserExternalIds(data.user_id, null, res.udsClientId);
                                console.log('💾 UDS ID клиента сохранен в базу.');
                            }
                        }
                    })
                    .catch(err => {
                        console.error('⚠️ UDS Error:', err.message);
                    });
                
                // --- C. EMAIL (ПИСЬМО) ---
                console.log('👉 3. Email...');
                if (loginLink) {
                    await sendWelcomeEmail(data.email, data.name, loginLink);
                } else {
                    console.error('⚠️ Письмо не отправлено: нет ссылки от Skillspace');
                }
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('❌ Критическая ошибка вебхука:', error);
        res.status(500).send('Error');
    }
});

// --- 3. ПРОВЕРКА СТАТУСА ---
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

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});