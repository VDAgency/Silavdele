import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProgram = () => {
    document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-white w-full overflow-visible">
      
      {/* --- КОНТЕЙНЕР --- */}
      <div className="container mx-auto px-4 pt-32 pb-48 md:pt-44 md:pb-64 max-w-screen-xl relative z-10">
        
        {/* ИЗМЕНЕНИЕ 1: Меняем grid-cols-5 на grid-cols-3. Делим экран на три большие части. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* --- ЛЕВАЯ КОЛОНКА (ТЕКСТ) --- */}
          {/* ИЗМЕНЕНИЕ 2: col-span-3 -> col-span-2. Текст занимает 2/3 экрана (66%) */}
          <div className="flex flex-col text-center lg:text-left order-1 relative z-20 lg:col-span-2">
            
            <h1 className="text-3xl sm:text-4xl md:text-[50px] lg:text-[60px] font-extrabold tracking-tight leading-[1.3] text-foreground">
              Превратите <span className="text-primary">Telegram</span>
              <br className="hidden sm:block" /> в 
              
              {/* ПЛАШКА (СИНИЙ ФОН) */}
              {/* ИЗМЕНЕНИЕ 3: Убрал mt-2, чтобы текст не падал слишком низко. align-middle выровняет его. */}
              <span className="relative inline-block mx-2 my-5 transform rotate-[-2deg] align-middle">
                
                <span className="absolute inset-0 bg-primary rounded-full shadow-lg w-full h-full skew-x-[-5deg]"></span>
                
                {/* Текст внутри плашки */}
                {/* Добавил whitespace-nowrap принудительно, чтобы не ломалось */}
                <span className="relative z-10 text-white px-4 py-2 block text-2xl sm:text-4xl md:text-[50px] lg:text-[60px] leading-none whitespace-nowrap">
                  мощный <span className="hidden sm:inline pl-2">инструмент</span>
                </span>
                 
                {/* Молния */}
                <img 
                    src="/assets/hero/Blitz.png" 
                    alt="Lightning"
                    className="absolute -top-3 left-[37%] w-8 h-8 sm:w-16 sm:h-16 md:w-20 md:h-20 z-20 drop-shadow-lg"
                />
              </span>
              <br />
              <span className="block mt-4 sm:inline sm:mt-2">роста вашего бизнеса</span>
            </h1>
            
            <p className="mt-6 md:mt-8 text-base sm:text-lg md:text-[20px] font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Пошаговая программа, благодаря которой ты создашь, настроишь и монетизируешь свой Telegram-канал — без технических сложностей
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base md:text-lg h-14 md:h-16 px-8 md:px-10 rounded-full shadow-xl shadow-primary/30"
                onClick={scrollToPricing}
              >
                Начать обучение
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-base md:text-lg h-14 md:h-16 px-8 md:px-10 rounded-full border-2"
                onClick={scrollToProgram}
              >
                Посмотреть программу
              </Button>
            </div>
          </div>

          {/* --- ПРАВАЯ КОЛОНКА (ТЕЛЕФОНЫ) --- */}
          {/* ИЗМЕНЕНИЕ 4: col-span-2 -> col-span-1. Телефоны занимают 1/3 экрана (33%) */}
          <div className="relative order-2 flex justify-center lg:justify-end lg:col-span-1 mt-8 lg:mt-0">
            
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full opacity-90 z-0 blur-sm"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)'
              }}
            />
            
            <img 
                src="/assets/hero/phones-mockup.png" 
                alt="App Interface Mockup" 
                className="relative z-10 w-[240px] sm:w-[320px] md:w-[400px] 
                h-auto object-contain transform rotate-[-3deg] lg:-translate-y-10 
                hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>

        </div>
      </div>

