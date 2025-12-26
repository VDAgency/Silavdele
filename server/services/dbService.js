// server/services/dbService.js
import { addUserToCourse } from './skillspaceService.js';
import { sendWelcomeEmail } from './emailService.js';
import dotenv from 'dotenv';
dotenv.config(); 
import pool from '../db.js';
import bcrypt from 'bcrypt';

// --- ПОЛЬЗОВАТЕЛИ (AUTH & REGISTRATION) ---

// 1. Найти или создать (УЛУЧШЕННАЯ ВЕРСИЯ)
// Используется при оплате на сайте
export const findOrCreateUser = async (email, phone, name, referrerCode = null) => {
    // 1. Сначала ищем, есть ли уже такой юзер
    const findRes = await pool.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [email, phone]);
    
    if (findRes.rows.length > 0) {
        return findRes.rows[0];
    }

    // 2. Если юзера нет — создаем нового
    // Сразу пытаемся найти ID того, кто пригласил, чтобы построить структуру
    let referrerId = null;
    if (referrerCode) {
        // Ищем юзера, у которого ЭТОТ код является его ЛИЧНЫМ (own_referral_code)
        const refRes = await pool.query('SELECT id FROM users WHERE own_referral_code = $1', [referrerCode]);
        
        if (refRes.rows.length > 0) {
            referrerId = refRes.rows[0].id;
        } else {
            // Если по own_code не нашли, можно попробовать поискать по старому referrer_code (временная мера)
            // Но лучше опираться на own_referral_code, который мы будем получать из UDS
        }
    }

    // 3. Создаем запись
    const createRes = await pool.query(
        `INSERT INTO users (email, phone, name, referrer_code, referrer_id) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [email, phone, name, referrerCode, referrerId]
    );
    return createRes.rows[0];
};

// 2. Регистрация (Обновленная: Умное слияние)
export const registerUser = async (email, phone, name, password, referrerCode) => {
    // 1. Ищем пользователя по телефону
    const existingUserRes = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    let user = existingUserRes.rows[0];

    // Сценарий А: Пользователя вообще нет -> Создаем с нуля
    if (!user) {
        user = await findOrCreateUser(email, phone, name, referrerCode);
    }

    // Сценарий Б: Пользователь есть (пришел из UDS без почты), и он регистрируется на сайте
    // Признак: у него в базе email-заглушка, а сейчас он ввел нормальный email
    if (user && user.email.includes('@silavdele.temp') && !email.includes('@silavdele.temp')) {
        console.log(`🔄 Апгрейд пользователя ${phone}: Замена ${user.email} на ${email}`);
        
        // Обновляем Email в базе
        await pool.query('UPDATE users SET email = $1 WHERE id = $2', [email, user.id]);
        user.email = email; // Обновляем объект в памяти

        // ПРОВЕРКА: Если у него уже были оплаченные заказы ("висящие"), выдаем доступ
        const paidOrders = await pool.query("SELECT tariff_code FROM orders WHERE user_id = $1 AND status = 'paid'", [user.id]);
        
        if (paidOrders.rows.length > 0) {
            console.log(`🎉 Нашли старые покупки! Выдаем доступ в Skillspace...`);
            // Берем последний тариф (или можно циклом все, если их много)
            const tariff = paidOrders.rows[0].tariff_code; 
            
            // Регистрируем в школе
            const loginLink = await addUserToCourse(email, name, phone, tariff);
            
            // Шлем письмо
            await sendWelcomeEmail(email, name, loginLink, user.referrer_code);
        }
    }

    // 2. Хешируем пароль и сохраняем имя
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const updateRes = await pool.query(
        'UPDATE users SET password_hash = $1, name = $2 WHERE id = $3 RETURNING *',
        [hash, name, user.id]
    );
    
    return updateRes.rows[0];
};

// 3. Вход (Проверка пароля)
export const loginUser = async (email, password) => {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = res.rows[0];

    if (!user) return null;
    
    // Если у юзера нет пароля (купил курс, но не регистрировался в ЛК)
    if (!user.password_hash) return 'no_password';

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) return null;

    return user;
};

// --- ФИНАНСЫ И ПАРТНЕРКА (НОВОЕ) ---

// 4. Начисление комиссионных (15% - 10% - 5%)
export const processCommissions = async (orderId, userId, amount) => {
    console.log(`💰 Рассчитываем комиссии для заказа #${orderId} (Сумма: ${amount})`);
    
    // Получаем текущего юзера, чтобы узнать, кто его пригласил
    const userRes = await pool.query('SELECT referrer_id, referrer_code FROM users WHERE id = $1', [userId]);
    let currentReferrerId = userRes.rows[0]?.referrer_id;
    
    // ФОЛЛБЕК: Если ID нет, но есть код (для старых записей), пробуем найти ID владельца кода
    if (!currentReferrerId && userRes.rows[0]?.referrer_code) {
        const findRef = await pool.query('SELECT id FROM users WHERE own_referral_code = $1', [userRes.rows[0].referrer_code]);
        if (findRef.rows.length > 0) currentReferrerId = findRef.rows[0].id;
    }

    if (!currentReferrerId) {
        console.log('ℹ️ У пользователя нет реферера. Комиссии не начисляются.');
        return;
    }

    const levels = [0.15, 0.10, 0.05]; // Проценты по уровням

    // Цикл на 3 уровня вверх
    for (let i = 0; i < 3; i++) {
        if (!currentReferrerId) break; // Если цепочка оборвалась

        const bonus = amount * levels[i];
        const level = i + 1;

        console.log(`   Level ${level}: Партнер ID ${currentReferrerId} получает ${bonus} руб.`);

        // 1. Записываем транзакцию в историю
        await pool.query(
            `INSERT INTO transactions (user_id, type, amount, description, source_user_id, level, order_id)
             VALUES ($1, 'earning', $2, $3, $4, $5, $6)`,
            [currentReferrerId, bonus, `Бонус за партнера (Ур. ${level})`, userId, level, orderId]
        );

        // 2. Увеличиваем баланс на счету партнера
        await pool.query(
            `UPDATE users SET balance = balance + $1, total_earned = total_earned + $1 WHERE id = $2`,
            [bonus, currentReferrerId]
        );

        // Идем на уровень выше (ищем "Папу" текущего реферера)
        const nextRefRes = await pool.query('SELECT referrer_id FROM users WHERE id = $1', [currentReferrerId]);
        currentReferrerId = nextRefRes.rows[0]?.referrer_id;
    }
};

