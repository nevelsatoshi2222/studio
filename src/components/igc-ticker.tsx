'use client';
import { Network, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export function IgcTicker() {
  // Price starts at the beginning of Stage 1
  const [price, setPrice] = useState(1.001);
  const [change, setChange] = useState(0.001);

  // In a real app, this would be connected to the locker sale status
  useEffect(() => {
    const interval = setInterval(() => {
      const newChange = 0.001; // Each locker sale increases price
      setChange(newChange);
      setPrice(prev => prev + newChange); 
    }, 5000); // Simulate a locker sale every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const colorClass = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">${price.toFixed(4)}</p>
        <p className={`text-sm ${colorClass}`}>
          +${(change).toFixed(4)}
        </p>
      </div>
      <Icon className={`h-8 w-8 ${colorClass}`} />
    </div>
  );
}
