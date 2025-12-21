import React from "react";
import { Quote } from "lucide-react";

const AboutSection = () => {
  const stats = [
    {
      icon: "/assets/about/icon-stars.png",
      value: "15+",
      label: "лет опыта",
    },
    {
      icon: "/assets/about/icon-student.png",
      value: "100+",
      label: "учеников",
    },
    {
      icon: "/assets/about/icon-growth.png",
      value: "150%",
      label: "средний рост",
    },
    {
      icon: "/assets/about/icon-folder.png",
      value: "50+",
      label: "проектов",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-screen-xl">
        
        {/* --- ВЕРХНЯЯ ЧАСТЬ (ФОТО И ТЕКСТ) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-12 items-start">
          
          {/* ЛЕВАЯ КОЛОНКА: ФОТО */}
          <div className="relative flex justify-center lg:justify-start lg:col-span-1">
            <img 
               src="/assets/about/star-top.png" 
               alt="star" 
               className="absolute -top-8 left-[90%] w-16 md:-top-10 md:left-[85%] md:w-20 z-10 animate-pulse"
            />
            <img 
              src="/assets/about/sergey-photo.png" 
              alt="Сергей Силантьев" 
              className="w-full h-auto object-contain"
            />
          </div>

          {/* ПРАВАЯ КОЛОНКА: ТЕКСТ */}
          <div className="flex flex-col justify-center lg:col-span-2 relative">
            <img 
               src="/assets/about/star-right.png" 
               alt="star" 
               className="absolute -right-8 top-20 md:right-2 md:top-20 w-20 md:w-40 z-0 pointer-events-none"
            />
            {/* Заголовок H2 */}
            <h2 className="font-black text-foreground mb-6 relative z-10">
              {/* ЧАСТЬ 1: Имя (40px) */}
              <span className="text-2xl md:text-[40px] md:leading-[35px]">
                Сергей Силантьев
              </span>
              
              {/* Пробел */}
              <span> </span>

              {/* ЧАСТЬ 2: Описание (30px) */}
              <span className="text-lg md:text-[30px] md:leading-[35px]">
                – эксперт по цифровому маркетингу, интеллект-тренер, коуч и наставник предпринимателей, спикер на профильных площадках.
                <br className="block mt-2" />
                Основатель онлайн-школы <span className="text-[#0088CC]">«Сила в Деле».</span>
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed relative z-10">
              Более 15 лет в digital-маркетинге. Помог сотням предпринимателей выстроить стратегии онлайн-присутствия и масштабировать бизнес через соцсети и мессенджеры. Видит тренды и мгновенно реагирует на изменения с точностью снайпера.
            </p>
            <div className="relative bg-[#0088CC]/10 rounded-2xl p-6 md:p-4 border-l-4 border-[#0088CC] z-10">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-[#0088CC]/20" />
              <p className="text-sm md:text-lg font-medium text-foreground italic relative z-10">
                «Telegram — это не просто мессенджер. Это целая экосистема для бизнеса, где каждый может найти свою аудиторию и построить прибыльный канал коммуникации. Главное — знать, как.»
              </p>
            </div>
          </div>
        </div>

        {/* --- НИЖНИЙ РЯД: СТАТИСТИКА (ИСПРАВЛЕНО) --- */}
        {/* mt-32: Большой отступ сверху, чтобы иконки не наезжали на текст выше */}
        <div className="mt-32">
          {/* overflow-visible: Важно! Чтобы иконки, торчащие сверху, не обрезались */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16 md:gap-8 overflow-visible">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="relative flex flex-col items-center justify-center p-6 pt-12 border-2 border-[#0088CC] rounded-[30px] bg-white text-center hover:shadow-lg transition-shadow duration-300"
              >
                
                {/* --- ИКОНКА НА ГРАНИЦЕ --- */}
                {/* absolute: вырываем из потока */}
                {/* top-0: ставим на верхнюю линию */}
                {/* left-1/2 -translate-x-1/2: центрируем по горизонтали */}
                {/* -translate-y-1/2: поднимаем вверх на 50% высоты (сажаем на линию) */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                   {/* w-16 h-16: Задаем размер иконки (можно менять на w-20 h-20) */}
                   <img src={stat.icon} alt={stat.label} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                </div>

                {/* Цифра */}
                <div className="text-3xl md:text-4xl font-black text-foreground mb-1">
                  {stat.value}
                </div>
                {/* Подпись */}
                <div className="text-sm md:text-base font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
