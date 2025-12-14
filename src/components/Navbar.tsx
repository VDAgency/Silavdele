import { useState, useEffect } from "react";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Логика скрытия/показа при скролле
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 650) {
        // Если скроллим ВНИЗ и прокрутили больше 50px -> Скрываем
        setIsVisible(false);
      } else {
        // Если скроллим ВВЕРХ -> Показываем
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    // Убираем слушатель при закрытии компонента (хорошая практика)
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 bg-white/70 backdrop-blur-md shadow-sm ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 max-w-screen-xl h-36 flex items-center justify-between">
        
        {/* ЛОГОТИП */}
        <div className="flex-shrink-0 cursor-pointer ml-2 md:ml-4" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {/* Укажи верное расширение: .svg или .png */}
          <img 
            src="/images/logo.svg" 
            alt="Сила в деле" 
            className="h-32 w-auto object-contain" // h-12 регулирует высоту, w-auto сохраняет пропорции
          />
        </div>

        {/* МЕНЮ (Пункты) */}
        <div className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
          <a 
            href="#program" 
            className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Программа
          </a>
          <a 
            href="#pricing" 
            className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Тарифы
          </a>
        </div>

        {/* МОБИЛЬНОЕ МЕНЮ (Пока просто кнопка, можно доработать позже) */}
        <div className="md:hidden">
           {/* Тут можно будет добавить иконку "бургер" для мобилок */}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
