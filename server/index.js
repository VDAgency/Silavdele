import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Подключаем pool напрямую для проверки статуса
import pool from './db.js'; 
// Подключаем функции сервиса
import { findOrCreateUser, createOrder, createPayment, updateOrderStatus } from './services/dbService.js';

// --- НОВЫЕ ИМПОРТЫ ---
import { addUserToCourse } from './services/skillspaceService.js';
import { sendWelcomeEmail } from './services/emailService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// --- 1. СОЗДАНИЕ ПЛАТЕЖА ---
app.post('/api/payment/create', async (req, res) => {
    try {
        const { email, phone, name, amount, tariff } = req.body;
        const cleanedPhone = phone.replace(/[^\d]/g, '');

        console.log('Новый заказ:', { email, amount, tariff, phone: cleanedPhone });

        const user = await findOrCreateUser(email, cleanedPhone, name);
        const order = await createOrder(user.id, amount, tariff);

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
            metadata: { order_id: order.id },
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
        console.error('Ошибка ЮКассы:', error.response?.data || error.message);
        res.status(500).json({ error: 'Не удалось создать платеж' });
    }
});

// --- 2. ВЕБХУК (С ВЫДАЧЕЙ ДОСТУПА) ---
app.post('/api/payment/webhook', async (req, res) => {
    try {
        const { event, object } = req.body;
        const yookassaId = object.id;
        const status = object.status;
        const metaOrderId = object.metadata && object.metadata.order_id;

        console.log(`🔔 Вебхук: ${event} -> ${status}. OrderID: ${metaOrderId}`);

        const orderId = await updateOrderStatus(yookassaId, status, metaOrderId);

        // !!! ГЛАВНАЯ МАГИЯ ЗДЕСЬ !!!
        if (event === 'payment.succeeded' && orderId) {
            console.log(`✅ Платеж подтвержден! Начинаем выдачу доступа...`);

            // 1. Достаем данные заказа из базы (нам нужен email, телефон, тариф)
            const orderRes = await pool.query(
                `SELECT o.tariff_code, u.email, u.name, u.phone 
                 FROM orders o 
                 JOIN users u ON o.user_id = u.id 
                 WHERE o.id = $1`, 
                [orderId]
            );

            if (orderRes.rows.length > 0) {
                const data = orderRes.rows[0];
                
                // 2. Добавляем в Skillspace
                const link = await addUserToCourse(data.email, data.name, data.phone, data.tariff_code);
                
                // 3. Отправляем письмо
                await sendWelcomeEmail(data.email, data.name, link);
                
                console.log(`🎉 Полный цикл завершен для ${data.email}`);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Ошибка вебхука:', error);
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
    console.log(`Server started on port ${PORT}`);
});