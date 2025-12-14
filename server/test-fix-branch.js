import crypto from 'crypto';
import axios from 'axios';

// ================= НАСТРОЙКИ (ТВОИ) =================
const API_KEY = 'ZjViZDJjZTItMjg4OS00NTVjLWE0Y2UtZTJlZGI0NGRhNGNj'; 
const COMPANY_ID = '549756210731'; 

// Тестовые данные
const REFERRER_CODE = 'tqqf9586'; 
const NEW_PHONE = '+79990005577'; // Снова новый номер, чтобы чисто проверить
// ====================================================

const authString = Buffer.from(`${COMPANY_ID}:${API_KEY}`).toString('base64');
const config = {
    headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};
const API_URL = 'https://api.uds.app/partner/v2';

async function runBranchFix() {
    console.log(`--- ПОИСК ФИЛИАЛА И ПОКУПКА ---`);

    let branchId = null;

    // 1. Ищем филиалы
    try {
        console.log('1. Запрашиваю список филиалов (GET /branches)...');
        const res = await axios.get(`${API_URL}/branches`, config);
        
        const branches = res.data.rows;
        if (branches && branches.length > 0) {
            console.log(`✅ Найдено филиалов: ${branches.length}`);
            console.log(`Первый филиал: ${branches[0].name} (ID: ${branches[0].id})`);
            branchId = branches[0].id;
        } else {
            console.log('❌ Список филиалов пуст. Нужно создать филиал в админке UDS!');
            return;
        }
    } catch (e) {
        console.log('❌ Ошибка при поиске филиалов:');
        printError(e);
        return;
    }

    // 2. Пробуем оплату с указанием филиала
    if (branchId) {
        console.log(`\n2. Пробую провести оплату в филиал ID: ${branchId}...`);
        
        try {
            const payload = {
                code: REFERRER_CODE, // Пробуем передать код друга
                participant: {
                    phone: NEW_PHONE
                },
                nonce: crypto.randomUUID(),
                cashier: { externalId: "site_bot" },
                branch: { id: branchId }, // <--- ВОТ ЧЕГО НЕ ХВАТАЛО!
                total: 100,
                cash: 100,
                description: "Test Fix Branch"
            };

            const resOp = await axios.post(`${API_URL}/operations`, payload, config);
            console.log('✅✅✅ ПОБЕДА! Операция прошла успешно!');
            console.log('ID операции:', resOp.data.id);
            console.log('Теперь проверь в админке UDS, стал ли этот клиент рефералом.');
            
        } catch (e) {
            console.log('❌ Оплата не прошла даже с филиалом.');
            printError(e);
        }
    }
}

function printError(error) {
    if (error.response) {
        console.log(`Статус: ${error.response.status}`);
        console.log('Ответ:', JSON.stringify(error.response.data, null, 2));
        
        // Если 403 Forbidden вылетит и тут
        if (error.response.status === 403) {
             console.log('\n!!! ВНИМАНИЕ !!!');
             console.log('Ошибка 403 означает, что ваш ТАРИФ в UDS не позволяет использовать API.');
             console.log('Если у вас тариф "Start" (бесплатный) или "Lite", API на запись часто закрыто.');
             console.log('Нужен тариф PRO или купленная опция интеграции.');
        }
    } else {
        console.log(error.message);
    }
}

runBranchFix();