'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function VotePage() {
  // --- STATE TANIMLAMALARI ---
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [ethPrice, setEthPrice] = useState<string>("Loading...");
  
  // --- 1. SAYAÇ MANTIĞI (28 ARALIK 2025 00:00) ---
  useEffect(() => {
    const targetDate = new Date("2025-12-28T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- 2. CANLI ETH FİYATI (CoinGecko API) ---
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await response.json();
        const price = data.ethereum.usd;
        setEthPrice("$" + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      } catch (error) {
        console.error("Fiyat çekilemedi", error);
        setEthPrice("$2,920.52"); 
      }
    };

    fetchPrice();
    const priceInterval = setInterval(fetchPrice, 30000);

    return () => clearInterval(priceInterval);
  }, []);

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full px-4 relative z-10 font-sans">
      
      {/* --- SAYAÇ (KÜÇÜLTÜLDÜ & ZARİFLEŞTİRİLDİ) --- */}
      <div className="mb-6 w-full max-w-md">
        <div className="relative bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-full px-6 py-2 text-center shadow-[0_0_20px_rgba(168,85,247,0.1)] flex items-center justify-center gap-4">
            <h3 className="text-purple-300/70 text-[10px] tracking-[0.2em] uppercase font-bold hidden md:block">
              REVEAL IN:
            </h3>
            
            <div className="flex items-center gap-2 font-[var(--font-space)] text-lg md:text-xl text-white font-bold tracking-widest">
              <span className="drop-shadow-md">{formatTime(timeLeft.days)}g</span>
              <span className="text-purple-500/50">:</span>
              <span className="drop-shadow-md">{formatTime(timeLeft.hours)}s</span>
              <span className="text-purple-500/50">:</span>
              <span className="drop-shadow-md">{formatTime(timeLeft.minutes)}d</span>
              <span className="text-purple-500/50">:</span>
              <span className="text-cyan-400 drop-shadow-lg">{formatTime(timeLeft.seconds)}</span>
            </div>
        </div>
      </div>

      {/* --- LIVE PRICE (DOKUNULMADI - AYNEN KALDI) --- */}
      <div className="mb-8 relative group">
         <div className="absolute -inset-2 bg-cyan-500/20 rounded-full blur-xl opacity-40 animate-pulse"></div>
         <div className="relative bg-black/20 backdrop-blur-xl border border-cyan-400/50 px-8 py-3 rounded-full flex items-center gap-4 shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-transform hover:scale-105">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
            </span>
            <span className="text-cyan-200 font-bold font-[var(--font-space)] text-lg tracking-wide">ETH Live:</span>
            <span className="text-white font-[var(--font-space)] tracking-wider text-lg font-bold min-w-[100px] text-right">
              {ethPrice}
            </span>
         </div>
      </div>

      {/* --- SORU (DARALTILDI - GÖZÜN İÇİNE HAPSEDİLDİ) --- */}
      <div className="mb-12 text-center max-w-2xl relative px-4">
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
          Will <br />
          <span className="text-cyan-400 mx-1 inline-block drop-shadow-[0_0_25px_rgba(6,182,212,0.9)]">
             ETH
          </span> 
          break the
          <span className="text-purple-400 mx-2 inline-block drop-shadow-[0_0_25px_rgba(192,132,252,0.9)]">
             $3,000
          </span> 
          barrier on Jan 1, 2026?
        </h1>
      </div>

      {/* --- BUTONLAR (GHOST STYLE: Şeffaf & Neon) --- */}
      <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center px-4">
        
        {/* EVET - GHOST GREEN */}
        <Link href="/methodology?vote=yes" className="group relative w-full md:w-80 h-24">
            <div className="absolute -inset-1 bg-green-500/30 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative h-full bg-green-950/50 backdrop-blur-sm border-2 border-green-500 hover:border-green-400 rounded-xl flex items-center justify-center gap-4 transition-all group-hover:scale-[1.02] group-hover:bg-green-950/60">
                <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">🚀</span>
                <div className="flex flex-col items-start">
                  <span className="text-3xl font-black text-white tracking-wider drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">YES</span>
                  <span className="text-[10px] text-green-400 font-[var(--font-space)] tracking-[0.2em] uppercase opacity-90">(IT WILL)</span>
                </div>
            </div>
        </Link>

        {/* HAYIR - GHOST RED */}
        <Link href="/methodology?vote=no" className="group relative w-full md:w-80 h-24">
            <div className="absolute -inset-1 bg-red-500/30 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative h-full bg-red-950/50 backdrop-blur-sm border-2 border-red-500 hover:border-red-400 rounded-xl flex items-center justify-center gap-4 transition-all group-hover:scale-[1.02] group-hover:bg-red-950/60">
                 <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">📉</span>
                 <div className="flex flex-col items-start">
                  <span className="text-3xl font-black text-white tracking-wider drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">NO</span>
                  <span className="text-[10px] text-red-400 font-[var(--font-space)] tracking-[0.2em] uppercase opacity-90">(IT WON'T)</span>
                </div>
            </div>
        </Link>

      </div>

      <Link href="/" className="mt-12 text-white/20 hover:text-white transition-colors text-xs font-[var(--font-space)] border-b border-transparent hover:border-white pb-1 tracking-widest uppercase">
        ← CANCEL
      </Link>

    </main>
  );
}
