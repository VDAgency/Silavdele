// server/services/dbService.js
import { addUserToCourse } from './skillspaceService.js';
import { sendWelcomeEmail } from './emailService.js';
import { buildUserStructureFromUds } from './udsSyncService.js';
import dotenv from 'dotenv';
dotenv.config(); 
import pool from '../db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

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

    // 3. Проверяем, является ли пользователь администратором
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
    const adminPhones = process.env.ADMIN_PHONES ? process.env.ADMIN_PHONES.split(',').map(p => p.trim()) : [];
    
    // Определяем роль: если пользователь уже админ, сохраняем его роль
    let userRole = user.role || 'user';
    
    // Если пользователь еще не админ, проверяем список админов
    if (userRole !== 'admin') {
        // Нормализуем телефон для сравнения (пробуем разные форматы)
        let normalizedPhone1 = phone;
        let normalizedPhone2 = phone;
        if (phone.startsWith('8')) {
            normalizedPhone1 = '+7' + phone.slice(1);
        }
        if (phone.startsWith('7') && !phone.startsWith('+7')) {
            normalizedPhone2 = '+' + phone;
        }
        
        // Проверяем по email и всем вариантам телефона
        if (adminEmails.includes(email) || 
            adminPhones.includes(phone) || 
            adminPhones.includes(normalizedPhone1) || 
            adminPhones.includes(normalizedPhone2)) {
            userRole = 'admin';
            console.log(`🔑 Пользователь ${email} определен как администратор`);
        }
    }

    const updateRes = await pool.query(
        'UPDATE users SET password_hash = $1, name = $2, role = $3 WHERE id = $4 RETURNING *',
        [hash, name, userRole, user.id]
    );
    
    if (!updateRes.rows[0]) {
        throw new Error('Не удалось обновить пользователя');
    }
    
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

    // Убеждаемся, что у пользователя есть роль (по умолчанию 'user')
    if (!user.role) {
        // Если роль не установлена, устанавливаем 'user' по умолчанию
        await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['user', user.id]);
        user.role = 'user';
    }

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
export const getUserDashboard = async (userId, targetUserId = null) => {
    // Если передан targetUserId, используем его (для админов)
    const actualUserId = targetUserId || userId;

    // Данные профиля (включая role)
    const userRes = await pool.query(
        'SELECT name, email, phone, balance, total_earned, own_referral_code, telegram_nick, role FROM users WHERE id = $1', 
        [actualUserId]
    );
    const user = userRes.rows[0];

    if (!user) {
        throw new Error('Пользователь не найден');
    }

    // Статистика (сколько людей пригласил)
    const statsRes = await pool.query(`
        SELECT 
            COUNT(*) FILTER (WHERE referrer_id = $1) as level1
        FROM users 
    `, [actualUserId]);

    // Список команды (1 линия)
    const teamRes = await pool.query(`
        SELECT name, email, phone, telegram_nick, created_at 
        FROM users 
        WHERE referrer_id = $1 
        ORDER BY created_at DESC LIMIT 50
    `, [actualUserId]);

    // Получаем ID пользователя (он у нас и так есть в actualUserId, но для надежности вернем из базы)
    // Лишний запрос убрал, берем из переменной
    
    return {
        profile: {
            ...user,
            id: actualUserId // Исправили ошибку дублирования и лишнего запроса
        },
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

// --- АДМИНСКИЕ ФУНКЦИИ ---

// 10. Получить структуру пользователя (3 уровня)
export const getUserStructureTree = async (userId, useUdsData = false) => {
    if (useUdsData) {
        // Синхронизируем из UDS и возвращаем структуру
        return await buildUserStructureFromUds(userId, 3);
    }

    // Получаем структуру из БД
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
        throw new Error(`Пользователь с ID ${userId} не найден`);
    }

    const user = userRes.rows[0];

    const structure = {
        userId,
        userName: user.name || user.email,
        udsCustomerId: user.uds_customer_id,
        lastSyncAt: user.last_sync_at,
        levels: {
            1: { count: 0, users: [] },
            2: { count: 0, users: [] },
            3: { count: 0, users: [] }
        },
        totalUsers: 0
    };

    // Уровень 1
    const level1Res = await pool.query(`
        SELECT u.*,
               (SELECT COUNT(*) FROM users WHERE referrer_id = u.id) as level1_count
        FROM users u
        WHERE u.referrer_id = $1
        ORDER BY u.created_at DESC
    `, [userId]);

    structure.levels[1].users = level1Res.rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        telegram_nick: row.telegram_nick,
        balance: row.balance?.toString() || '0',
        total_earned: row.total_earned?.toString() || '0',
        own_referral_code: row.own_referral_code,
        uds_customer_id: row.uds_customer_id,
        uds_inviter_id: row.uds_inviter_id,
        created_at: row.created_at,
        last_sync_at: row.last_sync_at,
        stats: {
            level1: parseInt(row.level1_count) || 0,
            level2: 0,
            level3: 0
        }
    }));

    structure.levels[1].count = structure.levels[1].users.length;

    // Уровень 2
    if (structure.levels[1].users.length > 0) {
        const level1Ids = structure.levels[1].users.map(u => u.id);
        
        const level2Res = await pool.query(`
            SELECT u.*,
                   (SELECT COUNT(*) FROM users WHERE referrer_id = u.id) as level1_count
            FROM users u
            WHERE u.referrer_id = ANY($1::integer[])
            ORDER BY u.created_at DESC
        `, [level1Ids]);

        // Подсчитываем статистику для уровня 1
        for (const level1User of structure.levels[1].users) {
            const level2ForUser = level2Res.rows.filter(r => r.referrer_id === level1User.id);
            level1User.stats.level2 = level2ForUser.length;

            // Подсчитываем level3 для этого пользователя
            if (level2ForUser.length > 0) {
                const level2Ids = level2ForUser.map(u => u.id);
                const level3Count = await pool.query(`
                    SELECT COUNT(*) as count
                    FROM users
                    WHERE referrer_id = ANY($1::integer[])
                `, [level2Ids]);
                level1User.stats.level3 = parseInt(level3Count.rows[0].count) || 0;
            }
        }

        structure.levels[2].users = level2Res.rows.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            telegram_nick: row.telegram_nick,
            balance: row.balance?.toString() || '0',
            total_earned: row.total_earned?.toString() || '0',
            own_referral_code: row.own_referral_code,
            uds_customer_id: row.uds_customer_id,
            uds_inviter_id: row.uds_inviter_id,
            created_at: row.created_at,
            last_sync_at: row.last_sync_at,
            stats: {
                level1: parseInt(row.level1_count) || 0,
                level2: 0,
                level3: 0
            }
        }));

        structure.levels[2].count = structure.levels[2].users.length;

        // Уровень 3
        if (structure.levels[2].users.length > 0) {
            const level2Ids = structure.levels[2].users.map(u => u.id);
            
            const level3Res = await pool.query(`
                SELECT u.*,
                       (SELECT COUNT(*) FROM users WHERE referrer_id = u.id) as level1_count
                FROM users u
                WHERE u.referrer_id = ANY($1::integer[])
                ORDER BY u.created_at DESC
            `, [level2Ids]);

            // Подсчитываем статистику для уровня 2
            for (const level2User of structure.levels[2].users) {
                const level3ForUser = level3Res.rows.filter(r => r.referrer_id === level2User.id);
                level2User.stats.level2 = level3ForUser.length;
                level2User.stats.level3 = 0; // Уровень 3 не имеет рефералов
            }

            structure.levels[3].users = level3Res.rows.map(row => ({
                id: row.id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                telegram_nick: row.telegram_nick,
                balance: row.balance?.toString() || '0',
                total_earned: row.total_earned?.toString() || '0',
                own_referral_code: row.own_referral_code,
                uds_customer_id: row.uds_customer_id,
                uds_inviter_id: row.uds_inviter_id,
                created_at: row.created_at,
                last_sync_at: row.last_sync_at,
                stats: {
                    level1: parseInt(row.level1_count) || 0,
                    level2: 0,
                    level3: 0
                }
            }));

            structure.levels[3].count = structure.levels[3].users.length;
        }
    }

    structure.totalUsers = structure.levels[1].count + structure.levels[2].count + structure.levels[3].count;

    return structure;
};

