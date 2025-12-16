import axios from 'axios';
import crypto from 'crypto';

// --- НАСТРОЙКИ ---
const API_KEY = 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = '549756210731'; 
const API_URL = 'https://api.uds.app/partner/v2';

// 1. Сначала проверь на существующем (Александр): '+79372752934'
// 2. Потом на новом (твоем): '+79871658054'
const PHONE = '+79871658054'; 
const AMOUNT = 10;

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

async function runRealFlow() {
    console.log(`🚀 ЗАПУСК: ${PHONE}`);
    let participantData = {};

    // --- ШАГ 1: ПОИСК ---
    console.log(`\n🔍 1. Ищем клиента...`);
    try {
        const encodedPhone = encodeURIComponent(PHONE);
        const resFind = await axios.get(`${API_URL}/customers/find?phone=${encodedPhone}`, { headers: getHeaders() });
        
        console.log(`✅ Клиент НАЙДЕН!`);
        console.log(`   UID: ${resFind.data.user.uid} (${resFind.data.user.displayName})`);
        
        // Если нашли - будем платить по UID
        participantData = { uid: resFind.data.user.uid };

    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`ℹ️ Клиент НЕ найден. Будем создавать через покупку.`);
            // Если не нашли - будем платить по Телефону
            participantData = { phone: PHONE };
        } else {
            console.log(`❌ Ошибка поиска: ${error.message}`);
            return;
        }
    }

    // --- ШАГ 2: ПОКУПКА ---
    console.log(`\n💸 2. Проводим покупку...`);
    try {
        const payload = {
            nonce: crypto.randomUUID(),
            // UDS сам разберется: если тут UID - найдет, если Phone - создаст
            participant: participantData, 
            cashier: { externalId: "site_bot", name: "Site" },
            total: AMOUNT,
            cash: AMOUNT,
            description: "Оплата курса"
        };

        // ВАЖНО: Мы НЕ передаем поле 'code', чтобы не получить 404.
        
        const resOp = await axios.post(`${API_URL}/operations`, payload, { headers: getHeaders() });
        console.log(`✅✅✅ УСПЕХ! Операция проведена.`);
        console.log(`ID Операции: ${resOp.data.id}`);
        console.log(`Данные клиента: ${JSON.stringify(resOp.data.customer)}`);

    } catch (error) {
        console.log(`❌ Ошибка покупки:`);
        if (error.response) {
            console.log(JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(error.message);
        }
    }
}

runRealFlow();