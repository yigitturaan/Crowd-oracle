'use client';

import { motion } from 'framer-motion';
import Background from '@/components/ui/background';

interface FinalViewProps {
  outcome: 'win' | 'lose' | 'spectator' | 'loading';
  stats?: {
    correctCount: number;
    totalCount: number;
    percentage: number;
  };
  prices?: {
    target: number;
    actual: number;
  };
  userVote?: { type: 'bull' | 'bear' } | null;
  onButtonClick?: () => void;
}

export default function FinalView({ 
  outcome, 
  stats = { correctCount: 0, totalCount: 0, percentage: 0 },
  prices = { target: 3000, actual: 2850 },
  userVote = null,
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
    
    const miniappUrl = 'https://farcaster.xyz/miniapps/2S48OqhLgh73/crowd-oracle';
    
    let message = '';
    if (outcome === 'win') {
      message = `Aligned with the Eye. My prophecy was fulfilled and the future took shape as I saw it. 👁️✨ Did your vision hold true? ${miniappUrl} #CrowdOracle`;
    } else if (outcome === 'lose') {
      message = `Reality deviation detected... Signals crossed. The universe had a different plan today. 🥀 What is your result? ${miniappUrl} #CrowdOracle`;
    } else {
      // Spectator or other states - mysterious message
      message = `The Great Prophecy is complete. I chose to watch in silence, but the Eye saw everything. 🔮 The truth is out. ${miniappUrl} #CrowdOracle`;
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
            PROCESSING...
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
                PROPHECY FULFILLED
              </h1>
              {/* User Preference Label */}
              {userVote && userVote.type && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-2 mt-4 mx-auto w-fit"
                >
                  <span className="text-white/80 text-sm md:text-base font-medium font-space">
                    YOUR CHOICE: {userVote.type === 'bull' ? '🐂' : '🐻'} {userVote.type === 'bull' ? 'BULL' : 'BEAR'}
                  </span>
                </motion.div>
              )}
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
                  JAN 1 REALITY
                </h2>
                <div className="space-y-2">
                  <p className="text-xs md:text-sm text-white/70 font-medium font-space">
                    TARGET: {formatPrice(prices.target)}
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
                  <span className="text-yellow-400 font-black">{stats.percentage}%</span> of Oracles foresaw the truth.
                </p>
                <p className="text-lg md:text-xl text-yellow-100 font-black drop-shadow-[0_0_15px_rgba(234,179,8,0.7)]">
                  The Eye has seen what you saw. The universe aligned with your vision.
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
                SHARE VICTORY 🏆
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    );
  }

  // SPECTATOR durumu (İzleyici Modu)
  if (outcome === 'spectator') {
    return (
      <div className="min-h-screen bg-transparent flex flex-col relative z-10 overflow-hidden">
        {/* KATMAN 1: ARKA PLAN & MİSTİK EFEKTLER (Z-0) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Background />
          
          {/* Mor/Mavi Nebula Efekti - Derin uzay hissi */}
          <div 
            className="absolute inset-0 flex items-center justify-center animate-rotate-slow"
            style={{
              background: 'conic-gradient(from 0deg at center, transparent 0deg, rgba(124, 58, 237, 0.3) 60deg, transparent 120deg, rgba(59, 130, 246, 0.2) 180deg, transparent 240deg, rgba(124, 58, 237, 0.3) 300deg, transparent 360deg)',
            }}
          ></div>

          {/* Nebula Bloom efekti - Gözün merkezinden yayılan mistik parlaklık */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.4) 0%, rgba(59, 130, 246, 0.3) 20%, rgba(124, 58, 237, 0.2) 40%, transparent 70%)',
            }}
          >
            <div className="w-[800px] h-[450px] border-[2px] border-purple-400/60 rounded-[100%] drop-shadow-[0_0_150px_rgba(124,58,237,0.6)] animate-pulse"></div>
          </div>

          {/* Köşelerde mor/mavi nebula parçacıkları */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
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
              <h1 className="text-4xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(124,58,237,0.9)] text-center">
                PROPHECY COMPLETE
              </h1>
            </div>
          </motion.div>

          {/* B. ORTA KISIM - Gözün Sahnesi (BOŞ) */}
          <div className="flex-1 flex items-center justify-center">
            {/* Göz burada görünecek, içerik yok */}
          </div>

          {/* C. ALT KISIM - Bilgi Adaları (Sadece Genel İstatistikler) */}
          <div className="w-full px-4 pb-8 md:pb-12">
            <div className="max-w-6xl mx-auto">
              
              {/* Alt Metin Adası */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 md:p-6 mb-4 md:mb-6"
              >
                <p className="text-lg md:text-2xl text-white/90 font-medium font-space leading-relaxed text-center">
                  You chose silence, but the Eye has spoken. The truth is revealed.
                </p>
              </motion.div>

              {/* İstatistik Adası (Kişisel veri yok, sadece genel) */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 md:p-6"
              >
                <p className="text-sm md:text-base text-white/90 font-medium font-space leading-relaxed text-center">
                  <span className="text-purple-400 font-black">{stats.percentage}%</span> of Oracles foresaw the truth.
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
                className="w-full py-4 md:py-5 rounded-2xl border-2 border-purple-500/50 bg-purple-950/20 backdrop-blur-sm text-purple-400 font-black text-lg md:text-xl tracking-wider shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:border-purple-400 hover:bg-purple-950/30 hover:shadow-[0_0_60px_rgba(124,58,237,0.8)] hover:text-purple-300 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                SHARE DISCOVERY 🔮
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
              REALITY GLITCH
            </h1>
            {/* User Preference Label */}
            {userVote && userVote.type && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-2 mt-4 mx-auto w-fit"
              >
                <span className="text-white/80 text-sm md:text-base font-medium font-space">
                  YOUR CHOICE: {userVote.type === 'bull' ? '🐂' : '🐻'} {userVote.type === 'bull' ? 'BULL' : 'BEAR'}
                </span>
              </motion.div>
            )}
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
                JAN 1 REALITY
              </h2>
              <div className="space-y-2">
                <p className="text-xs md:text-sm text-white/70 font-medium font-space">
                  TARGET: {formatPrice(prices.target)}
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
                <span className="text-red-400 font-black">{stats.percentage}%</span> of Oracles foresaw the truth.
              </p>
              <p className="text-lg md:text-xl text-red-200 font-black drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]">
                Signal deviation detected. The future took a different path than you foresaw.
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
              SHARE RESULT 💀
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
