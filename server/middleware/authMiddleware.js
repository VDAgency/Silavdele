// authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import pool from '../db.js';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Нет токена доступа' });
    }

    try {
        // Убираем "Bearer " из начала строки, если есть
        const cleanToken = token.replace('Bearer ', '');
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        req.user = decoded; // Сохраняем id юзера в запрос
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Неверный токен' });
    }
};

// Проверка прав администратора
export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Необходима авторизация' });
        }

        // Получаем роль пользователя из БД
        const userRes = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
        
        if (userRes.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const userRole = userRes.rows[0].role;

        if (userRole !== 'admin') {
            return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
        }

        next();
    } catch (error) {
        console.error('Ошибка проверки прав администратора:', error);
        return res.status(500).json({ error: 'Ошибка проверки прав доступа' });
    }
};
