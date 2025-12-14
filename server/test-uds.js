import crypto from 'crypto';
import axios from 'axios';

// ================= НАСТРОЙКИ (ТВОИ ВЕРНЫЕ ДАННЫЕ) =================
const API_KEY = 'NTNhNDg2MjctODYzMC00YmFiLTk2OWMtZTk1ZTgyYmQ5MmQz'; 
const COMPANY_ID = '549756210731'; 

// Код друга и тестовый телефон
const REFERRER_CODE = 'tqqf9586'; 
const NEW_CLIENT_PHONE = '+79140769557'; // Поменял последнюю цифру, чтобы был свежий номер
// ==================================================================

// Настройка заголовков
const authString = Buffer.from(`${COMPANY_ID}:${API_KEY}`).toString('base64');
const config = {
    headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};
const API_URL = 'https://api.uds.app/partner/v2';

async function runTests() {
    console.log(`--- ДИАГНОСТИКА UDS ---`);

    // === ТЕСТ 1: ПРОДАЖА БЕЗ КОДА (Проверка кассира) ===
    console.log(`\n1️⃣ ТЕСТ 1: Пробуем продажу БЕЗ кода друга (только телефон)...`);
    try {
        const payloadNoCode = {
            participant: { phone: NEW_CLIENT_PHONE },
            nonce: crypto.randomUUID(),
            cashier: { externalId: "site_payment" }, // Попробуем такое имя
            total: 10, 
            cash: 10,
            description: "Test without code"
        };

        const res1 = await axios.post(`${API_URL}/operations`, payloadNoCode, config);
        console.log('✅ ТЕСТ 1 УСПЕХ! Продажа прошла. Проблема НЕ в кассире.');
        console.log('ID операции:', res1.data.id);
    } catch (error) {
        console.log('❌ ТЕСТ 1 ПРОВАЛЕН.');
        printError(error);
        return; // Если даже простая продажа не идет, дальше нет смысла
    }

    // === ТЕСТ 2: ПРОДАЖА С КОДОМ ===
    console.log(`\n2️⃣ ТЕСТ 2: Пробуем продажу С КОДОМ друга (${REFERRER_CODE})...`);
    try {
        const payloadWithCode = {
            code: REFERRER_CODE,
            participant: { phone: NEW_CLIENT_PHONE }, // Тот же номер
            nonce: crypto.randomUUID(),
            cashier: { externalId: "site_payment" },
            total: 10,
            cash: 10,
            description: "Test WITH referral code"
        };

        const res2 = await axios.post(`${API_URL}/operations`, payloadWithCode, config);
        console.log('✅ ТЕСТ 2 УСПЕХ! Реферальная связь сработала!');
        console.log('Поздравляю, код работает напрямую через API.');
    } catch (error) {
        console.log('❌ ТЕСТ 2 ПРОВАЛЕН (Код не принят).');
        console.log('ВЫВОД: API не дает провести оплату по статичному коду приглашения.');
        console.log('РЕШЕНИЕ: Мы будем использовать другой алгоритм (Сначала создание юзера -> Потом оплата).');
        printError(error);
    }
}

function printError(error) {
    if (error.response) {
        console.log(`Статус: ${error.response.status}`);
        console.log('Ответ:', JSON.stringify(error.response.data, null, 2));
    } else {
        console.log(error.message);
    }
}

runTests();