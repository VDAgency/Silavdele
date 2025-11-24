import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Базовый",
      subtitle: "Для быстрого старта",
      price: "15 500",
      oldPrice: "24 999",
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
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
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

              <div className={`space-y-6 ${plan.popular ? "text-primary-foreground" : ""}`}>
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

                <Button 
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
            🔒 Безопасная оплата через Stripe • 💳 Рассрочка доступна • ✅ Возврат в течение 14 дней
          </p>
          <p className="text-sm text-muted-foreground">
            Не уверены? Свяжитесь с нами для бесплатной консультации
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
