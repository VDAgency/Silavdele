import { CheckCircle2, Rocket, Settings, TrendingUp, Bot, Wallet } from "lucide-react";

const ProgramSection = () => {
  const modules = [
    {
      icon: Rocket,
      title: "Создание канала с нуля",
      description: "От идеи до первого поста — пошаговая инструкция по запуску канала, выбору ниши и позиционированию"
    },
    {
      icon: Settings,
      title: "Настройка и оформление",
      description: "Профессиональный дизайн канала, создание визуального стиля, настройка автоответов и меню"
    },
    {
      icon: TrendingUp,
      title: "Вирусный рост и продвижение",
      description: "Стратегии привлечения подписчиков, кросс-промо, рекламные механики и органический рост"
    },
    {
      icon: Bot,
      title: "Автоматизация с ботами",
      description: "Создание и настройка ботов для автоматизации процессов, работа с нейросетями и AI-инструментами"
    },
    {
      icon: Wallet,
      title: "Монетизация контента",
      description: "Прямые продажи, подписки, рекламные интеграции, создание продуктовой воронки"
    },
    {
      icon: CheckCircle2,
      title: "Аналитика и масштабирование",
      description: "Отслеживание метрик, A/B тесты, работа с аудиторией и стратегия роста доходов"
    }
  ];

  return (
    <section id="program" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Чему вы{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              научитесь
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Полная программа от запуска до первых продаж — всё, что нужно для успешного канала в Telegram
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <module.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold leading-tight">{module.title}</h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {module.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-primary to-accent p-1 rounded-3xl">
          <div className="bg-background rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <h3 className="text-3xl font-bold">Бонусы к курсу</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">25+ готовых шаблонов контента для быстрого старта</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Доступ к закрытому комьюнити экспертов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Еженедельные разборы лучших практик</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Пожизненные обновления всех материалов</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-auto shrink-0">
                <div className="bg-primary/10 rounded-2xl p-8 text-center space-y-2">
                  <div className="text-5xl font-bold text-primary">50+</div>
                  <div className="text-muted-foreground">видеоуроков<br/>в программе</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
