// server/services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// ==========================================
// 1. НАСТРОЙКА ПОЧТОВОГО КЛИЕНТА
// ==========================================
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true для 465, false для других портов
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// ==========================================
// 2. ПИСЬМО ПОСЛЕ ПОКУПКИ (Доступ + UDS)
// ==========================================
export const sendWelcomeEmail = async (email, name, loginLink, referrerCode = null) => {
    try {
        console.log(`📧 Отправляем Welcome-письмо на ${email} (Ref: ${referrerCode || 'Нет'})...`);
        
        // Формируем ссылку UDS
        const udsLink = referrerCode 
            ? `https://silavdele.uds.app/c/join?ref=${referrerCode}`
            : `https://silavdele.uds.app/c/join`;

        const info = await transporter.sendMail({
            from: `"Сила в Деле" <${process.env.SMTP_USER}>`, 
            to: email, 
            subject: "Доступ к курсу «Сила в Деле» + Бонусы 🎁",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                    
                    <h2 style="color: #007bff;">Поздравляем с покупкой! 🎉</h2>
                    <p>Здравствуйте, <strong>${name}</strong>!</p>
                    <p>Оплата прошла успешно. Мы рады видеть вас на курсе.</p>
                    
                    <!-- БЛОК ОБУЧЕНИЯ -->
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">📚 Ваше обучение</h3>
                        <p>Личный кабинет уже создан. Переходите к урокам:</p>
                        <div style="margin: 20px 0;">
                            <a href="${loginLink}" style="background-color: #007bff; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                Войти в обучение
                            </a>
                        </div>
                        <p style="font-size: 12px;">Прямая ссылка: <a href="${loginLink}">${loginLink}</a></p>
                    </div>

                    <!-- БЛОК UDS (БОНУСЫ) -->
                    <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; border: 1px solid #ffeeba; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #856404;">💎 Заберите свой кэшбек!</h3>
                        <p>Мы начислили вам баллы за эту покупку.</p>
                        <p>Чтобы увидеть их и тратить на следующие покупки, <strong>обязательно перейдите по ссылке</strong> и установите приложение UDS:</p>
                        
                        <div style="margin: 20px 0;">
                            <a href="${udsLink}" style="background-color: #28a745; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                Получить баллы
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #856404;">
                            Это также закрепит вас в нашей системе лояльности.
                        </p>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #777;">Если у вас возникли вопросы, просто ответьте на это письмо.</p>
                </div>
            `,
        });

        console.log("✅ Welcome-письмо отправлено:", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Ошибка отправки письма:", error);
        return false;
    }
};

// ==========================================
// 3. ПИСЬМО ВОССТАНОВЛЕНИЯ ПАРОЛЯ
// ==========================================
export const sendResetPasswordEmail = async (email, token) => {
    try {
        console.log(`📧 Отправляем письмо восстановления на ${email}...`);

        // Ссылка ведет на фронтенд страницу сброса (её создадим на следующем шаге)
        const resetLink = `https://silavdele.ru/reset-password?token=${token}`;

        const info = await transporter.sendMail({
            from: `"Сила в Деле" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Восстановление доступа 🔐",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #007bff;">Восстановление пароля</h2>
                    <p>Здравствуйте!</p>
                    <p>Мы получили запрос на сброс пароля для вашего аккаунта.</p>
                    <p>Если это были вы, нажмите на кнопку ниже, чтобы придумать новый пароль:</p>

                    <div style="margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                            Сбросить пароль
                        </a>
                    </div>

                    <p style="font-size: 12px; color: #777;">
                        Ссылка действительна 1 час.<br>
                        Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
                    </p>
                </div>
            `,
        });

        console.log("✅ Письмо восстановления отправлено:", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Ошибка отправки письма восстановления:", error);
        return false;
    }
};
