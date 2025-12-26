'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

interface RealStats {
  totalVotes: number;
  bullPercentage: number;
  bearPercentage: number;
  tribePercentage: number;
  trendChange: number;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const vote = searchParams.get('vote');
  const method = searchParams.get('method');

  const [loading, setLoading] = useState(true);
  const [realStats, setRealStats] = useState<RealStats>({
    totalVotes: 0,
    bullPercentage: 50,
    bearPercentage: 50,
    tribePercentage: 50,
    trendChange: 0,
  });
  
  // Öneri inputu ve gönderim durumu için state'ler
  const [suggestion, setSuggestion] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Sahte progress counter ve zorunlu loading ekranı
  const [progress, setProgress] = useState(0);
  const [showFakeLoading, setShowFakeLoading] = useState(true);
  
  // Chart data için state
  const [chartData, setChartData] = useState<{ points: number[]; trend: number }>({ points: [], trend: 0 });
  const [rechartsData, setRechartsData] = useState<Array<{ 
    time: string; 
    bullRate: number; 
    bearRate: number; 
    active: boolean;
    rate: number;
    totalVotes: number;
  }>>([]);
  const [votesData, setVotesData] = useState<any[]>([]);
  
  // Etkileşim durumu (Midas tarzı)
  const [activeData, setActiveData] = useState<{ 
    time: string; 
    bullRate: number; 
    bearRate: number; 
    active: boolean;
    rate: number;
    totalVotes: number;
  } | null>(null);

  // ETH Fiyat Grafiği için state'ler
  const TARGET_PRICE = 3000;
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

