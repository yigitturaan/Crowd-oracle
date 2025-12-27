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
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8 relative z-10 overflow-hidden">
        <Background />
        
        {/* İLAHİ PATLAMA - Altın Efektler */}
        {/* Dönen altın hareler */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-spin-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-spin-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl animate-spin-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Uçuşan altın parçacıklar */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => {
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 2;
            const randomDuration = Math.random() * 3 + 2;
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: `${randomX}%`,
                  y: '100vh',
                  opacity: 0,
                }}
                animate={{
                  y: '-10vh',
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  delay: randomDelay,
                }}
              />
            );
          })}
        </div>

        {/* Parlayan göz efekti */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[450px] border-[2px] border-yellow-400/80 rounded-[100%] drop-shadow-[0_0_100px_rgba(234,179,8,0.8)] animate-pulse"></div>
        </div>

        {/* Ana İçerik - Ghost Glass Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-2xl bg-black/30 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(234,179,8,0.3)]"
        >
          {/* A. BAŞLIK */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.8)] mb-4">
              ZAFER SENİN.
            </h1>
          </motion.div>

          {/* B. FİYAT KARŞILAŞTIRMASI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8 space-y-3"
          >
            <div className="text-center">
              <p className="text-sm text-gray-400 font-space uppercase tracking-wider mb-2">
                HEDEF: {formatPrice(prices.target)}
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent my-4"></div>
              <p className="text-3xl md:text-5xl font-black text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                1 OCAK FİYATI: {formatPrice(prices.actual)}
              </p>
            </div>
          </motion.div>

          {/* C. İSTATİSTİK METNİ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-8 space-y-2"
          >
            <p className="text-lg md:text-xl text-white/80 font-space leading-relaxed">
              <span className="text-yellow-400 font-black">{stats.totalCount}</span> Kahin arasından sadece{' '}
              <span className="text-yellow-400 font-black">{stats.correctCount}</span> kişi gerçeği gördü.
            </p>
            <p className="text-xl md:text-2xl text-yellow-300 font-black">
              Sen, <span className="text-yellow-400">{stats.percentage}%</span>'lik o seçilmiş azınlıktasın.
            </p>
          </motion.div>

          {/* D. AKSİYON BUTONU */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onClick={onButtonClick}
            className="w-full py-4 md:py-5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-[#0f172a] font-black text-lg md:text-xl tracking-wider shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:shadow-[0_0_50px_rgba(234,179,8,0.8)] transition-all duration-300 hover:scale-105"
          >
            ZAFERİMİ PAYLAŞ 🏆
          </motion.button>
        </motion.div>

        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  // LOSE durumu
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8 relative z-10 overflow-hidden">
      <Background />
      
      {/* SİSTEM ÇÖKÜŞÜ - Kırmızı Efektler */}
      {/* Yanıp sönen kırmızı ışıklar */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-red-500/10 animate-pulse-red"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/30 rounded-full blur-2xl animate-pulse-red" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-700/30 rounded-full blur-2xl animate-pulse-red" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Titreyen göz efekti */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[450px] border-[2px] border-red-500/80 rounded-[100%] drop-shadow-[0_0_100px_rgba(239,68,68,0.8)] animate-glitch-severe"></div>
      </div>

      {/* Ana İçerik - Ghost Glass Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl bg-black/30 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(239,68,68,0.3)]"
      >
        {/* A. BAŞLIK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-black text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] mb-4 glitch-text-severe">
            SİNYAL KAYBI.
          </h1>
        </motion.div>

        {/* B. FİYAT KARŞILAŞTIRMASI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 space-y-3"
        >
          <div className="text-center">
            <p className="text-sm text-gray-400 font-space uppercase tracking-wider mb-2">
              HEDEF: {formatPrice(prices.target)}
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-4"></div>
            <p className="text-3xl md:text-5xl font-black text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
              1 OCAK FİYATI: {formatPrice(prices.actual)}
            </p>
          </div>
        </motion.div>

        {/* C. İSTATİSTİK METNİ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-8 space-y-2"
        >
          <p className="text-lg md:text-xl text-white/80 font-space leading-relaxed">
            <span className="text-red-400 font-black">{stats.totalCount}</span> Kahin arasından sadece{' '}
            <span className="text-red-400 font-black">{stats.correctCount}</span> kişi gerçeği gördü.
          </p>
          <p className="text-xl md:text-2xl text-red-300 font-black">
            Topluluğun <span className="text-red-400">{100 - stats.percentage}%</span>'si ile birlikte yanıldın.
          </p>
        </motion.div>

        {/* D. AKSİYON BUTONU */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={onButtonClick}
          className="w-full py-4 md:py-5 rounded-2xl border-2 border-red-500/50 bg-red-950/20 backdrop-blur-sm text-red-400 font-black text-lg md:text-xl tracking-wider shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:border-red-400 hover:bg-red-950/30 transition-all duration-300 hover:scale-105"
        >
          SONUCU PAYLAŞ 💀
        </motion.button>
      </motion.div>

      <style jsx>{`
        @keyframes pulse-red {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
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

        .animate-glitch-severe {
          animation: glitch-severe 0.3s infinite;
        }

        .glitch-text-severe {
          animation: glitch-text-severe 0.3s infinite;
        }
      `}</style>
    </div>
  );
}

