// test-referral-link.js
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// --- НАСТРОЙКИ ---
// Твой код партнера (Александра/Второго аккаунта)
const REFERRAL_CODE = 'hrue3421'; 

// Телефон "Новичка" (которого мы удалили из базы, чтобы он был как новый)
// Используй тот, который ты удалял SQL скриптом
const NEW_CLIENT_PHONE = '+79277774800'; 

// Ключи (берем жестко, чтобы исключить ошибки)
const API_KEY = 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = '549756210731'; 
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

async function testReferralPurchase() {
    console.log(`🚀 ЗАПУСК ТЕСТА РЕФЕРАЛЬНОЙ СВЯЗКИ`);
    console.log(`Покупатель: ${NEW_CLIENT_PHONE}`);
    console.log(`Пробуем привязать к партнеру: ${REFERRAL_CODE}`);

    const payload = {
        nonce: crypto.randomUUID(),
        // Пробуем передать код партнера в поле 'code'
        // Гипотеза: UDS должен понять, что это реферал
        code: REFERRAL_CODE, 
        participant: { 
            phone: NEW_CLIENT_PHONE 
        },
        cashier: { 
            externalId: "test_ref_script", 
            name: "Test Referral" 
        },
        receipt: {
            total: 10,
            cash: 10,
            points: 0,
            number: "REF-TEST-" + Date.now()
        },
        description: "Тест реферальной связки"
    };

    try {
        console.log(`\n⏳ Отправляем запрос...`);
        const response = await axios.post(`${API_URL}/operations`, payload, { headers: getHeaders() });

        console.log(`✅✅✅ УСПЕХ! Операция проведена.`);
        console.log(`ID Операции: ${response.data.id}`);
        console.log(`Данные клиента:`, response.data.customer);
        
        console.log(`\n🔎 ЗАДАНИЕ:`);
        console.log(`Зайди в UDS Admin -> Клиенты -> Найди ${NEW_CLIENT_PHONE}`);
        console.log(`Посмотри поле "Кто пригласил". Если там владелец кода ${REFERRAL_CODE} - МЫ ПОБЕДИЛИ.`);

    } catch (error) {
        console.log(`\n❌ ОШИБКА:`);
        if (error.response) {
            console.log(`Статус: ${error.response.status}`);
            console.log(`Ответ: ${JSON.stringify(error.response.data, null, 2)}`);
            
            if (error.response.status === 404) {
                console.log(`\n👇 ВЫВОД:`);
                console.log(`Сервер ответил "Не найдено" на код ${REFERRAL_CODE}.`);
                console.log(`Это подтверждает, что в поле 'code' нельзя передавать код партнера.`);
                console.log(`В поле 'code' UDS ждет ТОЛЬКО код на скидку из приложения самого покупателя.`);
            }
        } else {
            console.log(error.message);
        }
    }
}

testReferralPurchase();
