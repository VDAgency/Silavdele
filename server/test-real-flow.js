import axios from 'axios';
import crypto from 'crypto';

// --- НАСТРОЙКИ ---
// Твои рабочие ключи
const API_KEY = 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = '549756210731'; 
const API_URL = 'https://api.uds.app/partner/v2';

// Твой номер (у которого uid: null)
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
    console.log(`🚀 ЗАПУСК ТЕСТА: ${PHONE}`);
    let participantData = {};

    // --- ШАГ 1: ПОИСК ---
    console.log(`\n🔍 1. Ищем клиента...`);
    try {
        const encodedPhone = encodeURIComponent(PHONE);
        const resFind = await axios.get(`${API_URL}/customers/find?phone=${encodedPhone}`, { headers: getHeaders() });
        
        const uid = resFind.data.user.uid;
        console.log(`✅ Клиент НАЙДЕН! UID: ${uid} (${resFind.data.user.displayName})`);
        
        // ЛОГИКА ВЫБОРА: Если есть UID - берем его. Если нет (null) - берем телефон.
        if (uid) {
            console.log('👉 Используем UID для оплаты.');
            participantData = { uid: uid };
        } else {
            console.log('👉 UID пустой (клиент не в приложении). Используем ТЕЛЕФОН.');
            participantData = { phone: PHONE };
        }

    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`ℹ️ Клиент НЕ найден. Будем создавать через покупку (по телефону).`);
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
            participant: participantData, // Тут теперь или {uid: "..."} или {phone: "..."}
            cashier: { 
                externalId: "site_bot", 
                name: "Site" 
            },
            // ВАЖНО: Согласно документации, суммы должны быть внутри receipt
            receipt: {
                total: AMOUNT,
                cash: AMOUNT,
                points: 0,
                number: "ORDER-" + Date.now() // Номер чека (произвольный)
            },
            description: "Оплата курса"
        };

        const resOp = await axios.post(`${API_URL}/operations`, payload, { headers: getHeaders() });
        console.log(`✅✅✅ УСПЕХ! Операция проведена.`);
        console.log(`ID Операции: ${resOp.data.id}`);
        console.log(`Данные:`, resOp.data);

    } catch (error) {
        console.log(`❌ Ошибка покупки:`);
        if (error.response) {
            console.log(`Статус: ${error.response.status}`);
            console.log(JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(error.message);
        }
    }
}

runRealFlow();