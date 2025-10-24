'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

/**
 * A wrapper for the WalletMultiButton that ensures it only renders on the client-side
 * to prevent Next.js hydration errors. This component is now simplified to directly
 * render the button, as the check for client-side execution is handled by its parent
 * components and the 'use client' directive.
 */
export function WalletButton() {
  return <WalletMultiButton />;
}
