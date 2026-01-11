// src/components/admin/UserStructureView.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, ArrowLeft, Users, Wallet, Calendar } from "lucide-react";

interface UserStats {
  level1: number;
  level2: number;
  level3: number;
}

interface StructureUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  telegram_nick: string | null;
  balance: string;
  total_earned: string;
  own_referral_code: string | null;
  uds_customer_id: number | null;
  uds_inviter_id: number | null;
  created_at: string;
  last_sync_at: string | null;
  stats: UserStats;
}

interface UserStructureLevel {
  count: number;
  users: StructureUser[];
}

interface UserStructure {
  userId: number;
  userName: string;
  udsCustomerId: number | null;
  lastSyncAt: string | null;
  levels: {
    1: UserStructureLevel;
    2: UserStructureLevel;
    3: UserStructureLevel;
  };
  totalUsers: number;
}

interface UserStructureViewProps {
  userId: number;
  onBack?: () => void;
  onUserSelect?: (userId: number) => void;
}

export const UserStructureView = ({ userId, onBack, onUserSelect }: UserStructureViewProps) => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [structure, setStructure] = useState<UserStructure | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStructure = async (syncFromUds = false) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      const url = `/api/admin/users/${userId}/structure${syncFromUds ? "?syncFromUds=true" : ""}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStructure(response.data);
    } catch (err: any) {
      console.error("Ошибка загрузки структуры:", err);
      setError(err.response?.data?.error || "Ошибка загрузки структуры");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchStructure();
  }, [userId]);

  const handleSync = async () => {
    setSyncing(true);
    await fetchStructure(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("ru-RU");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-none shadow-md">
        <CardContent className="py-8">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={() => fetchStructure()} className="mt-4 mx-auto block">
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!structure) return null;

  return (
    <div className="space-y-6">
      {/* Карточка пользователя */}
      <Card className="border-none shadow-md bg-gradient-to-r from-primary to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {onBack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="text-white hover:bg-white/20"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                  </Button>
                )}
                <h2 className="text-2xl font-bold">{structure.userName}</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="opacity-80">ID пользователя</div>
                  <div className="font-bold">{structure.userId}</div>
                </div>
                {structure.udsCustomerId && (
                  <div>
                    <div className="opacity-80">UDS Customer ID</div>
                    <div className="font-bold">{structure.udsCustomerId}</div>
                  </div>
                )}
                <div>
                  <div className="opacity-80">Всего в структуре</div>
                  <div className="font-bold text-xl">{structure.totalUsers}</div>
                </div>
                <div>
                  <div className="opacity-80">Последняя синхронизация</div>
                  <div className="font-bold text-xs">{formatDate(structure.lastSyncAt)}</div>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSync}
              disabled={syncing}
              variant="secondary"
              className="ml-4"
            >
              {syncing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Обновить из UDS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Статистика по уровням */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{structure.levels[1].count}</div>
                <div className="text-sm text-gray-500">Уровень 1</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{structure.levels[2].count}</div>
                <div className="text-sm text-gray-500">Уровень 2</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{structure.levels[3].count}</div>
                <div className="text-sm text-gray-500">Уровень 3</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Детальный список по уровням */}
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="1">Уровень 1 ({structure.levels[1].count})</TabsTrigger>
          <TabsTrigger value="2">Уровень 2 ({structure.levels[2].count})</TabsTrigger>
          <TabsTrigger value="3">Уровень 3 ({structure.levels[3].count})</TabsTrigger>
        </TabsList>

        {[1, 2, 3].map((level) => (
          <TabsContent key={level} value={level.toString()} className="mt-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Уровень {level}</CardTitle>
              </CardHeader>
              <CardContent>
                {structure.levels[level as keyof typeof structure.levels].users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm text-gray-500">
                          <th className="py-3 px-4">Имя</th>
                          <th className="py-3 px-4">Контакты</th>
                          <th className="py-3 px-4">Финансы</th>
                          <th className="py-3 px-4">Статистика</th>
                          <th className="py-3 px-4">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {structure.levels[level as keyof typeof structure.levels].users.map((user) => (
                          <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="font-medium">{user.name || "Без имени"}</div>
                              {user.own_referral_code && (
                                <div className="text-xs text-gray-500">Код: {user.own_referral_code}</div>
                              )}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <div>{user.email}</div>
                              {user.phone && <div>{user.phone}</div>}
                              {user.telegram_nick && (
                                <div className="text-blue-600">@{user.telegram_nick}</div>
                              )}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <div>Баланс: {user.balance} ₽</div>
                              <div className="text-gray-500">Заработано: {user.total_earned} ₽</div>
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <div>Ур.1: {user.stats.level1}</div>
                              <div>Ур.2: {user.stats.level2}</div>
                              <div>Ур.3: {user.stats.level3}</div>
                            </td>
                            <td className="py-4 px-4">
                              {onUserSelect && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onUserSelect(user.id)}
                                >
                                  Просмотреть
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    На этом уровне нет пользователей
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
