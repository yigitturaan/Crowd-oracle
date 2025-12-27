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
  const [outcome, setOutcome] = useState<'win' | 'lose' | 'spectator' | 'loading'>('loading');
  const [stats, setStats] = useState({ correctCount: 0, totalCount: 0, percentage: 0 });
  const [prices, setPrices] = useState({ target: TARGET_PRICE, actual: 0 });
  const [userVote, setUserVote] = useState<{ type: 'bull' | 'bear' } | null>(null);

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

        // Fiyatı currentPrice olarak sakla
        const currentPrice = actualPrice;

        // C. TOPLULUK İSTATİSTİKLERİ (Supabase) - Her durumda çek
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
              const winnerVote = currentPrice >= TARGET_PRICE ? 'yes' : 'no';
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

        // 2. İSTATİSTİKLERİ VE FİYATI GÜNCELLE (Her durumda)
        setStats({
          correctCount,
          totalCount,
          percentage
        });

        setPrices({
          target: TARGET_PRICE,
          actual: Math.round(currentPrice * 100) / 100 // 2 ondalık basamak
        });

        // B. KULLANICI OYU KONTROLÜ
        const voteDataStr = localStorage.getItem('crowd-oracle-vote');
        
        if (!voteDataStr) {
          // Oy yoksa -> İZLEYİCİ MODU (Spectator)
          console.log('=== FINAL PAGE DEBUG ===');
          console.log('Kullanıcı Oyu: YOK (Spectator Mode)');
          console.log('Anlık Fiyat:', currentPrice);
          console.log('Hedef Fiyat:', TARGET_PRICE);
          console.log('Sonuç: spectator');
          console.log('======================');
          
          setUserVote(null);
          setOutcome('spectator');
          return;
        }

        // Oy varsa -> Parse et ve Win/Lose hesapla
        let voteData;
        try {
          voteData = JSON.parse(voteDataStr);
        } catch (error) {
          console.error('localStorage parse hatası:', error);
          // Parse hatası durumunda da spectator moduna geç
          setUserVote(null);
          setOutcome('spectator');
          return;
        }

        // vote formatını type formatına çevir
        const voteType: 'bull' | 'bear' = voteData.vote === 'yes' ? 'bull' : 'bear';
        const parsedUserVote = {
          type: voteType,
          method: voteData.method || 'logic'
        };

        // userVote state'ini set et
        setUserVote({ type: voteType });

        // DEBUG: Konsola log ekle
        console.log('=== FINAL PAGE DEBUG ===');
        console.log('Kullanıcı Oyu:', parsedUserVote.type);
        console.log('Anlık Fiyat:', currentPrice);
        console.log('Hedef Fiyat:', TARGET_PRICE);

        // 1. KAZANMA MANTIĞINI SIKILAŞTIR
        const isBullWin = parsedUserVote.type === 'bull' && currentPrice >= TARGET_PRICE;
        const isBearWin = parsedUserVote.type === 'bear' && currentPrice < TARGET_PRICE;
        const result = (isBullWin || isBearWin) ? 'win' : 'lose';

        // DEBUG: Sonucu konsola yazdır
        console.log('Bull Win:', isBullWin);
        console.log('Bear Win:', isBearWin);
        console.log('Sonuç:', result);
        console.log('======================');

        // Sonucu set et
        setOutcome(result);

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
      userVote={userVote}
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
