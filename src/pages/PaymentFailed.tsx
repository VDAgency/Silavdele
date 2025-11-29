import React from 'react';
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <XCircle className="w-20 h-20 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Оплата не прошла</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        Вы отменили платеж или произошла ошибка. Деньги не были списаны.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          На главную
        </Button>
        <Button onClick={() => window.location.href = '/#pricing'}>
          Попробовать снова
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailed;
