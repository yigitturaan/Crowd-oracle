'use client';

import { useEffect, useRef } from 'react';

export default function EyeBlink() {
  const eyeRef = useRef<HTMLDivElement>(null);

  // Göz kırpma animasyonunu tetikle
  const triggerBlink = () => {
    if (eyeRef.current) {
      // Animasyonu reset etmek için class'ı kaldırıp tekrar ekle
      eyeRef.current.classList.remove('animate-blink');
      // Reflow tetikle
      void eyeRef.current.offsetWidth;
      // Class'ı tekrar ekle (animasyon yeniden başlar)
      eyeRef.current.classList.add('animate-blink');
    }
  };

  // Interval'i ref ile yönet (sıfırlama için)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Otomatik göz kırpma: 10 saniyede bir
    const startAutoBlink = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        triggerBlink();
      }, 10000);
    };

    // İlk otomatik kırpmayı başlat
    startAutoBlink();

    // CustomEvent listener: 'oracle-blink' eventi tetiklendiğinde
    const handleOracleBlink = () => {
      triggerBlink();
      // Otomatik interval'i sıfırla ve yeniden başlat
      startAutoBlink();
    };

    // Event listener ekle
    window.addEventListener('oracle-blink', handleOracleBlink);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('oracle-blink', handleOracleBlink);
    };
  }, []);

  return (
    <div 
      ref={eyeRef}
      className="absolute flex items-center justify-center animate-blink opacity-70"
    >
      {/* A) Dış Göz Çerçevesi (Neon Mor) */}
      <div className="w-[800px] h-[450px] bg-transparent border-[2px] border-purple-400/80 rounded-[100%] shadow-[0_0_40px_rgba(168,85,247,0.5)]"></div>
      
      {/* B) İris (Neon Cyan) */}
      <div className="absolute w-[350px] h-[350px] bg-transparent border-[2px] border-cyan-400/80 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.5)]"></div>
      
      {/* C) Gözbebeği (REWORK - İçi Boş Neon Yırtık) */}
      <div className="absolute w-[20px] h-[200px] bg-transparent border-[3px] border-white/90 rounded-[100%] animate-pupil"></div>
    </div>
  );
}

