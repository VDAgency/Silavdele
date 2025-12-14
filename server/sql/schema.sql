-- Очистка старых таблиц (порядок важен из-за связей)
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
    
    -- Интеграции
    uds_id VARCHAR(100),               -- ID клиента внутри UDS (uid)
    skillspace_id VARCHAR(100),        -- ID ученика в Skillspace
    
    -- Реферальная система
    own_referral_code VARCHAR(50),     -- Личный код этого юзера (из UDS), например "QWERTY"
    referrer_code VARCHAR(50),         -- Код того, КТО пригласил этого юзера (из Cookie при регистрации)
    referrer_id INTEGER REFERENCES users(id), -- ID пригласившего (заполним сами, если найдем такого юзера у нас)
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по реферальному коду (чтобы быстро находить "Папу" реферала)
CREATE INDEX idx_users_own_code ON users(own_referral_code);

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

-- 5. Логи входящих вебхуков
CREATE TABLE webhooks_log (
    id SERIAL PRIMARY KEY,
    service VARCHAR(50),
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
