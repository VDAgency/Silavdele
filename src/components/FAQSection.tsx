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
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Часто задаваемые{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              вопросы
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Ответы на главные вопросы о курсе
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-2xl px-6 hover:border-primary/50 transition-colors duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-lg py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center space-y-4">
            <p className="text-muted-foreground">
              Остались вопросы? Напишите нам в поддержку
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="mailto:support@telegram-course.ru" className="text-primary hover:underline">
                support@telegram-course.ru
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="https://t.me/support" className="text-primary hover:underline">
                @support в Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
