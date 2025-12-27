// navbar.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Menu, X, LogIn } from "lucide-react"; 
import { AuthModal } from "@/components/auth/AuthModal";

const Navbar = () => {
  // --- СОСТОЯНИЯ ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Логика скрытия/показа при скролле
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* === НОВОГОДНЯЯ ГИРЛЯНДА === */}
        {/* pointer-events-none: чтобы сквозь неё можно было кликать на меню */}
        <div className="absolute top-0 left-0 w-full h-[60px] md:h-[170px] overflow-hidden pointer-events-none z-50">
           <img 
             src="/assets/decoration/garland.png" 
             alt="New Year Garland" 
             className="w-full h-full object-cover object-top md:object-fill"
             // Если на мобилке лампочки слишком мелкие, можно заменить object-cover на:
             // className="h-full w-auto min-w-[150%] max-w-none absolute left-1/2 -translate-x-1/2 top-0"
           />
        </div>

        <div className="container mx-auto px-4 max-w-screen-xl h-20 md:h-52 md:pt-20 flex items-center justify-between relative">
          
          {/* 1. ЛОГОТИП */}
          <div 
            className="flex-shrink-0 cursor-pointer z-20" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src="/images/logo.svg" 
              alt="Сила в деле" 
              className="h-16 md:h-40 w-auto object-contain" 
            />
          </div>

          {/* 2. МЕНЮ ПО ЦЕНТРУ */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <a 
              href="#program" 
              className="text-base font-bold text-foreground hover:text-primary transition-colors"
            >
              Программа
            </a>
            <a 
              href="#pricing" 
              className="text-base font-bold text-foreground hover:text-primary transition-colors"
            >
              Тарифы
            </a>
            <a 
              href="#about" 
              className="text-base font-bold text-foreground hover:text-primary transition-colors"
            >
              О нас
            </a>
          </div>

          {/* 3. КНОПКИ СПРАВА */}
          <div className="hidden md:flex items-center gap-4 z-20">
            {/* Кнопка Вход: Текст + Иконка */}
            <Button 
              variant="ghost" 
              onClick={() => openAuth("login")}
              className="text-foreground hover:text-primary hover:bg-transparent font-bold text-sm"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Вход
            </Button>

            {/* Кнопка Регистрация: Синяя пилюля */}
            <Button 
              onClick={() => openAuth("register")}
              className="px-6 font-bold shadow-lg shadow-primary/20"
            >
              <User className="w-4 h-4 mr-2" />
              Регистрация
            </Button>
          </div>

          {/* 4. БУРГЕР МЕНЮ */}
          <div className="md:hidden z-20">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
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
          <div className="p-6 flex flex-col gap-6 items-center text-center">
            <a href="#program" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-foreground">Программа</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-foreground">Тарифы</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-foreground">О нас</a>
            
            <hr className="w-full border-gray-100" />
            
            <div className="flex flex-col gap-3 w-full">
              <Button variant="ghost" className="w-full justify-center" onClick={() => openAuth("login")}>
                <LogIn className="w-4 h-4 mr-2" /> Вход
              </Button>
              <Button className="w-full justify-center" onClick={() => openAuth("register")}>
                <User className="w-4 h-4 mr-2" /> Регистрация
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        initialMode={authMode} 
      />
    </>
  );
};

export default Navbar;
