// WhyTelegramSection.tsx
import React from "react";

const WhyTelegramSection = () => {
  return (
    <section className="pt-32 pb-20 md:pt-52 md:pb-32 bg-white overflow-hidden" id="about">
      <div className="container mx-auto px-4 max-w-screen-xl">
        
        {/* --- 1. ЗАГОЛОВОК --- */}
        <div className="text-center mb-16 relative">
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-[50px] leading-[1.2] font-black text-foreground relative z-10">
              Почему <span className="text-[#0088CC]">Telegram</span> — лучшая
              <br className="hidden md:block" /> площадка сегодня
            </h2>
            <img src="/assets/why-telegram/star-small.png" alt="Star" className="absolute -left-2 -bottom-6 w-12 md:-left-2 md:-bottom-4 md:w-16 z-0 animate-pulse"/>
            <img src="/assets/why-telegram/star-large.png" alt="Star" className="absolute -right-4 -top-12 w-20 md:-right-32 md:-top-10 md:w-36 z-0"/>
          </div>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl md:max-w-6xl mx-auto">
            Пока другие борются за охваты в соцсетях, эксперты в Telegram создают лояльную аудиторию и зарабатывают
          </p>
        </div>

        {/* --- 2. ВЕРХНЯЯ ПЛАШКА --- */}
        <div className="max-w-6xl mx-auto mb-20 border-2 border-[#0088CC] rounded-[29px] py-10 px-4 md:px-8 bg-white shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 text-center items-end">
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-[50px] leading-tight font-bold text-[#0088CC] mb-2">900M+</div>
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

        {/* --- 3. СЕТКА КАРТОЧЕК --- */}
        {/* items-stretch заставляет карточки в одном ряду быть одинаковой высоты */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* === КАРТОЧКА 1 === */}
          <div className="relative w-full h-full">
              {/* ФОН: h-full растягивает картинку на всю высоту карточки (даже если сосед выше) */}
              <div className="absolute inset-0 z-0 h-full w-full">
                 <img src="/assets/why-telegram/card-bg.svg" alt="bg" className="w-full h-full object-fill rounded-[30px]"/>
              </div>
              
              {/* КОНТЕНТ: Flexbox вместо Grid для лучшего контроля переполнения */}
              <div className="relative z-10 w-full h-full p-4 md:p-8 flex items-center gap-4">
                
                {/* ЛЕВАЯ ЧАСТЬ (УТКА): Фиксируем ширину (например, 40% или w-32) */}
                <div className="w-[40%] flex-shrink-0 flex justify-center">
                  <img 
                    src="/assets/why-telegram/duck-growth.png" 
                    alt="Duck" 
                    className="w-full max-w-[140px] h-auto object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* ПРАВАЯ ЧАСТЬ (ТЕКСТ): min-w-0 критически важен, чтобы текст не вылезал вправо */}
                <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                  <h3 className="text-sm sm:text-base md:text-xl font-black text-foreground mb-2 leading-tight break-words">
                    Стремительный рост
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-3 leading-snug break-words">
                    Telegram — самая быстрорастущая платформа с 900M+ активных пользователей
                  </p>
                  <div className="mt-1">
                     <span className="block text-lg md:text-2xl font-black text-[#0088CC] leading-none mb-1">+150M</span>
                     <span className="text-[10px] md:text-xs text-gray-400 font-medium leading-none block break-words">новых пользователей в год</span>
                  </div>
                </div>

              </div>
          </div>

          {/* === КАРТОЧКА 2 === */}
          <div className="relative w-full h-full">
              <div className="absolute inset-0 z-0 h-full w-full">
                 <img src="/assets/why-telegram/card-bg.svg" alt="bg" className="w-full h-full object-fill rounded-[30px]"/>
              </div>
              <div className="relative z-10 w-full h-full p-4 md:p-8 flex items-center gap-4">
                <div className="w-[40%] flex-shrink-0 flex justify-center">
                  <img src="/assets/why-telegram/duck-laptop.png" alt="Duck" className="w-full max-w-[140px] h-auto object-contain hover:scale-105 transition-transform duration-300"/>
                </div>
                <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                  <h3 className="text-sm sm:text-base md:text-xl font-black text-foreground mb-2 leading-tight break-words">
                    Высокая вовлечённость
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-3 leading-snug break-words">
                    70% открываемость постов против 5% в Instagram и Facebook
                  </p>
                  <div className="mt-1">
                     <span className="block text-lg md:text-2xl font-black text-[#0088CC] leading-none mb-1">70%</span>
                     <span className="text-[10px] md:text-xs text-gray-400 font-medium leading-none block break-words">открываемость контента</span>
                  </div>
                </div>
              </div>
          </div>

          {/* === КАРТОЧКА 3 === */}
          <div className="relative w-full h-full">
              <div className="absolute inset-0 z-0 h-full w-full">
                 <img src="/assets/why-telegram/card-bg.svg" alt="bg" className="w-full h-full object-fill rounded-[30px]"/>
              </div>
              <div className="relative z-10 w-full h-full p-4 md:p-8 flex items-center gap-4">
                <div className="w-[40%] flex-shrink-0 flex justify-center">
                  <img src="/assets/why-telegram/duck-money.png" alt="Duck" className="w-full max-w-[140px] h-auto object-contain hover:scale-105 transition-transform duration-300"/>
                </div>
                <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                  <h3 className="text-sm sm:text-base md:text-xl font-black text-foreground mb-2 leading-tight break-words">
                    Прямая монетизация
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-3 leading-snug break-words">
                    Продажи, подписки, донаты — всё интегрировано в платформу
                  </p>
                  <div className="mt-1">
                     <span className="block text-lg md:text-2xl font-black text-[#0088CC] leading-none mb-1">0%</span>
                     <span className="text-[10px] md:text-xs text-gray-400 font-medium leading-none block break-words">комиссия за продажи</span>
                  </div>
                </div>
              </div>
          </div>

          {/* === КАРТОЧКА 4 === */}
          <div className="relative w-full h-full">
              <div className="absolute inset-0 z-0 h-full w-full">
                 <img src="/assets/why-telegram/card-bg.svg" alt="bg" className="w-full h-full object-fill rounded-[30px]"/>
              </div>
              <div className="relative z-10 w-full h-full p-4 md:p-8 flex items-center gap-4">
                <div className="w-[40%] flex-shrink-0 flex justify-center">
                  <img src="/assets/why-telegram/duck-easy.png" alt="Duck" className="w-full max-w-[140px] h-auto object-contain hover:scale-105 transition-transform duration-300"/>
                </div>
                <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                  <h3 className="text-sm sm:text-base md:text-xl font-black text-foreground mb-2 leading-tight break-words">
                    Нулевые барьеры
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-3 leading-snug break-words">
                    Запустить канал можно за 15 минут, без сложной настройки
                  </p>
                  <div className="mt-1">
                     <span className="block text-lg md:text-2xl font-black text-[#0088CC] leading-none mb-1">15 мин</span>
                     <span className="text-[10px] md:text-xs text-gray-400 font-medium leading-none block break-words">от идеи до запуска</span>
                  </div>
                </div>
              </div>
          </div>

        </div>

        {/* --- 4. НИЖНИЕ ЦИФРЫ --- */}
        <div className="mt-20 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-5xl md:text-[60px] font-bold text-[#0088CC] leading-none">78%</div>
                <div className="text-sm md:text-lg font-medium text-foreground leading-snug">
                  экспертов считают<br/>Telegram основным<br/>каналом продаж
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-5xl md:text-[60px] font-bold text-[#0088CC] leading-none">2.5x</div>
                <div className="text-sm md:text-lg font-medium text-foreground leading-snug">
                  выше конверсия в<br/>покупку чем в других<br/>соц. сетях
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-5xl md:text-[60px] font-bold text-[#0088CC] leading-none">70%</div>
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
