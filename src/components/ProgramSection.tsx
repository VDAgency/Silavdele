// ProgramSection.tsx
import React from "react";
import { Button } from "@/components/ui/button";

const ProgramSection = () => {
  const modules = [
    // 1 РЯД
    {
      img: "/assets/program/icon-security.png",
      title: "Основы безопасности",
      description: "Вы узнаете, как защитить свой аккаунт с помощью двухфакторной аутентификации и надёжных методов безопасности."
    },
    {
      img: "/assets/program/icon-create.png",
      title: "Создание канала с нуля",
      description: "Рассмотрим все шаги от идеи до публикации первого поста: выбор ниши, определение цели. Вы получите четкий план."
    },
    {
      img: "/assets/program/icon-settings.png",
      title: "Настройка и оформление",
      description: "Научитесь создавать профессиональный дизайн и визуальный стиль канала. Настроим автоответчик и удобное меню."
    },
    
    // 2 РЯД
    {
      img: "/assets/program/icon-bot.png",
      title: "Автоматизация с ботами",
      description: "Освоите создание и настройку ботов для автоматизации рутинных задач. Также познакомитесь с основами работы с нейросетями."
    },
    {
      img: "/assets/program/icon-ai.png",
      title: "Применение нейросетей",
      description: "Научитесь использовать нейросети для создания аватаров, оживления фотографий и оформления соцсетей."
    },
    {
      img: "/assets/program/icon-growth.png",
      title: "Вирусный рост и продвижение",
      description: "Изучите эффективные стратегии привлечения подписчиков и продвижения канала. Включены методы кросс-промо."
    },
    
    // 3 РЯД
    {
      img: "/assets/program/icon-ads.png",
      title: "Маркировка рекламы",
      description: "Объясняется, как правильно обозначать рекламный контент, соблюдая нормативы и сохраняя доверие аудитории."
    },
    {
      img: "/assets/program/icon-money.png",
      title: "Монетизация контента",
      description: "Узнаете, как зарабатывать на канале через прямые продажи, подписки и рекламные интеграции. Создадите воронки."
    },
    {
      img: "/assets/program/icon-analytics.png",
      title: "Аналитика и масштабирование",
      description: "Научитесь отслеживать ключевые метрики и проводить A/B тесты для оптимизации работы. Разработаете стратегию роста."
    },

    // 4 РЯД
    {
      img: "/assets/program/icon-socials.png",
      title: "Масштабирование и связка соц.сетей",
      description: "Освоите интеграцию каналов и социальных сетей для создания единого медиацентра. Это увеличит охват."
    },
    {
      img: "/assets/program/icon-collab.png",
      title: "Коллаборации и партнёрства",
      description: "Поймёте, как находить и строить сотрудничество с партнёрами для расширения аудитории и новых возможностей."
    },
    {
      img: "/assets/program/icon-access.png",
      title: "Пожизненный доступ",
      description: "Получите навсегда доступ ко всем материалам курса, обновлениям и поддержке сообщества для постоянного развития."
    }
  ];

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="program" className="relative py-20 md:py-32 overflow-hidden bg-white">
      
      {/* ФОНОВЫЙ ПАТТЕРН */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none">
          <img 
            src="/assets/program/bg-pattern.png" 
            alt="bg" 
            className="w-full h-full object-cover"
          />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* --- ЗАГОЛОВОК --- */}
        <div className="text-center mb-16 relative">
          <div className="relative inline-block">
            {/* Звезда слева (большая) */}
            <img 
              src="/assets/program/star-large.png" 
              alt="Star"
              className="absolute -left-12 -top-4 w-12 md:-left-20 md:-top-8 md:w-20 animate-pulse z-0"
            />
            
            <h2 className="text-4xl md:text-[56px] font-black tracking-tight text-foreground relative z-10">
              Чему вы{" "}
              <span className="text-[#0088CC]">
                научитесь
              </span>
            </h2>

            {/* Звезда справа (маленькая) */}
            <img 
              src="/assets/program/star-small.png" 
              alt="Star"
              className="absolute -right-8 top-0 w-8 md:-right-12 md:top-2 md:w-10 z-0 rotate-12"
            />
          </div>
          
          <p className="mt-6 text-base md:text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Полная программа от запуска до первых продаж — всё, что нужно для<br className="hidden md:block"/>
            успешного канала в Telegram
          </p>
        </div>

        {/* --- СЕТКА КАРТОЧЕК --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {modules.map((module, index) => (
            <div key={index} className="relative w-full h-full min-h-[190px] group">
              
              {/* ФОН КАРТОЧКИ (SVG) */}
              <div className="absolute inset-0 z-0">
                  <img 
                    src="/assets/program/card-bg.svg" 
                    alt="card-bg" 
                    className="w-full h-full object-fill rounded-[20px] shadow-sm group-hover:shadow-md transition-shadow duration-300"
                  />
              </div>

              {/* КОНТЕНТ */}
              <div className="relative z-10 p-6 md:p-7 flex flex-row items-center h-full">
                
                {/* ТЕКСТ (Слева) */}
                <div className="flex-1 pr-2">
                  <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight text-foreground">
                    {module.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                    {module.description}
                  </p>
                </div>

                {/* ИКОНКА (Справа) */}
                <div className="flex-shrink-0 w-[80px] h-[80px] md:w-[120px] md:h-[120px] flex items-center justify-center">
                  <img 
                    src={module.img} 
                    alt={module.title}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                  />
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 pt-12 w-full justify-center">
          <Button 
            onClick={scrollToPricing}
            className="w-full sm:w-auto px-10 py-7 text-lg rounded-full font-bold shadow-xl shadow-primary/20"
          >
            Хочу масштаб
          </Button>
          <Button 
            onClick={scrollToPricing}
            className="w-full sm:w-auto px-10 py-7 text-lg rounded-full font-bold bg-[#0088CC] hover:bg-[#0077aa] shadow-xl shadow-[#0088CC]/20"
          >
            Начни свой путь
          </Button>
        </div>

      </div>
    </section>
  );
};

export default ProgramSection;
