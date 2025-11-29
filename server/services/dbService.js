// dbService.js
import dotenv from 'dotenv';
dotenv.config({ path: '/var/www/silavdele/.env' });
import pool from '../db.js';

// 1. Найти или создать пользователя
export const findOrCreateUser = async (email, phone, name) => {
    const findRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (findRes.rows.length > 0) {
        return findRes.rows[0];
    }
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

// 4. Обновить статус заказа (УЛУЧШЕННАЯ ВЕРСИЯ)
// Теперь принимаем metaOrderId (ID заказа напрямую из вебхука)
export const updateOrderStatus = async (yookassaId, status, metaOrderId = null) => {
    console.log(`🔄 Обновляем статус. YookassaID: ${yookassaId}, Status: ${status}, OrderID: ${metaOrderId}`);

    // 1. Обновляем статус в таблице платежей (для истории)
    const paymentRes = await pool.query(
        'UPDATE payments SET status = $1 WHERE yookassa_payment_id = $2 RETURNING order_id',
        [status, yookassaId]
    );
    
    // Пытаемся узнать ID заказа: либо из базы, либо из метаданных вебхука
    let orderId = metaOrderId;
    
    if (!orderId && paymentRes.rows.length > 0) {
        orderId = paymentRes.rows[0].order_id;
    }

    // Если ID заказа у нас есть - обновляем его статус
    if (orderId) {
        console.log(`✅ Нашли заказ #${orderId}. Меняем статус на ${status}`);
        
        if (status === 'succeeded') {
            await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['paid', orderId]);
        } 
        else if (status === 'canceled') {
            await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['canceled', orderId]);
        }
        return orderId;
    } else {
        console.error(`❌ Ошибка: Не удалось найти ID заказа для платежа ${yookassaId}`);
        return null;
    }
};