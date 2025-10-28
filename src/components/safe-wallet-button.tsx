
'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

// Use dynamic import with ssr: false for the entire WalletMultiButton component.
// This is the most reliable way to prevent server-side rendering issues.
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { 
    ssr: false,
    // Add a loading skeleton to provide better UX while the button loads on the client.
    loading: () => <div className="w-24 h-9 rounded-lg bg-muted animate-pulse" /> 
  }
);

export function SafeWalletButton() {
  // Although dynamic import handles SSR, keeping this check adds an extra layer of safety
  // to ensure we don't attempt to render anything until the client has mounted.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or nothing on the server and during initial hydration.
    return <div className="w-24 h-9 rounded-lg bg-muted animate-pulse" />;
  }

  return <WalletMultiButtonDynamic />;
}
