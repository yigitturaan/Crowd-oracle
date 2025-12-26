'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";

// ⚠️ TEST AYARLARI (Kolayca değiştirilebilir)
const USER_VOTE = { type: 'Ayı', method: 'Sezgi' }; // Kullanıcının seçimi
const FINAL_ETH_PRICE = 2850.42; // Gerçekleşen Fiyat
const TARGET_PRICE = 3000; // Hedef

export default function FinalPage() {
  const searchParams = useSearchParams();
  // URL'den win parametresini oku: ?win=true = Kazanan, ?win=false veya yok = Kaybeden
  const IS_WINNER = searchParams.get('win') === 'true';
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVotes: 0,
    correctPredictions: 0,
    correctPercentage: 0,
    winnerGroup: '',
    winnerPercentage: 0,
  });

  // localStorage'dan kullanıcının oyunu al
  useEffect(() => {
    const voteData = localStorage.getItem('crowd-oracle-vote');
    if (voteData) {
      try {
        const data = JSON.parse(voteData);
        // USER_VOTE'yi localStorage'dan güncelle (eğer varsa)
        // Şimdilik test değerlerini kullanıyoruz
      } catch (error) {
        console.error('localStorage parse hatası:', error);
      }
    }
    setLoading(false);
  }, []);

  // Supabase'den istatistikleri çek
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('votes')
          .select('vote_choice, method');

        if (error) {
          console.error('Supabase hatası:', error);
          return;
        }

        if (!data || data.length === 0) {
          setStats({
            totalVotes: 0,
            correctPredictions: 0,
            correctPercentage: 0,
            winnerGroup: '',
            winnerPercentage: 0,
          });
          return;
        }

        const totalVotes = data.length;
        const winner = FINAL_ETH_PRICE > TARGET_PRICE ? 'yes' : 'no';
        const correctPredictions = data.filter(v => v.vote_choice === winner).length;
        const correctPercentage = totalVotes > 0 
          ? Math.round((correctPredictions / totalVotes) * 100) 
          : 0;

        // Kazanan grubu belirle (method + vote kombinasyonu)
        const winnerMethod = data.filter(v => v.vote_choice === winner);
        const methodGroups = {
          'logic-yes': winnerMethod.filter(v => v.method === 'logic' && v.vote_choice === 'yes').length,
          'logic-no': winnerMethod.filter(v => v.method === 'logic' && v.vote_choice === 'no').length,
          'intuition-yes': winnerMethod.filter(v => v.method === 'intuition' && v.vote_choice === 'yes').length,
          'intuition-no': winnerMethod.filter(v => v.method === 'intuition' && v.vote_choice === 'no').length,
        };

        const maxGroup = Object.entries(methodGroups).reduce((a, b) => a[1] > b[1] ? a : b);
        const winnerGroupName = maxGroup[0] === 'logic-yes' ? 'Mantıksal Boğalar' :
                               maxGroup[0] === 'logic-no' ? 'Mantıksal Ayılar' :
                               maxGroup[0] === 'intuition-yes' ? 'Sezgisel Boğalar' :
                               'Sezgisel Ayılar';
        const winnerGroupPercentage = correctPredictions > 0 
          ? Math.round((maxGroup[1] / correctPredictions) * 100) 
          : 0;

        setStats({
          totalVotes,
          correctPredictions,
          correctPercentage,
          winnerGroup: winnerGroupName,
          winnerPercentage: winnerGroupPercentage,
        });
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchStats();
  }, []);

  // Paylaşım fonksiyonu
  const shareResult = () => {
    const resultText = IS_WINNER ? 'KEHANET DOĞRULANDI' : 'SİNYAL HATASI';
    const shareText = `1 Ocak 2026 Crowd Oracle: ${resultText} | ${USER_VOTE.method} ${USER_VOTE.type} | Gerçek: $${FINAL_ETH_PRICE.toFixed(2)} 🔮`;
    
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
    window.open(warpcastUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white/60 font-space mt-4">Sonuçlar Hesaplanıyor...</p>
      </div>
    );
  }

  // Mod renkleri ve stilleri
  const isWinner = IS_WINNER;
  const bgGradient = isWinner 
    ? 'bg-gradient-to-t from-yellow-900/30 via-transparent to-transparent'
    : 'bg-gradient-to-t from-red-900/40 via-transparent to-transparent';
  const textColor = isWinner ? 'text-yellow-400' : 'text-red-500';
  const borderColor = isWinner ? 'border-yellow-500/50' : 'border-red-500/50';
  const shadowClass = isWinner ? 'shadow-[0_0_60px_rgba(34,197,94,0.5)]' : 'shadow-[0_0_60px_rgba(239,68,68,0.3)]';

  return (
    <div className={`min-h-screen ${bgGradient} flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden`}>
      {/* Noise efekti (Kaybeden modunda) */}
      {!isWinner && (
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      <main className="w-full max-w-4xl flex flex-col items-center gap-8 relative z-10">
        
        {/* 1. HEADER (Hüküm) */}
        <div className="text-center space-y-4">
          {isWinner ? (
            <>
              <h1 className={`text-5xl md:text-7xl font-black ${textColor} drop-shadow-[0_0_20px_currentColor] animate-pulse`}>
                KEHANET DOĞRULANDI
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-space">
                Geleceği kristal netliğinde gördün.
              </p>
            </>
          ) : (
            <>
              <h1 className={`text-5xl md:text-7xl font-black ${textColor} drop-shadow-[0_0_20px_currentColor] animate-glitch`}>
                SİNYAL HATASI...
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-space animate-pulse">
                Görüntü netleşmedi. Bağlantı koptu.
              </p>
            </>
          )}
        </div>

        {/* 2. KARŞILAŞTIRMA KARTI (VS Mode) */}
        <div className={`w-full bg-white/5 backdrop-blur-xl border ${borderColor} rounded-3xl ${shadowClass} p-6 md:p-10 ${!isWinner ? 'animate-shake' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* SOL TARA (Sen) */}
            <div className="text-center md:text-right space-y-3">
              <p className="text-xs md:text-sm text-white/40 uppercase tracking-[0.2em] font-space">SEN</p>
              <div className={`text-3xl md:text-5xl font-black ${isWinner ? 'text-yellow-400' : 'text-gray-400'} drop-shadow-[0_0_15px_currentColor]`}>
                {USER_VOTE.method.toUpperCase()}
              </div>
              <div className={`text-2xl md:text-4xl font-black ${isWinner ? 'text-green-400' : 'text-red-400'} drop-shadow-[0_0_15px_currentColor]`}>
                {USER_VOTE.type.toUpperCase()}
              </div>
            </div>

            {/* ORTA (Tik/Çarpı) */}
            <div className="flex justify-center items-center">
              {isWinner ? (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center animate-pulse">
                  <span className="text-6xl md:text-8xl text-green-400 font-black">✓</span>
                </div>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center animate-glitch">
                  <span className="text-6xl md:text-8xl text-red-500 font-black">✗</span>
                </div>
              )}
            </div>

            {/* SAĞ TARAF (Gerçek) */}
            <div className="text-center md:text-left space-y-3">
              <p className="text-xs md:text-sm text-white/40 uppercase tracking-[0.2em] font-space">GERÇEK</p>
              <div className={`text-3xl md:text-5xl font-black font-space ${FINAL_ETH_PRICE >= TARGET_PRICE ? 'text-green-400' : 'text-red-400'} drop-shadow-[0_0_15px_currentColor]`}>
                ${FINAL_ETH_PRICE.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm md:text-base text-white/60 font-space">
                Hedef: ${TARGET_PRICE.toLocaleString()}
              </div>
            </div>

          </div>
        </div>

        {/* 3. "KİM KAZANDI?" İSTATİSTİĞİ */}
        <div className={`w-full bg-white/5 backdrop-blur-xl border ${borderColor} rounded-3xl ${isWinner ? 'shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'shadow-[0_0_30px_rgba(239,68,68,0.2)]'} p-6 text-center`}>
          <p className="text-sm md:text-base text-white/70 font-space leading-relaxed">
            {stats.winnerGroup && stats.winnerPercentage > 0 ? (
              <>
                Bu döngüde <span className={`font-black ${textColor}`}>%{stats.winnerPercentage}</span>'lik azınlık 
                (<span className={`font-black ${textColor}`}>{stats.winnerGroup}</span>) haklı çıktı.
              </>
            ) : (
              <>
                Topluluğun <span className={`font-black ${textColor}`}>%{stats.correctPercentage}</span>'i doğru tahmin etti.
              </>
            )}
          </p>
          <p className="text-xs text-white/40 mt-2 font-space">
            {stats.totalVotes.toLocaleString('tr-TR')} toplam oy
          </p>
        </div>

        {/* 4. ROZET (Badge) */}
        <div className={`w-full bg-white/5 backdrop-blur-xl border ${borderColor} rounded-3xl ${isWinner ? 'shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'shadow-[0_0_30px_rgba(239,68,68,0.2)]'} p-8 text-center`}>
          {isWinner ? (
            <div className="space-y-4">
              <div className="text-6xl md:text-8xl mb-4 animate-pulse">🌟</div>
              <h3 className="text-2xl md:text-3xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                ORACLE MASTER
              </h3>
              <p className="text-sm text-white/60 font-space">
                Geleceği görenlerin arasındasın
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl md:text-8xl mb-4 animate-glitch">⚠️</div>
              <h3 className="text-2xl md:text-3xl font-black text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-glitch">
                BROKEN SIGHT
              </h3>
              <p className="text-sm text-white/60 font-space">
                Görüş bulanıklaştı, sinyal kayboldu
              </p>
            </div>
          )}
        </div>

        {/* 5. FOOTER (Aksiyon) */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <button
            onClick={shareResult}
            className={`flex-1 py-4 md:py-5 rounded-3xl font-black text-lg md:text-xl shadow-lg transition-all duration-200 active:scale-[0.98] ${
              isWinner
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-[#0f172a] hover:shadow-yellow-500/50'
                : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-red-500/50'
            }`}
          >
            📢 SONUCU PAYLAŞ
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className={`flex-1 py-4 md:py-5 rounded-3xl font-black text-lg md:text-xl border-2 ${borderColor} bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-all duration-200 active:scale-[0.98]`}
          >
            {isWinner ? '🔄 YENİ DÖNGÜYÜ BEKLE' : '🔄 TEKRAR DENE'}
          </button>
        </div>

      </main>
    </div>
  );
}