// 5. Данные для Дашборда (ЛК)
export const getUserDashboard = async (userId) => {
    // Данные профиля
    const userRes = await pool.query('SELECT name, email, phone, balance, total_earned, own_referral_code, telegram_nick FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];

    // Статистика (сколько людей пригласил)
    const statsRes = await pool.query(`
        SELECT 
            COUNT(*) FILTER (WHERE referrer_id = $1) as level1
        FROM users 
    `, [userId]);

    // Список команды (1 линия)
    const teamRes = await pool.query(`
        SELECT name, email, phone, telegram_nick, created_at 
        FROM users 
        WHERE referrer_id = $1 
        ORDER BY created_at DESC LIMIT 50
    `, [userId]);

    return {
        profile: user,
        stats: {
            level1: statsRes.rows[0]?.level1 || 0
        },
        team: teamRes.rows
    };
};

// --- СТАРЫЕ ФУНКЦИИ (ДЛЯ ОПЛАТЫ) ---

// 6. Создать заказ
export const createOrder = async (userId, amount, tariffCode) => {
    const res = await pool.query(
        `INSERT INTO orders (user_id, amount, tariff_code, status, source) 
         VALUES ($1, $2, $3, 'pending', 'site') RETURNING *`,
        [userId, amount, tariffCode]
    );
    return res.rows[0];
};

// 7. Создать запись о платеже
export const createPayment = async (orderId, yookassaId, amount, status) => {
    await pool.query(
        'INSERT INTO payments (order_id, yookassa_payment_id, amount, status) VALUES ($1, $2, $3, $4)',
        [orderId, yookassaId, amount, status]
    );
};

// 8. Обновить статус заказа
export const updateOrderStatus = async (yookassaId, status, metaOrderId = null) => {
    console.log(`🔄 Обновляем статус. YookassaID: ${yookassaId}, Status: ${status}`);

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

// 9. Обновить внешние ID (UDS, Skillspace)
export const updateUserExternalIds = async (userId, skillspaceId, udsId) => {
    if (!skillspaceId && !udsId) return;
    
    if (skillspaceId) {
        await pool.query('UPDATE users SET skillspace_id = $1 WHERE id = $2', [skillspaceId, userId]);
    }
    if (udsId) {
        await pool.query('UPDATE users SET uds_id = $1 WHERE id = $2', [udsId, userId]);
    }
};
