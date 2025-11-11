'use client';
import { useState } from 'react';
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
import { Flame, Gift, CheckCircle, Wallet, Zap, Loader2, Copy, AlertTriangle, TrendingUp, Star, Crown, Rocket, Sparkles, Award, Gem, Target, Coins } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CREATOR_TREASURY_WALLET_ADDRESS } from '@/lib/config';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Updated presale packages with consistent yellow/gold theme
const PRESALE_TIERS = [
  { 
    tier: 'BASIC',
    amountUSD: 10, 
    instantPgc: 20, 
    stage1: 40,
    stage2: 80,
    stage3: 160,
    totalPgc: 160,
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    icon: Star,
    gradient: 'from-yellow-900 to-yellow-700',
    bgGradient: 'from-gray-900 via-black to-yellow-900',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-300',
    badgeColor: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
    glowColor: 'shadow-yellow-500/20',
    stageColor: 'bg-yellow-900/30',
    borderStageColor: 'border-yellow-600/30'
  },
  { 
    tier: 'STARTER',
    amountUSD: 25, 
    instantPgc: 50, 
    stage1: 100,
    stage2: 200,
    stage3: 400,
    totalPgc: 400,
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    icon: Zap,
    gradient: 'from-yellow-900 to-yellow-700',
    bgGradient: 'from-gray-900 via-black to-yellow-900',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-300',
    badgeColor: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
    glowColor: 'shadow-yellow-500/20',
    stageColor: 'bg-yellow-900/30',
    borderStageColor: 'border-yellow-600/30'
  },
  { 
    tier: 'PREMIUM',
    amountUSD: 50, 
    instantPgc: 100, 
    stage1: 200,
    stage2: 400,
    stage3: 800,
    totalPgc: 800,
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    icon: Crown,
    gradient: 'from-yellow-900 to-yellow-700',
    bgGradient: 'from-gray-900 via-black to-yellow-900',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-300',
    badgeColor: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
    glowColor: 'shadow-yellow-500/30',
    stageColor: 'bg-yellow-900/30',
    borderStageColor: 'border-yellow-600/30'
  },
  { 
    tier: 'ADVANCED',
    amountUSD: 100, 
    instantPgc: 200, 
    stage1: 400,
    stage2: 800,
    stage3: 1600,
    totalPgc: 1600,
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    icon: Rocket,
    gradient: 'from-yellow-900 to-yellow-700',
    bgGradient: 'from-gray-900 via-black to-yellow-900',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-300',
    badgeColor: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
    glowColor: 'shadow-yellow-500/20',
    stageColor: 'bg-yellow-900/30',
    borderStageColor: 'border-yellow-600/30'
  },
  { 
    tier: 'PRO',
    amountUSD: 250, 
    instantPgc: 500, 
    stage1: 1000,
    stage2: 2000,
    stage3: 4000,
    totalPgc: 4000,
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    icon: Gem,
    gradient: 'from-yellow-900 to-yellow-700',
    bgGradient: 'from-gray-900 via-black to-yellow-900',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-300',
    badgeColor: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
    glowColor: 'shadow-yellow-500/25',
    stageColor: 'bg-yellow-900/30',
    borderStageColor: 'border-yellow-600/30'
  },
  { 
    tier: 'MASTER',
    amountUSD: 500, 
    instantPgc: 1000, 
    stage1: 2000,
    stage2: 4000,
    stage3: 8000,
    totalPgc: 8000,
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    icon: Award,
    gradient: 'from-yellow-900 to-yellow-700',
    bgGradient: 'from-gray-900 via-black to-yellow-900',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-300',
    badgeColor: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
    glowColor: 'shadow-yellow-500/30',
    stageColor: 'bg-yellow-900/30',
    borderStageColor: 'border-yellow-600/30'
  },
  { 
    tier: 'ELITE',
    amountUSD: 1000, 
    instantPgc: 2000, 
    stage1: 4000,
    stage2: 8000,
    stage3: 16000,
    totalPgc: 16000,
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    icon: Target,
    gradient: 'from-yellow-900 to-yellow-700',
    bgGradient: 'from-gray-900 via-black to-yellow-900',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-300',
    badgeColor: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
    glowColor: 'shadow-yellow-500/40',
    stageColor: 'bg-yellow-900/30',
    borderStageColor: 'border-yellow-600/30'
  }
];

