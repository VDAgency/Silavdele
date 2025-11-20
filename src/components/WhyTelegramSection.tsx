import { TrendingUp, Users, DollarSign, Zap } from "lucide-react";

const WhyTelegramSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Стремительный рост",
      description: "Telegram — самая быстрорастущая платформа с 900M+ активных пользователей",
      stat: "+150M",
      statLabel: "новых пользователей в год"
    },
    {
      icon: Users,
      title: "Высокая вовлечённость",
      description: "70% открываемость постов против 5% в Instagram и Facebook",
      stat: "70%",
      statLabel: "открываемость контента"
    },
    {
      icon: DollarSign,
      title: "Прямая монетизация",
      description: "Продажи, подписки, донаты — всё интегрировано в платформу",
      stat: "0%",
      statLabel: "комиссия за продажи"
    },
    {
      icon: Zap,
      title: "Нулевые барьеры",
      description: "Запустить канал можно за 15 минут, без сложной настройки",
      stat: "15 мин",
      statLabel: "от идеи до запуска"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Почему{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Telegram
            </span>{" "}
            — лучшая площадка сегодня
          </h2>
          <p className="text-xl text-muted-foreground">
            Пока другие борются за охваты в соцсетях, эксперты в Telegram создают лояльную аудиторию и зарабатывают
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <benefit.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold">{benefit.title}</h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
                
                <div className="pt-4 border-t border-border/50">
                  <div className="text-3xl font-bold text-primary">{benefit.stat}</div>
                  <div className="text-sm text-muted-foreground mt-1">{benefit.statLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-1">
            <div className="bg-background rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    78%
                  </div>
                  <div className="text-muted-foreground">
                    экспертов считают Telegram основным каналом продаж
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    3.5x
                  </div>
                  <div className="text-muted-foreground">
                    выше конверсия в покупку чем в других соцсетях
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    92%
                  </div>
                  <div className="text-muted-foreground">
                    пользователей читают сообщения в течение часа
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTelegramSection;
