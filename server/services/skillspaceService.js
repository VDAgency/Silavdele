// skillspaceService.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.SKILLSPACE_API_KEY;
const COURSE_ID = '96047';   // Телеграм от А до Я
const GROUP_ID = '174558';   // Вторая группа

export const addUserToCourse = async (email, name, phone, tariffName) => {
    try {
        console.log(`🚀 Skillspace: Добавляем ${email} в курс ${COURSE_ID}, группа ${GROUP_ID}`);

        const params = new URLSearchParams();
        params.append('token', API_KEY);
        params.append('email', email);
        params.append('name', name);
        params.append('comment', `Телефон: ${phone}, Тариф: ${tariffName}`);
        
        // Передача курса и группы
        params.append(`courses[${COURSE_ID}]`, GROUP_ID);

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

        // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
        // Если Скилспейс вернул ссылку для установки пароля - берем её!
        if (response.data && response.data.passwordSetupLink) {
            return response.data.passwordSetupLink;
        }

        // Если вдруг ссылки нет (например, юзер уже был зарегистрирован), 
        // возвращаем обычный вход
        const schoolDomain = process.env.SKILLSPACE_DOMAIN || 'skillspace.ru';
        return `https://${schoolDomain}/auth/login`;

    } catch (error) {
        console.error("❌ Ошибка Skillspace:", error.response?.data || error.message);
        const schoolDomain = process.env.SKILLSPACE_DOMAIN || 'skillspace.ru';
        return `https://${schoolDomain}/auth/login`;
    }
};