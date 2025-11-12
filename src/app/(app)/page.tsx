
'use client';
import { useState, useEffect } from 'react';
import { IceTicker } from '@/components/ice-ticker';
import { ItcTicker } from '@/components/itc-ticker';
import { IgcTicker } from '@/components/igc-ticker';
import { PgcTicker } from '@/components/pgc-ticker';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { IGC_TOKEN_MINT_ADDRESS } from '@/lib/config';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { IgcLogo } from '@/components/ui/igc-logo';

export default function Dashboard() {
  const { user, isUserLoading: isAppUserLoading } = useUser();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [igcBalance, setIgcBalance] = useState<number | null>(null);
  const [isWalletBalanceLoading, setIsWalletBalanceLoading] = useState(false);
  
  const firestore = useFirestore();

  // Fetch the user's Firestore document for the PGC balance
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);
  const pgcBalance = userProfile?.pgcBalance ?? 0;

  useEffect(() => {
    if (publicKey && connection && IGC_TOKEN_MINT_ADDRESS !== "YOUR_IGC_TOKEN_MINT_ADDRESS_HERE") {
      setIsWalletBalanceLoading(true);
      const fetchIgcBalance = async () => {
        try {
          // Fetch IGC Balance from Solana Wallet
          const igcMint = new PublicKey(IGC_TOKEN_MINT_ADDRESS);
          const igcTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            mint: igcMint,
          });
          if (igcTokenAccounts.value.length > 0) {
            const igcBal = igcTokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            setIgcBalance(igcBal);
          } else {
            setIgcBalance(0);
          }
        } catch (error) {
          console.error("Failed to fetch IGC token balance:", error);
          setIgcBalance(null);
        } finally {
          setIsWalletBalanceLoading(false);
        }
      };
      fetchIgcBalance();
    } else {
      setIgcBalance(0); // Default to 0 if no address or not connected
    }
  }, [publicKey, connection]);

  const isBalanceLoading = isAppUserLoading || isProfileLoading;

  return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName || 'guest'}! Here's your overview.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="p-0 overflow-hidden">
                <div className="bg-muted flex h-56 items-center justify-center">
                    <Image src="/pgc-logo.png" alt="PGC Logo" width={100} height={100} />
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <CardTitle>PGC Ticker</CardTitle>
                <CardDescription>Public Governance Coin.</CardDescription>
                <div className="mt-4">
                    <PgcTicker />
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-0 overflow-hidden">
                <div className="bg-muted flex h-32 items-center justify-center">
                    <IgcLogo className="h-[100px] w-[100px]" />
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <CardTitle>IGC Ticker</CardTitle>
                <CardDescription>Idea Governance Coin.</CardDescription>
                <div className="mt-4">
                    <IgcTicker />
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ITC Ticker</CardTitle>
              <CardDescription>Stablecoin pegged to Gold.</CardDescription>
            </CardHeader>
            <CardContent>
              <ItcTicker />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>ICE Ticker</CardTitle>
              <CardDescription>Exchange coin price.</CardDescription>
            </CardHeader>
            <CardContent>
              <IceTicker />
            </CardContent>
          </Card>
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>My Wallet & Balances</CardTitle>
              <CardDescription>Your connected wallet and in-app PGC balance from commissions and rewards.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Solana Wallet Address</p>
                {publicKey ? (
                   <p className="font-mono text-sm break-all">
                     {publicKey.toBase58()}
                   </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Please connect your wallet.</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Wallet IGC Balance</p>
                {isWalletBalanceLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : publicKey ? (
                  <p className="text-2xl font-bold">{igcBalance?.toLocaleString('en-US') ?? '0'} IGC</p>
                ) : (
                   <p className="text-2xl font-bold">-- IGC</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">In-App PGC Balance</p>
                {isBalanceLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : user ? (
                  <p className="text-2xl font-bold">{pgcBalance.toLocaleString('en-US')} PGC</p>
                ) : (
                   <p className="text-2xl font-bold">-- PGC</p>
                )}
              </div>
            </CardContent>
             <CardFooter>
                 <Button disabled={!publicKey}>Send / Receive</Button>
             </CardFooter>
          </Card>
        </div>
      </div>
  );
}
