import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.SKILLSPACE_API_KEY;
// Твои жесткие ID
const COURSE_ID = '96047';   // Телеграм от А до Я
const GROUP_ID = '174558';   // Вторая группа

export const addUserToCourse = async (email, name, phone, tariffName) => {
    try {
        console.log(`🚀 Skillspace: Добавляем ${email} в курс ${COURSE_ID}, группа ${GROUP_ID}`);

        // Используем URLSearchParams для формирования данных, 
        // так как API требует формат courses[ID]=ID
        const params = new URLSearchParams();
        params.append('token', API_KEY);
        params.append('email', email);
        params.append('name', name);
        // Телефон запишем в комментарий, так как отдельного поля phone в этом методе API нет (судя по скрину)
        params.append('comment', `Телефон: ${phone}, Тариф: ${tariffName}`);
        
        // Самое важное: передача курса и группы
        // Формат: courses[ID_КУРСА]=ID_ГРУППЫ
        params.append(`courses[${COURSE_ID}]`, GROUP_ID);

        // Отправляем POST запрос
        const response = await axios.post(
            'https://skillspace.ru/api/open/v1/course/student-invite', 
            params, 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log("✅ Ответ Skillspace:", response.data);

        // Ссылка на вход (общая)
        // Если у тебя есть свой поддомен, лучше использовать его
        const schoolDomain = process.env.SKILLSPACE_DOMAIN || 'skillspace.ru';
        return `https://${schoolDomain}/auth/login`;

    } catch (error) {
        console.error("❌ Ошибка Skillspace:", error.response?.data || error.message);
        // Возвращаем ссылку на вход, чтобы не ломать процесс отправки письма
        const schoolDomain = process.env.SKILLSPACE_DOMAIN || 'skillspace.ru';
        return `https://${schoolDomain}/auth/login`;
    }
};