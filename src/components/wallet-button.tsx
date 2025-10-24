'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useState, useEffect } from 'react';

/**
 * A wrapper for the WalletMultiButton that ensures it only renders on the client-side
 * to prevent Next.js hydration errors. It uses a mounted state to delay rendering
 * until after the initial client render.
 */
export function WalletButton() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // On the server or during the initial client render, render nothing or a placeholder.
  // Once mounted on the client, render the actual button.
  if (!isMounted) {
    return null; 
  }

  return <WalletMultiButton />;
}
