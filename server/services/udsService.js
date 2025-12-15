// server/services/udsService.js
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Данные UDS (Лучше вынести в .env, но пока оставим здесь для надежности)
// ВСТАВЬ СЮДА СВОЙ ПОСЛЕДНИЙ РАБОЧИЙ КЛЮЧ
const API_KEY = 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = '549756210731'; // Твой ID

const API_URL = 'https://api.uds.app/partner/v2';

// Хелпер для заголовков
const getHeaders = () => {
    const authString = Buffer.from(`${COMPANY_ID}:${API_KEY}`).toString('base64');
    return {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
};

export const sendUdsPurchase = async (phone, amount, referrerCode = null) => {
    try {
        console.log(`💎 UDS: Пробуем отправить покупку для ${phone} (Реферал: ${referrerCode || 'Нет'})`);

        // 1. Получаем ID филиала (это обязательно для создания операции)
        // Мы делаем это каждый раз, чтобы не хардкодить ID, если он сменится
        const branchRes = await axios.get(`${API_URL}/branches`, { headers: getHeaders() });
        const branchId = branchRes.data.rows && branchRes.data.rows[0]?.id;

        if (!branchId) {
            console.error('⚠️ UDS Warning: Не найдены филиалы. Операция невозможна.');
            return { success: false, reason: 'no_branches' };
        }

        // 2. Формируем тело запроса
        const payload = {
            participant: { phone: phone },
            nonce: crypto.randomUUID(),
            cashier: { externalId: "site_bot" },
            branch: { id: branchId },
            total: amount,
            cash: amount,
            description: "Оплата курса на сайте"
        };

        // Добавляем реферальный код, только если он есть
        if (referrerCode) {
            payload.code = referrerCode;
        }

        // 3. Отправляем в UDS
        const response = await axios.post(`${API_URL}/operations`, payload, { headers: getHeaders() });

        console.log(`✅ UDS Успех! ID операции: ${response.data.id}`);
        return { success: true, id: response.data.id };

    } catch (error) {
        // ОБРАБОТКА ОШИБОК
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 403) {
                console.log('⚠️ UDS Info: Интеграция недоступна на текущем тарифе (403). Данные не отправлены, но сайт работает дальше.');
                return { success: false, reason: 'tariff_restriction' };
            }
            
            if (status === 400 || status === 404) {
                 console.error('❌ UDS Error (Данные):', JSON.stringify(data));
                 // Если ошибка в реф-коде (например, код устарел), можно попробовать отправить без него
                 // Но пока оставим так
                 return { success: false, reason: 'validation_error', details: data };
            }
        }
        
        console.error('❌ UDS System Error:', error.message);
        return { success: false, reason: 'network_error' };
    }
};