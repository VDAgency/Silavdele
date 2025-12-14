import crypto from 'crypto';
import axios from 'axios';

// ================= НАСТРОЙКИ =================
const API_KEY = 'NTNhNDg2MjctODYzMC00YmFiLTk2OWMtZTk1ZTgyYmQ5MmQz'; 
const COMPANY_ID = '549756210731'; 

// Данные для теста
const NEW_PHONE = '+79990001122'; // Новый номер
const REFERRER_CODE = 'tqqf9586'; // Код друга
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

async function runStepByStep() {
    console.log(`--- ТЕСТ: СОЗДАНИЕ + ПОКУПКА ---`);

    let userId = null;

    // === ШАГ 1: СОЗДАНИЕ / ПОИСК КЛИЕНТА ===
    console.log(`\n1️⃣ ШАГ 1: Создаем клиента ${NEW_PHONE}...`);
    try {
        // Пробуем найти или создать
        // Сначала ищем, чтобы не было ошибки "Уже существует"
        // Но API UDS позволяет создавать: если есть - вернет ошибку, тогда найдем.
        
        const createPayload = {
            phone: NEW_PHONE,
            name: "Test User Site",
            // Важно: некоторые версии API принимают code при создании для рефералки
            // Попробуем передать код пригласителя здесь, это был бы идеальный вариант
            code: REFERRER_CODE 
        };

        const res1 = await axios.post(`${API_URL}/customers`, createPayload, config);
        console.log('✅ ШАГ 1 УСПЕХ! Клиент создан.');
        userId = res1.data.id; // Нам нужен этот uid (длинный)
        console.log('UDS ID клиента:', userId);

    } catch (error) {
        // Если ошибка 400 - возможно клиент уже есть
        if (error.response && error.response.status === 400 && error.response.data.errorCode === 'alreadyExists') {
            console.log('⚠️ Клиент уже существует. Ищем его...');
            // Ищем клиента
            const findRes = await axios.get(`${API_URL}/customers?phone=${encodeURIComponent(NEW_PHONE)}`, config);
            if (findRes.data.rows && findRes.data.rows.length > 0) {
                userId = findRes.data.rows[0].id;
                console.log('✅ Клиент найден. ID:', userId);
            } else {
                console.log('❌ Не удалось найти существующего клиента.');
                return;
            }
        } else {
            console.log('❌ ШАГ 1 ПРОВАЛЕН.');
            printError(error);
            // Если тут 404 - значит у нас вообще нет доступа к базе клиентов
            return; 
        }
    }

    if (!userId) return;

    // === ШАГ 2: ПРОВЕДЕНИЕ ОПЕРАЦИИ ПО ID ===
    console.log(`\n2️⃣ ШАГ 2: Проводим покупку для ID ${userId}...`);
    try {
        const opPayload = {
            customer: { id: userId }, // Используем ID вместо телефона
            nonce: crypto.randomUUID(),
            cashier: { externalId: "site_backend" }, 
            total: 100,
            cash: 100,
            description: "Step-by-step purchase"
        };

        const res2 = await axios.post(`${API_URL}/operations`, opPayload, config);
        console.log('✅ ШАГ 2 УСПЕХ! Операция проведена.');
        console.log('ID операции:', res2.data.id);
        
        console.log('\n🏁 ИТОГ:');
        console.log('Зайди в админку UDS -> Клиенты -> Найди "Test User Site"');
        console.log('Проверь поле "Кто пригласил". Если там Александр - ПОБЕДА.');

    } catch (error) {
        console.log('❌ ШАГ 2 ПРОВАЛЕН.');
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

runStepByStep();