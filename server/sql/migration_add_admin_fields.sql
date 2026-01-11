-- Миграция: Добавление полей для админского функционала и синхронизации с UDS
-- Выполнить в DBeaver на существующей базе данных

-- 1. Добавление поля role в таблицу users (если еще не существует)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        RAISE NOTICE 'Поле role добавлено в таблицу users';
    ELSE
        RAISE NOTICE 'Поле role уже существует в таблице users';
    END IF;
END $$;

-- 2. Добавление полей balance и total_earned (если еще не существуют)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'balance'
    ) THEN
        ALTER TABLE users ADD COLUMN balance NUMERIC(10, 2) DEFAULT 0;
        RAISE NOTICE 'Поле balance добавлено в таблицу users';
    ELSE
        RAISE NOTICE 'Поле balance уже существует в таблице users';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'total_earned'
    ) THEN
        ALTER TABLE users ADD COLUMN total_earned NUMERIC(10, 2) DEFAULT 0;
        RAISE NOTICE 'Поле total_earned добавлено в таблицу users';
    ELSE
        RAISE NOTICE 'Поле total_earned уже существует в таблице users';
    END IF;
END $$;

-- 3. Добавление полей для синхронизации с UDS
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'uds_customer_id'
    ) THEN
        ALTER TABLE users ADD COLUMN uds_customer_id INTEGER;
        CREATE INDEX IF NOT EXISTS idx_users_uds_customer_id ON users(uds_customer_id);
        RAISE NOTICE 'Поле uds_customer_id добавлено в таблицу users';
    ELSE
        RAISE NOTICE 'Поле uds_customer_id уже существует в таблице users';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'uds_inviter_id'
    ) THEN
        ALTER TABLE users ADD COLUMN uds_inviter_id INTEGER;
        RAISE NOTICE 'Поле uds_inviter_id добавлено в таблицу users';
    ELSE
        RAISE NOTICE 'Поле uds_inviter_id уже существует в таблице users';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_sync_at'
    ) THEN
        ALTER TABLE users ADD COLUMN last_sync_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Поле last_sync_at добавлено в таблицу users';
    ELSE
        RAISE NOTICE 'Поле last_sync_at уже существует в таблице users';
    END IF;
END $$;

-- 4. Добавление поля password_hash (если еще не существует)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
        RAISE NOTICE 'Поле password_hash добавлено в таблицу users';
    ELSE
        RAISE NOTICE 'Поле password_hash уже существует в таблице users';
    END IF;
END $$;

-- 5. Добавление поля telegram_nick (если еще не существует)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'telegram_nick'
    ) THEN
        ALTER TABLE users ADD COLUMN telegram_nick VARCHAR(100);
        RAISE NOTICE 'Поле telegram_nick добавлено в таблицу users';
    ELSE
        RAISE NOTICE 'Поле telegram_nick уже существует в таблице users';
    END IF;
END $$;

-- 6. Создание таблицы transactions (если еще не существует)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(20) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    source_user_id INTEGER REFERENCES users(id),
    level INTEGER,
    order_id INTEGER REFERENCES orders(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Создание таблицы uds_sync_log (если еще не существует)
CREATE TABLE IF NOT EXISTS uds_sync_log (
    id SERIAL PRIMARY KEY,
    sync_type VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    customers_synced INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'running',
    error_message TEXT
);

-- 8. Обновление существующих записей: устанавливаем role = 'user' для всех, у кого role IS NULL
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Готово!
SELECT 'Миграция завершена успешно!' as status;
