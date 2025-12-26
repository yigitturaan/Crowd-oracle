'use client';

import { useState, useEffect } from 'react';

export default function LivePrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot');
        const data = await response.json();
        
        if (data.data && data.data.amount) {
          setPrice(parseFloat(data.data.amount));
          setLoading(false);
          setError(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    // İlk yükleme
    fetchPrice();

    // Her 5 saniyede bir güncelle
    const interval = setInterval(fetchPrice, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="rounded-xl bg-[#1e293b] border border-[#334155] px-4 py-3 flex items-center gap-3">
      {/* Canlı göstergesi - pulse animasyonlu yeşil nokta */}
      <div className="relative">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
      </div>

      {/* Fiyat */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Live:</span>
        {loading ? (
          <span className="text-sm text-gray-500">Yükleniyor...</span>
        ) : error ? (
          <span className="text-sm text-red-400">Hata</span>
        ) : price !== null ? (
          <span className="text-base font-semibold text-white transition-all duration-300">
            {formatPrice(price)}
          </span>
        ) : (
          <span className="text-sm text-gray-500">Yükleniyor...</span>
        )}
      </div>
    </div>
  );
}

