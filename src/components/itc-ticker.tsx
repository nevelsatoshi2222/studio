'use client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export function ItcTicker() {
  const [price, setPrice] = useState(1.00);
  const [change, setChange] = useState(0);

  // In a real app, you'd use a WebSocket or API calls here
  useEffect(() => {
    const interval = setInterval(() => {
      const newChange = (Math.random() - 0.5) * 0.001; // Tiny fluctuation
      setChange(newChange);
      setPrice(prev => Math.max(0.99, Math.min(1.01, prev + newChange))); // Keep it pegged
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const Icon = change > 0.0001 ? TrendingUp : change < -0.0001 ? TrendingDown : Minus;
  const colorClass = change > 0.0001 ? 'text-green-500' : change < -0.0001 ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">${price.toFixed(4)}</p>
        <p className={`text-sm ${colorClass}`}>
          {(change * 100).toFixed(4)}%
        </p>
      </div>
      <Icon className={`h-8 w-8 ${colorClass}`} />
    </div>
  );
}