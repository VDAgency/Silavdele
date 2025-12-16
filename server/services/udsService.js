// server/services/udsService.js
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Ключи UDS
const API_KEY = process.env.UDS_API_KEY || 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = process.env.UDS_COMPANY_ID || '549756210731'; 
const API_URL = 'https://api.uds.app/partner/v2';

const getHeaders = () => {
    // Авторизация точно как в успешном тесте
    const authString = Buffer.from(`${COMPANY_ID}:${API_KEY}`).toString('base64');
    return {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Origin-Request-Id': Date.now().toString(),
        'X-Timestamp': new Date().toISOString()
    };
};

export const sendUdsPurchase = async (phone, amount, referrerCode = null) => {
    try {
        console.log(`💎 UDS: Отправка покупки для ${phone}. Сумма: ${amount}. Реферал: ${referrerCode || 'Нет'}`);

        // Кодируем телефон как в документации (на случай спецсимволов, хотя в body это не обязательно, но для порядка)
        // В теле запроса (body) отправляем обычный телефон, кодировать нужно только в URL (GET)
        
        const payload = {
            nonce: crypto.randomUUID(),
            participant: { 
                phone: phone 
            },
            cashier: { 
                externalId: "website_backend",
                name: "Сайт Школы"
            },
            total: amount,
            cash: amount,
            description: "Оплата курса на сайте"
        };

        // Если есть реферальный код, добавляем его
        if (referrerCode) {
            payload.code = referrerCode;
        }

        // Отправляем запрос на создание операции
        const response = await axios.post(`${API_URL}/operations`, payload, { headers: getHeaders() });

        console.log(`✅ UDS Успех! ID операции: ${response.data.id}`);
        
        // Возвращаем ID клиента (UDS сам вернет его в ответе, даже если создал только что)
        return { 
            success: true, 
            operationId: response.data.id,
            udsClientId: response.data.customer?.uid || response.data.customer?.id 
        };

    } catch (error) {
        // ЛОГИКА ПОВТОРНОЙ ОТПРАВКИ (RETRY)
        // Если UDS вернул 404 или 400 из-за неверного кода реферала - пробуем провести оплату БЕЗ кода.
        // Чтобы клиент не потерял баллы за покупку, даже если ошибся в коде друга.
        if (referrerCode && error.response && (error.response.status === 404 || error.response.status === 400)) {
            console.warn('⚠️ UDS: Код реферала не принят. Пробуем провести оплату без кода...');
            return sendUdsPurchase(phone, amount, null); // Рекурсивный вызов без кода
        }

        console.error('❌ Ошибка UDS:', error.response?.data || error.message);
        
        // Возвращаем false, но не ломаем сервер
        return { success: false, error: error.message };
    }
};