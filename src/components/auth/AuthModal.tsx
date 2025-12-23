import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Добавили для перехода

// Тип для режима окна: вход или регистрация
type AuthMode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode; // С чего начинать (вход или регистрация)
}

export const AuthModal = ({ isOpen, onClose, initialMode = "login" }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Хук для навигации

  // Данные формы
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  // Сбрасываем режим и данные при открытии окна
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFormData({ name: "", phone: "", email: "", password: "" });
      setLoading(false);
    }
  }, [isOpen, initialMode]);

  // Обработчик ввода
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обработчик отправки (ГЛАВНАЯ ЛОГИКА)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Определяем адрес и данные
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      
      let payload: any = {
        email: formData.email,
        password: formData.password
      };

      // Если регистрация - добавляем имя, телефон и реферальный код
      if (mode === "register") {
        const referrerCode = localStorage.getItem("uds_ref_code"); // Достаем код из памяти
        payload = {
          ...payload,
          name: formData.name,
          phone: formData.phone,
          referrer_code: referrerCode || null
        };
      }

      // 2. Отправляем запрос на сервер
      const response = await axios.post(url, payload);

      // 3. Если успех
      const { token, user } = response.data;

      // Сохраняем токен в браузере
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(user));

      console.log("Успешная авторизация:", user.name);

      // Закрываем окно
      onClose();

      // Переходим в личный кабинет
      navigate("/dashboard");

    } catch (error: any) {
      console.error("Ошибка авторизации:", error);
      // Выводим сообщение от сервера или общее
      const message = error.response?.data?.error || "Произошла ошибка. Проверьте данные.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Переключатель режимов
  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-8 rounded-2xl bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "login" ? "Вход в кабинет" : "Регистрация"}
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

          {/* Общие поля */}
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

          <div className="space-y-2 relative">
            <Label htmlFor="password">Пароль</Label>
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

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full py-6 text-base font-semibold rounded-xl mt-6 bg-primary hover:bg-primary-hover"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </Button>
        </form>

        {/* Переключатель внизу */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Нет аккаунта?{" "}
              <button onClick={toggleMode} className="text-primary font-semibold hover:underline">
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{" "}
              <button onClick={toggleMode} className="text-primary font-semibold hover:underline">
                Войти
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
