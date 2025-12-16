import axios from 'axios';

// ================= НАСТРОЙКИ =================
const API_KEY = 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = '549756210731'; 

// Тестовый телефон (реальный или выдуманный)
const PHONE = '+79372752934'; 
// =============================================

const authString = Buffer.from(`${COMPANY_ID}:${API_KEY}`).toString('base64');
const config = {
    headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Добавляем ID запроса и время (как в примере из документации)
        'X-Origin-Request-Id': Date.now().toString(),
        'X-Timestamp': new Date().toISOString()
    }
};

const API_URL = 'https://api.uds.app/partner/v2';

async function testFindCustomer() {
    console.log(`--- ТЕСТ: ПОИСК КЛИЕНТА (FIND) ---`);
    
    // ВАЖНО: Кодируем телефон (+ превращается в %2b)
    const encodedPhone = encodeURIComponent(PHONE);
    console.log(`Ищем телефон: ${PHONE} (Encoded: ${encodedPhone})`);

    try {
        // Формируем URL с параметрами
        // Добавляем total=100, чтобы UDS сразу посчитал, сколько баллов можно списать/начислить
        const url = `${API_URL}/customers/find?phone=${encodedPhone}&total=100`;
        
        const response = await axios.get(url, config);
        
        console.log('\n✅ УСПЕХ! Клиент найден (или получена информация).');
        console.log('User UID:', response.data.user?.uid);
        console.log('Имя:', response.data.user?.displayName);
        console.log('Баллов у клиента:', response.data.user?.participant?.points);
        console.log('Можно списать баллов:', response.data.purchase?.maxPoints);

    } catch (error) {
        console.log('\n❌ ОШИБКА:');
        if (error.response) {
            console.log(`Статус: ${error.response.status}`);
            console.log('Ответ:', JSON.stringify(error.response.data, null, 2));
            
            // Если 404 - значит клиента просто нет в базе (это нормальный ответ для find)
            if (error.response.status === 404) {
                console.log('👉 Это нормально. Клиент с таким номером еще не регистрировался в UDS.');
            }
        } else {
            console.log(error.message);
        }
    }
}

testFindCustomer();