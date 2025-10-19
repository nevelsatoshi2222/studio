
'use client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// NOTE: The live API call was removed to prevent browser CORS errors.
// This component now simulates price changes like the other tickers.

export function ItcTicker() {
  const [price, setPrice] = useState(7.50); // Start with a realistic price for 100mg of gold
  const [change, setChange] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small, realistic fluctuations for gold price
      const newChange = (Math.random() - 0.5) * 0.02;
      setChange(newChange);
      setPrice(prev => Math.max(7.0, prev + newChange)); // Keep price in a realistic range
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);
  
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