// 11. Поиск пользователей
export const searchUsers = async (query, limit = 50) => {
    const searchTerm = `%${query}%`;
    
    const result = await pool.query(`
        SELECT id, name, email, phone, telegram_nick, own_referral_code, 
               uds_customer_id, role, created_at
        FROM users
        WHERE 
            email ILIKE $1 OR
            phone ILIKE $1 OR
            name ILIKE $1 OR
            own_referral_code ILIKE $1 OR
            CAST(uds_customer_id AS TEXT) ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2
    `, [searchTerm, limit]);

    return result.rows;
};

// 12. Получить список всех пользователей (с пагинацией)
export const getAllUsersList = async (page = 1, limit = 50) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(`
        SELECT id, name, email, phone, telegram_nick, own_referral_code,
               uds_customer_id, role, balance, total_earned, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) as total FROM users');
    const total = parseInt(countResult.rows[0].total);

    return {
        users: result.rows,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};


// --- ВОССТАНОВЛЕНИЕ ПАРОЛЯ ---

// 13. Генерация и сохранение токена сброса
export const setResetToken = async (email) => {
    // 1. Ищем пользователя
    const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) return null; // Юзер не найден

    // 2. Генерируем случайный токен (32 байта в hex = 64 символа)
    const token = crypto.randomBytes(32).toString('hex');
    
    // 3. Устанавливаем срок жизни (1 час с текущего момента)
    const expires = new Date(Date.now() + 3600000); // 3600000 мс = 1 час

    // 4. Сохраняем в базу
    await pool.query(
        'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
        [token, expires, email]
    );

    return token;
};

// 14. Сброс пароля по токену
export const resetPasswordWithToken = async (token, newPassword) => {
    // 1. Ищем юзера, у которого совпадает токен И время еще не истекло (NOW() < expires)
    const res = await pool.query(
        'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
        [token]
    );

    if (res.rows.length === 0) return null; // Токен неверный или просрочен
    const userId = res.rows[0].id;

    // 2. Хешируем новый пароль
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    // 3. Обновляем пароль и очищаем токен (чтобы нельзя было использовать повторно)
    await pool.query(
        'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
        [hash, userId]
    );

    return true;
};
