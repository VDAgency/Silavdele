import React from "react";

const TechSection = () => {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-screen-xl">
        
        {/* ЗАГОЛОВОК СЕКЦИИ */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-[56px] leading-tight font-black text-foreground mb-6">
            Технологии <span className="text-[#0088CC]">будущего</span> уже здесь
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Мы используем самые современные инструменты для автоматизации и масштабирования вашего присутствия в Telegram и других платформах
          </p>
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* ЛЕВАЯ КОЛОНКА: Блоки с описанием */}
          <div className="space-y-8">
            
            {/* Блок 1: Нейросети */}
            <div className="border-2 border-[#0088CC] rounded-[40px] p-8 md:p-10 relative bg-white hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4">Нейросети</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                Научитесь использовать ChatGPT, Midjourney и другие AI-инструменты для создания уникального контента за минуты.
              </p>
              
              {/* Список фич */}
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <img src="/assets/tech/icon-lamp.png" alt="icon" className="w-6 h-6 object-contain" />
                  <span className="text-sm md:text-base font-bold text-foreground">Генерация текстов и идей</span>
                </li>
                <li className="flex items-center gap-4">
                  <img src="/assets/tech/icon-magic.png" alt="icon" className="w-6 h-6 object-contain" />
                  <span className="text-sm md:text-base font-bold text-foreground">Создание визуального контента</span>
                </li>
                <li className="flex items-center gap-4">
                  <img src="/assets/tech/icon-robot.png" alt="icon" className="w-6 h-6 object-contain" />
                  <span className="text-sm md:text-base font-bold text-foreground">Автоматизация рутинных задач</span>
                </li>
              </ul>
            </div>

            {/* Блок 2: Кросспостинг */}
            <div className="border-2 border-[#0088CC] rounded-[40px] p-8 md:p-10 relative bg-white hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4">Кросспостинг</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                Публикуйте контент одновременно на всех платформах и достигайте максимального охвата аудитории с минимальными усилиями.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <img src="/assets/tech/icon-sync.png" alt="icon" className="w-6 h-6 object-contain" />
                  <span className="text-sm md:text-base font-bold text-foreground">Синхронизация платформ</span>
                </li>
                <li className="flex items-center gap-4">
                  <img src="/assets/tech/icon-chart.png" alt="icon" className="w-6 h-6 object-contain" />
                  <span className="text-sm md:text-base font-bold text-foreground">Увеличение охвата в 3-5 раз</span>
                </li>
                <li className="flex items-center gap-4">
                  <img src="/assets/tech/icon-check.png" alt="icon" className="w-6 h-6 object-contain" />
                  <span className="text-sm md:text-base font-bold text-foreground">Адаптация под каждую площадку</span>
                </li>
              </ul>
            </div>

          </div>

          {/* ПРАВАЯ КОЛОНКА: Иллюстрация */}
          <div className="flex justify-center lg:justify-end relative">
             {/* Декор (можно добавить круги или свечение сзади, если нужно) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#0088CC]/5 rounded-full blur-3xl -z-10"></div>
             
             <img 
               src="/assets/tech/duck-tech-main.png" 
               alt="Tech Duck" 
               className="w-full max-w-[500px] h-auto object-contain transform hover:scale-105 transition-transform duration-500"
             />
          </div>

        </div>

        {/* НИЖНИЙ БЛОК (Комплексный подход) */}
        <div className="mt-20 text-center max-w-4xl mx-auto">
           <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4">
             Комплексный подход = максимальный результат
           </h3>
           <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
             Объединяя силу нейросетей и кросспостинга, вы получаете конкурентное преимущество: быстрое создание качественного контента и его распространение на все ключевые платформы. Это и есть формула успеха в современном digital-маркетинге.
           </p>
        </div>

      </div>
    </section>
  );
};

export default TechSection;