  // Supabase'den veri çek ve istatistikleri hesapla
  useEffect(() => {
    const fetchStats = async () => {
      // Supabase yapılandırması kontrolü
      if (!isSupabaseConfigured()) {
        console.warn('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('votes')
          .select('vote_choice, method, created_at');

        if (error) {
          console.error('Supabase hatası:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          // Hiç oy yoksa varsayılan değerler
          setRealStats({
            totalVotes: 0,
            bullPercentage: 50,
            bearPercentage: 50,
            tribePercentage: 50,
            trendChange: 0,
          });
          setLoading(false);
          return;
        }

        // İstatistikleri hesapla
        const totalVotes = data.length;
        const bullVotes = data.filter(v => v.vote_choice === 'yes').length;
        const bearVotes = data.filter(v => v.vote_choice === 'no').length;
        
        // bullPercentage: Sadece vote_choice === 'yes' olanların oranı
        const bullPercentage = totalVotes > 0 ? Math.round((bullVotes / totalVotes) * 100) : 50;
        const bearPercentage = totalVotes > 0 ? Math.round((bearVotes / totalVotes) * 100) : 50;
        
        // tribePercentage: Kullanıcının seçimiyle (vote ve method) birebir aynı olan oyların oranı
        const matchingVotes = data.filter(v => 
          v.vote_choice === vote && v.method === method
        ).length;
        let tribePercentage = 50;
        if (totalVotes > 0 && vote && method) {
          const calculated = Math.round((matchingVotes / totalVotes) * 100);
          // NaN veya Infinity kontrolü
          if (isNaN(calculated) || !isFinite(calculated)) {
            tribePercentage = 0;
          } else {
            tribePercentage = calculated;
          }
        }

        // Trend hesaplama: Son 1 saatteki değişim
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000); // 1 saat = 3600000 ms
        
        // Geçmiş oylar (1 saatten eski olanlar)
        const pastVotes = data.filter(v => {
          if (!v.created_at) return false;
          const voteTime = new Date(v.created_at).getTime();
          return voteTime < oneHourAgo;
        });
        
        // Tüm oylar (şimdiki durum)
        const currentVotes = data;
        
        // Sayıları hesapla
        const pastBullCount = pastVotes.filter(v => v.vote_choice === 'yes').length;
        const pastTotal = pastVotes.length;
        const currentBullCount = data.filter(v => v.vote_choice === 'yes').length;
        const currentTotal = data.length;
        
        // Oran hesaplama (Sıfıra bölünme hatasını önle)
        const pastRate = pastTotal > 0 ? (pastBullCount / pastTotal) * 100 : 0;
        const currentRate = currentTotal > 0 ? (currentBullCount / currentTotal) * 100 : 0;
        const trend = currentRate - pastRate;
        
        // Detaylı konsol logları (Debug için)
        console.log("--- TREND ANALİZİ ---");
        console.log("Geçmiş Toplam Oy:", pastTotal);
        console.log("Geçmiş 'EVET' Sayısı:", pastBullCount);
        console.log("Geçmiş Oran (%):", pastRate);
        console.log("Şu Anki Oran (%):", currentRate);
        console.log("Hesaplanan Trend:", trend);
        
        // Trend değişimi (yuvarlanmış)
        const trendChange = Math.round(trend);
        
        // Bull percentage'ı currentRate'e göre güncelle
        const updatedBullPercentage = Math.round(currentRate);

        setRealStats({
          totalVotes,
          bullPercentage: updatedBullPercentage,
          bearPercentage: 100 - updatedBullPercentage,
          tribePercentage,
          trendChange,
        });
        
        // Votes data'yı state'e kaydet (chart için)
        setVotesData(data || []);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Supabase verilerini otomatik yenile (her 5 saniyede bir)
    const statsInterval = setInterval(fetchStats, 5000);
    return () => clearInterval(statsInterval);
  }, []);

  // Chart data hesaplama fonksiyonu (Eski - SVG için)
  const calculateChartData = (votes: any[]) => {
    if (!votes || votes.length === 0) {
      return { points: [], trend: 0 };
    }

    // Son 1 saat içindeki oyları filtrele
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const recentVotes = votes.filter(v => {
      if (!v.created_at) return false;
      const voteTime = new Date(v.created_at).getTime();
      return voteTime >= oneHourAgo;
    });

    if (recentVotes.length === 0) {
      return { points: [], trend: 0 };
    }

    // Zaman dilimlerine böl (8 nokta)
    const numPoints = 8;
    const timeRange = now - oneHourAgo;
    const interval = timeRange / numPoints;
    
    const points: number[] = [];
    
    for (let i = 0; i < numPoints; i++) {
      const segmentStart = oneHourAgo + (i * interval);
      const segmentEnd = oneHourAgo + ((i + 1) * interval);
      
      // Bu dilimdeki oyları bul
      const segmentVotes = recentVotes.filter(v => {
        if (!v.created_at) return false;
        const voteTime = new Date(v.created_at).getTime();
        return voteTime >= segmentStart && voteTime < segmentEnd;
      });
      
      // Bu dilimdeki boğa oranını hesapla
      if (segmentVotes.length === 0) {
        // Önceki noktayı kullan veya 50% varsayılan
        points.push(points.length > 0 ? points[points.length - 1] : 50);
      } else {
        const bullCount = segmentVotes.filter(v => v.vote_choice === 'yes').length;
        const bullPercentage = Math.round((bullCount / segmentVotes.length) * 100);
        points.push(bullPercentage);
      }
    }

    // Trend hesapla (son nokta - ilk nokta)
    const trend = points.length > 0 ? points[points.length - 1] - points[0] : 0;
    
    return { points, trend };
  };

  // Recharts için kümülatif geçmiş veri işleme fonksiyonu (Running Tally)
  const calculateRechartsData = (votes: any[]) => {
    if (!votes || votes.length === 0) {
      return [];
    }

    // 1. SIRALAMA: created_at tarihine göre eskiden yeniye
    const sortedVotes = [...votes].sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    // 2. KÜMÜLATİF DÖNGÜ (Running Tally)
    let runningBull = 0;
    let runningBear = 0;

    // map ile dönerek yeni chartData dizisi oluştur
    const chartData = sortedVotes
      .filter((vote) => vote.created_at) // created_at olmayanları filtrele
      .map((vote) => {
        // DÖNGÜ İÇİNDE:
        // Eğer oy 'yes' ise runningBull'u 1 artır
        if (vote.vote_choice === 'yes') {
          runningBull++;
        } else {
          // Eğer oy 'no' ise runningBear'i 1 artır
          runningBear++;
        }

        // Toplam
        const total = runningBull + runningBear;

        // O ANKİ ORAN
        const currentBullRate = total > 0 ? Math.round((runningBull / total) * 100) : 50;

        // O ANKİ SAAT
        const time = new Date(vote.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

        // Return: Her veri noktası kendi zamanındaki skoru biliyor
        return {
          time,
          bullRate: currentBullRate,
          bearRate: 100 - currentBullRate,
          active: true,
          rate: currentBullRate, // Grafik için (bullRate ile aynı)
          totalVotes: total, // O saatteki toplam oy sayısı
        };
      });

    return chartData;
  };

  // Chart data'yı hesapla (votes data değiştiğinde)
  useEffect(() => {
    if (votesData.length > 0) {
      const chart = calculateChartData(votesData);
      setChartData(chart);
      
      // Recharts data'yı hesapla
      const recharts = calculateRechartsData(votesData);
      setRechartsData(recharts);
    } else {
      setRechartsData([]);
    }
  }, [votesData]);

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
          // Veriyi işle: [timestamp, price] formatından [time, price, timestamp] formatına çevir
          const processedData = data.prices.map(([timestamp, price]: [number, number]) => {
            const date = new Date(timestamp);
            const time = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            return {
              time,
              price: Math.round(price * 100) / 100, // 2 ondalık basamak
              timestamp,
            };
          });
          
          console.log('ETH fiyat verisi yüklendi:', processedData.length, 'nokta');
          setEthPriceData(processedData);
        } else {
          console.warn('ETH fiyat verisi boş veya geçersiz format:', data);
          setEthPriceData([]);
        }
      } catch (error) {
        console.error('ETH fiyat verisi çekilemedi:', error);
        // Hata durumunda boş array set et
        setEthPriceData([]);
      }
    };

    // İlk yükleme
    fetchEthPrice();
    
    // Her 5 saniyede bir otomatik güncelle (daha sık güncelleme)
    const interval = setInterval(fetchEthPrice, 5000);
    return () => clearInterval(interval);
  }, []);

  // Zorunlu 3 saniyelik loading ekranı - Sayfa yüklendiğinde başlar
  useEffect(() => {
    setProgress(0); // Reset progress when component mounts
    setShowFakeLoading(true); // Zorunlu loading ekranını başlat
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // 3 saniye dolduğunda fake loading'i kapat
          setTimeout(() => {
            setShowFakeLoading(false);
          }, 0);
          return 100;
        }
        return prev + 1; // Her adımda +1 artır
      });
    }, 30); // 30ms interval (100 adım * 30ms = 3000ms = 3 saniye)

    return () => clearInterval(interval);
  }, []); // Sadece component mount olduğunda çalışır

  // Başlık belirleme
  const getTitle = () => {
    if (vote === 'yes' && method === 'logic') {
      return { prefix: 'SEN BİR', highlight: 'MANTIKLI BOĞA', suffix: 'SIN!', emoji: '🐂🧠' };
    }
    if (vote === 'yes' && method === 'intuition') {
      return { prefix: 'SEN BİR', highlight: 'SEZGİSEL BOĞA', suffix: 'SIN!', emoji: '🐂🔮' };
    }
    if (vote === 'no' && method === 'logic') {
      return { prefix: 'SEN BİR', highlight: 'MANTIKLI AYI', suffix: 'SIN!', emoji: '🐻🧠' };
    }
    if (vote === 'no' && method === 'intuition') {
      return { prefix: 'SEN BİR', highlight: 'SEZGİSEL AYI', suffix: 'SIN!', emoji: '🐻🔮' };
    }
    return { prefix: 'HENÜZ KARAR VERMEDİN', highlight: '', suffix: '', emoji: '' };
  };

  const title = getTitle();

  // Custom Tooltip bileşeni (Momentum Grafiği için - Sadeleştirilmiş - Sadece saat)
  const CustomTooltip = ({ active, payload, label }: any) => {
    // Tooltip aktif olduğunda activeData'yı güncelle (Recharts'ta mouse hareketini yakalamanın en güvenilir yolu)
    useEffect(() => {
      if (active && payload && payload.length && payload[0]?.payload) {
        setActiveData(payload[0].payload);
      } else if (!active) {
        setActiveData(null);
      }
    }, [active, payload]);

    // TOOLTIP: Tooltip kutusunun içinde SADECE saat yazsın (anlık saat)
    if (active && payload && payload.length && payload[0]?.payload) {
      const time = payload[0].payload.time; // Veriden saati al
      return (
        <div className="bg-black/80 backdrop-blur border border-white/20 px-3 py-1 rounded-full">
          <p className="text-white text-xs font-space">{time}</p>
        </div>
      );
    }
    return null;
  };

  // ETH Fiyat Grafiği için Custom Tooltip
  const EthPriceTooltip = ({ active, payload, label }: any) => {
    // Tooltip aktif olduğunda activeEthData'yı güncelle
    useEffect(() => {
      if (active && payload && payload.length && payload[0]?.payload) {
        setActiveEthData(payload[0].payload);
      } else if (!active) {
        setActiveEthData(null);
      }
    }, [active, payload]);

    // TOOLTIP: Tooltip kutusunun içinde SADECE saat yazsın
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

  // Tahminimi Paylaş fonksiyonu
  const shareOnWarpcast = () => {
    if (!vote) return;
    
    // Paylaşım metni oluştur
    const direction = vote === 'yes' ? 'ÜSTÜ' : 'ALTI';
    const animal = vote === 'yes' ? 'BOĞA' : 'AYI';
    
    const shareText = `1 Ocak ETH Tahminim: $3.000 ${direction}! (${animal}) 🚀 Acaba topluluğun çoğunluğu doğru mu bilecek? Sen de katıl: https://crowd-oracle.vercel.app`;
    
    // Warpcast compose URL'i
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
    
    // Yeni sekmede aç
    window.open(warpcastUrl, '_blank');
  };

  // Öneri gönder fonksiyonu
  const handleSuggestion = async () => {
    // Input boşsa işlem yapma
    if (!suggestion.trim()) return;
    
    // Supabase yapılandırması kontrolü
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. Cannot send suggestion.');
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
      return;
    }
    
    setStatus('idle');
    
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .insert({ content: suggestion });
      
      if (error) {
        console.error('Öneri gönderme hatası:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setStatus('error');
        // 3 saniye sonra eski haline dön
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
        return;
      }
      
      // Başarılı
      setStatus('success');
      setSuggestion(''); // Input temizle
      
      // 3 saniye sonra eski haline dön
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Öneri gönderme hatası:', error);
      setStatus('error');
      // 3 saniye sonra eski haline dön
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  };

  // Loading durumu - Hem gerçek veri yüklenene kadar hem de zorunlu 4 saniye dolana kadar göster
  if (loading || showFakeLoading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8">
        <main className="w-full max-w-md flex flex-col items-center gap-8">
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.15)] p-10 flex flex-col items-center justify-center gap-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400 border-l-transparent border-r-transparent shadow-[0_0_20px_#06b6d4]"></div>
            <p className="text-2xl font-black text-white tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              Veriler Analiz Ediliyor...
            </p>
            <div className="text-4xl md:text-6xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              %{progress}
            </div>
            <p className="text-xs font-space text-cyan-200/60 animate-pulse">
              {progress <= 30 ? 'Blokzincir taranıyor...' : progress <= 60 ? 'Veriler doğrulanıyor...' : progress <= 90 ? 'Yapay zeka tahminleri işleniyor...' : 'Sonuçlar hazırlanıyor...'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-4 lg:px-8 lg:py-8">
      <main className="w-full max-w-7xl flex flex-col items-center gap-4 lg:gap-8">
        {/* Başlık */}
        <h1 className="text-3xl md:text-5xl font-black text-center text-white mb-4 drop-shadow-2xl">
          {title.highlight ? (
            <>
              {title.prefix} <span className="text-yellow-400">[{title.highlight}]</span>{title.suffix} {title.emoji}
            </>
          ) : (
            title.prefix
          )}
        </h1>

        {/* İstatistik Kartları */}
        <div className="w-full flex flex-col sm:flex-row gap-4 lg:gap-6">
          {/* Kutu 1: Karar Mekanizması - Logic vs Intuition Bar */}
          <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(124,58,237,0.1)] p-4 md:p-6 lg:p-8">
            {(() => {
              // Logic ve Intuition sayılarını hesapla
              const logicCount = votesData.filter(v => v.method === 'logic').length;
              const intuitionCount = votesData.filter(v => v.method === 'intuition').length;
              const totalMethodVotes = logicCount + intuitionCount;
              const logicRate = totalMethodVotes > 0 ? Math.round((logicCount / totalMethodVotes) * 100) : 50;
              const intuitionRate = totalMethodVotes > 0 ? Math.round((intuitionCount / totalMethodVotes) * 100) : 50;
              
              return (
                <>
                  <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-space mb-4">KARAR MEKANİZMASI</p>
                  
                  {/* Bar Chart */}
                  <div className="relative w-full h-8 rounded-lg overflow-hidden mb-3">
                    {/* Sol Kısım (Mantık) */}
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${logicRate}%` }}
                    ></div>
                    {/* Sağ Kısım (Sezgi) */}
                    <div 
                      className="absolute right-0 top-0 h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
                      style={{ width: `${intuitionRate}%` }}
                    ></div>
                  </div>
                  
                  {/* Yüzde Yazıları */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-orange-400 font-black font-space">Mantık %{logicRate}</span>
                    <span className="text-purple-400 font-black font-space">Sezgi %{intuitionRate}</span>
                  </div>
                  
                  <p className="text-xs text-white/40 mt-2 font-space">{realStats.totalVotes} oy</p>
                </>
              );
            })()}
          </div>

          {/* Kutu 2: Senin Kabilen */}
          <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(124,58,237,0.1)] p-4 md:p-6 lg:p-8">
            <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-space mb-2">Senin Kabilen</p>
            <p className="text-4xl md:text-6xl font-black text-yellow-400 font-space drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
              %{isNaN(realStats.tribePercentage) || !isFinite(realStats.tribePercentage) ? 0 : realStats.tribePercentage}
            </p>
            <p className="text-xs text-white/40 mt-2">Kitle içinde seninle tıpatıp aynı düşünenlerin oranı</p>
          </div>
        </div>

        {/* Grafikler - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full max-w-7xl mt-6">
          {/* SOL TARAF: Momentum Grafiği */}
          <div className="relative w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(124,58,237,0.1)] overflow-hidden p-2 md:p-4">
          {/* 1. BİLGİ BAŞLIĞI (Grafiğin Üstünde) */}
          {rechartsData.length > 0 ? (
            <div className="flex flex-col mb-2 px-2">
              {(() => {
                // Gösterilecek Veri: activeData varsa onu, yoksa en son veriyi, hiçbiri yoksa varsayılan
                const displayData = activeData || rechartsData[rechartsData.length - 1] || { bullRate: 0, bearRate: 0, time: '---', totalVotes: 0 };
                
                return (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-[10px] md:text-xs font-space uppercase tracking-[0.2em]">
                        {activeData ? `GEÇMİŞ (${displayData.time})` : 'ŞU AN'}
                      </span>
                      <span className="text-white/30 text-[10px] md:text-xs font-space">
                        {displayData.totalVotes || 0} oy
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      {/* BOĞA (Her zaman YEŞİL) */}
                      <div className="flex flex-col">
                        <span className="text-4xl md:text-6xl font-black text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                          %{displayData.bullRate}
                        </span>
                        <span className="text-[10px] text-green-300/70 font-space tracking-widest uppercase">BOĞA</span>
                      </div>
                      
                      {/* AYIRICI ÇİZGİ */}
                      <div className="h-8 w-px bg-white/10"></div>

                      {/* AYI (Her zaman KIRMIZI) */}
                      <div className="flex flex-col">
                        <span className="text-4xl md:text-6xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                          %{displayData.bearRate}
                        </span>
                        <span className="text-[10px] text-red-300/70 font-space tracking-widest uppercase">AYI</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 md:h-96 text-white/40 text-sm font-space">
              Henüz veri oluşmadı
            </div>
          )}

          {/* 2. GRAFİK ALANI (ResponsiveContainer) */}
          {rechartsData.length > 0 && (
            <div className="h-64 md:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={rechartsData} 
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  onMouseMove={(e: any) => {
                    // ETKİLEŞİM: onMouseMove olayında - Recharts event yapısını kontrol et
                    if (e?.activePayload && e.activePayload.length > 0 && e.activePayload[0]?.payload) {
                      setActiveData(e.activePayload[0].payload);
                    }
                  }}
                  onMouseLeave={() => {
                    // ETKİLEŞİM: onMouseLeave olayında
                    setActiveData(null);
                  }}
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
          )}
          </div>

          {/* SAĞ TARAF: ETH Fiyat Grafiği */}
          <div className="relative w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(124,58,237,0.1)] overflow-hidden p-2 md:p-4">
            {/* 1. BİLGİ BAŞLIĞI (Grafiğin Üstünde) */}
            {ethPriceData.length > 0 ? (
              <div className="flex flex-col mb-2 px-2">
                {(() => {
                  // Gösterilecek Veri: activeEthData varsa onu, yoksa en son veriyi
                  const displayEthData = activeEthData || ethPriceData[ethPriceData.length - 1] || { time: '---', price: 0 };
                  const currentPrice = displayEthData.price;
                  const isAboveTarget = currentPrice >= TARGET_PRICE;
                  
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-[10px] md:text-xs font-space uppercase tracking-[0.2em]">
                          {activeEthData ? `GEÇMİŞ (${displayEthData.time})` : 'ŞU AN'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex flex-col">
                          <span className={`text-4xl md:text-6xl font-black drop-shadow-[0_0_10px_rgba(${isAboveTarget ? '34,197,94' : '239,68,68'},0.5)] ${isAboveTarget ? 'text-green-500' : 'text-red-500'}`}>
                            ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className={`text-[10px] font-space tracking-widest uppercase ${isAboveTarget ? 'text-green-300/70' : 'text-red-300/70'}`}>
                            ETH FİYAT
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 md:h-96 text-white/40 text-sm font-space">
                Fiyat verisi yükleniyor...
              </div>
            )}

            {/* 2. GRAFİK ALANI (ResponsiveContainer) */}
            {ethPriceData.length > 0 && (
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
                    onMouseLeave={() => {
                      setActiveEthData(null);
                    }}
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
                        // Fiyat aralığını daralt - min ve max değerleri hesapla (TARGET_PRICE'ı da dahil et)
                        if (ethPriceData.length === 0) return ['auto', 'auto'];
                        const prices = ethPriceData.map(d => d.price);
                        const minPrice = Math.min(...prices, TARGET_PRICE);
                        const maxPrice = Math.max(...prices, TARGET_PRICE);
                        const range = maxPrice - minPrice;
                        // %10 padding ekle ama çok daraltma
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
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-grow min-h-[1rem]"></div>

        {/* Aksiyon Alanı */}
        <div className="w-full flex flex-col gap-3 md:gap-4">
          {/* Paylaş Butonu */}
          <button 
            onClick={shareOnWarpcast}
            className="group relative w-full h-12 md:h-14 rounded-3xl overflow-hidden"
          >
            <div className="absolute -inset-1 bg-purple-500/30 rounded-3xl blur-lg opacity-20 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative h-full bg-purple-950/50 backdrop-blur-sm border-2 border-purple-500 hover:border-purple-400 rounded-3xl flex items-center justify-center gap-2 md:gap-3 transition-all group-hover:scale-[1.02] group-hover:bg-purple-950/60">
              <span className="text-xl md:text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">📢</span>
              <span className="text-base md:text-lg lg:text-xl font-black text-white tracking-wider drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Tahminimi Paylaş</span>
            </div>
          </button>

          {/* Input Alanı */}
          <div className="w-full flex gap-2 md:gap-3">
            <input
              type="text"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Bir sonraki soru ne olsun?"
              className="flex-1 px-3 md:px-4 h-12 md:h-14 bg-transparent border-b-2 border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors font-space text-sm md:text-base"
            />
            <button 
              onClick={handleSuggestion}
              className="group relative h-12 md:h-14 rounded-3xl overflow-hidden"
            >
              <div className="absolute -inset-1 bg-purple-500/30 rounded-3xl blur-lg opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-purple-950/50 backdrop-blur-sm border-2 border-purple-500 hover:border-purple-400 rounded-3xl px-4 md:px-6 h-full flex items-center justify-center transition-all group-hover:scale-[1.02] group-hover:bg-purple-950/60">
                <span className="text-white font-black font-space tracking-wider text-sm md:text-base">
                  {status === 'success' ? 'Gönderildi ✅' : status === 'error' ? 'Hata!' : 'GÖNDER'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8">
        <main className="w-full max-w-md flex flex-col items-center gap-8">
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.15)] p-10 flex flex-col items-center justify-center gap-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400 border-l-transparent border-r-transparent shadow-[0_0_20px_#06b6d4]"></div>
            <p className="text-2xl font-black text-white tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              Yükleniyor...
            </p>
          </div>
        </main>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