export default function PresalePage() {
  const { user } = useUser();
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
    if (!selectedPackage || !publicKey || !firestore || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'User not logged in or connection error. Please try again.'});
        return;
    };

    setIsProcessing(true);
    try {
      const presaleCollection = collection(firestore, 'presales');
      const selectedPkg = PRESALE_TIERS.find(p => p.amountUSD === selectedPackage);
      
      if (!selectedPkg) throw new Error("Invalid package selected.");
      
      const totalPgc = selectedPkg.instantPgc;

      await addDoc(presaleCollection, {
        userId: user.uid,
        amountUSDT: selectedPackage,
        pgcCredited: totalPgc,
        potentialPgc: selectedPkg.totalPgc,
        currentStage: 0,
        status: 'PENDING_VERIFICATION',
        purchaseDate: serverTimestamp(),
        tier: selectedPkg.tier,
      });
      
      toast({
        title: 'Verification Submitted!',
        description: `Your purchase of ${totalPgc.toLocaleString()} PGC is pending verification. Potential: ${selectedPkg.totalPgc.toLocaleString()} PGC after 3 stages!`,
      });
      
      setPurchaseInitiated(false);
      setSelectedPackage(null);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'Could not log the purchase. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-gray-900 via-black to-yellow-900 border-yellow-600 border-2 shadow-2xl">
          <CardHeader className="text-center py-6">
             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-black shadow-2xl mb-3">
                <Coins className="h-7 w-7" />
            </div>
            <h1 className="font-headline text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              PGC PRESALE EVENT
            </h1>
            <p className="text-yellow-200 text-base mt-1">
              ⚡ <span className="font-bold text-yellow-300">1:1 INSTANT BONUS</span> + <span className="font-bold text-yellow-300">3-STAGE DOUBLING</span>
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-3 pb-6">
             <div className="flex flex-wrap justify-center items-center gap-1">
                <Badge className="text-xs bg-gradient-to-r from-yellow-600 to-yellow-800 text-yellow-100 border-0 px-2 py-1">2M PGC SUPPLY</Badge>
                <Badge className="text-xs bg-gradient-to-r from-yellow-600 to-yellow-800 text-yellow-100 border-0 px-2 py-1">1:1 BONUS</Badge>
                <Badge className="text-xs bg-gradient-to-r from-yellow-600 to-yellow-800 text-yellow-100 border-0 px-2 py-1">3-STAGE GROWTH</Badge>
                <Badge className="text-xs bg-gradient-to-r from-yellow-600 to-yellow-800 text-yellow-100 border-0 px-2 py-1">NO STAKING</Badge>
             </div>
             <p className="text-yellow-100 max-w-xl mx-auto text-xs">
                Invest in PGC with USDT and get instant 1:1 bonus plus exponential returns through our 3-stage doubling system!
             </p>
          </CardContent>
        </Card>

        {/* Compact Package Selection */}
        <Card className="bg-gradient-to-br from-gray-900 to-black border-yellow-600 border-2 shadow-2xl">
          <CardHeader className="text-center py-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              🎯 SELECT YOUR PACKAGE
            </CardTitle>
            <CardDescription className="text-yellow-200 text-sm">
              Choose your investment tier and start growing
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 px-4 pb-4">
            {PRESALE_TIERS.map((pkg) => (
              <div
                key={pkg.amountUSD}
                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  selectedPackage === pkg.amountUSD 
                    ? `border-yellow-400 shadow-2xl ${pkg.glowColor} ring-2 ring-yellow-400` 
                    : `${pkg.borderColor} hover:border-yellow-400`
                }`}
              >
                {/* Background Layer */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.bgGradient} ${pkg.glowColor}`} />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -skew-x-12 transform translate-x-[-100%] animate-shimmer" />

                {/* Content Layer - Clear and Visible */}
                <button
                  onClick={() => handleSelectPackage(pkg.amountUSD)}
                  disabled={!connected || !user || isProcessing}
                  className="w-full p-3 text-left disabled:opacity-50 disabled:cursor-not-allowed relative z-10 bg-black/40 backdrop-blur-sm"
                >
                  {/* Header Section */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${pkg.gradient} border ${pkg.borderColor} shadow-lg`}>
                      <pkg.icon className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-black text-lg text-yellow-300">${pkg.amountUSD}</p>
                      <p className={`text-xs font-bold ${pkg.textColor}`}>
                        {pkg.tier}
                      </p>
                    </div>
                  </div>
                  
                  {/* Instant Bonus */}
                  <div className="mb-2 p-1.5 rounded bg-black/50 border border-yellow-600/30">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-yellow-200">INSTANT:</span>
                      <span className="text-sm font-black text-yellow-300">{pkg.instantPgc.toLocaleString()} PGC</span>
                    </div>
                  </div>

                  {/* Stage Progress - Full Stage Names */}
                  <div className="mb-2">
                    <div className="grid grid-cols-3 gap-0.5 text-[9px]">
                      <div className={`text-center p-0.5 bg-black/50 rounded border ${pkg.borderStageColor}`}>
                        <div className="font-bold text-yellow-300">STAGE 1</div>
                        <div className="font-black text-yellow-400">{pkg.stage1.toLocaleString()}</div>
                      </div>
                      <div className={`text-center p-0.5 bg-black/50 rounded border ${pkg.borderStageColor}`}>
                        <div className="font-bold text-yellow-300">STAGE 2</div>
                        <div className="font-black text-yellow-400">{pkg.stage2.toLocaleString()}</div>
                      </div>
                      <div className={`text-center p-0.5 bg-black/50 rounded border ${pkg.borderStageColor}`}>
                        <div className="font-bold text-yellow-300">STAGE 3</div>
                        <div className="font-black text-yellow-400">{pkg.stage3.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Total Potential */}
                  <div className="p-1.5 rounded bg-black/50 border border-yellow-600/40">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-yellow-200">TOTAL:</span>
                      <span className="text-sm font-black text-yellow-300">{pkg.totalPgc.toLocaleString()} PGC</span>
                    </div>
                  </div>

                  {/* ROI Badge */}
                  <div className="mt-1.5 text-center">
                    <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${pkg.badgeColor} text-yellow-100 text-[10px] font-black border border-yellow-500/30`}>
                      <TrendingUp className="h-2.5 w-2.5" />
                      {Math.round((pkg.totalPgc / pkg.amountUSD) * 100)}% ROI
                    </div>
                  </div>

                  {/* Selected Checkmark */}
                  {selectedPackage === pkg.amountUSD && (
                    <div className="absolute top-1 right-1">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black p-0.5 rounded-full shadow-lg">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-3 py-4">
            {!user ? (
              <div className="text-center">
                <p className="text-sm font-semibold flex items-center gap-1.5 text-yellow-200">
                  <Wallet className="h-4 w-4 text-yellow-400" />
                  PLEASE LOGIN TO PURCHASE
                </p>
              </div>
            ) : !connected ? (
              <div className="text-center">
                <p className="text-sm font-semibold flex items-center gap-1.5 text-yellow-200">
                  <Wallet className="h-4 w-4 text-yellow-400" />
                  CONNECT WALLET TO PURCHASE
                </p>
                <p className="text-yellow-300 text-xs mt-0.5">Connect wallet to enable purchase</p>
              </div>
            ) : (
              <Button 
                size="lg" 
                onClick={handleInitiatePurchase} 
                disabled={!selectedPackage || isProcessing || purchaseInitiated}
                className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-black font-black text-sm py-2.5 px-6 rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-40 border border-yellow-400"
              >
                {isProcessing && !purchaseInitiated ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Rocket className="mr-1.5 h-3.5 w-3.5" />
                )}
                {isProcessing && !purchaseInitiated ? 'PROCESSING...' : `INVEST $${selectedPackage || ''}`}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Compact Investment Table */}
        <Card className="bg-gradient-to-br from-gray-900 to-black border-yellow-600 border-2 shadow-2xl">
          <CardHeader className="text-center py-4">
            <CardTitle className="flex items-center justify-center gap-1.5 text-lg font-bold">
              <Award className="h-4 w-4 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                PACKAGE BREAKDOWN
              </span>
              <Award className="h-4 w-4 text-yellow-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-yellow-600/30 overflow-hidden shadow-xl">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-yellow-700 to-yellow-900">
                    <TableHead className="font-black text-yellow-100 text-xs border-r border-yellow-600/30">TIER</TableHead>
                    <TableHead className="font-black text-yellow-100 text-xs border-r border-yellow-600/30">INVEST</TableHead>
                    <TableHead className="font-black text-yellow-300 text-xs border-r border-yellow-600/30">INSTANT</TableHead>
                    <TableHead className="font-black text-yellow-300 text-xs border-r border-yellow-600/30">STAGE 1</TableHead>
                    <TableHead className="font-black text-yellow-300 text-xs border-r border-yellow-600/30">STAGE 2</TableHead>
                    <TableHead className="font-black text-yellow-300 text-xs border-r border-yellow-600/30">STAGE 3</TableHead>
                    <TableHead className="font-black text-yellow-300 text-xs">TOTAL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PRESALE_TIERS.map((tier) => (
                    <TableRow key={tier.tier} className="bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 border-b border-yellow-600/10">
                      <TableCell className="font-bold py-2">
                        <div className="flex items-center gap-1">
                          <div className={`p-0.5 rounded bg-gradient-to-r ${tier.gradient} border ${tier.borderColor}`}>
                            <tier.icon className="h-2.5 w-2.5 text-yellow-400" />
                          </div>
                          <span className={tier.textColor}>{tier.tier}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <span className="font-black text-yellow-300">${tier.amountUSD}</span>
                      </TableCell>
                      <TableCell className="text-yellow-400 font-black py-2">
                        {tier.instantPgc.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-yellow-400 font-black py-2">
                        {tier.stage1.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-yellow-400 font-black py-2">
                        {tier.stage2.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-yellow-400 font-black py-2">
                        {tier.stage3.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-yellow-300 font-black py-2">
                        {tier.totalPgc.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Ultra Compact Stage Explanation */}
            <div className="mt-4 p-3 bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-lg border border-yellow-600/30">
              <h4 className="font-bold text-sm mb-2 flex items-center gap-1 text-yellow-300">
                <Zap className="h-3 w-3 text-yellow-400" />
                GROWTH MECHANISM:
              </h4>
              <div className="grid grid-cols-4 gap-1 text-[10px]">
                <div className="text-center p-1 bg-yellow-900/40 rounded border border-yellow-600/30">
                  <div className="font-black text-yellow-300">INSTANT</div>
                  <div className="text-base font-black text-yellow-400">2x</div>
                </div>
                <div className="text-center p-1 bg-yellow-900/40 rounded border border-yellow-600/30">
                  <div className="font-black text-yellow-300">STAGE 1</div>
                  <div className="text-base font-black text-yellow-400">2x</div>
                </div>
                <div className="text-center p-1 bg-yellow-900/40 rounded border border-yellow-600/30">
                  <div className="font-black text-yellow-300">STAGE 2</div>
                  <div className="text-base font-black text-yellow-400">2x</div>
                </div>
                <div className="text-center p-1 bg-yellow-900/40 rounded border border-yellow-600/30">
                  <div className="font-black text-yellow-300">STAGE 3</div>
                  <div className="text-base font-black text-yellow-400">2x</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Process */}
        {purchaseInitiated && selectedPackage && (
          <Card className="bg-gradient-to-br from-gray-900 to-black border-yellow-600 border-2 shadow-2xl">
            <CardHeader className="text-center py-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                COMPLETE INVESTMENT
              </CardTitle>
              <CardDescription className="text-yellow-200 text-sm">
                Finalize your ${selectedPackage} investment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/30 border border-yellow-600">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertTitle className="text-yellow-300 font-bold text-sm">SOLANA NETWORK ONLY</AlertTitle>
                <AlertDescription className="text-yellow-200 text-xs">
                  Send USDT on Solana (SPL) network only. Other networks will result in permanent loss.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-yellow-300">STEP 1: SEND ${selectedPackage} USDT</label>
                <div className="flex items-center space-x-1.5 rounded border border-yellow-600/30 bg-yellow-900/20 p-2">
                  <input type="text" value={CREATOR_TREASURY_WALLET_ADDRESS} readOnly className="flex-1 bg-transparent border-0 text-yellow-200 font-mono text-xs"/>
                  <Button onClick={() => copyToClipboard(CREATOR_TREASURY_WALLET_ADDRESS, 'Address')} size="icon" variant="ghost" className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-yellow-100 hover:from-yellow-500 hover:to-yellow-700 h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="p-2 bg-gradient-to-r from-yellow-900/40 to-yellow-800/30 rounded border border-yellow-600/40">
                <h4 className="font-bold mb-1 text-yellow-300 text-sm">INVESTMENT SUMMARY:</h4>
                {(() => {
                  const pkg = PRESALE_TIERS.find(p => p.amountUSD === selectedPackage);
                  if (!pkg) return null;
                  return (
                    <div className="space-y-0.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-yellow-200">Investment:</span>
                        <span className="font-black text-yellow-300">${pkg.amountUSD}</span>
                      </div>
                      <div className="flex justify-between text-yellow-400">
                        <span>Instant PGC:</span>
                        <span className="font-black">{pkg.instantPgc.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-yellow-300">
                        <span>Total Potential:</span>
                        <span className="font-black">{pkg.totalPgc.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" onClick={handleConfirmPayment} disabled={isProcessing} className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-2 px-4 rounded-lg text-sm min-w-32 border border-yellow-400">
                {isProcessing ? <><Loader2 className="mr-1.5 h-3 w-3 animate-spin" />CONFIRMING...</> : '✅ PAYMENT SENT'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
  );
}