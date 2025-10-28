'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// The WalletMultiButton is dynamically imported with SSR (Server-Side Rendering) turned off.
// This is a crucial step to prevent hydration errors and "stuck connecting" issues
// by ensuring the wallet button, which relies on browser APIs, only ever renders on the client.
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

/**
 * A wrapper for the WalletMultiButton that ensures it only renders on the client-side
 * using Next.js dynamic import with SSR disabled.
 */
export function WalletButton() {
  return <WalletMultiButtonDynamic />;
}