{/* --- ВОЛНЫ --- */}
<div className={`absolute left-0 w-full z-0 pointer-events-none
          /* 1. МОБИЛКА: Опускаем немного (-40px) */
          -bottom-[40px]
          
          /* 2. ПЛАНШЕТ (md): Опускаем сильнее (-220px) */
          md:-bottom-[130px]
          
          /* 3. ДЕСКТОП (lg): Твоё значение (-440px) */
          lg:-bottom-[440px]
      `}>
          <img 
            src="/assets/hero/wave-full.png" 
            alt="Background Wave" 
            className="w-[180%] md:w-full h-auto object-cover md:object-contain translate-y-[10%] md:translate-y-0"
          />
      </div>      

{/* --- УТКА САНТА --- */}
      <img 
        src="/assets/hero/duck-santa.png" 
        alt="Duck Santa" 
        className="absolute z-20 object-contain pointer-events-none
        
          /* 1. МОБИЛКА */
          /* Увеличиваем размер (было w-32 -> w-[200px]) */
          /* Опускаем в минус, так как волна у нас -bottom-[40px] */
          right-[20x] bottom-[50px] w-[100px]

          /* 2. ПЛАНШЕТ (md) */
          /* Волна -120px, сажаем утку глубже */
          md:right-[80px] md:bottom-[120px] md:w-[240px]

          /* 3. ДЕСКТОП (lg) */
          /* Волна -440px (очень глубоко). Утку нужно опустить сильно ниже, чтобы она не висела */
          /* Увеличиваем размер до 550px для массивности как в Figma */
          lg:right-[140px] lg:-bottom-[30px] lg:w-[300px]" 
      />

{/* --- ИКОНКИ --- */}
      
      {/* 1. Самолетик (Plane) - Слева */}
      <img 
        src="/assets/hero/icon-plane.png" 
        alt="Plane" 
        className="absolute z-20 
          /* Mobile: Чуть ниже края */
          left-[20px] bottom-[50px] w-20 rotate-[4deg]
          /* Tablet: Опускаем сильнее */
          md:left-[10%] md:bottom-[130px] md:w-32
          /* Desktop: Опускаем глубоко на волну (-bottom-[100px]) */
          lg:left-[8%] lg:-bottom-[50px] lg:w-[197px] lg:rotate-[4.61deg]
          /* Animation */
          hover:scale-110 transition-transform duration-500"
      />

      {/* 2. Подарок (Gift) - По центру, выше остальных */}
      <img 
        src="/assets/hero/icon-gift.png" 
        alt="Gift" 
        className="absolute z-10
          /* Mobile */
          left-[40%] bottom-[70px] w-20 -rotate-[10deg]
          /* Tablet */
          md:left-[35%] md:bottom-[160px] md:w-28 -rotate-[10deg]
          /* Desktop: Чуть ниже границы (-bottom-[30px]), он на гребне волны */
          lg:left-[38%] lg:bottom-[15px] lg:w-[177px] lg:rotate-[-2deg]
          /* Animation */
          hover:scale-105 transition-transform duration-500"
      />

      {/* 3. Звезда (Star) - Самая нижняя, между самолетом и подарком */}
      <img 
        src="/assets/hero/icon-star.png" 
        alt="Star" 
        className="absolute z-20
          /* Mobile */
          left-[25%] bottom-[5px] w-16 rotate-[15deg]
          /* Tablet */
          md:left-[22%] md:bottom-[20px] md:w-24
          /* Desktop: Самая низкая точка (-bottom-[190px]) */
          lg:left-[26%] lg:-bottom-[190px] lg:w-[163px] lg:rotate-[-5deg]
          /* Animation */
          hover:rotate-[20deg] transition-transform duration-500"
      />

      {/* 4. Молния (Lightning) - Справа от подарка */}
      <img 
        src="/assets/hero/icon-lightning.png" 
        alt="Lightning" 
        className="absolute z-20
          /* Mobile */
          left-[55%] bottom-[35px] w-16 -rotate-[15deg]
          /* Tablet */
          md:left-[50%] md:bottom-[90px] md:w-24
          /* Desktop: На уровне самолетика (-bottom-[90px]) */
          lg:left-[53%] lg:-bottom-[90px] lg:w-[149px] lg:rotate-[-22.37deg]
          /* Animation */
          hover:scale-110 transition-transform duration-500"
      />
    </section>
  );
};

export default HeroSection;
