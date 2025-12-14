// init-db.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js'; // Убедись, что путь к db.js правильный

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDb = async () => {
    try {
        // Читаем файл schema.sql
        const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Начинаю обновление структуры базы данных...');
        
        // Выполняем SQL запрос
        await pool.query(schemaSql);
        
        console.log('УСПЕХ! База данных обновлена.');
    } catch (err) {
        console.error('ОШИБКА при обновлении базы:', err);
    } finally {
        // Закрываем соединение
        await pool.end();
    }
};

initDb();
