'use client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// Gold price per gram in USD
const GOLD_API_URL = 'https://api.metals.live/v1/spot/gold';

export function ItcTicker() {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState(0);
  const [lastPrice, setLastPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await fetch(GOLD_API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch gold price');
        }
        const data = await response.json();
        const goldPricePerGram = data.gold;
        
        // 1 gram = 1000 mg, so price per mg is price per gram / 1000
        // 1 ITC = 10mg gold
        const itcPrice = (goldPricePerGram / 1000) * 10;
        
        setPrice(itcPrice);

        if (lastPrice !== null) {
          setChange(itcPrice - lastPrice);
        }
        setLastPrice(itcPrice);

      } catch (error) {
        console.error("Error fetching gold price:", error);
        // In case of API error, fallback to a stable price
        setPrice(0.75); 
      }
    };

    fetchGoldPrice(); // Fetch on initial render
    const interval = setInterval(fetchGoldPrice, 60000); // Fetch every minute

    return () => clearInterval(interval);
  }, [lastPrice]);
  
  const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const colorClass = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-muted-foreground';

  if (price === null) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">${price.toFixed(4)}</p>
        <p className={`text-sm ${colorClass}`}>
          {(change).toFixed(4)}
        </p>
      </div>
      <Icon className={`h-8 w-8 ${colorClass}`} />
    </div>
  );
}
