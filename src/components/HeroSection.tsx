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
      
      {/* --- КОНТЕЙНЕР С КОНТЕНТОМ (Grid) --- */}
      <div className="container mx-auto px-4 pt-32 pb-48 md:pt-64 md:pb-64 max-w-screen-xl relative z-30">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* ТЕКСТ (Левая колонка) */}
          <div className="flex flex-col text-center lg:text-left order-1 relative z-20 lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl md:text-[50px] lg:text-[60px] font-extrabold tracking-tight leading-[1.3] text-foreground">
              Превратите <span className="text-primary">Telegram</span>
              <br className="hidden sm:block" /> в 
              
              <span className="relative inline-block mx-2 my-5 transform rotate-[-2deg] align-middle">
                <span className="absolute inset-0 bg-primary rounded-full shadow-lg w-full h-full skew-x-[-5deg]"></span>
                <span className="relative z-10 text-white px-4 py-2 block text-2xl sm:text-4xl md:text-[50px] lg:text-[60px] leading-none whitespace-nowrap">
                  мощный <span className="pl-2">инструмент</span>
                </span>
                {/* Молния (Настройка для 3 экранов) */}
                <img 
                    src="/assets/hero/Blitz.png" 
                    alt="Lightning"
                    className="absolute z-20 drop-shadow-lg
                    
                    /* 1. МОБИЛКА (Базовые стили) */
                    /* top: двигает вверх/вниз, left: влево/вправо */
                    top-0 left-[36%] w-12 h-12
                    
                    /* 2. ПЛАНШЕТ (md) */
                    md:top-0 md:left-[38%] md:w-16 md:h-16
                    
                    /* 3. ДЕСКТОП (lg) */
                    lg:-top-4 lg:left-[36%] lg:w-24 lg:h-24 animate-pulse"
                />
              </span>
              <br />
              <span className="block mt-4 sm:inline sm:mt-2">роста вашего бизнеса</span>
            </h1>
            
            <p className="mt-6 md:mt-8 text-base sm:text-lg md:text-[20px] font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Пошаговая программа, благодаря которой ты создашь, настроишь и монетизируешь свой Telegram-канал — без технических сложностей
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto text-base md:text-lg h-14 md:h-16 px-8 md:px-10 rounded-full shadow-xl shadow-primary/30" onClick={scrollToPricing}>
                Начать обучение
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg h-14 md:h-16 px-8 md:px-10 rounded-full border-2" onClick={scrollToProgram}>
                Посмотреть программу
              </Button>
            </div>
          </div>

          {/* ТЕЛЕФОНЫ (Правая колонка) */}
          <div className="relative order-2 flex justify-center lg:justify-end lg:col-span-1 mt-8 lg:mt-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full opacity-90 z-0 blur-sm"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }} />
            <img src="/assets/hero/phones-mockup.png" alt="App Interface Mockup" 
                className="relative z-10 w-[240px] sm:w-[320px] md:w-[400px] h-auto object-contain transform rotate-[-3deg] lg:-translate-y-10 hover:scale-105 transition-transform duration-500 ease-out" />
          </div>
        </div>
      </div>

      {/* ===================================================================================== */}
      {/* SCENE WRAPPER (КОНТЕЙНЕР-СЦЕНА) */}
      {/* Все элементы декора живут внутри этого блока. Блок позиционируется так же, как раньше Волна */}
      {/* ===================================================================================== */}
      <div className={`absolute left-1/2 -translate-x-1/2 z-0 pointer-events-none
          /* 1. Настройки самой коробки (совпадают с твоими настройками волны) */
          w-[100%] -bottom-[30px]
          md:w-full md:-bottom-[130px]
          lg:w-full lg:-bottom-[440px]
      `}>
          
          {/* 1. ФОН: Сама Волна */}
          {/* relative нужен, чтобы дети позиционировались от неё */}
          <div className="relative w-full h-full">
            <img 
              src="/assets/hero/wave-full.png" 
              alt="Background Wave" 
              className="w-full h-auto object-cover md:object-contain translate-y-[10%] md:translate-y-0"
            />

            {/* --- ДЕТИ (Элементы внутри волны) --- */}
            {/* Теперь мы используем % (bottom: 40%, left: 10%), чтобы они приклеились к месту */}
            
            {/* УТКА САНТА */}
            <img 
              src="/assets/hero/duck-santa.png" 
              alt="Duck Santa" 
              className="absolute z-20 object-contain
                /* Позиция в % от ширины/высоты волны */
                right-[5%] bottom-[35%] w-[20%]
                md:right-[5%] md:bottom-[40%] md:w-[22%]
                lg:right-[10] lg:bottom-[40%] lg:w-[20%]" 
            />

            {/* 1. Самолетик (Plane) */}
            <img 
              src="/assets/hero/icon-plane.png" 
              alt="Plane" 
              className="absolute z-20 rotate-[4deg] hover:scale-110 transition-transform duration-500
                left-[10%] bottom-[35%] w-[12%]
                md:left-[10%] md:bottom-[42%] md:w-[15%]
                lg:left-[10%] lg:bottom-[40%] lg:w-[15%]"
            />

            {/* 2. Подарок (Gift) */}
            <img 
              src="/assets/hero/icon-gift.png" 
              alt="Gift" 
              className="absolute z-10 -rotate-[10deg] hover:scale-105 transition-transform duration-500
                left-[40%] bottom-[40%] w-[12%]
                md:left-[45%] md:bottom-[52%] md:w-[12%]
                lg:left-[43%] lg:bottom-[51%] lg:w-[11%]"
            />

            {/* 3. Звезда (Star) */}
            <img 
              src="/assets/hero/icon-star.png" 
              alt="Star" 
              className="absolute z-20 rotate-[15deg] hover:rotate-[20deg] transition-transform duration-500
                left-[27%] bottom-[17%] w-[11%]
                md:left-[30%] md:bottom-[30%] md:w-[11%]
                lg:left-[30%] lg:bottom-[29%] lg:w-[10%]"
            />

            {/* 4. Молния (Lightning) */}
            <img 
              src="/assets/hero/icon-lightning.png" 
              alt="Lightning" 
              className="absolute z-20 -rotate-[15deg] hover:scale-110 transition-transform duration-500
                left-[55%] bottom-[27%] w-[11%]
                md:left-[58%] md:bottom-[37%] md:w-[11%]
                lg:left-[58%] lg:bottom-[38%] lg:w-[10%]"
            />

          </div>
      </div>      

    </section>
  );
};

export default HeroSection;