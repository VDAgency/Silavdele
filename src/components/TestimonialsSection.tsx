import { Star, TrendingUp } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Анна Смирнова",
      role: "Коуч по здоровью",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
      before: "150 подписчиков",
      after: "12,000 подписчиков",
      revenue: "450,000₽/мес",
      text: "За 3 месяца после курса мой канал вырос в 80 раз. Теперь я зарабатываю на консультациях и продаже марафонов больше, чем на основной работе."
    },
    {
      name: "Дмитрий Волков",
      role: "Эксперт по инвестициям",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry",
      before: "0 подписчиков",
      after: "8,500 подписчиков",
      revenue: "320,000₽/мес",
      text: "Запустил канал с нуля, следуя программе курса. Уже через месяц получил первые продажи. Сейчас веду платную подписку и продаю курсы."
    },
    {
      name: "Мария Петрова",
      role: "Психолог",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      before: "500 подписчиков",
      after: "25,000 подписчиков",
      revenue: "680,000₽/мес",
      text: "Раньше вела Instagram, но там охваты упали до 5%. В Telegram открываемость моих постов — 65%! Аудитория активная, продажи растут каждый месяц."
    },
    {
      name: "Алексей Ковалёв",
      role: "Маркетолог",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
      before: "1,200 подписчиков",
      after: "18,000 подписчиков",
      revenue: "550,000₽/мес",
      text: "Боты и автоматизация из курса сэкономили мне 20 часов в неделю. Теперь канал работает почти на автопилоте, а я фокусируюсь на контенте."
    },
    {
      name: "Елена Соколова",
      role: "Бизнес-тренер",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      before: "2,000 подписчиков",
      after: "35,000 подписчиков",
      revenue: "920,000₽/мес",
      text: "VIP-тариф окупился за первый месяц! Персональная стратегия и консультации помогли выстроить воронку продаж, которая приносит стабильный доход."
    },
    {
      name: "Игорь Николаев",
      role: "IT-эксперт",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Igor",
      before: "300 подписчиков",
      after: "15,000 подписчиков",
      revenue: "480,000₽/мес",
      text: "Думал, что создать канал сложно. Курс показал, что это проще, чем кажется. За 2 месяца вышел на первую прибыль, а через 4 — уволился с работы."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Истории{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              успеха
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Реальные результаты наших учеников — от первых подписчиков до стабильного дохода
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full ring-2 ring-primary/20"
                />
                <div className="flex-1">
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-sm">
                "{testimonial.text}"
              </p>

              <div className="pt-4 border-t border-border/50 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Было:</span>
                  <span className="font-semibold">{testimonial.before}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Стало:</span>
                  <span className="font-semibold text-primary flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {testimonial.after}
                  </span>
                </div>
                <div className="bg-primary/10 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-primary">{testimonial.revenue}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">ежемесячный доход</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-primary to-accent p-1 rounded-3xl">
          <div className="bg-background rounded-3xl p-8 md:p-12 text-center space-y-6">
            <h3 className="text-3xl font-bold">Присоединяйтесь к 2,500+ успешным ученикам</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">2,500+</div>
                <div className="text-sm text-muted-foreground">прошли обучение</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">₽180M+</div>
                <div className="text-sm text-muted-foreground">заработали наши ученики</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">4.9/5</div>
                <div className="text-sm text-muted-foreground">средняя оценка курса</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
