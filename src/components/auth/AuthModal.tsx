import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Добавили режим "forgot-password"
type AuthMode = "login" | "register" | "forgot-password";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export const AuthModal = ({ isOpen, onClose, initialMode = "login" }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Данные формы
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  // Сбрасываем режим при открытии
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFormData({ name: "", phone: "", email: "", password: "" });
      setLoading(false);
    }
  }, [isOpen, initialMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- ЛОГИКА ВОССТАНОВЛЕНИЯ ПАРОЛЯ ---
      if (mode === "forgot-password") {
        await axios.post("/api/auth/forgot-password", { email: formData.email });
        alert("Ссылка для сброса пароля отправлена на ваш Email! Проверьте почту.");
        setMode("login"); // Возвращаем на вход
        setLoading(false);
        return;
      }

      // --- ЛОГИКА ВХОДА И РЕГИСТРАЦИИ ---
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      
      let payload: any = {
        email: formData.email,
        password: formData.password
      };

      if (mode === "register") {
        const referrerCode = localStorage.getItem("uds_ref_code");
        payload = {
          ...payload,
          name: formData.name,
          phone: formData.phone,
          referrer_code: referrerCode || null
        };
      }

      const response = await axios.post(url, payload);
      const { token, user } = response.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(user));

      console.log("Успешная авторизация:", user.name);
      onClose();
      navigate("/dashboard");

    } catch (error: any) {
      console.error("Ошибка:", error);
      const message = error.response?.data?.error || "Произошла ошибка. Проверьте данные.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Заголовок модалки
  const getTitle = () => {
    if (mode === "login") return "Вход в кабинет";
    if (mode === "register") return "Регистрация";
    return "Восстановление пароля";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-8 rounded-2xl bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Поля только для регистрации */}
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Иван Иванов"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+7 (999) 000-00-00"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
            </>
          )}

          {/* Email нужен во всех режимах */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@mail.ru"
              required
              value={formData.email}
              onChange={handleChange}
              className="rounded-xl bg-gray-50 border-gray-200"
            />
          </div>

          {/* Пароль нужен только для Входа и Регистрации (не для сброса) */}
          {mode !== "forgot-password" && (
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Пароль</Label>
                {/* Ссылка "Забыли пароль" только при входе */}
                {mode === "login" && (
                  <button 
                    type="button" 
                    onClick={() => setMode("forgot-password")}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Забыли пароль?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="rounded-xl bg-gray-50 border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full py-6 text-base font-semibold rounded-xl mt-6 bg-primary hover:bg-primary-hover"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Войти" : mode === "register" ? "Создать аккаунт" : "Сбросить пароль"}
          </Button>
        </form>

        {/* Переключатель внизу */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Нет аккаунта?{" "}
              <button onClick={() => setMode("register")} className="text-primary font-semibold hover:underline">
                Зарегистрироваться
              </button>
            </>
          ) : mode === "register" ? (
            <>
              Уже есть аккаунт?{" "}
              <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">
                Войти
              </button>
            </>
          ) : (
            // Кнопка "Назад" для режима восстановления
            <button 
              onClick={() => setMode("login")} 
              className="flex items-center justify-center gap-1 mx-auto text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={14} /> Вернуться ко входу
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
