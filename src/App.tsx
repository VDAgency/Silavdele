import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PublicOffer from "./pages/PublicOffer";
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

// --- НОВЫЙ КОМПОНЕНТ: ЛОВЕЦ РЕФЕРАЛОВ ---
// Этот компонент невидимый, он просто следит за URL
const ReferralTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // 1. Разбираем параметры адресной строки
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref"); // Ищем ?ref=...

    // 2. Если нашли код - сохраняем в память браузера навсегда (пока не очистят кэш)
    if (refCode) {
      console.log("🔗 Пойман реферальный код:", refCode);
      localStorage.setItem("uds_ref_code", refCode);
    }
  }, [location]);

  return null; // Ничего не рисуем на экране
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Вставляем Ловца внутрь Роутера */}
        <ReferralTracker />
        
        <Routes>
          <Route path="/" element={<Index />} />

          {/* ЗАЩИЩЕННЫЙ РОУТ */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Новые страницы */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/offer" element={<PublicOffer />} />

          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
