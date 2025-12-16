// server/services/dbService.js
import dotenv from 'dotenv';
dotenv.config(); 
import pool from '../db.js';

// 1. Найти или создать пользователя
export const findOrCreateUser = async (email, phone, name, referrerCode = null) => {
    // Ищем по email или телефону
    const findRes = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR phone = $2', 
        [email, phone]
    );

    if (findRes.rows.length > 0) {
        return findRes.rows[0];
    }

    // Создаем нового, записываем реферальный код (кто пригласил)
    const createRes = await pool.query(
        `INSERT INTO users (email, phone, name, referrer_code) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [email, phone, name, referrerCode]
    );
    return createRes.rows[0];
};

// 2. Создать заказ
export const createOrder = async (userId, amount, tariffCode) => {
    const res = await pool.query(
        `INSERT INTO orders (user_id, amount, tariff_code, status, source) 
         VALUES ($1, $2, $3, 'pending', 'site') RETURNING *`,
        [userId, amount, tariffCode]
    );
    return res.rows[0];
};

// 3. Платеж
export const createPayment = async (orderId, yookassaId, amount, status) => {
    await pool.query(
        'INSERT INTO payments (order_id, yookassa_payment_id, amount, status) VALUES ($1, $2, $3, $4)',
        [orderId, yookassaId, amount, status]
    );
};

// 4. Обновить статус заказа
export const updateOrderStatus = async (yookassaId, status, metaOrderId = null) => {
    console.log(`🔄 Статус: ${status}. OrderID: ${metaOrderId}`);

    const paymentRes = await pool.query(
        'UPDATE payments SET status = $1 WHERE yookassa_payment_id = $2 RETURNING order_id',
        [status, yookassaId]
    );
    
    let orderId = metaOrderId;
    if (!orderId && paymentRes.rows.length > 0) {
        orderId = paymentRes.rows[0].order_id;
    }

    if (orderId) {
        if (status === 'succeeded') {
            await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['paid', orderId]);
        } else if (status === 'canceled') {
            await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['canceled', orderId]);
        }
        return orderId;
    }
    return null;
};

// 5. НОВОЕ: Обновить ID внешних сервисов
export const updateUserExternalIds = async (userId, skillspaceId, udsId) => {
    if (!skillspaceId && !udsId) return;
    
    // Динамически строим запрос, чтобы обновлять только то, что пришло
    if (skillspaceId) {
        await pool.query('UPDATE users SET skillspace_id = $1 WHERE id = $2', [skillspaceId, userId]);
    }
    if (udsId) {
        await pool.query('UPDATE users SET uds_id = $1 WHERE id = $2', [udsId, userId]);
    }
};