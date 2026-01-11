// server/scripts/update-admins.js
// Скрипт для обновления роли существующих пользователей в БД на 'admin'
import dotenv from 'dotenv';
dotenv.config();
import pool from '../db.js';

async function updateAdmins() {
    try {
        console.log('🔧 Начинаем обновление администраторов...\n');

        // Получаем список админов из .env
        const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
        const adminPhones = process.env.ADMIN_PHONES ? process.env.ADMIN_PHONES.split(',').map(p => p.trim()) : [];

        if (adminEmails.length === 0 && adminPhones.length === 0) {
            console.log('⚠️  Не найдены ADMIN_EMAILS или ADMIN_PHONES в .env файле');
            console.log('   Добавьте в .env:');
            console.log('   ADMIN_EMAILS=silavdele@mail.ru,dolvv2021@gmail.com');
            console.log('   или');
            console.log('   ADMIN_PHONES=+79140769556,+79871658054');
            process.exit(1);
        }

        console.log(`📧 Найдено email админов: ${adminEmails.length}`);
        console.log(`📱 Найдено телефонов админов: ${adminPhones.length}\n`);

        let updatedCount = 0;
        let notFoundEmails = [];
        let notFoundPhones = [];

        // Обновляем по email
        for (const email of adminEmails) {
            const result = await pool.query(
                'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, name, email',
                ['admin', email]
            );

            if (result.rows.length > 0) {
                console.log(`✅ Обновлен: ${result.rows[0].name} (${result.rows[0].email})`);
                updatedCount++;
            } else {
                console.log(`❌ Не найден пользователь с email: ${email}`);
                notFoundEmails.push(email);
            }
        }

        // Обновляем по телефону
        for (const phone of adminPhones) {
            // Нормализуем телефон (убираем пробелы, добавляем + если нужно)
            let normalizedPhone = phone.trim();
            if (!normalizedPhone.startsWith('+')) {
                if (normalizedPhone.startsWith('8')) {
                    normalizedPhone = '+7' + normalizedPhone.slice(1);
                } else if (normalizedPhone.startsWith('7')) {
                    normalizedPhone = '+' + normalizedPhone;
                }
            }

            const result = await pool.query(
                'UPDATE users SET role = $1 WHERE phone = $2 OR phone = $3 RETURNING id, name, phone',
                ['admin', phone, normalizedPhone]
            );

            if (result.rows.length > 0) {
                console.log(`✅ Обновлен: ${result.rows[0].name} (${result.rows[0].phone})`);
                updatedCount++;
            } else {
                console.log(`❌ Не найден пользователь с телефоном: ${phone}`);
                notFoundPhones.push(phone);
            }
        }

        console.log(`\n📊 Итого обновлено: ${updatedCount} пользователей`);

        if (notFoundEmails.length > 0 || notFoundPhones.length > 0) {
            console.log('\n⚠️  Не найдены следующие пользователи:');
            if (notFoundEmails.length > 0) {
                console.log('   Email:', notFoundEmails.join(', '));
            }
            if (notFoundPhones.length > 0) {
                console.log('   Телефоны:', notFoundPhones.join(', '));
            }
        }

        console.log('\n✅ Обновление завершено!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Ошибка при обновлении администраторов:', error);
        process.exit(1);
    }
}

updateAdmins();
