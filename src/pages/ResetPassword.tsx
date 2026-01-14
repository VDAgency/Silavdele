import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Достаем токен из URL (?token=...)
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  useEffect(() => {
    // Если токена нет, перекидываем на главную
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    if (password.length < 6) {
        alert("Пароль должен быть не менее 6 символов");
        return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/reset-password", {
        token,
        newPassword: password
      });

      setSuccess(true);
    } catch (error: any) {
      console.error("Ошибка сброса:", error);
      const message = error.response?.data?.error || "Ссылка устарела или неверна.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center p-6 shadow-xl border-none">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">Пароль изменен!</CardTitle>
          <p className="text-gray-600 mb-6">
            Теперь вы можете войти в личный кабинет с новым паролем.
          </p>
          <Button 
            className="w-full py-6 rounded-xl text-lg"
            onClick={() => navigate("/")}
          >
            На главную
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Новый пароль</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Придумайте новый пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl pr-10"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Повторите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full py-6 text-base font-semibold rounded-xl mt-4 bg-primary hover:bg-primary-hover"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить пароль
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
