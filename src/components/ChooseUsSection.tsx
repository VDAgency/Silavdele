import React from "react";

const ChooseUsSection = () => {
  const cards = [
    {
      title: "Практичность",
      description: "Никакой воды — только работающие инструменты и стратегии, проверенные на реальных кейсах",
    },
    {
      title: "Результативность",
      description: "Конкретные метрики роста: подписчики, вовлеченность, продажи. Видимый результат уже через месяц",
    },
    {
      title: "Современный подход",
      description: "Используем последние технологии: ИИ для контента, автоматизацию процессов, передовые методики",
    },
    {
      title: "Поддержка 24/7",
      description: "Закрытое сообщество единомышленников, регулярные созвоны с экспертом, ответы на все вопросы",
    },
    {
      title: "Гибкий формат",
      description: "Учитесь в своем темпе: видеоуроки доступны всегда, практические задания с обратной связью",
    },
    {
      title: "Пожизненный доступ",
      description: "Все обновления курса, новые материалы и инструменты — бесплатно и навсегда",
    },
  ];

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      
      {/* ПАТТЕРН НА ФОНЕ */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-90"
        style={{
          backgroundImage: 'url("/assets/choose-us/bg-pattern.png")',
          backgroundRepeat: 'repeat',
          backgroundSize: '800px',
          backgroundPosition: 'center top'
        }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* --- ЗАГОЛОВОК --- */}
        <div className="text-center mb-16 relative">
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-[50px] leading-[1.2] font-black text-foreground relative z-10">
              Почему выбирают <span className="text-[#0088CC]">нас</span>
            </h2>
            
            {/* Звезда слева */}
            <img 
              src="/assets/choose-us/star-left.png" 
              alt="Star"
              className="absolute -left-12 -top-8 w-12 md:-left-20 md:-top-10 md:w-20 z-0 animate-pulse"
            />
            
            {/* Звезда справа */}
            <img 
              src="/assets/choose-us/star-right.png" 
              alt="Star"
              className="absolute -right-8 top-2 w-8 md:-right-12 md:top-4 md:w-12 z-0 rotate-12"
            />
          </div>
          
          <p className="mt-6 text-base md:text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Мы не просто учим теории — мы помогаем достигать реальных бизнес-результатов через практические навыки и современные технологии.
          </p>
        </div>

        {/* --- СЕТКА КАРТОЧЕК --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, index) => (
            <div 
              key={index}
              className="relative p-8 h-full min-h-[220px] flex flex-col transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #0292DA 0%, #68CDFF 100%)',
                // Настройка скруглений: 
                // Верхний-левый: 15px (маленький)
                // Остальные: 40px (большие)
                borderRadius: '15px 66px 66px 66px',
                boxShadow: '0 10px 30px -10px rgba(2, 146, 218, 0.3)'
              }}
            >
              {/* Заголовок */}
              <h3 className="text-xl md:text-2xl font-black text-white mb-4">
                {card.title}
              </h3>
              
              {/* Белая линия-разделитель */}
              <div className="w-full h-[2px] bg-white/30 mb-4"></div>
              
              {/* Описание */}
              <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ChooseUsSection;
