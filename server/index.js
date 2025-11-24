// server/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
// Если порт не задан в .env, используем 5000
const PORT = process.env.PORT || 5000;

// Настройка CORS
app.use(cors());

// Обработка JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- ТЕСТОВЫЙ РОУТ ---
app.get('/', (req, res) => {
    res.send('Привет! Сервер Silavdele работает исправно (ESM Modules) 🚀');
});

// --- ЗАГОТОВКА ПОД ОПЛАТУ (ЮKassa) ---
app.post('/api/payment/create', async (req, res) => {
    const { amount, email } = req.body;
    console.log(`Попытка оплаты: ${amount} руб. от ${email}`);
    
    res.json({ 
        confirmation_url: 'https://yookassa.ru/test-link', 
        message: 'Это заглушка, реальная оплата скоро будет' 
    });
});

// --- ЗАГОТОВКА ПОД ВЕБХУК ---
app.post('/api/payment/webhook', (req, res) => {
    console.log('Пришел вебхук от ЮКассы:', req.body);
    res.status(200).send('OK');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});