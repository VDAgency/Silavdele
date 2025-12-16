// server/services/udsService.js
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config(); // Загружаем переменные из .env

// 1. НАСТРОЙКИ
// Берем из файла .env (UDS_API_KEY), если там пусто — берем жестко прописанную строку
const API_KEY = process.env.UDS_API_KEY || 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = process.env.UDS_COMPANY_ID || '549756210731'; 
const API_URL = 'https://api.uds.app/partner/v2';

const getHeaders = () => {
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
        console.log(`💎 UDS: Начинаем процесс оплаты. Телефон: ${phone}, Сумма: ${amount}`);

        let participantData = {};
        
        // --- ШАГ 1: Поиск клиента (чтобы понять, использовать UID или Телефон) ---
        try {
            // Кодируем телефон для URL (+7 превращается в %2b7)
            const encodedPhone = encodeURIComponent(phone);
            const resFind = await axios.get(`${API_URL}/customers/find?phone=${encodedPhone}`, { headers: getHeaders() });
            
            const uid = resFind.data.user?.uid;
            
            if (uid) {
                console.log(`   ✅ Клиент найден в UDS (UID: ${uid}). Платим по UID.`);
                participantData = { uid: uid };
            } else {
                console.log(`   ℹ️ Клиент найден, но не в приложении (UID: null). Платим по Телефону.`);
                participantData = { phone: phone };
            }
        } catch (findError) {
            // Если 404 - значит клиента вообще нет в базе
            if (findError.response && findError.response.status === 404) {
                console.log(`   ℹ️ Клиент не найден в базе. Будет создан автоматически при покупке (по Телефону).`);
                participantData = { phone: phone };
            } else {
                console.error(`   ⚠️ Ошибка поиска UDS: ${findError.message}. Пробуем по телефону.`);
                participantData = { phone: phone };
            }
        }

        // --- ШАГ 2: Формирование операции (ВАЖНО: Структура receipt) ---
        const payload = {
            nonce: crypto.randomUUID(),
            participant: participantData, // { uid: ... } или { phone: ... }
            cashier: { 
                externalId: "site_backend", 
                name: "Сайт Школы" 
            },
            // ВАЖНО: Суммы должны быть строго внутри receipt
            receipt: {
                total: Number(amount),
                cash: Number(amount),
                points: 0,
                number: "ORDER-" + Date.now() // Уникальный номер чека
            },
            description: "Оплата курса через сайт"
        };

        // Мы не передаем referrerCode в поле code, так как тесты показали, 
        // что это вызывает ошибку 404, если код принадлежит партнеру, а не является кодом на оплату.
        // UDS свяжет клиента по номеру телефона, если он переходил по ссылке ранее.

        // --- ШАГ 3: Отправка ---
        const response = await axios.post(`${API_URL}/operations`, payload, { headers: getHeaders() });

        console.log(`✅ UDS Успех! Операция проведена. ID: ${response.data.id}`);
        
        return { 
            success: true, 
            operationId: response.data.id,
            // Возвращаем UID (если есть) или ID (числовой)
            udsClientId: response.data.customer?.uid || response.data.customer?.id 
        };

    } catch (error) {
        // Логирование ошибок
        if (error.response) {
            console.error('❌ Ошибка UDS (Ответ сервера):', JSON.stringify(error.response.data));
        } else {
            console.error('❌ Ошибка UDS (Сеть/Код):', error.message);
        }
        
        return { success: false, error: error.message };
    }
};