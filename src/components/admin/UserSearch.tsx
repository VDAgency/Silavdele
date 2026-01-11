// src/components/admin/UserSearch.tsx
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, User } from "lucide-react";

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

interface UserSearchProps {
  onUserSelect: (user: User) => void;
}

export const UserSearch = ({ onUserSelect }: UserSearchProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(`/api/admin/users/search?query=${encodeURIComponent(query)}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(response.data.users);
    } catch (err: any) {
      console.error("Ошибка поиска:", err);
      setError(err.response?.data?.error || "Ошибка поиска пользователей");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Поиск пользователей
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Email, телефон, имя, реферальный код, UDS ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {users.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onUserSelect(user)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{user.name || "Без имени"}</div>
                    <div className="text-sm text-gray-600 truncate">{user.email}</div>
                    {user.phone && (
                      <div className="text-sm text-gray-600">{user.phone}</div>
                    )}
                    <div className="flex gap-2 mt-1">
                      {user.own_referral_code && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Код: {user.own_referral_code}
                        </span>
                      )}
                      {user.uds_customer_id && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          UDS: {user.uds_customer_id}
                        </span>
                      )}
                      {user.role === "admin" && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Админ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && query && users.length === 0 && !error && (
          <div className="text-center text-gray-500 py-4">
            Пользователи не найдены
          </div>
        )}
      </CardContent>
    </Card>
  );
};
