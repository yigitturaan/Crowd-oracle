'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // localStorage kontrolü
    const voteData = localStorage.getItem('crowd-oracle-vote');
    
    if (voteData) {
      try {
        const data = JSON.parse(voteData);
        // vote ve method parametrelerini al
        const vote = data.vote || '';
        const method = data.method || '';
        
        // Dashboard'a yönlendir
        if (vote && method) {
          router.push(`/dashboard?vote=${vote}&method=${method}`);
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        // JSON parse hatası durumunda normal akışa devam et
        setIsChecking(false);
      }
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Yönlendirme yapılıyorsa loading göster (veya hiçbir şey gösterme)
  if (isChecking) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8">
        <main className="w-full max-w-md flex flex-col items-center gap-8">
          <p className="text-gray-400">Yükleniyor...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-transparent">
      <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-transparent">
        {/* Başlık */}
        <h1 className="max-w-4xl mx-auto text-6xl md:text-8xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
          GELECEĞİ GÖREBİLİYOR MUSUN?
        </h1>

        {/* İhtişamlı Buton */}
        <Link 
          href="/vote"
          className="mt-12 py-6 px-12 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-2xl shadow-[0_0_40px_rgba(168,85,247,0.7)] hover:scale-105 hover:shadow-[0_0_60px_rgba(168,85,247,0.9)] transition-all duration-300 text-center"
        >
          KEHANETİNİ YAP 🔮
        </Link>
      </main>
    </div>
  );
}
