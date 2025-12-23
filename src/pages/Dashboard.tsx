import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, Copy, LogOut, Users, Wallet, 
  Trophy, ExternalLink, Send 
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  balance: string;
  total_earned: string;
  own_referral_code: string | null;
  telegram_nick: string | null;
}

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  telegram_nick: string | null;
  created_at: string;
}

interface DashboardData {
  profile: UserProfile;
  stats: {
    level1: string; // количество рефералов
  };
  team: TeamMember[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  // Получение данных
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        navigate("/"); // Если нет токена, кидаем на главную
        return;
      }

      try {
        const response = await axios.get("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        // Если токен протух - разлогиниваем
        localStorage.removeItem("auth_token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Выход
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    navigate("/");
  };

  // Копирование ссылки
  const copyLink = () => {
    if (data?.profile.own_referral_code) {
      const link = `https://silavdele.ru/?ref=${data.profile.own_referral_code}`;
      navigator.clipboard.writeText(link);
      alert("Ссылка скопирована!");
    }
  };

  // Получение кода (заглушка на будущее)
  const handleGetCode = async () => {
    alert("Запрос кода отправлен! (Функционал в разработке)");
    // Тут будет запрос axios.post('/api/user/generate-code')
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- ВЕРХНЯЯ ШАПКА --- */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Сила в Деле</span> / Кабинет
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm text-gray-600">{data.profile.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* --- 1. ПРИВЕТСТВИЕ И БАЛАНС --- */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Карточка Профиля */}
          <Card className="md:col-span-2 border-none shadow-md bg-gradient-to-r from-primary to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Привет, {data.profile.name}! 👋</h1>
                  <p className="opacity-90">Партнерская программа активна.</p>
                  <div className="mt-6 flex gap-3">
                    <Button variant="secondary" className="text-primary font-bold">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Перейти к обучению
                    </Button>
                  </div>
                </div>
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm min-w-[200px]">
                  <p className="text-sm opacity-80 mb-1">Доступно к выводу</p>
                  <p className="text-3xl font-bold">{data.profile.balance} ₽</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Карточка Статистики */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-gray-500">Ваша статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.profile.total_earned} ₽</p>
                  <p className="text-xs text-gray-500">Заработано всего</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.stats.level1}</p>
                  <p className="text-xs text-gray-500">Партнеров 1-го уровня</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- 2. РЕФЕРАЛЬНЫЙ ИНСТРУМЕНТ --- */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Ваша партнерская ссылка
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.profile.own_referral_code ? (
              <div className="flex flex-col md:flex-row gap-4 items-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="flex-1 w-full text-center md:text-left">
                  <p className="text-sm text-gray-500 mb-1">Ваш уникальный код: <span className="font-bold text-gray-900">{data.profile.own_referral_code}</span></p>
                  <p className="text-lg font-mono font-medium text-primary break-all">
                    https://silavdele.ru/?ref={data.profile.own_referral_code}
                  </p>
                </div>
                <Button onClick={copyLink} className="w-full md:w-auto shrink-0">
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-600 mb-4">У вас пока нет реферального кода. Получите его, чтобы начать зарабатывать!</p>
                <Button onClick={handleGetCode}>Получить реферальный код</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- 3. ВКЛАДКИ (КОМАНДА И ФИНАНСЫ) --- */}
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="team">Моя команда</TabsTrigger>
            <TabsTrigger value="finance">Финансы</TabsTrigger>
          </TabsList>
          
          {/* ВКЛАДКА КОМАНДА */}
          <TabsContent value="team" className="mt-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Структура (1-й уровень)</CardTitle>
              </CardHeader>
              <CardContent>
                {data.team.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm text-gray-500">
                          <th className="py-3 px-4">Имя</th>
                          <th className="py-3 px-4">Контакты</th>
                          <th className="py-3 px-4">Дата регистрации</th>
                          <th className="py-3 px-4">Действие</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.team.map((member, idx) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 font-medium">{member.name || "Без имени"}</td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              <div>{member.email}</div>
                              <div>{member.phone}</div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {new Date(member.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              {member.telegram_nick && (
                                <a 
                                  href={`https://t.me/${member.telegram_nick.replace('@', '')}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="inline-flex items-center text-blue-500 hover:underline text-sm"
                                >
                                  <Send className="w-3 h-3 mr-1" />
                                  Написать
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-10 text-gray-500">У вас пока нет партнеров.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ВКЛАДКА ФИНАНСЫ (Пока заглушка) */}
          <TabsContent value="finance" className="mt-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>История операций</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-gray-500">История начислений пуста.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default Dashboard;
