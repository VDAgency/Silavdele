// PaymentSuccess.tsx
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await axios.get(`/api/payment/check/${orderId}`);
        const orderStatus = response.data.status; // 'paid', 'pending', 'canceled'

        if (orderStatus === 'paid') {
          setStatus('success');
        } else if (orderStatus === 'canceled') {
          // Если отменен - кидаем на страницу ошибки
          navigate('/payment/failed');
        } else {
          // Если всё еще 'pending' (человек вернулся, но вебхук еще не долетел)
          // Можно подождать 3 секунды и спросить снова
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    checkStatus();
  }, [orderId, navigate]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl">Проверяем оплату...</h2>
      </div>
    );
  }

  if (status === 'error') {
     // Если вдруг order_id нет или сбой
     navigate('/payment/failed');
     return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Оплата прошла успешно! 🎉</h1>
      <p className="text-xl text-gray-700 mb-8">
        Спасибо за покупку. Письмо с доступом к курсу уже летит на вашу почту.
      </p>
      <Button onClick={() => window.location.href = '/'}>
        Вернуться на главную
      </Button>
    </div>
  );
};

export default PaymentSuccess;