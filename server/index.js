import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Подключаем наши функции работы с БД
import { findOrCreateUser, createOrder, createPayment, updateOrderStatus } from './services/dbService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- 1. СОЗДАНИЕ ПЛАТЕЖА ---
app.post('/api/payment/create', async (req, res) => {
    try {
        const { email, phone, name, amount, tariff } = req.body;
        
        console.log('Новый заказ:', { email, amount, tariff });

        // 1. Сохраняем пользователя и заказ в БД
        const user = await findOrCreateUser(email, phone, name);
        const order = await createOrder(user.id, amount, tariff);

        // 2. Готовим запрос в ЮКассу
        const idempotenceKey = uuidv4(); // Уникальный ключ запроса
        const shopId = process.env.YOOKASSA_SHOP_ID;
        const secretKey = process.env.YOOKASSA_SECRET_KEY;
        
        // Кодируем ключи для авторизации (Basic Auth)
        const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64');

        // 3. Отправляем запрос в ЮКассу
        const response = await axios.post('https://api.yookassa.ru/v3/payments', {
            amount: {
                value: amount,
                currency: 'RUB'
            },
            capture: true, // Сразу списываем деньги
            confirmation: {
                type: 'redirect',
                return_url: 'https://silavdele.ru/payment/success' // Куда вернуть юзера
            },
            description: `Оплата тарифа ${tariff} (${email})`,
            metadata: {
                order_id: order.id // Передаем наш ID заказа, чтобы потом узнать его в вебхуке
            }
        }, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Idempotence-Key': idempotenceKey,
                'Content-Type': 'application/json'
            }
        });

        const paymentData = response.data;
        
        // 4. Сохраняем ID платежа ЮКассы в нашу БД
        await createPayment(order.id, paymentData.id, amount, paymentData.status);

        // 5. Отдаем ссылку фронтенду
        res.json({ 
            confirmation_url: paymentData.confirmation.confirmation_url 
        });

    } catch (error) {
        console.error('Ошибка создания платежа:', error.response?.data || error.message);
        res.status(500).json({ error: 'Не удалось создать платеж' });
    }
});

// --- 2. ВЕБХУК (Уведомление от ЮКассы) ---
app.post('/api/payment/webhook', async (req, res) => {
    try {
        const { event, object } = req.body;

        // Нас интересует только успешная оплата
        if (event === 'payment.succeeded') {
            const yookassaId = object.id;
            const status = object.status;
            
            console.log(`💰 Пришла оплата! ID: ${yookassaId}`);

            // Обновляем статус в БД
            const orderId = await updateOrderStatus(yookassaId, status);

            if (orderId) {
                console.log(`✅ Заказ #${orderId} оплачен. Тут будем выдавать доступ к курсу...`);
                // TODO: Здесь будет вызов функции отправки письма и добавления в Skillspace
            }
        }

        // Всегда отвечаем 200 OK, иначе ЮКасса будет слать запросы снова и снова
        res.status(200).send('OK');
    } catch (error) {
        console.error('Ошибка вебхука:', error);
        res.status(500).send('Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
