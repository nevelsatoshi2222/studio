'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

/**
 * A wrapper for the WalletMultiButton that ensures it only renders on the client-side
 * to prevent Next.js hydration errors.
 */
export function WalletButton() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <WalletMultiButton /> : null;
}
