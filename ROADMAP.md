# Project Roadmap

_Last updated: 17 Dec 2025 (payments + onboarding update)_

## Current Snapshot
_Текущее состояние_
- Tech stack: Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Express API + PostgreSQL + nodemailer (`src/*`, `server/*`).
- Технологический стек: Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Express API + PostgreSQL + nodemailer (`src/*`, `server/*`).
- UX: single-page landing with modal checkout (name/email/phone) that redirects to YooKassa; success/fail pages wired; sections `HeroSection`, `ProgramSection`, `PricingSection`, testimonials, FAQ, CTA, legal pages `/privacy`, `/offer`.
- UX: одностраничный лендинг с модальным чекаутом (имя/email/телефон) на YooKassa, подключены страницы успеха/ошибки; блоки `HeroSection`, `ProgramSection`, `PricingSection`, отзывы, FAQ, CTA, страницы `/privacy`, `/offer`.
- State & data: orders/payments persisted to Postgres; webhook adds student to Skillspace, logs purchase to UDS, and emails login link; контент статический, CMS/аналитики пока нет.
- Состояние и данные: заказы/платежи пишутся в Postgres; вебхук добавляет ученика в Skillspace, шлет покупку в UDS и письмо со входом; контент статический, CMS/аналитика отсутствуют.
- Infra: backend relies on `.env` (YooKassa, Skillspace, SMTP, DB, UDS); CI/CD, automated tests, and monitoring still missing.
- Инфраструктура: бэкенд использует `.env` (YooKassa, Skillspace, SMTP, БД, UDS); CI/CD, авто-тесты и мониторинг пока не настроены.
- Business intent: sell онлайн-курс «Сила в деле» и конвертировать трафик в покупки/заявки.
- Бизнес-цель: продавать онлайн-курс «Сила в деле» и переводить трафик в оплату/заявки.

## Guiding Principles
_Основные принципы_
1. **Conversion-first**: every new feature should shorten the path from landing visitor to оплаченный ученик.  
   **Фокус на конверсию**: любая новая фича сокращает путь от посетителя лендинга до оплатившего ученика.
2. **Lifecycle automation**: reduce manual work for lead capture, payments, onboarding, and support (email/Telegram).  
   **Автоматизация цикла**: минимизируем ручной труд при сборе лидов, оплате, онбординге и саппорте (email/Telegram).
3. **Content scalability**: enable non-devs to edit copy, pricing, и расписание без деплоя.  
   **Масштабируемость контента**: даём нетехнарям менять тексты, цены и расписание без деплоя.
4. **Data-informed decisions**: instrument analytics and experiment tooling early.  
   **Решения на данных**: заранее закладываем аналитику и инструменты экспериментов.

## Milestones & Deliverables
_Этапы и результаты_

### M0 — Repository hygiene & observability (1 нед.)
_Гигиена репозитория и наблюдаемость_
- [ ] Add `ROADMAP.md` upkeep guidelines (see bottom of file).  
  [ ] Добавить правила поддержки `ROADMAP.md` (см. конец файла).
- [ ] Configure Prettier/ESLint scripts to run in CI (GitHub Actions).  
  [ ] Настроить запуск Prettier/ESLint в CI (GitHub Actions).
- [ ] Add basic vitest/react-testing-library harness for smoke tests (render `Index` without crashes).  
  [ ] Подключить vitest + react-testing-library для смоук-теста (`Index` рендерится без падений).
- [ ] Hook Vercel/Netlify preview deploys for PRs; document environment variables template.  
  [ ] Подключить превью-деплои (Vercel/Netlify) для PR и описать шаблон переменных окружения.

### M1 — Landing polish & trust signals (1–2 нед.)
_Полировка лендинга и социальное доказательство_
- [ ] Audit copy/visual consistency across `HeroSection`, `ProgramSection`, `PricingSection`, FAQ.  
  [ ] Провести аудит текстов/визуала в `HeroSection`, `ProgramSection`, `PricingSection`, FAQ.
- [ ] Add responsive screenshots/video proof block (carousel) near testimonials for social proof.  
  [ ] Добавить адаптивный блок скриншотов/видео (карусель) рядом с отзывами для соцдоказательства.
- [ ] Implement sticky nav with CTA buttons tracking (intersection observer).  
  [ ] Реализовать липкое меню с трекингом кликов по CTA (intersection observer).
- [ ] Localize static content keys to a JSON dictionary to prep for multi-lang support.  
  [ ] Вынести статический контент в JSON-словарь для подготовки к мультиязычности.
- [ ] Add structured FAQ schema + metadata for SEO.  
  [ ] Добавить структурированные данные FAQ + метаданные для SEO.

### M2 — Lead capture & analytics (2–3 нед.)
_Сбор лидов и аналитика_
- [ ] Add lead form (email + Telegram @handle + tariff) with validation (`react-hook-form` + `zod`).  
  [ ] Сделать форму лида (email, Telegram @, тариф) с валидацией (`react-hook-form` + `zod`).
- [ ] Persist leads to lightweight backend (Supabase table or simple serverless endpoint) and trigger Telegram bot notification.  
  [ ] Сохранять лиды в лёгкий бэкенд (Supabase/серверлес) и отправлять нотификацию в Telegram-бот.
- [ ] Integrate analytics stack (Yandex.Metrica + Google Analytics 4 + server-side event forwarding).  
  [ ] Подключить аналитику (Яндекс.Метрика, GA4, server-side события).
- [ ] Add A/B testing hooks for hero headline + CTA text (e.g., splitbee or growthbook).  
  [ ] Настроить A/B-тестирование заголовка/CTA (splitbee/growthbook).
