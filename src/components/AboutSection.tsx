import { Users, Award, BookOpen, Rocket } from "lucide-react";

const AboutSection = () => {
  const stats = [
    { icon: Users, value: "2,500+", label: "Выпускников курса" },
    { icon: Award, value: "5 лет", label: "Опыта в Telegram" },
    { icon: BookOpen, value: "50+", label: "Часов контента" },
    { icon: Rocket, value: "92%", label: "Успешных запусков" }
  ];

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                О курсе{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Telegram от А до Я
                </span>
              </h2>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Мы создали первый в России комплексный курс по развитию и монетизации Telegram-каналов для экспертов, блогеров и предпринимателей.
                </p>
                <p>
                  Наша команда — это эксперты с многолетним опытом запуска успешных проектов в Telegram. Мы знаем все тонкости платформы и делимся только проверенными стратегиями.
                </p>
                <p>
                  За 5 лет мы помогли более 2,500 ученикам создать прибыльные каналы. Суммарный доход наших выпускников превысил 180 миллионов рублей.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Гарантия результата</div>
                    <div className="text-sm text-muted-foreground">или вернём деньги в течение 14 дней</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg space-y-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground leading-tight">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 space-y-4">
                <h3 className="text-xl font-bold">Что делает нас лучшими</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0">→</span>
                    <span>Практический подход — никакой воды, только конкретные действия</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0">→</span>
                    <span>Актуальные стратегии 2024 года — работают здесь и сейчас</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0">→</span>
                    <span>Постоянная поддержка — не оставим вас один на один с вопросами</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0">→</span>
                    <span>Реальные кейсы — учитесь на примерах успешных учеников</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
