// server/test-final.js
import crypto from 'crypto';
import axios from 'axios';

// ================= НАСТРОЙКИ =================
// Укажи здесь свои АКТУАЛЬНЫЕ ключи
const API_KEY = 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = '549756210731'; 

// Тестовые данные
const REFERRER_CODE = 'tqqf9586'; // Код друга
const PHONE = '+79871658054';     // Тестовый номер
// =============================================

const authString = Buffer.from(`${COMPANY_ID}:${API_KEY}`).toString('base64');
const config = {
    headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};
const API_URL = 'https://api.uds.app/partner/v2';

async function runFinalTest() {
    console.log(`--- ФИНАЛЬНЫЙ ТЕСТ UDS ---`);
    console.log(`Пробуем провести оплату напрямую (без поиска филиалов)...`);

    try {
        const payload = {
            nonce: crypto.randomUUID(),
            participant: {
                phone: PHONE
            },
            // cashier - это обязательное поле. 
            // externalId - это любой ID, который мы придумаем для нашего сайта.
            cashier: {
                externalId: "website_backend",
                name: "Сайт школы" 
            },
            total: 100,
            cash: 100,
            description: "Final Test Payment",
            // Пробуем передать код реферала (если сработает - отлично)
            code: REFERRER_CODE 
        };

        // ВАЖНО: Мы НЕ передаем branch: { id: ... }, так как поддержка сказала не искать его.
        // UDS должен зачислить это на дефолтный филиал.

        const response = await axios.post(`${API_URL}/operations`, payload, config);
        
        console.log('\n✅✅✅ УСПЕХ! Операция проведена!');
        console.log('ID операции:', response.data.id);
        console.log('Покупатель ID:', response.data.customer?.id);
        
    } catch (error) {
        console.log('\n❌ ОШИБКА:');
        if (error.response) {
            console.log(`Статус: ${error.response.status}`);
            console.log('Ответ:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(error.message);
        }
    }
}

runFinalTest();