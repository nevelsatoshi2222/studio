'use client';

import { WalletProvider } from '@/components/wallet-provider';
import React from 'react';

/**
 * This is a client-side only wrapper for the main WalletProvider.
 * It ensures that all wallet connection logic, which depends on browser APIs,
 * is only executed on the client, preventing server-side rendering issues.
 */
export function ClientWalletProvider({ children }: { children: React.ReactNode }) {
    return <WalletProvider>{children}</WalletProvider>;
}
