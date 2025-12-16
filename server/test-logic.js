import axios from 'axios';
import crypto from 'crypto';

// --- НАСТРОЙКИ ---
const API_KEY = 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = '549756210731'; 
const API_URL = 'https://api.uds.app/partner/v2';

const PHONE = '+79372752934'; // Александр
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

async function runLogic() {
    console.log(`🚀 ЗАПУСК АЛГОРИТМА ДЛЯ: ${PHONE}`);
    let userUid = null;

    // --- ШАГ 1: ПОИСК КЛИЕНТА ---
    console.log(`\n🔍 1. Ищем клиента...`);
    try {
        const encodedPhone = encodeURIComponent(PHONE);
        const resFind = await axios.get(`${API_URL}/customers/find?phone=${encodedPhone}`, { headers: getHeaders() });
        
        console.log(`✅ Клиент НАЙДЕН!`);
        console.log(`   UID: ${resFind.data.user.uid}`);
        userUid = resFind.data.user.uid;

    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`ℹ️ Клиент НЕ найден.`);
        } else {
            console.log(`❌ Ошибка поиска: ${error.message}`);
            return;
        }
    }

    // --- ШАГ 3: ПОКУПКА ПО UID ---
    if (userUid) {
        console.log(`\n💸 3. Проводим покупку для UID: ${userUid}`);
        try {
            const payload = {
                nonce: crypto.randomUUID(),
                // ИСПРАВЛЕНИЕ: Используем participant.uid вместо customer.id
                participant: { 
                    uid: userUid 
                },
                cashier: { externalId: "site_backend", name: "Сайт" },
                total: AMOUNT,
                cash: AMOUNT,
                description: "Покупка по алгоритму"
            };

            const resOp = await axios.post(`${API_URL}/operations`, payload, { headers: getHeaders() });
            console.log(`✅✅✅ УСПЕХ! Операция проведена.`);
            console.log(`ID: ${resOp.data.id}`);

        } catch (error) {
            console.log(`❌ Ошибка покупки:`);
            console.log(JSON.stringify(error.response?.data || error.message));
        }
    } else {
        console.log('⚠️ Тест остановлен: Клиент не найден, а создание мы пока не тестируем.');
    }
}

runLogic();