'use client';

import { motion } from 'framer-motion';
import Background from '@/components/ui/background';

interface FinalViewProps {
  outcome: 'win' | 'lose' | 'loading';
  stats?: {
    correctCount: number;
    totalCount: number;
    percentage: number;
  };
  prices?: {
    target: number;
    actual: number;
  };
  onButtonClick?: () => void;
}

export default function FinalView({ 
  outcome, 
  stats = { correctCount: 0, totalCount: 0, percentage: 0 },
  prices = { target: 3000, actual: 2850 },
  onButtonClick 
}: FinalViewProps) {
  // Fiyat formatı
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Paylaş butonu fonksiyonu
  const handleShare = () => {
    const baseUrl = window.location.origin;
    const imageUrl = `${baseUrl}/api/og?outcome=${outcome}&price=${prices.actual}`;
    
    let message = '';
    if (outcome === 'win') {
      message = `Crowd Oracle konuşuyor: Geleceği gördüm ve haklı çıktım. ETH $${prices.actual} oldu! 🔮 #CrowdOracle`;
    } else {
      message = `Crowd Oracle'da sinyaller karıştı... ETH $${prices.actual} oldu. Bir dahaki sefere. 🥀 #CrowdOracle`;
    }

    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(message)}&embeds[]=${encodeURIComponent(imageUrl)}`;
    
    window.open(warpcastUrl, '_blank', 'noopener,noreferrer');
    
    // Opsiyonel: onButtonClick callback'i de çağır
    if (onButtonClick) {
      onButtonClick();
    }
  };

  // LOADING durumu
  if (outcome === 'loading') {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <Background />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl">
            ANALİZ EDİLİYOR...
          </h1>
        </motion.div>
      </div>
    );
  }

  // WIN durumu
  if (outcome === 'win') {
    return (
      <div className="min-h-screen bg-transparent flex flex-col relative z-10 overflow-hidden">
        {/* KATMAN 1: ARKA PLAN & COŞKU EFEKTLERİ (Z-0) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Gözü altın rengine çeviren filtre */}
          <div className="sepia-[1] brightness-150 saturate-200 hue-rotate-15">
            <Background />
          </div>
          
          {/* Sunburst/God Rays - Yavaşça dönen ışık huzmesi */}
          <div 
            className="absolute inset-0 flex items-center justify-center animate-rotate-slow"
            style={{
              background: 'conic-gradient(from 0deg at center, transparent 0deg, rgba(234, 179, 8, 0.3) 60deg, transparent 120deg, rgba(234, 179, 8, 0.2) 180deg, transparent 240deg, rgba(234, 179, 8, 0.3) 300deg, transparent 360deg)',
            }}
          ></div>

          {/* Güçlendirilmiş Bloom efekti - Gözün merkezinden yayılan parlaklık */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at center, rgba(234, 179, 8, 0.6) 0%, rgba(234, 179, 8, 0.4) 20%, rgba(234, 179, 8, 0.2) 40%, transparent 70%)',
            }}
          >
            <div className="w-[800px] h-[450px] border-[2px] border-yellow-400/95 rounded-[100%] drop-shadow-[0_0_200px_rgba(234,179,8,1)] animate-pulse"></div>
          </div>

          {/* Köşelerde altın parçacık efektleri */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* KATMAN 2: PARÇALANMIŞ UI (Z-10) */}
        <div className="relative z-10 min-h-screen flex flex-col">
          
          {/* A. ÜST KISIM - Başlık Adası */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full px-4 pt-8 md:pt-12"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl font-black text-yellow-400 drop-shadow-[0_0_40px_rgba(234,179,8,0.9)] text-center">
                KEHANET DOĞRULANDI.
              </h1>
            </div>
          </motion.div>

          {/* B. ORTA KISIM - Gözün Sahnesi (BOŞ) */}
          <div className="flex-1 flex items-center justify-center">
            {/* Göz burada görünecek, içerik yok */}
          </div>

          {/* C. ALT KISIM - Bilgi Adaları */}
          <div className="w-full px-4 pb-8 md:pb-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              {/* SOL ADA - Fiyat & Gerçek */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 md:p-6"
              >
                <h2 className="text-sm md:text-base text-white/90 font-bold font-space uppercase tracking-wider mb-4">
                  1 OCAK GERÇEĞİ
                </h2>
                <div className="space-y-2">
                  <p className="text-xs md:text-sm text-white/70 font-medium font-space">
                    Hedef: {formatPrice(prices.target)}
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent my-3"></div>
                  <p className="text-2xl md:text-4xl font-black text-green-400 drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]">
                    {formatPrice(prices.actual)}
                  </p>
                </div>
              </motion.div>

              {/* SAĞ ADA - İstatistik */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 md:p-6"
              >
                <p className="text-sm md:text-base text-white/90 font-medium font-space leading-relaxed mb-2">
                  Kahinlerin <span className="text-yellow-400 font-black">{stats.percentage}%</span>'i gerçeği gördü.
                </p>
                <p className="text-lg md:text-xl text-yellow-100 font-black drop-shadow-[0_0_15px_rgba(234,179,8,0.7)]">
                  Sen seçilmişlerdensin.
                </p>
              </motion.div>

            </div>
          </div>

          {/* D. EN ALT - Buton */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full px-4 pb-8 md:pb-12"
          >
            <div className="max-w-2xl mx-auto">
              <button
                onClick={handleShare}
                className="w-full py-4 md:py-5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-[#0f172a] font-black text-lg md:text-xl tracking-wider shadow-[0_0_40px_rgba(234,179,8,0.6)] hover:shadow-[0_0_80px_rgba(234,179,8,1)] hover:from-yellow-400 hover:to-amber-400 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                ZAFERİ PAYLAŞ 🏆
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    );
  }

  // LOSE durumu
  return (
    <div className="min-h-screen bg-transparent flex flex-col relative z-10 overflow-hidden">
      {/* KATMAN 1: ARKA PLAN & COŞKU EFEKTLERİ (Z-0) */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/30">
        <Background />
        
        {/* Gözün glitch efekti */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[450px] border-[2px] border-red-500/80 rounded-[100%] drop-shadow-[0_0_150px_rgba(239,68,68,0.9)] animate-glitch-severe"></div>
        </div>

        {/* Kırmızı yanıp sönen ışıklar */}
        <div className="absolute top-0 left-0 w-full h-full bg-red-500/15 animate-pulse-red"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/40 rounded-full blur-3xl animate-pulse-red" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-700/40 rounded-full blur-3xl animate-pulse-red" style={{ animationDelay: '1s' }}></div>

        {/* Noise overlay - Daha koyu */}
        <div 
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* KATMAN 2: PARÇALANMIŞ UI (Z-10) */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* A. ÜST KISIM - Başlık Adası */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full px-4 pt-8 md:pt-12"
        >
          <div className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-black text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.9)] text-center glitch-text-severe">
              SİNYAL HATASI.
            </h1>
          </div>
        </motion.div>

        {/* B. ORTA KISIM - Gözün Sahnesi (BOŞ) */}
        <div className="flex-1 flex items-center justify-center">
          {/* Göz burada görünecek, içerik yok */}
        </div>

        {/* C. ALT KISIM - Bilgi Adaları */}
        <div className="w-full px-4 pb-8 md:pb-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* SOL ADA - Fiyat & Gerçek */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 md:p-6"
            >
              <h2 className="text-sm md:text-base text-white/90 font-bold font-space uppercase tracking-wider mb-4">
                1 OCAK GERÇEĞİ
              </h2>
              <div className="space-y-2">
                <p className="text-xs md:text-sm text-white/70 font-medium font-space">
                  Hedef: {formatPrice(prices.target)}
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-3"></div>
                <p className="text-2xl md:text-4xl font-black text-red-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]">
                  {formatPrice(prices.actual)}
                </p>
              </div>
            </motion.div>

            {/* SAĞ ADA - İstatistik */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 md:p-6"
            >
              <p className="text-sm md:text-base text-white/90 font-medium font-space leading-relaxed mb-2">
                Kahinlerin <span className="text-red-400 font-black">{stats.percentage}%</span>'i gerçeği gördü.
              </p>
              <p className="text-lg md:text-xl text-red-200 font-black drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]">
                Çoğunluk yanıldı.
              </p>
            </motion.div>

          </div>
        </div>

        {/* D. EN ALT - Buton */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full px-4 pb-8 md:pb-12"
        >
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleShare}
              className="w-full py-4 md:py-5 rounded-2xl border-2 border-red-500/50 bg-red-950/20 backdrop-blur-sm text-red-400 font-black text-lg md:text-xl tracking-wider shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:border-red-400 hover:bg-red-950/30 hover:shadow-[0_0_60px_rgba(239,68,68,0.8)] hover:text-red-300 transition-all duration-300 hover:scale-105 active:scale-95 glitch-button"
            >
              SONUCU PAYLAŞ 💀
            </button>
          </div>
        </motion.div>

      </div>

      <style jsx>{`
        @keyframes pulse-red {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        .animate-pulse-red {
          animation: pulse-red 1.5s ease-in-out infinite;
        }

        @keyframes glitch-severe {
          0% {
            transform: translate(0) rotate(0deg);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translate(-4px, 4px) rotate(-1deg);
            filter: hue-rotate(10deg);
          }
          20% {
            transform: translate(-4px, -4px) rotate(1deg);
            filter: hue-rotate(-10deg);
          }
          30% {
            transform: translate(4px, 4px) rotate(-1deg);
            filter: hue-rotate(10deg);
          }
          40% {
            transform: translate(4px, -4px) rotate(1deg);
            filter: hue-rotate(-10deg);
          }
          50% {
            transform: translate(-4px, 4px) rotate(-1deg);
            filter: hue-rotate(10deg);
          }
          60% {
            transform: translate(-4px, -4px) rotate(1deg);
            filter: hue-rotate(-10deg);
          }
          70% {
            transform: translate(4px, 4px) rotate(-1deg);
            filter: hue-rotate(10deg);
          }
          80% {
            transform: translate(4px, -4px) rotate(1deg);
            filter: hue-rotate(-10deg);
          }
          90% {
            transform: translate(-4px, 4px) rotate(-1deg);
            filter: hue-rotate(10deg);
          }
          100% {
            transform: translate(0) rotate(0deg);
            filter: hue-rotate(0deg);
          }
        }

        @keyframes glitch-text-severe {
          0%, 100% {
            text-shadow: 
              3px 0 #ff0000,
              -3px 0 #00ffff,
              0 3px #00ff00;
            transform: translate(0);
          }
          25% {
            text-shadow: 
              -3px 0 #ff0000,
              3px 0 #00ffff,
              0 -3px #00ff00;
            transform: translate(2px, -2px);
          }
          50% {
            text-shadow: 
              3px 0 #ff0000,
              -3px 0 #00ffff,
              0 3px #00ff00;
            transform: translate(-2px, 2px);
          }
          75% {
            text-shadow: 
              -3px 0 #ff0000,
              3px 0 #00ffff,
              0 -3px #00ff00;
            transform: translate(2px, 2px);
          }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-glitch-severe {
          animation: glitch-severe 0.3s infinite;
        }

        .glitch-text-severe {
          animation: glitch-text-severe 0.3s infinite;
        }

        .animate-rotate-slow {
          animation: rotate-slow 30s linear infinite;
        }

        @keyframes glitch-button {
          0%, 100% {
            text-shadow: 
              2px 0 #ff0000,
              -2px 0 #00ffff;
            transform: translate(0);
          }
          25% {
            text-shadow: 
              -2px 0 #ff0000,
              2px 0 #00ffff;
            transform: translate(1px, -1px);
          }
          50% {
            text-shadow: 
              2px 0 #ff0000,
              -2px 0 #00ffff;
            transform: translate(-1px, 1px);
          }
          75% {
            text-shadow: 
              -2px 0 #ff0000,
              2px 0 #00ffff;
            transform: translate(1px, 1px);
          }
        }

        .glitch-button:hover {
          animation: glitch-button 0.2s infinite;
        }
      `}</style>
    </div>
  );
}
