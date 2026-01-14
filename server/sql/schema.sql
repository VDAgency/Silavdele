-- server/sql/schema.sql
-- Очистка старых таблиц (порядок важен из-за связей)
DROP TABLE IF EXISTS uds_sync_log;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS webhooks_log;
DROP TABLE IF EXISTS platform_sync;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;

-- 1. Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) UNIQUE,          -- Телефон, критически важен для UDS
    name VARCHAR(255),
    password_hash VARCHAR(255),        -- Хеш пароля для входа в ЛК
    
    -- Восстановление доступа (НОВОЕ)
    reset_token VARCHAR(255),          -- Токен для сброса пароля
    reset_token_expires TIMESTAMP WITH TIME ZONE, -- Время жизни токена
    
    -- Роли и права
    role VARCHAR(20) DEFAULT 'user',   -- 'user' или 'admin'
    
    -- Интеграции
    uds_id VARCHAR(100),               -- ID клиента внутри UDS (uid)
    skillspace_id VARCHAR(100),        -- ID ученика в Skillspace
    
    -- Реферальная система
    own_referral_code VARCHAR(50),     -- Личный код этого юзера (из UDS), например "QWERTY"
    referrer_code VARCHAR(50),         -- Код того, КТО пригласил этого юзера (из Cookie при регистрации)
    referrer_id INTEGER REFERENCES users(id), -- ID пригласившего (заполним сами, если найдем такого юзера у нас)
    
    -- Финансы
    balance NUMERIC(10, 2) DEFAULT 0,  -- Текущий баланс
    total_earned NUMERIC(10, 2) DEFAULT 0, -- Всего заработано
    
    -- Синхронизация с UDS
    uds_customer_id INTEGER,           -- ID клиента в UDS (participant.id)
    uds_inviter_id INTEGER,            -- ID пригласившего в UDS (participant.inviterId)
    last_sync_at TIMESTAMP WITH TIME ZONE, -- Время последней синхронизации с UDS
    
    -- Дополнительные поля
    telegram_nick VARCHAR(100),        -- Telegram никнейм
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_users_own_code ON users(own_referral_code);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_uds_customer_id ON users(uds_customer_id);
-- Индекс для поиска по токену сброса (ускоряет проверку при восстановлении)
CREATE INDEX idx_users_reset_token ON users(reset_token);

-- 2. Заказы
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tariff_code VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending', -- pending, paid, cancelled
    source VARCHAR(20) DEFAULT 'site',    -- site, uds_app
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Платежи
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    yookassa_payment_id VARCHAR(100) UNIQUE,
    amount NUMERIC(10, 2),
    status VARCHAR(50), 
    payload JSONB,      
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Очередь задач (Task Queue)
-- Сюда мы будем класть задачи "Отправить в Skillspace" и "Отправить в UDS"
CREATE TABLE platform_sync (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id), -- Может быть NULL
    user_id INTEGER REFERENCES users(id),   
    task_type VARCHAR(50) NOT NULL,         -- 'register_skillspace', 'send_uds_purchase', 'sync_uds_structure'
    status VARCHAR(30) DEFAULT 'pending',   -- pending, processing, completed, failed
    attempts INTEGER DEFAULT 0,
    payload JSONB,                          -- Данные для задачи
    last_error TEXT,
    run_after TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Чтобы можно было отложить задачу
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Транзакции (история начислений и выводов)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(20) NOT NULL,         -- 'earning', 'withdrawal'
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    source_user_id INTEGER REFERENCES users(id), -- Кто привел к начислению
    level INTEGER,                     -- Уровень в структуре (1, 2, 3)
    order_id INTEGER REFERENCES orders(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Логи синхронизации с UDS
CREATE TABLE uds_sync_log (
    id SERIAL PRIMARY KEY,
    sync_type VARCHAR(50) NOT NULL,    -- 'full', 'user_request', 'scheduled'
    user_id INTEGER REFERENCES users(id), -- NULL для полной синхронизации
    customers_synced INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'running', -- 'running', 'completed', 'failed'
    error_message TEXT
);

-- 7. Логи входящих вебхуков
CREATE TABLE webhooks_log (
    id SERIAL PRIMARY KEY,
    service VARCHAR(50),
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
