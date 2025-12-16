import axios from 'axios';
import crypto from 'crypto';

// ================= НАСТРОЙКИ ТЕСТА =================
const API_KEY = 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = '549756210731'; 

const API_URL = 'https://api.uds.app/partner/v2';

// 1. ТЕЛЕФОН ПОКУПАТЕЛЯ (Меняй его, чтобы тестировать новых и старых)
// Совет: Для теста регистрации нового введи номер, которого точно нет в UDS
const TEST_PHONE = '+79871658054'; 

// 2. СУММА
const AMOUNT = 10;

// 3. КОД ПАРТНЕРА (РЕФЕРАЛА)
// Введи сюда код ТОЧНО существующего партнера (например, 'tqqf9586')
// Или введи 'INVALID_CODE', чтобы проверить, как скрипт обработает ошибку
const REFERRER_CODE = 'tqqf9586'; 
// ===================================================

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

async function runTestFlow() {
    console.log(`\n🚀 ЗАПУСК ТЕСТОВОГО СЦЕНАРИЯ UDS`);
    console.log(`-----------------------------------`);
    console.log(`Покупатель: ${TEST_PHONE}`);
    console.log(`Сумма:      ${AMOUNT}`);
    console.log(`Реферал:    ${REFERRER_CODE || 'НЕ УКАЗАН'}`);
    console.log(`-----------------------------------\n`);

    // --- ШАГ 1: ПРОВЕРКА (Справочно) ---
    try {
        console.log(`🔍 1. Проверяем, существует ли клиент в базе...`);
        const encodedPhone = encodeURIComponent(TEST_PHONE);
        const findUrl = `${API_URL}/customers/find?phone=${encodedPhone}`;
        
        const findRes = await axios.get(findUrl, { headers: getHeaders() });
        console.log(`   ✅ Клиент НАЙДЕН. UID: ${findRes.data.user.uid}`);
        console.log(`   Имя: ${findRes.data.user.displayName}`);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`   ℹ️ Клиент НЕ найден. (Будет создан автоматически при покупке)`);
        } else {
            console.log(`   ⚠️ Ошибка поиска (не критично): ${error.message}`);
        }
    }

    // --- ШАГ 2: ПОКУПКА ---
    console.log(`\n💸 2. Пробуем провести покупку...`);
    
    // Формируем данные
    const payload = {
        nonce: crypto.randomUUID(),
        participant: { phone: TEST_PHONE },
        cashier: { externalId: "test_script", name: "Test Script" },
        total: AMOUNT,
        cash: AMOUNT,
        description: "Тестовая оплата (скрипт)"
    };

    // Если есть код - добавляем
    if (REFERRER_CODE) {
        payload.code = REFERRER_CODE;
        console.log(`   👉 Отправляем запрос с кодом реферала: ${REFERRER_CODE}`);
    } else {
        console.log(`   👉 Отправляем запрос БЕЗ реферального кода`);
    }

    try {
        const res = await axios.post(`${API_URL}/operations`, payload, { headers: getHeaders() });
        console.log(`\n✅✅✅ УСПЕХ! ОПЕРАЦИЯ ПРОВЕДЕНА.`);
        console.log(`ID Операции: ${res.data.id}`);
        console.log(`Клиент (UID): ${res.data.customer?.uid || 'Не вернулся'}`);
        console.log(`Баллы начислены.`);
        
    } catch (error) {
        console.log(`\n❌ ОШИБКА при оплате с кодом:`);
        if (error.response) {
            console.log(`   Статус: ${error.response.status}`);
            console.log(`   Ответ: ${JSON.stringify(error.response.data)}`);
            
            // --- ЛОГИКА СПАСЕНИЯ (FALLBACK) ---
            // Если ошибка 404 или 400 и мы использовали код - значит код плохой.
            // Пробуем провести без кода, чтобы не терять продажу.
            if (REFERRER_CODE && (error.response.status === 404 || error.response.status === 400)) {
                console.log(`\n🔄 3. АВТО-ПОВТОР: Пробуем провести оплату БЕЗ кода реферала...`);
                delete payload.code; // Удаляем плохой код
                payload.nonce = crypto.randomUUID(); // Новый ID запроса

                try {
                    const retryRes = await axios.post(`${API_URL}/operations`, payload, { headers: getHeaders() });
                    console.log(`   ✅ УСПЕХ (Со второй попытки)!`);
                    console.log(`   Операция проведена без привязки к партнеру.`);
                    console.log(`   ID Операции: ${retryRes.data.id}`);
                } catch (retryError) {
                    console.log(`   ❌ ФАТАЛЬНАЯ ОШИБКА (Даже без кода не вышло):`);
                    console.log(`   ${retryError.message}`);
                }
            }
        } else {
            console.log(`   ${error.message}`);
        }
    }
}

runTestFlow();