'use client';

import { motion } from 'framer-motion';
import Background from '@/components/ui/background';

interface FinalViewProps {
  outcome: 'win' | 'lose' | 'loading';
  onButtonClick?: () => void;
}

export default function FinalView({ outcome, onButtonClick }: FinalViewProps) {
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
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <Background />
        
        {/* Altın Sarısı Divine Katman */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/30 via-yellow-800/20 to-transparent pointer-events-none"></div>
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(250, 204, 21, 0.2) 0%, transparent 70%)'
          }}
        ></div>
        
        {/* Ana İçerik */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-4xl w-full">
          {/* Başlık */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] mb-4">
              KEHANET DOĞRULANDI
            </h1>
            <p className="text-xl md:text-2xl text-yellow-200/80 font-space">
              Göz, senin gördüğünü gördü.
            </p>
          </motion.div>

          {/* Buton */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            onClick={onButtonClick}
            className="px-8 py-4 border-2 border-yellow-400 rounded-full bg-yellow-950/30 backdrop-blur-sm text-yellow-400 font-black text-lg md:text-xl tracking-wider hover:bg-yellow-950/50 hover:border-yellow-300 transition-all shadow-[0_0_30px_rgba(250,204,21,0.3)]"
          >
            RİTÜELİ TAMAMLA
          </motion.button>
        </div>

        <style jsx>{`
          @keyframes divine-glow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .divine-glow {
            animation: divine-glow 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // LOSE durumu
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8 relative z-10">
      <Background />
      
      {/* Kırmızı Glitch Katman */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/40 via-red-800/30 to-transparent pointer-events-none"></div>
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.2) 0%, transparent 70%)'
        }}
      ></div>
      
      {/* Ana İçerik */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-4xl w-full">
        {/* Başlık - Glitch Efekti */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-black text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] mb-4 glitch-text">
            SİNYAL HATASI
          </h1>
          <p className="text-xl md:text-2xl text-red-200/80 font-space">
            Gerçeklik sapması tespit edildi.
          </p>
        </motion.div>

        {/* Buton */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onClick={onButtonClick}
          className="px-8 py-4 border-2 border-red-500 rounded-full bg-red-950/30 backdrop-blur-sm text-red-500 font-black text-lg md:text-xl tracking-wider hover:bg-red-950/50 hover:border-red-400 transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        >
          BAĞLANTIYI KES
        </motion.button>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes glitch-text {
          0%, 100% {
            text-shadow: 
              2px 0 #ff0000,
              -2px 0 #00ffff;
          }
          25% {
            text-shadow: 
              -2px 0 #ff0000,
              2px 0 #00ffff;
          }
          50% {
            text-shadow: 
              2px 0 #ff0000,
              -2px 0 #00ffff;
          }
          75% {
            text-shadow: 
              -2px 0 #ff0000,
              2px 0 #00ffff;
          }
        }

        .glitch-text {
          animation: glitch 0.3s infinite, glitch-text 0.3s infinite;
        }
      `}</style>
    </div>
  );
}

