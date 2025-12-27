'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import FinalView from '@/components/FinalView';

function FinalContent() {
  const searchParams = useSearchParams();
  const [outcome, setOutcome] = useState<'win' | 'lose' | 'loading'>('loading');

  // 3 saniyelik veri çekme simülasyonu
  useEffect(() => {
    const timer = setTimeout(() => {
      // Şimdilik varsayılan olarak 'lose' göster
      setOutcome('lose');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    // Buton tıklama işlemi (isteğe bağlı)
    console.log('Button clicked');
  };

  return <FinalView outcome={outcome} onButtonClick={handleButtonClick} />;
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
