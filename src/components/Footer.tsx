import { Link } from "react-router-dom";

const Footer = () => {
  return (
    // mt-32 или больше: Отступ от предыдущей секции, чтобы волна не наехала на контент
    <footer className="relative w-full bg-white pt-10 pb-10 mt-16 md:mt-40 lg:mt-[480px] overflow-visible">
      
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        
        {/* Родитель для позиционирования (relative) */}
        <div className="relative w-full">
            
            {/* 1. СИНЯЯ ВОЛНА (Фон сцены) */}
            <img 
               src="/assets/footer/footer-wave.png" 
               alt="Wave" 
               className="w-full h-auto object-cover"
            />

            {/* 2. ЕЛКА (Лежит на волне) */}
            <img 
              src="/assets/footer/tree-gifts.png" 
              alt="Christmas Tree" 
              className="absolute z-20 hover:scale-105 transition-transform duration-500
                /* Координаты в % от размера ВОЛНЫ */
                left-[2%] bottom-[25%] w-[25%]
                md:left-[5%] md:bottom-[28%] md:w-[20%]
                lg:left-[8%] lg:bottom-[30%] lg:w-[18%] max-w-[400px]"
            />

            {/* 3. УТКА (Лежит на волне справа) */}
            <img 
              src="/assets/footer/duck-walking.png" 
              alt="Duck Walking" 
              className="absolute z-20 hover:scale-105 transition-transform duration-500
                /* Координаты в % */
                right-[0%] bottom-[20%] w-[25%]
                md:right-[2%] md:bottom-[25%] md:w-[18%]
                lg:right-[8%] lg:bottom-[35%] lg:w-[15%] max-w-[300px]"
            />
        </div>
      </div>

      {/* ===================================================================================== */}
      {/* КОНТЕНТ ФУТЕРА (Текст) */}
      {/* ===================================================================================== */}
      <div className="container mx-auto px-4 max-w-7xl relative z-20">
        <div className="flex flex-col md:flex-row gap-10 text-sm text-gray-600">

          {/* Левый столбик: Копирайт и ссылки */}
          <div className="flex flex-col space-y-3 md:w-1/3 text-center md:text-left">
            <p className="font-bold text-black text-base">
              © {new Date().getFullYear()} Silavdele. Все права защищены.
            </p>
            <div className="flex flex-col gap-2">
                <Link to="/privacy" className="hover:text-[#0088CC] transition-colors w-fit mx-auto md:mx-0">
                Политика конфиденциальности
                </Link>
                <Link to="/offer" className="hover:text-[#0088CC] transition-colors w-fit mx-auto md:mx-0">
                Публичная оферта
                </Link>
            </div>
          </div>

          {/* Центральный столбик: Реквизиты */}
          <div className="flex flex-col space-y-3 md:w-1/3 text-center md:text-left">
            <p className="font-bold text-black text-base">
              ИП Силантьев Сергей Александрович
            </p>
            <p>
              ИНН: 250816422607
            </p>
            <p>
              Email: <a href="mailto:silavdele@mail.ru" className="text-[#0088CC] hover:underline font-medium">silavdele@mail.ru</a>
            </p>
          </div>

          {/* Правый столбик (Логотип или пустота) */}
          <div className="hidden md:flex md:w-1/3 justify-end items-center opacity-50">
             <img src="/images/logo.svg" alt="Logo" className="h-12 grayscale hover:grayscale-0 transition-all duration-300" />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
