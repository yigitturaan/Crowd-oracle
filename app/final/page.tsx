'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import FinalView from '@/components/FinalView';

function FinalContent() {
  const searchParams = useSearchParams();
  const [outcome, setOutcome] = useState<'win' | 'lose' | 'loading'>('loading');
  const [stats, setStats] = useState({ correctCount: 0, totalCount: 0, percentage: 0 });
  const [prices, setPrices] = useState({ target: 3000, actual: 0 });

  // 2 saniyelik loading, sonra rastgele sonuç üret
  useEffect(() => {
    const timer = setTimeout(() => {
      // Rastgele win veya lose seç
      const isWin = Math.random() > 0.5;
      const finalOutcome = isWin ? 'win' : 'lose';
      
      // Rastgele istatistikler oluştur
      const totalCount = Math.floor(Math.random() * 200) + 100; // 100-300 arası
      const correctCount = isWin 
        ? Math.floor(Math.random() * (totalCount * 0.4)) + Math.floor(totalCount * 0.1) // Win: %10-50 arası
        : Math.floor(Math.random() * (totalCount * 0.2)) + Math.floor(totalCount * 0.05); // Lose: %5-25 arası
      const percentage = Math.round((correctCount / totalCount) * 100);
      
      // Rastgele fiyatlar oluştur
      const targetPrice = 3000;
      const actualPrice = isWin
        ? targetPrice + Math.random() * 500 + 50 // Win: $3,050 - $3,550 arası
        : targetPrice - Math.random() * 300 - 50; // Lose: $2,650 - $2,950 arası
      
      setStats({
        correctCount,
        totalCount,
        percentage
      });
      
      setPrices({
        target: targetPrice,
        actual: Math.round(actualPrice * 100) / 100 // 2 ondalık basamak
      });
      
      setOutcome(finalOutcome);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    // Buton tıklama işlemi (isteğe bağlı)
    console.log('Button clicked');
  };

  return (
    <FinalView 
      outcome={outcome} 
      stats={stats}
      prices={prices}
      onButtonClick={handleButtonClick} 
    />
  );
}

export default function FinalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white/60 font-space mt-4">Yükleniyor...</p>
      </div>
    }>
      <FinalContent />
    </Suspense>
  );
}
