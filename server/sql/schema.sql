-- 1. Пользователи (Ученики)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    name VARCHAR(255),
    uds_id VARCHAR(100),       -- ID из UDS (если есть)
    skillspace_id VARCHAR(100),-- ID ученика в Skillspace
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Заказы (Корзина / Намерение купить)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tariff_code VARCHAR(50) NOT NULL, -- например 'standart', 'vip'
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending', -- pending, paid, cancelled
    source VARCHAR(20) DEFAULT 'site',    -- site, uds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Платежи (Транзакции в ЮКассе)
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    yookassa_payment_id VARCHAR(100) UNIQUE, -- ID транзакции от ЮКассы
    amount NUMERIC(10, 2),
    status VARCHAR(50), -- pending, succeeded, canceled
    payload JSONB,      -- Полный ответ от ЮКассы (для истории)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Очередь задач (Синхронизация со Skillspace/UDS)
CREATE TABLE platform_sync (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    platform VARCHAR(20) NOT NULL, -- 'skillspace', 'uds'
    status VARCHAR(30) DEFAULT 'pending', -- pending, success, failed
    attempts INTEGER DEFAULT 0,           -- Сколько раз пытались отправить
    last_error TEXT,                      -- Текст ошибки, если не вышло
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Лог всех входящих Вебхуков (Черный ящик)
CREATE TABLE webhooks_log (
    id SERIAL PRIMARY KEY,
    service VARCHAR(50), -- 'yookassa', 'skillspace'
    payload JSONB,       -- Само "тело" запроса
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);