// server/services/udsSyncService.js
// Сервис для синхронизации структуры пользователей из UDS API
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import pool from '../db.js';

const API_KEY = process.env.UDS_API_KEY;
const COMPANY_ID = process.env.UDS_COMPANY_ID;
const API_URL = 'https://api.uds.app/partner/v2';

const getHeaders = () => {
    const authString = Buffer.from(`${COMPANY_ID}:${API_KEY}`).toString('base64');
    return {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'X-Origin-Request-Id': Date.now().toString() + Math.random().toString(36).substr(2, 9),
        'X-Timestamp': new Date().toISOString()
    };
};

// Получение списка клиентов из UDS API
export const getUdsCustomers = async (max = 100, offset = 0, cursor = null) => {
    try {
        let url = `${API_URL}/customers?max=${max}&offset=${offset}`;
        if (cursor) {
            url += `&cursor=${cursor}`;
        }

        const response = await axios.get(url, { headers: getHeaders() });
        
        return {
            customers: response.data.rows || [],
            hasMore: response.data.rows && response.data.rows.length === max,
            cursor: response.data.cursor || null
        };
    } catch (error) {
        console.error('❌ Ошибка получения клиентов из UDS:', error.response?.data || error.message);
        throw error;
    }
};

// Получение информации о конкретном клиенте из UDS
export const getUdsCustomerById = async (customerId) => {
    try {
        const response = await axios.get(`${API_URL}/customers/${customerId}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error(`❌ Ошибка получения клиента ${customerId} из UDS:`, error.response?.data || error.message);
        throw error;
    }
};

// Синхронизация одного клиента из UDS в нашу БД
export const syncCustomerFromUds = async (udsCustomerData) => {
    try {
        const participant = udsCustomerData.participant || {};
        const customerId = participant.id;
        const inviterId = participant.inviterId;
        const phone = udsCustomerData.phone;
        const email = udsCustomerData.email;
        const displayName = udsCustomerData.displayName;
        const uid = udsCustomerData.uid;

        if (!customerId) {
            console.log('⚠️  Пропускаем клиента без participant.id');
            return null;
        }

        // Ищем пользователя по uds_customer_id или по phone/email
        let user = null;
        if (customerId) {
            const res = await pool.query('SELECT * FROM users WHERE uds_customer_id = $1', [customerId]);
            if (res.rows.length > 0) {
                user = res.rows[0];
            }
        }

        // Если не нашли по uds_customer_id, ищем по телефону или email
        if (!user && phone) {
            const res = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
            if (res.rows.length > 0) {
                user = res.rows[0];
            }
        }

        if (!user && email) {
            const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (res.rows.length > 0) {
                user = res.rows[0];
            }
        }

        // Если пользователь найден - обновляем
        if (user) {
            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;

            if (displayName && displayName !== user.name) {
                updateFields.push(`name = $${paramIndex++}`);
                updateValues.push(displayName);
            }
            if (phone && phone !== user.phone) {
                updateFields.push(`phone = $${paramIndex++}`);
                updateValues.push(phone);
            }
            if (email && email !== user.email && !email.includes('@silavdele.temp')) {
                updateFields.push(`email = $${paramIndex++}`);
                updateValues.push(email);
            }
            if (customerId !== user.uds_customer_id) {
                updateFields.push(`uds_customer_id = $${paramIndex++}`);
                updateValues.push(customerId);
            }
            if (inviterId !== user.uds_inviter_id) {
                updateFields.push(`uds_inviter_id = $${paramIndex++}`);
                updateValues.push(inviterId);
            }
            if (uid && uid !== user.uds_id) {
                updateFields.push(`uds_id = $${paramIndex++}`);
                updateValues.push(uid);
            }

            updateFields.push(`last_sync_at = CURRENT_TIMESTAMP`);
            updateValues.push(user.id);

            if (updateFields.length > 1) { // Больше чем просто last_sync_at
                const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
                const result = await pool.query(query, updateValues);
                return result.rows[0];
            }

            return user;
        } else {
            // Создаем нового пользователя
            // Если нет email, создаем временный
            const userEmail = email || `no-email-${phone ? phone.replace(/[^\d]/g, '') : Date.now()}@silavdele.temp`;
            
            const result = await pool.query(
                `INSERT INTO users (email, phone, name, uds_customer_id, uds_inviter_id, uds_id, last_sync_at, role)
                 VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, 'user')
                 RETURNING *`,
                [userEmail, phone, displayName, customerId, inviterId, uid]
            );
            
            return result.rows[0];
        }
    } catch (error) {
        console.error('❌ Ошибка синхронизации клиента из UDS:', error);
        throw error;
    }
};

// Полная синхронизация всех клиентов из UDS
export const syncAllCustomersFromUds = async (options = {}) => {
    const { maxPerRequest = 100, updateExisting = true } = options;
    
    let syncLogId = null;
    try {
        // Создаем запись в uds_sync_log
        const logResult = await pool.query(
            `INSERT INTO uds_sync_log (sync_type, status, started_at)
             VALUES ('full', 'running', CURRENT_TIMESTAMP)
             RETURNING id`,
            []
        );
        syncLogId = logResult.rows[0].id;

        console.log(`🔄 Начинаем полную синхронизацию с UDS (ID лога: ${syncLogId})...`);

        let totalSynced = 0;
        let totalErrors = 0;
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            try {
                const result = await getUdsCustomers(maxPerRequest, offset);
                const customers = result.customers;

                console.log(`📦 Получено ${customers.length} клиентов из UDS (offset: ${offset})`);

                for (const customer of customers) {
                    try {
                        await syncCustomerFromUds(customer);
                        totalSynced++;
                    } catch (error) {
                        console.error(`❌ Ошибка синхронизации клиента ${customer.participant?.id}:`, error.message);
                        totalErrors++;
                    }
                }

                hasMore = result.hasMore && customers.length > 0;
                offset += customers.length;

                // Обновляем прогресс в логе
                await pool.query(
                    `UPDATE uds_sync_log SET customers_synced = $1, errors_count = $2 WHERE id = $3`,
                    [totalSynced, totalErrors, syncLogId]
                );

            } catch (error) {
                console.error(`❌ Ошибка при получении пачки клиентов (offset: ${offset}):`, error.message);
                totalErrors++;
                hasMore = false;
            }
        }

        // Обновляем связи referrer_id на основе uds_inviter_id
        console.log('🔗 Обновляем связи referrer_id...');
        const linkResult = await pool.query(`
            UPDATE users u1
            SET referrer_id = u2.id
            FROM users u2
            WHERE u1.uds_inviter_id = u2.uds_customer_id
              AND u1.uds_inviter_id IS NOT NULL
              AND u2.uds_customer_id IS NOT NULL
              AND u1.referrer_id IS NULL
        `);
        console.log(`✅ Обновлено связей: ${linkResult.rowCount}`);

        // Завершаем синхронизацию
        await pool.query(
            `UPDATE uds_sync_log 
             SET status = 'completed', completed_at = CURRENT_TIMESTAMP, customers_synced = $1, errors_count = $2
             WHERE id = $3`,
            [totalSynced, totalErrors, syncLogId]
        );

        console.log(`✅ Синхронизация завершена. Синхронизировано: ${totalSynced}, Ошибок: ${totalErrors}`);

        return {
            success: true,
            syncLogId,
            customersSynced: totalSynced,
            errorsCount: totalErrors
        };

    } catch (error) {
        console.error('❌ Критическая ошибка синхронизации:', error);
        
        if (syncLogId) {
            await pool.query(
                `UPDATE uds_sync_log 
                 SET status = 'failed', completed_at = CURRENT_TIMESTAMP, error_message = $1
                 WHERE id = $2`,
                [error.message, syncLogId]
            );
        }

        throw error;
    }
};

// Синхронизация структуры конкретного пользователя из UDS
export const syncUserStructureFromUds = async (userId) => {
    try {
        // Получаем пользователя из БД
        const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userRes.rows.length === 0) {
            throw new Error(`Пользователь с ID ${userId} не найден`);
        }

        const user = userRes.rows[0];
        
        if (!user.uds_customer_id) {
            console.log(`⚠️  У пользователя ${userId} нет uds_customer_id`);
            return { synced: 0 };
        }

        console.log(`🔄 Синхронизация структуры пользователя ${userId} (UDS ID: ${user.uds_customer_id})...`);

        let totalSynced = 0;

        // Получаем всех клиентов из UDS (пачками)
        let offset = 0;
        let hasMore = true;
        const maxPerRequest = 100;

        while (hasMore) {
            const result = await getUdsCustomers(maxPerRequest, offset);
            const customers = result.customers;

            for (const customer of customers) {
                const participant = customer.participant || {};
                const inviterId = participant.inviterId;

                // Если этот клиент приглашен нашим пользователем
                if (inviterId === user.uds_customer_id) {
                    try {
                        await syncCustomerFromUds(customer);
                        totalSynced++;
                    } catch (error) {
                        console.error(`❌ Ошибка синхронизации клиента ${participant.id}:`, error.message);
                    }
                }
            }

            hasMore = result.hasMore && customers.length > 0;
            offset += customers.length;
        }

        // Обновляем связи referrer_id
        await pool.query(`
            UPDATE users u1
            SET referrer_id = u2.id
            FROM users u2
            WHERE u1.uds_inviter_id = u2.uds_customer_id
              AND u1.uds_inviter_id IS NOT NULL
              AND u2.uds_customer_id IS NOT NULL
        `);

        // Обновляем last_sync_at для пользователя
        await pool.query('UPDATE users SET last_sync_at = CURRENT_TIMESTAMP WHERE id = $1', [userId]);

        console.log(`✅ Синхронизировано ${totalSynced} пользователей в структуре`);

        return { synced: totalSynced };

    } catch (error) {
        console.error('❌ Ошибка синхронизации структуры пользователя:', error);
        throw error;
    }
};

// Построение структуры пользователя на основе данных UDS (3 уровня)
export const buildUserStructureFromUds = async (userId, maxLevels = 3) => {
    try {
        // Получаем пользователя из БД
        const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userRes.rows.length === 0) {
            throw new Error(`Пользователь с ID ${userId} не найден`);
        }

        const user = userRes.rows[0];

        if (!user.uds_customer_id) {
            return {
                userId,
                userName: user.name || user.email,
                udsCustomerId: null,
                lastSyncAt: null,
                levels: {
                    1: { count: 0, users: [] },
                    2: { count: 0, users: [] },
                    3: { count: 0, users: [] }
                },
                totalUsers: 0
            };
        }

        console.log(`🌳 Построение структуры для пользователя ${userId} (UDS ID: ${user.uds_customer_id})...`);

        // Получаем всех клиентов из UDS
        let allCustomers = [];
        let offset = 0;
        let hasMore = true;
        const maxPerRequest = 100;

        while (hasMore) {
            const result = await getUdsCustomers(maxPerRequest, offset);
            allCustomers = allCustomers.concat(result.customers);
            hasMore = result.hasMore && result.customers.length > 0;
            offset += result.customers.length;
        }

        console.log(`📊 Всего клиентов в UDS: ${allCustomers.length}`);

        // Строим структуру по уровням
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

        // Уровень 1: прямые рефералы
        const level1Customers = allCustomers.filter(c => 
            (c.participant?.inviterId) === user.uds_customer_id
        );

        for (const customer of level1Customers) {
            await syncCustomerFromUds(customer);
        }

        // Получаем данные уровня 1 из БД
        const level1Res = await pool.query(`
            SELECT u.*, 
                   (SELECT COUNT(*) FROM users WHERE referrer_id = u.id) as level1_count
            FROM users u
            WHERE u.uds_inviter_id = $1
            ORDER BY u.created_at DESC
        `, [user.uds_customer_id]);

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

        // Уровень 2: рефералы уровня 1
        if (maxLevels >= 2 && structure.levels[1].users.length > 0) {
            const level1Ids = structure.levels[1].users.map(u => u.uds_customer_id).filter(Boolean);
            
            if (level1Ids.length > 0) {
                const level2Customers = allCustomers.filter(c => 
                    level1Ids.includes(c.participant?.inviterId)
                );

                for (const customer of level2Customers) {
                    await syncCustomerFromUds(customer);
                }

                const level2Res = await pool.query(`
                    SELECT u.*,
                           (SELECT COUNT(*) FROM users WHERE referrer_id = u.id) as level1_count
                    FROM users u
                    WHERE u.uds_inviter_id = ANY($1::integer[])
                    ORDER BY u.created_at DESC
                `, [level1Ids]);

                // Подсчитываем level2 и level3 для каждого пользователя уровня 1
                for (const level1User of structure.levels[1].users) {
                    const level2ForUser = level2Res.rows.filter(r => r.uds_inviter_id === level1User.uds_customer_id);
                    level1User.stats.level2 = level2ForUser.length;

                    // Подсчитываем level3
                    if (level2ForUser.length > 0) {
                        const level2Ids = level2ForUser.map(u => u.uds_customer_id).filter(Boolean);
                        const level3Count = await pool.query(`
                            SELECT COUNT(*) as count
                            FROM users
                            WHERE uds_inviter_id = ANY($1::integer[])
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
            }
        }

        // Уровень 3: рефералы уровня 2
        if (maxLevels >= 3 && structure.levels[2].users.length > 0) {
            const level2Ids = structure.levels[2].users.map(u => u.uds_customer_id).filter(Boolean);
            
            if (level2Ids.length > 0) {
                const level3Customers = allCustomers.filter(c => 
                    level2Ids.includes(c.participant?.inviterId)
                );

                for (const customer of level3Customers) {
                    await syncCustomerFromUds(customer);
                }

                const level3Res = await pool.query(`
                    SELECT u.*,
                           (SELECT COUNT(*) FROM users WHERE referrer_id = u.id) as level1_count
                    FROM users u
                    WHERE u.uds_inviter_id = ANY($1::integer[])
                    ORDER BY u.created_at DESC
                `, [level2Ids]);

                // Подсчитываем level2 и level3 для каждого пользователя уровня 2
                for (const level2User of structure.levels[2].users) {
                    const level3ForUser = level3Res.rows.filter(r => r.uds_inviter_id === level2User.uds_customer_id);
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

        // Обновляем связи referrer_id
        await pool.query(`
            UPDATE users u1
            SET referrer_id = u2.id
            FROM users u2
            WHERE u1.uds_inviter_id = u2.uds_customer_id
              AND u1.uds_inviter_id IS NOT NULL
              AND u2.uds_customer_id IS NOT NULL
        `);

        // Обновляем last_sync_at
        await pool.query('UPDATE users SET last_sync_at = CURRENT_TIMESTAMP WHERE id = $1', [userId]);

        structure.totalUsers = structure.levels[1].count + structure.levels[2].count + structure.levels[3].count;

        console.log(`✅ Структура построена: Уровень 1: ${structure.levels[1].count}, Уровень 2: ${structure.levels[2].count}, Уровень 3: ${structure.levels[3].count}`);

        return structure;

    } catch (error) {
        console.error('❌ Ошибка построения структуры:', error);
        throw error;
    }
};
