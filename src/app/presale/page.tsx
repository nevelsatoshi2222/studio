
'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Gift, CheckCircle, Wallet, Zap, Loader2, Copy, AlertTriangle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CREATOR_TREASURY_WALLET_ADDRESS } from '@/lib/config';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


const presalePackages = [
  { amountUSD: 10, pgcAmount: 10, bonus: 10 },
  { amountUSD: 100, pgcAmount: 100, bonus: 100 },
  { amountUSD: 1000, pgcAmount: 1000, bonus: 1000 },
  { amountUSD: 10000, pgcAmount: 10000, bonus: 10000 },
];

export default function PresalePage() {
  const { publicKey, connected } = useWallet();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseInitiated, setPurchaseInitiated] = useState(false);

  const handleSelectPackage = (amount: number) => {
    setSelectedPackage(amount);
    setPurchaseInitiated(false); 
  };

  const copyToClipboard = (text: string, entity: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard!',
      description: `${entity} has been copied.`,
    });
  };

  const handleInitiatePurchase = async () => {
    if (!selectedPackage || !publicKey) return;

    setIsProcessing(true);
    
    setTimeout(() => {
        setPurchaseInitiated(true);
        setIsProcessing(false);
        toast({
            title: "Action Required",
            description: "Please follow the instructions to complete your payment.",
        })
    }, 500);

  };

  const handleConfirmPayment = async () => {
    if (!selectedPackage || !publicKey || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Connection error. Please try again.'});
        return;
    };

    setIsProcessing(true);
    try {
      const presaleCollection = collection(firestore, 'presale_purchases');
      const selectedPkg = presalePackages.find(p => p.amountUSD === selectedPackage);
      
      if (!selectedPkg) throw new Error("Invalid package selected.");

      await addDoc(presaleCollection, {
        buyerWalletAddress: publicKey.toBase58(),
        packageAmountUSD: selectedPackage,
        pgcAmount: selectedPkg.pgcAmount,
        bonusPgc: selectedPkg.bonus,
        totalPgc: selectedPkg.pgcAmount + selectedPkg.bonus,
        purchaseDate: serverTimestamp(),
        status: 'pending_verification',
      });
      
      toast({
        title: 'Purchase Logged!',
        description: `Your purchase of ${(selectedPkg.pgcAmount + selectedPkg.bonus).toLocaleString()} PGC has been recorded. An admin will verify the transaction and send your tokens shortly.`,
      });
      setPurchaseInitiated(false);
      setSelectedPackage(null);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logging Failed',
        description: error.message || 'Could not log the purchase. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-primary/10 to-background">
          <CardHeader className="text-center">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary mb-4">
                <Flame className="h-8 w-8" />
            </div>
            <h1 className="font-headline text-4xl font-bold">PGC Presale Event</h1>
            <p className="text-muted-foreground text-lg">
              An exclusive opportunity for our earliest supporters.
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
             <div className="flex justify-center items-center gap-4">
                <Badge variant="secondary" className="text-base">Sale Supply: 2,000,000 PGC (0.00025%)</Badge>
                <Badge variant="secondary" className="text-base">Bonus: 1:1 Instant</Badge>
                <Badge variant="secondary" className="text-base">No Staking Required</Badge>
             </div>
             <p className="text-muted-foreground max-w-2xl mx-auto">
                For a limited time, purchase PGC with USDT and receive an instant 1:1 bonus—buy one, get one free. These bonus coins are liquid immediately. This event is to reward our founding members before the first public sale stage begins.
             </p>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Select a Presale Package</CardTitle>
                <CardDescription>Choose one of the exclusive packages below. Payment is in USDT on the Solana network.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                {presalePackages.map((pkg) => (
                    <button
                        key={pkg.amountUSD}
                        onClick={() => handleSelectPackage(pkg.amountUSD)}
                        disabled={!connected || isProcessing}
                        className={`p-6 rounded-lg border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedPackage === pkg.amountUSD ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                 <Image src="https://storage.googleapis.com/project-spark-348216.appspot.com/vision_public-governance-859029-c316e_1723055490400_0.png" alt="PGC Coin" width={40} height={40} />
                                 <div>
                                    <p className="font-bold text-2xl">${pkg.amountUSD} <span className="text-sm font-normal text-muted-foreground">USDT</span></p>
                                 </div>
                            </div>
                            {selectedPackage === pkg.amountUSD && <CheckCircle className="h-6 w-6 text-primary" />}
                        </div>
                        <div className="mt-4 space-y-1">
                            <p className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary"/> You get: <span className="font-semibold">{pkg.pgcAmount.toLocaleString()} PGC</span></p>
                            <p className="flex items-center gap-2"><Gift className="h-4 w-4 text-green-500"/> Instant Bonus: <span className="font-semibold">{pkg.bonus.toLocaleString()} PGC</span></p>
                        </div>
                        <p className="mt-2 text-lg font-bold">Total: {(pkg.pgcAmount + pkg.bonus).toLocaleString()} PGC</p>
                    </button>
                ))}
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-4">
                 {!connected ? (
                     <>
                        <p className="text-lg font-semibold flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" />Please connect your wallet to purchase.</p>
                        <p className="text-sm text-muted-foreground">The purchase button will appear here once you are connected.</p>
                     </>
                 ) : (
                    <Button size="lg" onClick={handleInitiatePurchase} disabled={!selectedPackage || isProcessing || purchaseInitiated}>
                        {isProcessing && !purchaseInitiated ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Initiate Purchase for ${selectedPackage || '...'} USDT
                    </Button>
                 )}
            </CardFooter>
        </Card>

        {purchaseInitiated && selectedPackage && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Purchase</CardTitle>
              <CardDescription>To finalize your purchase of the ${selectedPackage} package, please follow these steps carefully.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important: Use Solana Network Only</AlertTitle>
                    <AlertDescription>
                        You must send **USDT on the Solana (SPL) network**. Sending USDT from other networks like Ethereum (ERC-20), Tron (TRC-20), or Binance Smart Chain (BEP-20) will result in a permanent loss of your funds.
                    </AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Step 1: Send Exactly ${selectedPackage} USDT (Solana SPL)</label>
                    <p className="text-sm text-muted-foreground">Send the specified amount to the official treasury address below.</p>
                    <div className="flex items-center space-x-2 rounded-md border bg-muted p-2">
                        <input type="text" value={CREATOR_TREASURY_WALLET_ADDRESS} readOnly className="flex-1 bg-transparent border-0 text-muted-foreground font-mono text-sm"/>
                        <Button onClick={() => copyToClipboard(CREATOR_TREASURY_WALLET_ADDRESS, 'Treasury address')} size="icon" variant="ghost">
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Step 2: Confirm Your Transaction</label>
                    <p className="text-sm text-muted-foreground">After you have sent the USDT, click the button below. An admin will verify the transaction and send the PGC to your wallet ({publicKey?.toBase58().slice(0, 6)}...).</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button size="lg" onClick={handleConfirmPayment} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Confirming...</> : 'I Have Sent the USDT'}
                </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
