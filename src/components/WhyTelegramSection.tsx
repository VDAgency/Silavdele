// WhyTelegramSection.tsx
import React from "react";

const WhyTelegramSection = () => {
  // Данные для карточек с утками
  const features = [
    {
      img: "/assets/why-telegram/duck-growth.png",
      title: "Стремительный рост",
      description: "Telegram — самая быстрорастущая платформа с 900M+ активных пользователей",
      highlight: "+150M",
      subLabel: "новых пользователей в год",
    },
    {
      img: "/assets/why-telegram/duck-laptop.png",
      title: "Высокая вовлечённость",
      description: "70% открываемость постов против 5% в Instagram и Facebook",
      highlight: "70%",
      subLabel: "открываемость контента",
    },
    {
      img: "/assets/why-telegram/duck-money.png",
      title: "Прямая монетизация",
      description: "Продажи, подписки, донаты — всё интегрировано в платформу",
      highlight: "0%",
      subLabel: "комиссия за продажи",
    },
    {
      img: "/assets/why-telegram/duck-easy.png",
      title: "Нулевые барьеры",
      description: "Запустить канал можно за 15 минут, без сложной настройки",
      highlight: "15 мин",
      subLabel: "от идеи до запуска",
    },
  ];

  return (
    <section className="pt-32 pb-20 md:pt-52 md:pb-32 bg-white overflow-hidden" id="about">
      <div className="container mx-auto px-4 max-w-screen-xl">
        
        {/* --- 1. ЗАГОЛОВОК С ЗВЕЗДАМИ --- */}
        <div className="text-center mb-16 relative">
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-[50px] leading-[1.2] font-black text-foreground relative z-10">
              Почему <span className="text-[#0088CC]">Telegram</span> — лучшая
              <br className="hidden md:block" /> площадка сегодня
            </h2>
            
            {/* Маленькая звездочка (слева снизу) */}
            <img 
              src="/assets/why-telegram/star-small.png" 
              alt="Star"
              className="absolute -left-2 -bottom-6 w-12 
                md:-left-2 md:-bottom-4 md:w-16 z-0 animate-pulse"
            />
            
            {/* Большая звездочка (справа сверху) */}
            <img 
              src="/assets/why-telegram/star-large.png" 
              alt="Star"
              className="absolute -right-4 -top-12 w-20 
                md:-right-32 md:-top-10 md:w-36 z-0"
            />
          </div>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl md:max-w-6xl mx-auto">
            Пока другие борются за охваты в соцсетях, эксперты в Telegram создают лояльную аудиторию и зарабатывают
          </p>
        </div>

{/* --- 2. ВЕРХНЯЯ ПЛАШКА С ЦИФРАМИ (Bordered Box) --- */}
        {/* 1. Ширина: max-w-6xl (было 5xl). 2. Радиус: rounded-[29px] (было 50px). */}
        <div className="max-w-6xl mx-auto mb-20 border-2 border-[#0088CC] rounded-[29px] py-10 px-4 md:px-8 bg-white shadow-sm">
          
          {/* Grid: Убрал divide-x, чтобы дать тексту больше свободы */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 text-center items-end">
            
            <div className="flex flex-col items-center">
              {/* Цифры: font-bold (было font-black). Размер чуть поправил под макет */}
              <div className="text-3xl md:text-[50px] leading-tight font-bold text-[#0088CC] mb-2">900M+</div>
              {/* Текст: whitespace-nowrap (запрет переноса) */}
              <div className="text-xs sm:text-sm md:text-base font-medium text-foreground whitespace-nowrap">активных пользователей</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-[50px] leading-tight font-bold text-[#0088CC] mb-2">70%</div>
              <div className="text-xs sm:text-sm md:text-base font-medium text-foreground whitespace-nowrap">вовлеченность аудитории</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-[50px] leading-tight font-bold text-[#0088CC] mb-2">2.5x</div>
              <div className="text-xs sm:text-sm md:text-base font-medium text-foreground whitespace-nowrap">рост каналов</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-[50px] leading-tight font-bold text-[#0088CC] mb-2">0₽</div>
              <div className="text-xs sm:text-sm md:text-base font-medium text-foreground whitespace-nowrap">затрат на старт</div>
            </div>

          </div>
        </div>

{/* --- 3. КАРТОЧКИ С УТКАМИ (SVG Background) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 max-w-6xl mx-auto">
          {features.map((item, index) => (
            <div key={index} className="relative group w-full">
              
              {/* ФОН КАРТОЧКИ (SVG) */}
              <div className="absolute inset-0 z-0">
                 <img 
                    src="/assets/why-telegram/card-bg.svg" 
                    alt="bg" 
                    // object-fill заставляет фон растянуться ровно по размеру контента
                    className="w-full h-full object-fill rounded-[30px]"
                 />
              </div>

              {/* КОНТЕНТ ВНУТРИ: Всегда 2 колонки (grid-cols-2), даже на мобилке */}
              <div className="relative z-10 grid grid-cols-2 h-full min-h-[180px] p-4 md:p-8 items-center">
                
                {/* ЛЕВАЯ КОЛОНКА: Изображение Утки */}
                <div className="flex justify-center items-center">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    // Размеры: поменьше на мобилке, побольше на десктопе. 
                    // Но всегда слева.
                    className="w-[110px] md:w-[160px] object-contain transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* ПРАВАЯ КОЛОНКА: Текст */}
                <div className="flex flex-col justify-center text-left pl-2 md:pl-4">
                  {/* Заголовок */}
                  <h3 className="text-sm md:text-xl font-black text-foreground mb-2 leading-tight">
                    {item.title}
                  </h3>
                  
                  {/* Описание */}
                  <p className="text-[11px] md:text-sm text-muted-foreground mb-3 leading-snug">
                    {item.description}
                  </p>
                  
                  {/* Статистика (Синяя) */}
                  <div className="mt-auto">
                     <span className="block text-lg md:text-2xl font-black text-[#0088CC] leading-none mb-1">
                        {item.highlight}
                     </span>
                     <span className="text-[10px] md:text-xs text-gray-400 font-medium leading-none">
                        {item.subLabel}
                     </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

{/* --- 4. НИЖНИЕ ЦИФРЫ (Статистика) --- */}
<div className="mt-20 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
              
              <div className="flex flex-col items-center space-y-2">
                {/* Цифры: font-bold (как вверху), цвет Telegram Blue */}
                <div className="text-5xl md:text-[60px] font-bold text-[#0088CC] leading-none">
                  78%
                </div>
                {/* Текст: font-medium (средняя жирность), аккуратный межстрочный интервал */}
                <div className="text-sm md:text-lg font-medium text-foreground leading-snug">
                  экспертов считают<br/>Telegram основным<br/>каналом продаж
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="text-5xl md:text-[60px] font-bold text-[#0088CC] leading-none">
                  2.5x
                </div>
                <div className="text-sm md:text-lg font-medium text-foreground leading-snug">
                  выше конверсия в<br/>покупку чем в других<br/>соц. сетях
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="text-5xl md:text-[60px] font-bold text-[#0088CC] leading-none">
                  70%
                </div>
                <div className="text-sm md:text-lg font-medium text-foreground leading-snug">
                  пользователей читают<br/>сообщения в течении<br/>часа
                </div>
              </div>

            </div>
        </div>

      </div>
    </section>
  );
};

export default WhyTelegramSection;
