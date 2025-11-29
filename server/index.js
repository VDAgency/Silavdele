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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- 1. СОЗДАНИЕ ПЛАТЕЖА ---
app.post('/api/payment/create', async (req, res) => {
    try {
        const { email, phone, name, amount, tariff } = req.body;
        
        // Очищаем телефон (твоя рабочая логика)
        const cleanedPhone = phone.replace(/[^\d]/g, '');

        console.log('Новый заказ:', { email, amount, tariff, phone: cleanedPhone });

        // 1. Сохраняем в БД
        const user = await findOrCreateUser(email, cleanedPhone, name);
        const order = await createOrder(user.id, amount, tariff);

        // 2. Готовим запрос
        const idempotenceKey = uuidv4();
        const shopId = process.env.YOOKASSA_SHOP_ID;
        const secretKey = process.env.YOOKASSA_SECRET_KEY;
        const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64');

        // 3. Отправляем в ЮКассу
        const response = await axios.post('https://api.yookassa.ru/v3/payments', {
            amount: {
                value: amount,
                currency: 'RUB'
            },
            capture: true,
            confirmation: {
                type: 'redirect',
                // --- ИЗМЕНЕНИЕ: Добавляем ID заказа в ссылку ---
                // Это нужно, чтобы страница Success знала, какой заказ проверять
                return_url: `https://silavdele.ru/payment/success?order_id=${order.id}`
            },
            description: `Оплата тарифа ${tariff} (${email})`,
            metadata: {
                order_id: order.id
            },
            receipt: {
                customer: {
                    email: email,
                    phone: cleanedPhone
                },
                items: [
                    {
                        description: `Курс: ${tariff}`,
                        quantity: "1.00",
                        amount: {
                            value: amount,
                            currency: "RUB"
                        },
                        vat_code: "1",
                        payment_mode: "full_payment",
                        payment_subject: "service"
                    }
                ]
            }
        }, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Idempotence-Key': idempotenceKey,
                'Content-Type': 'application/json'
            }
        });

        const paymentData = response.data;
        
        // 4. Сохраняем ID платежа
        await createPayment(order.id, paymentData.id, amount, paymentData.status);

        // 5. Отдаем ссылку
        res.json({ 
            confirmation_url: paymentData.confirmation.confirmation_url 
        });

    } catch (error) {
        console.error('Ошибка ЮКассы:', error.response?.data || error.message);
        res.status(500).json({ error: 'Не удалось создать платеж' });
    }
});

// --- 2. ВЕБХУК (Уведомление от ЮКассы) ---
app.post('/api/payment/webhook', async (req, res) => {
    try {
        const { event, object } = req.body;
        const yookassaId = object.id;
        const status = object.status; // succeeded, canceled, pending
        
        // --- ИЗМЕНЕНИЕ: Достаем ID заказа из metadata ---
        // Это гарантирует, что мы найдем заказ, даже если база затупит
        const metaOrderId = object.metadata && object.metadata.order_id;

        console.log(`🔔 Вебхук: ${event} -> ${status}. OrderID из метаданных: ${metaOrderId}`);

        // Передаем metaOrderId в функцию обновления
        const orderId = await updateOrderStatus(yookassaId, status, metaOrderId);

        if (event === 'payment.succeeded' && orderId) {
            console.log(`✅ Заказ #${orderId} успешно оплачен! Выдаем доступ...`);
            // TODO: Отправка письма и Skillspace
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Ошибка вебхука:', error);
        res.status(500).send('Error');
    }
});

// --- 3. НОВОЕ: Роут для проверки статуса (для Фронтенда) ---
app.get('/api/payment/check/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Простой запрос в базу, чтобы узнать статус заказа
        const result = await pool.query('SELECT status FROM orders WHERE id = $1', [orderId]);

        if (result.rows.length > 0) {
            res.json({ status: result.rows[0].status });
        } else {
            res.status(404).json({ error: 'Заказ не найден' });
        }
    } catch (error) {
        console.error('Ошибка проверки статуса:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});