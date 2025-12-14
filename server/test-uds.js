// test-uds.js
import axios from 'axios';

// ================= НАСТРОЙКИ =================
// Возьми в админке UDS: Настройки -> Интеграция
const API_KEY = 'NTNhNDg2MjctODYzMC00YmFiLTk2OWMtZTk1ZTgyYmQ5MmQz'; 
const COMPANY_ID = '549756210731'; 

// Возьми реальный код из приложения UDS (свой или друга)
// Например: 'u12345' или буквенный код
const REFERRER_CODE = 'tqqf9586'; 

// Придумай номер телефона, которого ТОЧНО НЕТ в твоей базе UDS
const NEW_CLIENT_PHONE = '+79140769556'; 
// =============================================

async function testUdsIntegration() {
    // Кодируем ключ для авторизации
    const authString = Buffer.from(`${COMPANY_ID}:${API_KEY}`).toString('base64');
    
    const config = {
        headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const API_URL = 'https://api.uds.app/partner/v2';

    console.log(`--- НАЧИНАЕМ ТЕСТ UDS ---`);
    console.log(`Пробуем создать операцию для нового телефона: ${NEW_CLIENT_PHONE}`);
    console.log(`Используем промокод пригласителя: ${REFERRER_CODE}`);

    try {
        const payload = {
            code: REFERRER_CODE, // Гипотеза: это свяжет их
            participant: {
                phone: NEW_CLIENT_PHONE
            },
            nonce: `test_${Date.now()}`,
            cashier: {
                externalId: "site_bot" 
            },
            total: 100, // Сумма покупки 100 руб
            cash: 100,
            description: "Тестовая покупка с сайта (Скрипт проверки)"
        };

        // Отправляем запрос
        const response = await axios.post(`${API_URL}/operations`, payload, config);
        
        console.log('\n✅ УСПЕХ! Ответ от UDS:');
        console.log(JSON.stringify(response.data, null, 2));
        
        console.log('\n⬇️ ЧТО ДЕЛАТЬ ДАЛЬШЕ:');
        console.log('1. Зайди в UDS Admin (Клиенты).');
        console.log(`2. Найди клиента с телефоном ${NEW_CLIENT_PHONE}.`);
        console.log('3. Посмотри в его профиле: Указан ли там, "Кто пригласил"? (Должен быть владелец кода ' + REFERRER_CODE + ')');

    } catch (error) {
        console.log('\n❌ ОШИБКА ЗАПРОСА:');
        if (error.response) {
            console.log(`Статус: ${error.response.status}`);
            console.log('Ответ сервера:', JSON.stringify(error.response.data, null, 2));
            
            if (error.response.data.errorCode === 'notFound' && error.response.data.message.includes('code')) {
                console.log('\n⚠️ ВЫВОД: UDS не нашел этот код как "код операции".');
                console.log('Скорее всего, просто передать реф-код в поле "code" нельзя.');
            }
        } else {
            console.log(error.message);
        }
    }
}

testUdsIntegration();