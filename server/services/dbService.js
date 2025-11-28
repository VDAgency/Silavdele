// server/services/dbService.js
import pool from '../db.js';

// 1. Найти или создать пользователя
export const findOrCreateUser = async (email, phone, name) => {
    // Сначала ищем
    const findRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (findRes.rows.length > 0) {
        return findRes.rows[0];
    }
    // Если нет - создаем
    const createRes = await pool.query(
        'INSERT INTO users (email, phone, name) VALUES ($1, $2, $3) RETURNING *',
        [email, phone, name]
    );
    return createRes.rows[0];
};

// 2. Создать заказ
export const createOrder = async (userId, amount, tariffCode) => {
    const res = await pool.query(
        'INSERT INTO orders (user_id, amount, tariff_code, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, amount, tariffCode, 'pending']
    );
    return res.rows[0];
};

// 3. Создать запись о платеже
export const createPayment = async (orderId, yookassaId, amount, status) => {
    await pool.query(
        'INSERT INTO payments (order_id, yookassa_payment_id, amount, status) VALUES ($1, $2, $3, $4)',
        [orderId, yookassaId, amount, status]
    );
};

// 4. Обновить статус заказа (когда оплата прошла)
export const updateOrderStatus = async (yookassaId, status) => {
    // Сначала обновляем таблицу payments
    const paymentRes = await pool.query(
        'UPDATE payments SET status = $1 WHERE yookassa_payment_id = $2 RETURNING order_id',
        [status, yookassaId]
    );
    
    if (paymentRes.rows.length > 0) {
        const orderId = paymentRes.rows[0].order_id;
        // Если оплата успешна, обновляем и заказ
        if (status === 'succeeded') {
            await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['paid', orderId]);
            return orderId;
        }
    }
    return null;
};