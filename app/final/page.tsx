'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import FinalView from '@/components/FinalView';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

// YAPILANDIRMA
const TARGET_PRICE = 3000; // Sabit Hedef
const DEBUG_MODE = false; // True yaparsak tarihi beklemeden sonucu görebiliriz

function FinalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [outcome, setOutcome] = useState<'win' | 'lose' | 'loading'>('loading');
  const [stats, setStats] = useState({ correctCount: 0, totalCount: 0, percentage: 0 });
  const [prices, setPrices] = useState({ target: TARGET_PRICE, actual: 0 });

  // VERİ ÇEKME (useEffect - async)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A. GÜNCEL ETH FİYATI
        let actualPrice = 3450.00; // Fallback fiyat
        try {
          const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
          if (response.ok) {
            const data = await response.json();
            if (data.ethereum && data.ethereum.usd) {
              actualPrice = data.ethereum.usd;
            }
          }
        } catch (error) {
          console.warn('CoinGecko API hatası, fallback fiyat kullanılıyor:', error);
        }

        // B. KULLANICI OYU
        const voteDataStr = localStorage.getItem('crowd-oracle-vote');
        if (!voteDataStr) {
          // Oy yoksa dashboard'a yönlendir
          router.push('/dashboard');
          return;
        }

        let voteData;
        try {
          voteData = JSON.parse(voteDataStr);
        } catch (error) {
          console.error('localStorage parse hatası:', error);
          router.push('/dashboard');
          return;
        }

        // vote formatını type formatına çevir
        const userVote = {
          type: voteData.vote === 'yes' ? 'bull' : 'bear',
          method: voteData.method || 'logic'
        };

        // C. TOPLULUK İSTATİSTİKLERİ (Supabase)
        let totalCount = 0;
        let correctCount = 0;

        if (isSupabaseConfigured()) {
          try {
            const { data, error } = await supabase
              .from('votes')
              .select('vote_choice');

            if (!error && data) {
              totalCount = data.length;
              
              // Doğru tahmin edenleri hesapla
              const winnerVote = actualPrice >= TARGET_PRICE ? 'yes' : 'no';
              correctCount = data.filter(v => v.vote_choice === winnerVote).length;
            }
          } catch (error) {
            console.error('Supabase veri çekme hatası:', error);
          }
        }

        // Eğer veri yoksa varsayılan değerler
        if (totalCount === 0) {
          totalCount = 1;
          correctCount = 0;
        }

        const percentage = Math.round((correctCount / totalCount) * 100);

        // 3. SONUÇ HESAPLAMA
        const isWin = 
          (actualPrice >= TARGET_PRICE && userVote.type === 'bull') ||
          (actualPrice < TARGET_PRICE && userVote.type === 'bear');

        // Stats ve prices'ı set et
        setStats({
          correctCount,
          totalCount,
          percentage
        });

        setPrices({
          target: TARGET_PRICE,
          actual: Math.round(actualPrice * 100) / 100 // 2 ondalık basamak
        });

        // Sonucu set et
        setOutcome(isWin ? 'win' : 'lose');

      } catch (error) {
        console.error('Veri çekme hatası:', error);
        // Hata durumunda lose göster
        setOutcome('lose');
      }
    };

    fetchData();
  }, [router]);

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