- [ ] Build success modal with calendly link / autopitch deck download.  
  [ ] Сделать success-модалку с ссылкой на Calendly/автоскачивание презентации.

### M3 — Payments & onboarding (3–5 нед.)
_Оплаты и онбординг_
- [x] Connect Stripe/ЮKassa checkout for three tariffs defined in `PricingSection`; replace static buttons with actual links. (Done via YooKassa redirect; amounts/tariffs come from `PricingSection`, orders/payments stored in Postgres.)  
  [x] Подключить Stripe/ЮKassa для трёх тарифов из `PricingSection`, заменить статические кнопки реальными ссылками. (Реализовано через YooKassa redirect; тарифы/суммы из `PricingSection`, заказы/платежи пишутся в Postgres.)
- [x] Build post-payment webhook handler that grants course access (e.g., add to Telegram закрытый канал via bot API). (Webhook triggers Skillspace invite, UDS sync, and returns login link for email.)  
  [x] Реализовать вебхук после оплаты, который выдаёт доступ (например, добавляет в закрытый Telegram-канал). (Вебхук добавляет в Skillspace, шлет покупку в UDS и возвращает ссылку входа для письма.)
- [ ] Add automated email/SMS onboarding sequence (Resend + SMS provider). (Welcome email with Skillspace login already отправляется после оплаты; SMS и многошаговая цепочка не сделаны.)  
  [ ] Настроить автоматическую цепочку email/SMS онбординга (Resend + SMS-провайдер). (Приветственное письмо со ссылкой на вход уже отправляется после оплаты; SMS/цепочка не реализованы.)
- [ ] Implement dashboard page (`/dashboard`) where user can see purchase status, download materials, contact support.  
  [ ] Сделать страницу `/dashboard` с информацией о покупке, материалами и контактами саппорта.
- [ ] Add refund automation (14-day policy) with admin review UI.  
  [ ] Добавить автоматизацию возвратов (14 дней) и интерфейс модерации для админа.

### M4 — Content management & scalability (5–7 нед.)
_Контент-менеджмент и масштабирование_
- [ ] Migrate static sections to CMS (Sanity/Contentful/Strapi) to let маркетолог править текст, изображения, цены.  
  [ ] Перенести статичные блоки в CMS (Sanity/Contentful/Strapi), чтобы маркетолог менял тексты, изображения и цены.
- [ ] Support scheduled launches/promotions (countdown timers, dynamic bonuses).  
  [ ] Поддержать запланированные запуски/акции (таймеры обратного отсчёта, динамические бонусы).
- [ ] Add blog/news section (`/blog/:slug`) for organic traffic with MDX/Notion sync.  
  [ ] Добавить блог/новости (`/blog/:slug`) для органики с синком через MDX/Notion.
- [ ] Implement localization (ru/en) with i18n routing.  
  [ ] Реализовать локализацию (ru/en) с i18n-маршрутизацией.
- [ ] Add accessibility & performance budget (Lighthouse score ≥ 90).  
  [ ] Ввести бюджет по доступности и производительности (Lighthouse ≥ 90).

### M5 — Community & automation (7+ нед.)
_Комьюнити и продвинутая автоматизация_
- [ ] Deep Telegram integration: in-app widgets showing live канал статистику, отзывов поток через бот.  
  [ ] Глубокая интеграция с Telegram: виджеты со статистикой канала, поток отзывов через бота.
- [ ] Gamify student progress (achievements, referral links, leaderboard).  
  [ ] Геймификация прогресса студентов (ачивки, реферальные ссылки, лидерборд).
- [ ] Build CRM sync (Airtable/HubSpot) to keep sales team updated.  
  [ ] Настроить синхронизацию с CRM (Airtable/HubSpot), чтобы отдел продаж видел обновления.
- [ ] Introduce recommendation engine for upsells (VIP консалтинг, доп. продукты).  
  [ ] Добавить рекомендательную систему для допродаж (VIP-консалтинг, дополнительные продукты).
- [ ] Add advanced reporting dashboard for admins (курс продажи, LTV, воронка).  
  [ ] Сделать расширенную админ-панель отчётности (продажи курса, LTV, воронка).

## Backlog / Ideas
_Резерв / идеи_
- Webinar registration flow with calendar reminders.  
  Поток регистрации на вебинар с напоминаниями в календаре.
- AI контент-генератор мини-бот для подписчиков (можно монетизировать отдельно).  
  Мини-бот с генерацией AI-контента для подписчиков (отдельная монетизация).
- Offline events / meetups map embedded via Mapbox.  
  Карта офлайн-мероприятий/митапов через Mapbox.
- Public testimonials API endpoint for cross-site reuse.  
  Публичный API эндпоинт отзывов для переиспользования на других сайтах.
- Mobile app shell (React Native/Expo) once content stabilizes.  
  Мобильное приложение (React Native/Expo) после стабилизации контента.

## Roadmap Upkeep
_Поддержка дорожной карты_
- Update `_Last updated` date on every edit.  
  Обновляйте дату `_Last updated` при каждом изменении.
- Keep milestones bite-sized (1–2 weeks) and list owner if defined.  
  Держите этапы небольшими (1–2 недели) и указывайте владельца, если он есть.
- Move delivered items from checkboxes to release notes in `README.md` or changelog.  
  Переносите выполненные пункты из чекбоксов в релиз-ноутсы (`README.md` или changelog).
- When scope changes, annotate reasons (market feedback, data, etc.) instead of deleting items.  
  При изменении объёма фиксируйте причину (фидбек рынка, данные и т.д.), а не удаляйте пункты.

