'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

const TARGET_PRICE = 3000;

export default function LockdownPage() {
  // Kullanıcının oyu için state
  const [userVote, setUserVote] = useState<{ vote: string; method: string } | null>(null);
  
  // Momentum grafiği için state'ler
  const [rechartsData, setRechartsData] = useState<Array<{ 
    time: string; 
    bullRate: number; 
    bearRate: number; 
    rate: number;
    totalVotes: number;
  }>>([]);
  const [activeData, setActiveData] = useState<{ 
    time: string; 
    bullRate: number; 
    bearRate: number; 
    rate: number;
    totalVotes: number;
  } | null>(null);
  
  // ETH Fiyat Grafiği için state'ler
  const [ethPriceData, setEthPriceData] = useState<Array<{
    time: string;
    price: number;
    timestamp: number;
  }>>([]);
  const [activeEthData, setActiveEthData] = useState<{
    time: string;
    price: number;
    timestamp: number;
  } | null>(null);
  
  // İstatistikler için state
  const [stats, setStats] = useState({
    totalVotes: 0,
    bullPercentage: 50,
    bearPercentage: 50,
    logicPercentage: 50,
    intuitionPercentage: 50,
    logicBulls: 0,
    logicBears: 0,
    intuitionBulls: 0,
    intuitionBears: 0,
  });

  // Geri sayım için state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Kümülatif grafik verisi hesaplama (Dashboard'dan kopyalandı)
  const calculateRechartsData = (votes: any[]) => {
    if (!votes || votes.length === 0) {
      return [];
    }

    // 1. SIRALAMA: created_at'e göre ESKİDEN YENİYE
    const sortedVotes = [...votes].sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    // 2. KÜMÜLATİF DÖNGÜ (Running Tally)
    let runningBull = 0;
    let runningBear = 0;

    const chartData = sortedVotes
      .filter((vote) => vote.created_at)
      .map((vote) => {
        if (vote.vote_choice === 'yes') {
          runningBull++;
        } else {
          runningBear++;
        }

        const total = runningBull + runningBear;
        const currentBullRate = total > 0 ? Math.round((runningBull / total) * 100) : 50;
        const time = new Date(vote.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

        return {
          time,
          bullRate: currentBullRate,
          bearRate: 100 - currentBullRate,
          rate: currentBullRate,
          totalVotes: total,
        };
      });

    return chartData;
  };

  // Veri çekme useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Kullanıcının son oyunu çek (localStorage'dan veya Supabase'den son oy)
        const voteData = localStorage.getItem('crowd-oracle-vote');
        if (voteData) {
          try {
            const data = JSON.parse(voteData);
            setUserVote({ vote: data.vote || '', method: data.method || '' });
          } catch (e) {
            console.error('localStorage parse hatası:', e);
          }
        }

        // 2. Supabase'den tüm oyları çek
        const { data: votesData, error: votesError } = await supabase
          .from('votes')
          .select('vote_choice, method, created_at')
          .order('created_at', { ascending: true });

        if (votesError) {
          console.error('Supabase hatası:', votesError);
          return;
        }

        if (votesData && votesData.length > 0) {
          // Momentum grafiği verisini hesapla
          const chartData = calculateRechartsData(votesData);
          setRechartsData(chartData);

          // İstatistikleri hesapla
          const totalVotes = votesData.length;
          const bullVotes = votesData.filter(v => v.vote_choice === 'yes').length;
          const bearVotes = votesData.filter(v => v.vote_choice === 'no').length;
          const logicVotes = votesData.filter(v => v.method === 'logic').length;
          const intuitionVotes = votesData.filter(v => v.method === 'intuition').length;

          // Mantıklı düşünenlerin içindeki Boğa/Ayı oranı
          const logicVotesData = votesData.filter(v => v.method === 'logic');
          const logicBullsCount = logicVotesData.filter(v => v.vote_choice === 'yes').length;
          const logicBulls = logicVotesData.length > 0 ? Math.round((logicBullsCount / logicVotesData.length) * 100) : 0;
          const logicBears = logicVotesData.length > 0 ? 100 - logicBulls : 0;

          // Sezgicilerin içindeki Boğa/Ayı oranı
          const intuitionVotesData = votesData.filter(v => v.method === 'intuition');
          const intuitionBullsCount = intuitionVotesData.filter(v => v.vote_choice === 'yes').length;
          const intuitionBulls = intuitionVotesData.length > 0 ? Math.round((intuitionBullsCount / intuitionVotesData.length) * 100) : 0;
          const intuitionBears = intuitionVotesData.length > 0 ? 100 - intuitionBulls : 0;

          setStats({
            totalVotes,
            bullPercentage: totalVotes > 0 ? Math.round((bullVotes / totalVotes) * 100) : 50,
            bearPercentage: totalVotes > 0 ? Math.round((bearVotes / totalVotes) * 100) : 50,
            logicPercentage: totalVotes > 0 ? Math.round((logicVotes / totalVotes) * 100) : 50,
            intuitionPercentage: totalVotes > 0 ? Math.round((intuitionVotes / totalVotes) * 100) : 50,
            logicBulls: isNaN(logicBulls) || !isFinite(logicBulls) ? 0 : logicBulls,
            logicBears: isNaN(logicBears) || !isFinite(logicBears) ? 0 : logicBears,
            intuitionBulls: isNaN(intuitionBulls) || !isFinite(intuitionBulls) ? 0 : intuitionBulls,
            intuitionBears: isNaN(intuitionBears) || !isFinite(intuitionBears) ? 0 : intuitionBears,
          });
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchData();
    
    // Her 5 saniyede bir otomatik güncelle
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ETH Fiyat verisini CoinGecko API'den çek
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.prices && Array.isArray(data.prices) && data.prices.length > 0) {
          const processedData = data.prices.map(([timestamp, price]: [number, number]) => {
            const date = new Date(timestamp);
            const time = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            return {
              time,
              price: Math.round(price * 100) / 100,
              timestamp,
            };
          });
          
          setEthPriceData(processedData);
        } else {
          setEthPriceData([]);
        }
      } catch (error) {
        console.error('ETH fiyat verisi çekilemedi:', error);
        setEthPriceData([]);
      }
    };

    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 5000);
    return () => clearInterval(interval);
  }, []);

  // Geri sayım sayacı (1 Ocak 2026 00:00)
  useEffect(() => {
    const targetDate = new Date('2026-01-01T00:00:00').getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Custom Tooltip (Momentum Grafiği)
  const CustomTooltip = ({ active, payload }: any) => {
    useEffect(() => {
      if (active && payload && payload.length && payload[0]?.payload) {
        setActiveData(payload[0].payload);
      } else if (!active) {
        setActiveData(null);
      }
    }, [active, payload]);

    if (active && payload && payload.length && payload[0]?.payload) {
      const time = payload[0].payload.time;
      return (
        <div className="bg-black/80 backdrop-blur border border-white/20 px-3 py-1 rounded-full">
          <p className="text-white text-xs font-space">{time}</p>
        </div>
      );
    }
    return null;
  };

  // ETH Fiyat Grafiği için Custom Tooltip
  const EthPriceTooltip = ({ active, payload }: any) => {
    useEffect(() => {
      if (active && payload && payload.length && payload[0]?.payload) {
        setActiveEthData(payload[0].payload);
      } else if (!active) {
        setActiveEthData(null);
      }
    }, [active, payload]);

    if (active && payload && payload.length && payload[0]?.payload) {
      const time = payload[0].payload.time;
      return (
        <div className="bg-black/80 backdrop-blur border border-white/20 px-3 py-1 rounded-full">
          <p className="text-white text-xs font-space">{time}</p>
        </div>
      );
    }
    return null;
  };

  // Kullanıcının oy metnini oluştur
  const getUserVoteText = () => {
    if (!userVote || !userVote.vote || !userVote.method) {
      return { text: 'NO VOTE', color: 'text-gray-400' };
    }
    
    const voteText = userVote.vote === 'yes' ? 'BULL' : 'BEAR';
    const methodText = userVote.method === 'logic' ? 'LOGICAL' : 'INTUITIVE';
    
    let color = 'text-white';
    if (userVote.vote === 'yes') {
      color = userVote.method === 'logic' ? 'text-orange-400' : 'text-green-400';
    } else {
      color = userVote.method === 'logic' ? 'text-orange-400' : 'text-purple-400';
    }
    
    return { text: `You are a ${voteText}`, color };
  };

  const userVoteInfo = getUserVoteText();

  // Öneri gönder fonksiyonu
  const [suggestion, setSuggestion] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSuggestion = async () => {
    if (!suggestion.trim()) return;
    
    setStatus('idle');
    
    try {
      const { error } = await supabase
        .from('suggestions')
        .insert({ content: suggestion });
      
      if (error) {
        console.error('Öneri gönderme hatası:', error);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
        return;
      }
      
      setStatus('success');
      setSuggestion('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Öneri gönderme hatası:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8">
      <main className="flex flex-col gap-6 p-4 md:p-8 w-full max-w-4xl mx-auto mt-10 mb-20">
        
        {/* 1. EN ÜST: Kullanıcının Oyu & Başlık */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] p-6">
          {/* EĞER OY VARSA: "Sen Bir X'sin" kartını göster */}
          {userVote && userVote.vote && userVote.method ? (
            <>
              <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-space mb-2">YOUR VOTE</p>
              <h2 className={`text-3xl md:text-5xl font-black ${userVoteInfo.color} mb-4 drop-shadow-[0_0_10px_currentColor]`}>
                {userVoteInfo.text}
              </h2>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">
                VOTING ENDED. RESULTS PENDING.
              </h1>
            </>
          ) : (
            /* EĞER OY YOKSA: "Kapılar Kapandı" mesajı */
            <>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2">
                GATES CLOSED.
              </h1>
              <p className="text-base md:text-lg text-white/70 font-medium font-space mb-4">
                The prophecy process has begun. Now you can only witness.
              </p>
            </>
          )}
          
          {/* Geri Sayım Sayacı (Her durumda göster) */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] p-4 md:p-6 mt-4">
            <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-space mb-3 text-center">
              REVEAL IN:
            </p>
            {timeLeft ? (
              <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-5xl font-black font-space text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-xs md:text-sm text-white/60 font-space uppercase tracking-wider mt-1">Days</span>
                </div>
                <span className="text-2xl md:text-4xl text-white/40 font-space">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-5xl font-black font-space text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-xs md:text-sm text-white/60 font-space uppercase tracking-wider mt-1">Hours</span>
                </div>
                <span className="text-2xl md:text-4xl text-white/40 font-space">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-5xl font-black font-space text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-xs md:text-sm text-white/60 font-space uppercase tracking-wider mt-1">Minutes</span>
                </div>
                <span className="text-2xl md:text-4xl text-white/40 font-space">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-5xl font-black font-space text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-xs md:text-sm text-white/60 font-space uppercase tracking-wider mt-1">Seconds</span>
                </div>
              </div>
            ) : (
              <p className="text-center text-white/60 font-space">Calculating...</p>
            )}
            <p className="text-xs text-white/40 text-center mt-3 font-space">January 1, 2026 00:00</p>
          </div>
        </div>

        {/* 2. BÜYÜK GRAFİKLER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Momentum Grafiği */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden p-2 md:p-4">
            {rechartsData.length > 0 ? (
              <>
                <div className="flex flex-col mb-2 px-2">
                  {(() => {
                    const displayData = activeData || rechartsData[rechartsData.length - 1] || { bullRate: 0, bearRate: 0, time: '---', totalVotes: 0 };
                    return (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 text-[10px] md:text-xs font-space uppercase tracking-[0.2em]">
                            {activeData ? `PAST (${displayData.time})` : 'NOW'}
                          </span>
                          <span className="text-white/30 text-[10px] md:text-xs font-space">
                            {displayData.totalVotes || 0} votes
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex flex-col">
                            <span className="text-4xl md:text-6xl font-black text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                              %{displayData.bullRate}
                            </span>
                            <span className="text-[10px] text-green-300/70 font-space tracking-widest uppercase">BULL</span>
                          </div>
                          <div className="h-8 w-px bg-white/10"></div>
                          <div className="flex flex-col">
                            <span className="text-4xl md:text-6xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                              %{displayData.bearRate}
                            </span>
                            <span className="text-[10px] text-red-300/70 font-space tracking-widest uppercase">BEAR</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="h-64 md:h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={rechartsData} 
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      onMouseMove={(e: any) => {
                        if (e?.activePayload && e.activePayload.length > 0 && e.activePayload[0]?.payload) {
                          setActiveData(e.activePayload[0].payload);
                        }
                      }}
                      onMouseLeave={() => setActiveData(null)}
                    >
                      <defs>
                        <linearGradient id="colorBull" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(34, 197, 94, 0.5)" />
                          <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                        </linearGradient>
                        <linearGradient id="colorBear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(239, 68, 68, 0.5)" />
                          <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="0 0" stroke="transparent" />
                      <XAxis hide />
                      <YAxis hide />
                      <ReferenceLine y={50} stroke="white" strokeDasharray="3 3" opacity={0.2} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke={(() => {
                          const displayData = activeData || (rechartsData.length > 0 ? rechartsData[rechartsData.length - 1] : null);
                          const rate = displayData?.rate || 50;
                          return rate >= 50 ? "#22c55e" : "#ef4444";
                        })()}
                        fill={(() => {
                          const displayData = activeData || (rechartsData.length > 0 ? rechartsData[rechartsData.length - 1] : null);
                          const rate = displayData?.rate || 50;
                          return rate >= 50 ? "url(#colorBull)" : "url(#colorBear)";
                        })()}
                        strokeWidth={3}
                        activeDot={{
                          r: 6,
                          strokeWidth: 0,
                          fill: 'white',
                          filter: 'drop-shadow(0 0 10px currentColor)'
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-space text-center mt-2 px-2">
                  PRICE EXPECTATION (MOMENTUM)
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 md:h-96 text-white/40 text-sm font-space">
                Loading data...
              </div>
            )}
          </div>

          {/* ETH Fiyat Grafiği */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden p-2 md:p-4">
            {ethPriceData.length > 0 ? (
              <>
                <div className="flex flex-col mb-2 px-2">
                  {(() => {
                    const displayEthData = activeEthData || ethPriceData[ethPriceData.length - 1] || { time: '---', price: 0 };
                    const currentPrice = displayEthData.price;
                    const isAboveTarget = currentPrice >= TARGET_PRICE;
                    return (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 text-[10px] md:text-xs font-space uppercase tracking-[0.2em]">
                            {activeEthData ? `PAST (${displayEthData.time})` : 'NOW'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex flex-col">
                            <span className={`text-4xl md:text-6xl font-black drop-shadow-[0_0_10px_rgba(${isAboveTarget ? '34,197,94' : '239,68,68'},0.5)] ${isAboveTarget ? 'text-green-500' : 'text-red-500'}`}>
                              ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className={`text-[10px] font-space tracking-widest uppercase ${isAboveTarget ? 'text-green-300/70' : 'text-red-300/70'}`}>
                              ETH PRICE
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="h-64 md:h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={ethPriceData} 
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      onMouseMove={(e: any) => {
                        if (e?.activePayload && e.activePayload.length > 0 && e.activePayload[0]?.payload) {
                          setActiveEthData(e.activePayload[0].payload);
                        }
                      }}
                      onMouseLeave={() => setActiveEthData(null)}
                    >
                      <defs>
                        <linearGradient id="colorEthGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(34, 197, 94, 0.5)" />
                          <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                        </linearGradient>
                        <linearGradient id="colorEthRed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(239, 68, 68, 0.5)" />
                          <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="0 0" stroke="transparent" />
                      <XAxis hide />
                      <YAxis 
                        hide
                        domain={(() => {
                          if (ethPriceData.length === 0) return ['auto', 'auto'];
                          const prices = ethPriceData.map(d => d.price);
                          const minPrice = Math.min(...prices, TARGET_PRICE);
                          const maxPrice = Math.max(...prices, TARGET_PRICE);
                          const range = maxPrice - minPrice;
                          const padding = range * 0.1;
                          return [minPrice - padding, maxPrice + padding];
                        })()}
                      />
                      <ReferenceLine 
                        y={TARGET_PRICE} 
                        stroke="white" 
                        strokeDasharray="3 3" 
                        strokeWidth={1.5}
                        opacity={0.6}
                      />
                      <Tooltip content={<EthPriceTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={(() => {
                          const displayEthData = activeEthData || (ethPriceData.length > 0 ? ethPriceData[ethPriceData.length - 1] : null);
                          const price = displayEthData?.price || 0;
                          return price >= TARGET_PRICE ? "#22c55e" : "#ef4444";
                        })()}
                        fill={(() => {
                          const displayEthData = activeEthData || (ethPriceData.length > 0 ? ethPriceData[ethPriceData.length - 1] : null);
                          const price = displayEthData?.price || 0;
                          return price >= TARGET_PRICE ? "url(#colorEthGreen)" : "url(#colorEthRed)";
                        })()}
                        strokeWidth={3}
                        activeDot={{
                          r: 6,
                          strokeWidth: 0,
                          fill: 'white',
                          filter: 'drop-shadow(0 0 10px currentColor)'
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-space text-center mt-2 px-2">
                  ETH PRICE TARGET ($3,000)
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 md:h-96 text-white/40 text-sm font-space">
                Loading price data...
              </div>
            )}
          </div>
        </div>

        {/* 3. İSTATİSTİK BARLARI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Karar Mekanizması (Genel) */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] p-4 md:p-6">
            <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-space mb-4">DECISION MECHANISM</p>
            <div className="relative w-full h-8 rounded-lg overflow-hidden mb-3">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                style={{ width: `${stats.logicPercentage}%` }}
              ></div>
              <div 
                className="absolute right-0 top-0 h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
                style={{ width: `${stats.intuitionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-orange-400 font-black font-space">Logic %{stats.logicPercentage}</span>
              <span className="text-purple-400 font-black font-space">Intuition %{stats.intuitionPercentage}</span>
            </div>
            <p className="text-xs text-white/40 mt-2 font-space">{stats.totalVotes} votes</p>
          </div>

          {/* Karar Mekanizması Detayı */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] p-4 md:p-6">
            <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-space mb-4">DECISION MECHANISM DETAILS</p>
            
            {/* Mantıklı Düşünenler */}
            <div className="mb-4">
              <p className="text-xs text-orange-300/80 font-space mb-2">LOGICAL THINKERS</p>
              <div className="relative w-full h-8 rounded-lg overflow-hidden mb-2">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 flex items-center justify-start pl-3"
                  style={{ width: `${stats.logicBulls}%` }}
                >
                  <span className="text-xs font-black text-white drop-shadow-md">%{stats.logicBulls} BULLISH</span>
                </div>
                <div 
                  className="absolute right-0 top-0 h-full bg-gradient-to-r from-orange-600 to-red-500 transition-all duration-500 flex items-center justify-end pr-3"
                  style={{ width: `${stats.logicBears}%` }}
                >
                  <span className="text-xs font-black text-white drop-shadow-md">%{stats.logicBears} BEARISH</span>
                </div>
              </div>
            </div>

            {/* Hislerine Güvenenler */}
            <div>
              <p className="text-xs text-purple-300/80 font-space mb-2">INTUITIVE THINKERS</p>
              <div className="relative w-full h-8 rounded-lg overflow-hidden mb-2">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 flex items-center justify-start pl-3"
                  style={{ width: `${stats.intuitionBulls}%` }}
                >
                  <span className="text-xs font-black text-white drop-shadow-md">%{stats.intuitionBulls} BULLISH</span>
                </div>
                <div 
                  className="absolute right-0 top-0 h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 flex items-center justify-end pr-3"
                  style={{ width: `${stats.intuitionBears}%` }}
                >
                  <span className="text-xs font-black text-white drop-shadow-md">%{stats.intuitionBears} BEARISH</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. ALT KISIM: İstek/Soru Gönderme */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] p-4 md:p-6">
          <div className="w-full flex gap-2 md:gap-3">
            <input
              type="text"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Suggest the next prophecy..."
              className="flex-1 px-3 md:px-4 h-12 md:h-14 bg-transparent border-b-2 border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors font-space text-sm md:text-base"
            />
            <button 
              onClick={handleSuggestion}
              className="group relative h-12 md:h-14 rounded-3xl overflow-hidden"
            >
              <div className="absolute -inset-1 bg-purple-500/30 rounded-3xl blur-lg opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-purple-950/50 backdrop-blur-sm border-2 border-purple-500 hover:border-purple-400 rounded-3xl px-4 md:px-6 h-full flex items-center justify-center transition-all group-hover:scale-[1.02] group-hover:bg-purple-950/60">
                <span className="text-white font-black font-space tracking-wider text-sm md:text-base">
                  {status === 'success' ? 'Sent ✅' : status === 'error' ? 'Error!' : 'SEND'}
                </span>
              </div>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
