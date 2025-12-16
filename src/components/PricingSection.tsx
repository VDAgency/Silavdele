import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, X, Loader2 } from "lucide-react";
import axios from "axios";

const PricingSection = () => {
  // --- СОСТОЯНИЕ (STATE) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Данные выбранного тарифа
  const [selectedTariff, setSelectedTariff] = useState<{name: string, price: string} | null>(null);

  // Данные формы
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // --- ДАННЫЕ ТАРИФОВ ---
  const plans = [
    {
      name: "Базовый",
      subtitle: "Для быстрого старта",
      price: "10",
      oldPrice: "1000",
      features: [
        "25 видеоуроков",
        "Готовые шаблоны контента",
        "Telegram Premium на 3 месяца в подарок 🎁",
        "Setup Facecraft bot для генерации фото подписка за 10$ в подарок 🎁 ",
        "Доступ к курсам и обновлениям навсегда",
        "Поддержка в чате 3 месяца"
      ],
      popular: false,
      cta: "Выбрать тариф"
    },
    {
      name: "Продвинутый",
      subtitle: "Для масштабирования",
      price: "30 999",
      oldPrice: "49 999",
      features: [
        "50+ видеоуроков",
        "Расширенные стратегии продвижения",
        "Telegram Premium на 6 месяцев в подарок 🎁",
        "Setup Facecraft bot для генерации фото подписка за 50$ в подарок 🎁",
        "AI/нейросетевые инструменты",
        "Доступ к курсам и обновлениям навсегда",
        "Поддержка в чате 6 месяцев",
        "Разборы кейсов",
        "Доступ к закрытому комьюнити"
      ],
      popular: true,
      badge: "Рекомендуем",
      cta: "Начать обучение"
    },
    {
      name: "VIP",
      subtitle: "Максимальный результат",
      price: "61 999",
      oldPrice: "99 999",
      features: [
        "Всё из тарифа Продвинутый",
        "Индивидуальные консультации 1-на-1",
        "Telegram Premium на год в подарок 🎁",
        "Setup Facecraft bot для генерации фото подписка за 100$ в подарок 🎁",
        "Персональная стратегия роста",
        "Приоритетная поддержка 24/7",
        "Разбор вашего канала",
        "Доступ к закрытому комьюнити",
        "Пожизненный доступ ко всем обновлениям"
      ],
      popular: false,
      badge: "Максимум",
      cta: "Получить VIP"
    }
  ];

  // --- ФУНКЦИИ ---

  // Открыть модалку
  const openPaymentModal = (tariffName: string, tariffPrice: string) => {
    setSelectedTariff({ name: tariffName, price: tariffPrice });
    setIsModalOpen(true);
  };

  // Обновление полей ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ОТПРАВКА ПЛАТЕЖА
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault(); // Чтобы страница не перезагружалась
    if (!selectedTariff) return;

    setLoading(true);

    try {
      // Убираем пробелы из цены ("15 500" -> 15500) и приводим к формату "15500.00"
      const cleanPrice = parseFloat(selectedTariff.price.replace(/\s/g, '')).toFixed(2);

      // Отправляем данные на наш сервер
      const response = await axios.post('/api/payment/create', {
        amount: cleanPrice,
        email: formData.email,
        phone: formData.phone,
        name: formData.name,
        tariff: selectedTariff.name
      });

      // Если сервер вернул ссылку, переходим на неё
      if (response.data.confirmation_url) {
        window.location.href = response.data.confirmation_url;
      } else {
        alert("Ошибка: Сервер не вернул ссылку на оплату");
      }

    } catch (error) {
      console.error("Ошибка оплаты:", error);
      alert("Не удалось создать платеж. Проверьте соединение или попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(200,100%,40%,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(200,90%,50%,0.05),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Выберите свой{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              тариф
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Начните с комфортного для вас уровня и масштабируйте результаты
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col ${
                plan.popular
                  ? "bg-gradient-to-b from-primary to-accent shadow-2xl scale-105 md:scale-110 border-2 border-primary"
                  : "bg-card border border-border hover:border-primary/50 hover:shadow-lg"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                    {plan.popular ? <Star className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className={`space-y-6 flex-grow ${plan.popular ? "text-primary-foreground" : ""}`}>
                <div className="space-y-2 pt-4">
                  <h3 className={`text-2xl font-bold ${plan.popular ? "text-primary-foreground" : ""}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {plan.subtitle}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className={`text-xl ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>₽</span>
                  </div>
                  <div className={`text-sm ${plan.popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    <span className="line-through">{plan.oldPrice}₽</span>
                    <span className="ml-2 font-semibold text-accent">
                      Скидка {Math.round((1 - parseInt(plan.price.replace(/\s/g, '')) / parseInt(plan.oldPrice.replace(/\s/g, ''))) * 100)}%
                    </span>
                  </div>
                </div>

                {/* КНОПКА ОТКРЫТИЯ МОДАЛКИ */}
                <Button 
                  onClick={() => openPaymentModal(plan.name, plan.price)}
                  className={`w-full py-6 text-base font-semibold rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? "bg-background text-primary hover:bg-background/90 shadow-lg hover:shadow-xl hover:scale-105"
                      : "bg-primary hover:bg-primary-hover text-primary-foreground hover:scale-105"
                  }`}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3 pt-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 mt-0.5 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                      <span className={`text-sm leading-relaxed ${plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center space-y-4">
          <p className="text-muted-foreground">
            🔒 Безопасная оплата через ЮKassa • 💳 Рассрочка доступна • ✅ Возврат в течение 14 дней
          </p>
          <p className="text-sm text-muted-foreground">
            Не уверены? Свяжитесь с нами для бесплатной консультации
          </p>
        </div>
      </div>

      {/* --- МОДАЛЬНОЕ ОКНО ОПЛАТЫ --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
            
            {/* Кнопка закрытия */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 md:p-8">
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold mb-2">Оформление заказа</h3>
                <p className="text-muted-foreground">
                  Тариф: <span className="font-semibold text-primary">{selectedTariff?.name}</span>
                </p>
                <p className="text-xl font-bold mt-1">{selectedTariff?.price} ₽</p>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Ваше Имя</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email (для доступа к курсу)</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="example@mail.ru"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Телефон</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+7 (999) 000-00-00"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-6 text-lg font-bold rounded-xl mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Создаем заказ...
                    </>
                  ) : (
                    "Перейти к оплате"
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Нажимая кнопку, вы соглашаетесь с условиями оферты и политикой конфиденциальности.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default PricingSection;