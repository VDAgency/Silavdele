// src/components/admin/AdminPanel.tsx
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSearch } from "./UserSearch";
import { UserStructureView } from "./UserStructureView";
import { Loader2, RefreshCw, Users, Shield } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  telegram_nick: string | null;
  own_referral_code: string | null;
  uds_customer_id: number | null;
  role: string;
  created_at: string;
}

interface AdminPanelProps {
  currentUserId: number;
  currentUserData: any;
}

export const AdminPanel = ({ currentUserId, currentUserData }: AdminPanelProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);
  const [viewHistory, setViewHistory] = useState<number[]>([]); // История просмотров для навигации
  const [syncing, setSyncing] = useState(false);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setViewingUserId(user.id);
    setViewHistory([user.id]);
  };

  const handleViewUserStructure = (userId: number) => {
    setViewingUserId(userId);
    setViewHistory((prev) => [...prev, userId]);
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Убираем текущий
      const previousUserId = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setViewingUserId(previousUserId);
    } else {
      // Возвращаемся к своей структуре
      setViewingUserId(null);
      setSelectedUser(null);
      setViewHistory([]);
    }
  };

  const handleBackToMyStructure = () => {
    setViewingUserId(null);
    setSelectedUser(null);
    setViewHistory([]);
  };

  const handleFullSync = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem("auth_token");
      await axios.post(
        "/api/admin/sync-uds",
        { type: "full" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Синхронизация запущена. Это может занять некоторое время.");
    } catch (error: any) {
      console.error("Ошибка синхронизации:", error);
      alert(error.response?.data?.error || "Ошибка запуска синхронизации");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Заголовок админской панели */}
      <Card className="border-none shadow-md bg-gradient-to-r from-red-600 to-red-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Панель администратора</h2>
                <p className="text-sm opacity-90">Просмотр и управление пользователями</p>
              </div>
            </div>
            <Button
              onClick={handleFullSync}
              disabled={syncing}
              variant="secondary"
            >
              {syncing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Синхронизировать всех из UDS
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="my-structure" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-structure">Моя структура</TabsTrigger>
          <TabsTrigger value="view-user">Просмотр пользователя</TabsTrigger>
        </TabsList>

        <TabsContent value="my-structure" className="mt-6">
          {viewingUserId === null || viewingUserId === currentUserId ? (
            <UserStructureView
              userId={currentUserId}
              onUserSelect={handleViewUserStructure}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Просмотр структуры:</span>
                {viewHistory.map((id, index) => (
                  <span key={id}>
                    {index > 0 && " → "}
                    <button
                      onClick={() => {
                        if (index < viewHistory.length - 1) {
                          const newHistory = viewHistory.slice(0, index + 1);
                          setViewHistory(newHistory);
                          setViewingUserId(id);
                        }
                      }}
                      className="hover:underline"
                    >
                      ID {id}
                    </button>
                  </span>
                ))}
              </div>
              <UserStructureView
                userId={viewingUserId}
                onBack={viewHistory.length > 1 ? handleBack : handleBackToMyStructure}
                onUserSelect={handleViewUserStructure}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="view-user" className="mt-6">
          <div className="space-y-6">
            <UserSearch onUserSelect={handleUserSelect} />

            {selectedUser && (
              <div className="space-y-4">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Выбранный пользователь</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Имя:</span> {selectedUser.name || "Без имени"}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {selectedUser.email}
                      </div>
                      {selectedUser.phone && (
                        <div>
                          <span className="font-medium">Телефон:</span> {selectedUser.phone}
                        </div>
                      )}
                      {selectedUser.own_referral_code && (
                        <div>
                          <span className="font-medium">Реферальный код:</span> {selectedUser.own_referral_code}
                        </div>
                      )}
                      {selectedUser.uds_customer_id && (
                        <div>
                          <span className="font-medium">UDS Customer ID:</span> {selectedUser.uds_customer_id}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <UserStructureView
                  userId={selectedUser.id}
                  onUserSelect={handleViewUserStructure}
                />
              </div>
            )}

            {!selectedUser && (
              <Card className="border-none shadow-md">
                <CardContent className="py-12 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Выберите пользователя из результатов поиска</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
