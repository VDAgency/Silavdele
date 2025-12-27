import React from "react";

const ResultsSection = () => {
  const items = [
    {
      title: "Автоматизация",
      description: "Настроенные процессы кросспостинга и публикаций",
    },
    {
      title: "Источник дохода",
      description: "Понимание как превратить подписчиков в клиентов",
    },
    {
      title: "Работающий канал",
      description: "Готовый к монетизации Telegram-канал с первыми подписчиками",
    },
    {
      title: "Навыки работы с ИИ",
      description: "Умение создавать контент в 10 раз быстрее",
    },
    {
      title: "Системный подход",
      description: "Четкая стратегия развития и масштабирования",
    },
    {
      title: "Сообщество",
      description: "Доступ к закрытому чату успешных предпринимателей",
    },
  ];

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      
      {/* ПАТТЕРН НА ФОНЕ */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-90"
        style={{
          backgroundImage: 'url("/assets/results/bg-pattern.png")', // Проверь название папки! (results или choose-us)
          backgroundRepeat: 'repeat',
          backgroundSize: '800px',
          backgroundPosition: 'center top'
        }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* ЗАГОЛОВОК */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-[50px] leading-[1.2] font-black text-foreground mb-4">
            Что вы получите после
            <br className="hidden md:block" /> прохождения курса
          </h2>
        </div>

        {/* СЕТКА КАРТОЧЕК */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, index) => (
            <div 
              key={index}
              className="relative p-8 h-full min-h-[200px] flex flex-col justify-center bg-[#F0F6F9] transition-transform duration-300 hover:scale-[1.02]"
              style={{
                // 1. ФОРМА: Делаем "лепесток". 
                // Верхний-Левый: 15px (острый). Остальные: 60px (круглые)
                borderRadius: '15px 60px 60px 60px',
                
                // 2. БЕЛАЯ ЛИНИЯ: Толстый белый бордюр
                border: '4px solid #FFFFFF',
                
                // 3. ТЕНЬ: Сильная внутренняя тень (inset) + небольшая внешняя тень
                boxShadow: 'inset 2px 4px 16px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0,0,0,0.05)'
              }}
            >
              <div className="flex items-start gap-5">
                
                {/* ГАЛОЧКА */}
                {/* shrink-0 не дает ей сжиматься. w-14 h-14 задает крупный размер (56px) */}
                <div className="flex-shrink-0">
                   <img 
                     src="/assets/results/icon-check-blue.png" 
                     alt="Check" 
                     className="w-14 h-14 object-contain"
                   />
                </div>

                {/* ТЕКСТ */}
                {/* pt-2 чуть опускает текст, чтобы выровнять по центру галочки */}
                <div className="pt-1">
                  <h3 className="text-xl md:text-xl font-bold text-foreground mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base font-medium text-muted-foreground leading-snug">
                    {item.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ResultsSection;
