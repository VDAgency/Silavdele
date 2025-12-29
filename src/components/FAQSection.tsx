import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Для кого подходит этот курс?",
      answer: "Курс подходит для экспертов, блогеров, коучей, предпринимателей и всех, кто хочет создать канал в Telegram и зарабатывать на своём контенте. Не требуется опыт работы с Telegram — мы научим всему с нуля."
    },
    {
      question: "Сколько времени займёт обучение?",
      answer: "Программа рассчитана на 6-8 недель при темпе 5-7 часов в неделю. Но вы можете проходить курс в удобном для вас темпе — доступ к материалам остаётся навсегда."
    },
    {
      question: "Какой формат обучения?",
      answer: "Видеоуроки + практические задания + готовые шаблоны. Вы смотрите урок, применяете знания на практике и получаете обратную связь в чате поддержки. Всё материалы доступны 24/7."
    },
    {
      question: "Нужны ли технические навыки?",
      answer: "Нет, технические навыки не нужны. Мы объясняем всё простым языком и показываем каждый шаг. Если вы умеете пользоваться смартфоном — вы справитесь с курсом."
    },
    {
      question: "Когда я увижу первые результаты?",
      answer: "Первые подписчики появятся уже через 1-2 недели после запуска канала. Первые продажи — через 4-6 недель при условии выполнения всех заданий курса. Скорость зависит от вашей ниши и активности."
    },
    {
      question: "Есть ли гарантия возврата денег?",
      answer: "Да, у нас 14-дневная гарантия возврата. Если вы посмотрите первые 10 уроков и поймёте, что курс вам не подходит — мы вернём 100% стоимости без лишних вопросов."
    },
    {
      question: "Чем отличаются тарифы?",
      answer: "Базовый — для самостоятельного изучения. Продвинутый — с расширенными материалами и долгой поддержкой. VIP — с личными консультациями и персональной стратегией роста. Все тарифы дают результат."
    },
    {
      question: "Будут ли обновления курса?",
      answer: "Да, мы постоянно обновляем материалы с учётом изменений в Telegram. Все обновления бесплатны для учеников. Вы получаете пожизненный доступ ко всем новым урокам и материалам."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden" id="faq">
      {/* 1. РАСШИРЯЕМ ОБЩИЙ КОНТЕЙНЕР: max-w-4xl -> max-w-7xl */}
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* --- ЗАГОЛОВОК --- */}
        <div className="text-center mb-16 relative">
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-[50px] leading-[1.2] font-black text-foreground relative z-10">
              Часто задаваемые{" "}
              <span className="text-[#0088CC] pb-1">
                вопросы
              </span>
            </h2>
            
            <img 
              src="/assets/faq/star-left.png" 
              alt="Star"
              className="absolute -left-6 -top-8 w-16 
                         md:-left-48 md:-top-6 md:w-48
                         z-0 animate-pulse"
            />
            
            <img 
              src="/assets/faq/star-right.png" 
              alt="Star"
              className="absolute -right-4 bottom-0 w-12
                         md:-right-28 md:-bottom-14 md:w-28 z-0"
            />
          </div>
          
          <p className="mt-6 text-base md:text-lg text-muted-foreground font-medium">
            Ответы на главные вопросы о курсе
          </p>
        </div>

        {/* --- АККОРДЕОН --- */}
        {/* 2. РАСШИРЯЕМ СПИСОК ВОПРОСОВ: max-w-3xl -> max-w-5xl */}
        <div className="max-w-5xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-gray-100 rounded-[20px] px-6 py-2 shadow-sm hover:shadow-md hover:border-[#0088CC]/30 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-bold text-lg md:text-xl py-5 hover:no-underline text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base md:text-lg text-muted-foreground leading-relaxed pb-6 pr-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 text-center">
            <p className="text-lg font-bold text-foreground mb-4">
              Остались вопросы?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-base font-medium">
              <a href="mailto:support@silavdele.ru" className="text-[#0088CC] hover:text-[#006699] transition-colors">
                support@silavdele.ru
              </a>
              <span className="hidden sm:inline text-gray-300">•</span>
              <a href="https://t.me/silavdele_support" target="_blank" rel="noreferrer" className="text-[#0088CC] hover:text-[#006699] transition-colors">
                @silavdele_support
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
