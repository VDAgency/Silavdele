import { Button } from "@/components/ui/button";

const CTASection = () => {
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProgram = () => {
    document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-center space-y-8">
          
          {/* --- УТКА И ПЛАШКА --- */}
          <div className="relative mb-8 flex flex-col items-center">
             {/* Утка */}
             <div className="relative z-10 -mb-6 w-[200px] md:w-[450px]">
                <img 
                  src="/assets/cta/duck-rich.png" 
                  alt="Rich Duck" 
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
                />
             </div>
             
             {/* Плашка "Специальное предложение" */}
             <div className="relative z-20">
                <img 
                  src="/assets/cta/badge-special.png" 
                  alt="Special Offer" 
                  className="h-10 md:h-14 w-auto object-contain"
                />
             </div>
          </div>
          
          {/* --- ЗАГОЛОВОК --- */}
          <div>
            <h2 className="text-3xl md:text-[56px] leading-[1.1] font-black text-foreground mb-4">
              Начни свой путь к <span className="text-[#0088CC] pb-1">Telegram-</span>
              <br className="hidden md:block"/>
              <span className="text-[#0088CC] pb-1">монетизации</span> уже сегодня
            </h2>
            
            <p className="text-base md:text-lg md:pt-4 text-muted-foreground font-medium max-w-full mx-auto leading-relaxed">
              Присоединяйся к успешным ученикам, которые уже зарабатывают на своём контенте в Telegram
            </p>
          </div>

          {/* --- КНОПКИ --- */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-16">
            <Button 
              size="lg"
              className="text-lg px-10 py-7 rounded-full shadow-xl shadow-[#0088CC]/20 bg-[#0088CC] hover:bg-[#0077aa] font-bold"
              onClick={scrollToPricing}
            >
              Начать обучение
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7 rounded-full border-2 border-foreground text-foreground font-bold hover:bg-gray-50"
              onClick={scrollToProgram}
            >
              Посмотреть программу
            </Button>
          </div>

          {/* --- ПРЕИМУЩЕСТВА (14 дней, 24/7, Бесконечность) --- */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto items-center">
            
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-b from-[#0292DA] to-[#68CDFF] bg-clip-text text-transparent">
                14 дней
              </div>
              <div className="text-sm md:text-base font-medium text-muted-foreground">гарантия возврата денег</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-b from-[#0292DA] to-[#68CDFF] bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm md:text-base font-medium text-muted-foreground">доступ к материалам</div>
            </div>
            
            <div className="space-y-1 flex flex-col items-center">
              {/* Иконка бесконечности */}
              <div className="h-10 md:h-12 flex items-center justify-center mb-1">
                 <img src="/assets/cta/icon-infinity.png" alt="Infinity" className="h-full w-auto object-contain" />
              </div>
              <div className="text-sm md:text-base font-medium text-muted-foreground">бесплатные обновления</div>
            </div>

          </div>

          {/* --- СИНЯЯ ПЛАШКА С ПОДАРКОМ --- */}
          <div 
            className="mt-24 bg-gradient-to-b from-[#0292DA] to-[#68CDFF] rounded-[30px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-center gap-6 shadow-xl shadow-[#0088CC]/20 max-w-3xl mx-auto"
            style={{
            borderRadius: '15px 50px 50px 50px'
            }}
          >
             <div className="flex-shrink-0">
                <img src="/assets/cta/gift-box.png" alt="Gift" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md" />
             </div>
             <div className="text-white text-center md:text-left">
                <p className="text-base md:text-lg font-medium leading-snug">
                   <span className="font-bold text-yellow-300">Бонус при покупке сегодня:</span> Дополнительный модуль<br className="hidden md:block"/>
                   «Секреты вирусного контента» стоимостью 4,999₽
                </p>
             </div>
          </div>

          {/* --- ФУТЕР (КОНТАКТЫ) --- */}
          <div className="pt-16 border-t border-gray-100 max-w-4xl mx-auto">
            <p className="text-muted-foreground mb-4">Остались вопросы? Свяжитесь с нами:</p>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-[#0088CC] font-bold">
              <a href="mailto:silavdele@mail.ru" className="hover:underline">
                silavdele@mail.ru
              </a>
              <span className="hidden md:inline text-gray-300">•</span>
              <a href="https://t.me/Sergei_Silantev" target="_blank" rel="noreferrer" className="hover:underline">
                @support в Telegram
              </a>
              <span className="hidden md:inline text-gray-300">•</span>
              <a href="tel:+79140769556" className="hover:underline">
                +7 (914) 076-95-56
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
