'use client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export function PgcTicker() {
  const [price, setPrice] = useState(0.50);
  const [change, setChange] = useState(0);

  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      const newChange = (Math.random() - 0.48) * 0.02; // Smaller fluctuations
      setChange(newChange);
      setPrice(prev => Math.max(0.01, prev + newChange)); 
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const colorClass = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">${price.toFixed(4)}</p>
        <p className={`text-sm ${colorClass}`}>
          {(change * 100).toFixed(2)}%
        </p>
      </div>
      <Icon className={`h-8 w-8 ${colorClass}`} />
    </div>
  );
}
