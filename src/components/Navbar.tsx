import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Menu, X, LogIn } from "lucide-react"; // Иконки
import { AuthModal } from "@/components/auth/AuthModal"; // Импорт нашей новой модалки

const Navbar = () => {
  // --- ТВОИ СУЩЕСТВУЮЩИЕ СОСТОЯНИЯ ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // --- НОВЫЕ СОСТОЯНИЯ ДЛЯ МЕНЮ И МОДАЛОК ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Функция открытия модалки (Вход или Регистрация)
  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthOpen(true);
    setIsMobileMenuOpen(false); // Закрываем мобильное меню при клике
  };

  // Логика скрытия/показа при скролле (ТВОЙ КОД)
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 650) {
        setIsVisible(false);
        setIsMobileMenuOpen(false); // Скрываем мобильное меню при скролле вниз
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 max-w-screen-xl h-24 md:h-28 flex items-center justify-between relative">
          
          {/* 1. ЛОГОТИП (ТВОЙ КОД) */}
          <div 
            className="flex-shrink-0 cursor-pointer z-20" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src="/images/logo.svg" 
              alt="Сила в деле" 
              className="h-16 md:h-20 w-auto object-contain" // Чуть уменьшил высоту для баланса с кнопками
            />
          </div>

          {/* 2. МЕНЮ ПО ЦЕНТРУ (ТВОЙ КОД) */}
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
            <a 
              href="#about" // Добавил пункт "О нас", если нужен
              className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
            >
              О нас
            </a>
          </div>

          {/* 3. КНОПКИ СПРАВА (НОВОЕ) */}
          <div className="hidden md:flex items-center gap-4 z-20">
            {/* Кнопка Вход (Простая текстовая/Ghost) */}
            <Button 
              variant="ghost" 
              onClick={() => openAuth("login")}
              className="text-gray-700 hover:text-primary text-base font-medium"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Вход
            </Button>

            {/* Кнопка Регистрация (Яркая) */}
            <Button 
              onClick={() => openAuth("register")}
              className="rounded-xl px-6 py-5 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <User className="w-4 h-4 mr-2" />
              Регистрация
            </Button>
          </div>

          {/* 4. МОБИЛЬНОЕ МЕНЮ (БУРГЕР) */}
          <div className="md:hidden z-20">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>

        {/* 5. ВЫПАДАЮЩЕЕ МЕНЮ ДЛЯ МОБИЛЬНЫХ */}
        <div 
          className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl flex flex-col transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 flex flex-col gap-4">
            <a href="#program" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 py-2">Программа</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-700 py-2">Тарифы</a>
            
            <hr className="border-gray-100" />
            
            <Button variant="outline" className="w-full justify-start" onClick={() => openAuth("login")}>
              <LogIn className="w-4 h-4 mr-2" /> Вход в кабинет
            </Button>
            <Button className="w-full justify-start" onClick={() => openAuth("register")}>
              <User className="w-4 h-4 mr-2" /> Регистрация
            </Button>
          </div>
        </div>
      </nav>

      {/* --- ПОДКЛЮЧАЕМ МОДАЛКУ --- */}
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        initialMode={authMode} 
      />
    </>
  );
};

export default Navbar;