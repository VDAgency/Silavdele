import axios from 'axios';
import crypto from 'crypto';

// --- НАСТРОЙКИ ---
const API_KEY = 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = '549756210731'; 
const API_URL = 'https://api.uds.app/partner/v2';

// ТЕСТОВЫЕ ДАННЫЕ
// 1. Попробуй сначала существующий номер (Александр): +79372752934
// 2. Потом попробуй новый номер
const PHONE = '+79372752934'; 
const REFERRER_CODE = 'tqqf9586'; // Код друга
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
        // Запрашиваем find с total=0, чтобы просто узнать, есть ли он
        const resFind = await axios.get(`${API_URL}/customers/find?phone=${encodedPhone}`, { headers: getHeaders() });
        
        console.log(`✅ Клиент НАЙДЕН!`);
        console.log(`   Имя: ${resFind.data.user.displayName}`);
        userUid = resFind.data.user.uid;

    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`ℹ️ Клиент НЕ найден.`);
        } else {
            console.log(`❌ Ошибка поиска: ${error.message}`);
            return;
        }
    }

    // --- ШАГ 2: СОЗДАНИЕ (ЕСЛИ НЕ НАЙДЕН) ---
    if (!userUid) {
        console.log(`\n🆕 2. Создаем нового клиента...`);
        try {
            // !!! ВНИМАНИЕ: Тут нужен точный формат из документации, которую ты пришлешь !!!
            // Обычно это выглядит так:
            const createPayload = {
                phone: PHONE,
                // code: REFERRER_CODE // <-- Жду подтверждения, можно ли сюда совать код
            };

            // const resCreate = await axios.post(`${API_URL}/customers`, createPayload, { headers: getHeaders() });
            // userUid = resCreate.data.uid;
            // console.log(`✅ Клиент создан! UID: ${userUid}`);
            
            console.log(`🛑 СТОП: Я пока не знаю точный формат создания (POST). Жду документацию.`);
            return; // Прерываем, пока нет доков

        } catch (error) {
            console.log(`❌ Ошибка создания: ${error.message}`);
            return;
        }
    }

    // --- ШАГ 3: ПОКУПКА ПО UID ---
    if (userUid) {
        console.log(`\n💸 3. Проводим покупку для UID: ${userUid}`);
        try {
            const payload = {
                nonce: crypto.randomUUID(),
                customer: { id: userUid }, // <-- Самое главное: работаем по ID
                cashier: { externalId: "site_backend", name: "Сайт" },
                total: AMOUNT,
                cash: AMOUNT,
                description: "Покупка по алгоритму"
            };

            // Если это была покупка существующего юзера, но он применил реф. код:
            if (REFERRER_CODE) {
                 // payload.code = REFERRER_CODE; // Можно попробовать добавить
            }

            const resOp = await axios.post(`${API_URL}/operations`, payload, { headers: getHeaders() });
            console.log(`✅✅✅ УСПЕХ! Операция проведена.`);
            console.log(`ID: ${resOp.data.id}`);

        } catch (error) {
            console.log(`❌ Ошибка покупки:`);
            console.log(JSON.stringify(error.response?.data || error.message));
        }
    }
}

runLogic();