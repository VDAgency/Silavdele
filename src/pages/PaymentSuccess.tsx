import React from 'react';
import { Button } from "@/components/ui/button"; // Или твой компонент кнопки

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Оплата прошла успешно! 🎉</h1>
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