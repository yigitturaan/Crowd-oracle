'use client';

import EyeBlink from '@/components/EyeBlink';

export default function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* 1. KAHİN AURASI (Arkadaki Yumuşak Işık) */}
      <div className="absolute w-[900px] h-[900px] bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-full blur-[120px] animate-rotate"></div>
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] rounded-full blur-[150px] opacity-40 animate-aura"></div>

      {/* 2. NEON SİBER GÖZ (İnce Çizgili & İçi Boş) */}
      <EyeBlink />
    </div>
  );
}

