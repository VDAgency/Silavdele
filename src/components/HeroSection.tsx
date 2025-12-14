import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProgram = () => {
    document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // 1. ИЗМЕНЕНИЕ: Увеличил pt-10 md:pt-20 -> pt-28 md:pt-40 (Больше отступа сверху)
    <section className="relative bg-white overflow-visible pt-28 md:pt-40 pb-80">
      
      {/* --- ДЕКОР: ПЛАВАЮЩИЕ ИКОНКИ (Оставляем как было, можно подвигать позже) --- */}
      {/* 1. Самолетик (Слева, должен быть ВЫСОКО на синем фоне) */}
      {/* bottom-[100px] поднимет его над краем секции */}
      <img 
        src="/assets/hero/icon-plane.png" 
        alt="Telegram Plane" 
        className="absolute left-[10%] bottom-[30px] md:bottom-[100px] z-20 w-24 md:w-36 -rotate-2 hover:scale-110 transition-transform duration-500"
      />

      {/* 2. Звезда (На спуске, почти на границе) */}
      {/* bottom-[0px] ставит его ровно на край секции */}
      <img 
        src="/assets/hero/icon-star.png" 
        alt="Star Box" 
        className="absolute left-[22%] -bottom-[40px] md:bottom-[0px] z-20 w-20 md:w-32 -rotate-12 hover:rotate-0 transition-transform"
      />

      {/* 3. Подарок (В самой яме, чуть-чуть свисает) */}
      {/* -bottom-[50px] чуть опускает вниз, но не закрывает текст */}
      <img 
        src="/assets/hero/icon-gift.png" 
        alt="Gift" 
        className="absolute left-[40%] bottom-[80px] md:bottom-[150px] z-20 w-20 md:w-32 rotate-12 hover:scale-110 transition-transform"
      />

      {/* 4. Молния (На подъеме справа) */}
      {/* bottom-[10px] поднимаем чуть выше края */}
      <img 
        src="/assets/hero/icon-lightning.png" 
        alt="Lightning Box" 
        className="absolute left-[58%] -bottom-[30px] md:bottom-[10px] z-20 w-20 md:w-32 rotate-6"
      />

      {/* 5. Утка Санта (Справа, большая) */}
      {/* -bottom-[180px] - она большая, пусть сидит глубоко, но не перекрывает весь низ */}
      <img 
        src="/assets/hero/duck-santa.png" 
        alt="Duck Santa" 
        className="absolute right-[-40px] md:right-[-20px] -bottom-[120px] md:-bottom-[180px] z-30 w-56 md:w-[500px] object-contain pointer-events-none"
      />

      {/* --- ОСНОВНОЙ КОНТЕНТ --- */}
      <div className="container mx-auto px-4 max-w-screen-xl relative z-10">
        
        {/* 2. ИЗМЕНЕНИЕ: grid-cols-2 -> grid-cols-5. Делим экран на 5 частей. */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          
          {/* ЛЕВАЯ КОЛОНКА: Занимает 3 части из 5 (60% ширины) */}
          <div className="text-left space-y-8 order-2 lg:order-1 relative z-20 lg:col-span-3">
            
            {/* 3. ИЗМЕНЕНИЕ: Типографика под Фигму */}
            {/* ЗАГОЛОВОК */}
            <h1 className="text-4xl md:text-[50px] lg:text-[60px] font-extrabold tracking-tight leading-[1.1] text-black">
              Превратите <span className="text-[#0088cc]">Telegram</span>
              <br />
              в 
              {/* БЛОК С ПЛАШКОЙ */}
              {/* 1. inline-block: чтобы он вел себя как слово в строке */}
              {/* 2. rotate-[-1.84deg]: точный наклон из Фигмы */}
              {/* 3. align-middle: чтобы выровнять относительно предлога "в" */}
              <span className="relative inline-block mx-2 transform rotate-[-1.84deg] align-middle mt-2 md:mt-4">
                
                {/* СИНИЙ ФОН (ПЛАШКА) */}
                {/* rounded-full: делает полные закругления по бокам */}
                <span className="absolute inset-0 bg-[#0088cc] rounded-full shadow-lg w-full h-full"></span>
                
                {/* ТЕКСТ */}
                {/* px-6: отступы по бокам, чтобы текст не прилипал к закруглениям */}
                {/* py-1: небольшой вертикальный отступ */}
                <span className="relative z-10 text-white px-6 py-1 block">
                  мощный
                  <span className="pl-5">инструмент</span>
                </span>
                
                {/* МОЛНИЯ */}
                {/* Подкорректировал позицию (left-[38%]), чтобы она била в слово "мощный" */}
                <img 
                    src="/assets/hero/Blitz.png" 
                    alt="Lightning"
                    className="absolute -top-1 left-[36%] w-10 h-10 md:w-24 md:h-24 z-20"
                />
              </span>
              <br />
              роста вашего бизнеса
            </h1>
            
            <p className="mt-8 text-[20px] font-light leading-[35px] text-black max-w-[704px]">
              Пошаговая программа, благодаря которой ты создашь, настроишь и монетизируешь свой Telegram-канал — без технических сложностей
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 rounded-full shadow-xl bg-[#0088cc] hover:bg-[#0077b5] font-bold text-white"
                onClick={scrollToPricing}
              >
                Начать обучение
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-7 rounded-full border-2 border-gray-900 text-gray-900 font-bold bg-transparent hover:bg-gray-100"
                onClick={scrollToProgram}
              >
                Посмотреть программу
              </Button>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Занимает 2 части из 5 (40% ширины) */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end lg:col-span-2">
            {/* КРУГ ПОД ТЕЛЕФОНАМИ */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[361px] h-[361px] rounded-full bg-gradient-to-br from-[#0292DA] to-[#68CDFF] z-0"
              style={{
                background: 'linear-gradient(135deg, #0292DA 0%, #68CDFF 100%)'
              }}
            />
            <img 
                src="/assets/hero/phones-mockup.png" 
                alt="App Interface Mockup" 
                className="relative z-10 w-[280px] h-[365px] md:w-[396.83px] md:h-[524.43px] object-contain transform rotate-[-3.76deg] lg:-translate-x-[50px] lg:-translate-y-[30px] origin-center"
            />
          </div>

        </div>
      </div>
      
      {/* --- ФОН: ВОЛНА --- */}
      <div className="absolute -bottom-[360px] left-0 w-full z-0 pointer-events-none">
          <img 
            src="/assets/hero/wave-full.png" 
            alt="Background Wave" 
            className="w-full h-auto object-cover min-h-[150px]"
          />
      </div>

    </section>
  );
};

export default HeroSection;