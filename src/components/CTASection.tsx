import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProgram = () => {
    document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-accent p-1 rounded-3xl">
            <div className="bg-background rounded-3xl p-8 md:p-16 text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                <Sparkles className="w-4 h-4" />
                Специальное предложение
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Начни свой путь к{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Telegram-монетизации
                </span>{" "}
                уже сегодня
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Присоединяйся к 2,500+ успешным ученикам, которые уже зарабатывают на своём контенте в Telegram
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-primary hover:bg-primary-hover"
                  onClick={scrollToPricing}
                >
                  Выбрать тариф
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-muted/50 transition-all duration-300"
                  onClick={scrollToProgram}
                >
                  Посмотреть программу курса
                </Button>
              </div>

              <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">14 дней</div>
                  <div className="text-sm text-muted-foreground">гарантия возврата денег</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">доступ к материалам</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">∞</div>
                  <div className="text-sm text-muted-foreground">бесплатные обновления</div>
                </div>
              </div>

              <div className="pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  🎁 <strong>Бонус при покупке сегодня:</strong> Дополнительный модуль «Секреты вирусного контента» стоимостью 4,999₽ в подарок
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground space-y-2">
            <p>Остались вопросы? Свяжитесь с нами:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:silavdele@mail.ru" className="text-primary hover:underline">
                silavdele@mail.ru
              </a>
              <span>•</span>
              <a href="https://t.me/Sergei_Silantev" className="text-primary hover:underline">
                @support в Telegram
              </a>
              <span>•</span>
              <a href="tel:+79140769556" className="text-primary hover:underline">
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
