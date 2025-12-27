'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

function MethodologyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const vote = searchParams.get('vote') || '';

  const handleCardClick = async (method: 'logic' | 'intuition') => {
    // localStorage'a kayıt oluştur
    const voteData = {
      vote: vote,
      method: method,
      date: Date.now()
    };
    
    localStorage.setItem('crowd-oracle-vote', JSON.stringify(voteData));
    
    // Supabase'e kayıt (asenkron, kullanıcıyı bekletmez)
    const saveToSupabase = async () => {
      // Supabase yapılandırması kontrolü
      if (!isSupabaseConfigured()) {
        console.warn('Supabase is not configured. Vote will not be saved to database.');
        return;
      }

      try {
        const user_id = Date.now().toString(); // Rastgele user_id
        
        const { error } = await supabase
          .from('votes')
          .insert({
            user_id: user_id,
            vote_choice: vote,
            method: method
          });

        if (error) {
          console.error('Supabase kayıt hatası:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
        } else {
          // Başarılı olduğunda cookie ekle
          document.cookie = "hasVoted=true; path=/; max-age=31536000";
        }
      } catch (error) {
        console.error('Supabase kayıt hatası:', error);
        // Hata olsa bile kullanıcıyı yönlendir
      }
    };
    
    // Arka planda kayıt yap, kullanıcıyı bekleme
    saveToSupabase();
    
    // Dashboard'a hemen yönlendir
    router.push(`/dashboard?vote=${vote}&method=${method}`);
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        {/* Başlık */}
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl mb-12 text-center">
          KARARINI NEYE GÖRE VERDİN?
        </h1>

        {/* Kartlar */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* KART 1: MANTIK & VERİ - Amber Tema */}
          <button 
            onClick={() => handleCardClick('logic')}
            className="group relative w-full md:w-80 h-40 transition-all"
          >
            <div className="absolute -inset-1 bg-amber-500/30 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-full bg-amber-950/30 backdrop-blur-md border-2 border-amber-500 hover:border-amber-400 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:scale-[1.03]">
              <div className="text-4xl">🧠</div>
              <h2 className="font-black text-2xl text-white">
                MANTIK & VERİ
              </h2>
              <p className="font-space text-amber-200 text-xs">
                Grafikler, analizler, teknik veriler.
              </p>
            </div>
          </button>

          {/* KART 2: HİS & SEZGİ - Pink Tema */}
          <button 
            onClick={() => handleCardClick('intuition')}
            className="group relative w-full md:w-80 h-40 transition-all"
          >
            <div className="absolute -inset-1 bg-pink-500/30 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-full bg-pink-950/30 backdrop-blur-md border-2 border-pink-500 hover:border-pink-400 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.2)] group-hover:scale-[1.03]">
              <div className="text-4xl">🔮</div>
              <h2 className="font-black text-2xl text-white">
                HİS & SEZGİ
              </h2>
              <p className="font-space text-pink-200 text-xs">
              Piyasa psikolojisi, sosyal algı, içgüdü.
              </p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

export default function MethodologyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8">
        <main className="w-full max-w-4xl flex flex-col items-center gap-8">
          <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl mb-12 text-center">
            Yükleniyor...
          </h1>
        </main>
      </div>
    }>
      <MethodologyContent />
    </Suspense>
  );
}

