// authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

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
