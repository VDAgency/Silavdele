import React from "react";
import { Check } from "lucide-react";

const BonusSection = () => {
  const bonuses = [
    "25+ готовых шаблонов контента для быстрого старта",
    "Доступ к закрытому комьюнити экспертов",
    "Еженедельные разборы лучших практик",
    "Пожизненные обновления всех материалов",
  ];

  return (
    <section className="py-12 md:py-20 bg-white overflow-visible">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* --- СИНИЙ КОНТЕЙНЕР --- */}
        <div className="relative bg-gradient-to-r from-[#0292DA] to-[#68CDFF] rounded-[30px] md:rounded-[40px] p-6 md:p-12 shadow-xl overflow-visible">
          
          {/* Декор: Звездочки на фоне (CSS-ом или SVG) */}
          <div className="absolute top-4 right-1/3 text-white/40 text-2xl animate-pulse">✦</div>
          <div className="absolute bottom-10 left-10 text-white/30 text-4xl">✦</div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* ЛЕВАЯ ЧАСТЬ: ТЕКСТ (Занимает 7-8 колонок) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Заголовок */}
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                Бонусы к курсу “Продвинутый”
              </h2>

              {/* Список бонусов */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                {bonuses.map((bonus, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" strokeWidth={3} />
                    <p className="text-sm md:text-base font-medium text-white/90 leading-snug">
                      {bonus}
                    </p>
                  </div>
                ))}
              </div>

              {/* Белая плашка */}
              <div className="inline-flex items-center bg-white rounded-full py-3 px-6 md:px-8 shadow-lg max-w-full">
                <span className="text-3xl md:text-5xl font-black text-foreground mr-3 md:mr-4">
                  50+
                </span>
                <span className="text-sm md:text-lg font-bold text-foreground leading-tight">
                  видеоуроков в программе
                </span>
              </div>

            </div>

            {/* ПРАВАЯ ЧАСТЬ: УТКА (Занимает 4 колонки) */}
            {/* На десктопе absolute, чтобы вылезать за рамки */}
            <div className="lg:col-span-4 relative h-full min-h-[200px] lg:min-h-[auto]">
               <img 
                 src="/assets/bonus/duck-gift.png" 
                 alt="Duck Gift" 
                 className="
                    /* Мобилка: просто внизу по центру */
                    w-[200px] mx-auto mt-4
                    /* Десктоп: Абсолютно справа и снизу, вылезая за границы */
                    lg:absolute lg:right-[-60px] lg:bottom-[-60px] 
                    lg:w-[380px] lg:max-w-none lg:mx-0
                    object-contain drop-shadow-2xl
                    transform hover:scale-105 transition-transform duration-500
                 "
               />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default BonusSection;
