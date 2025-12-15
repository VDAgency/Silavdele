// emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Настройка почтальона
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true для 465, false для других портов
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendWelcomeEmail = async (email, name, loginLink) => {
    try {
        console.log(`📧 Отправляем письмо на ${email}...`);
        
        const info = await transporter.sendMail({
            from: `"Сила в Деле" <${process.env.SMTP_USER}>`, // От кого
            to: email, // Кому
            subject: "Доступ к курсу «Сила в Деле»", // Тема
            // HTML версия письма (красивая)
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #007bff;">Поздравляем с покупкой! 🎉</h2>
                    <p>Здравствуйте, <strong>${name}</strong>!</p>
                    <p>Оплата прошла успешно. Мы рады видеть вас на курсе.</p>
                    <p>Ваш личный кабинет уже создан.</p>
                    
                    <div style="margin: 30px 0;">
                        <a href="${loginLink}" style="background-color: #28a745; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Войти в обучение
                        </a>
                    </div>

                    <p>Или используйте прямую ссылку:<br>
                    <a href="${loginLink}">${loginLink}</a></p>
                    
                    <hr>
                    <p style="font-size: 12px; color: #777;">Если у вас возникли вопросы, ответьте на это письмо.</p>
                </div>
            `,
        });

        console.log("✅ Письмо отправлено:", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Ошибка отправки письма:", error);
        return false;
    }
};