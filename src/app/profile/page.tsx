
'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy, UploadCloud, UserCog, Wallet, Landmark, Send, DollarSign, ChevronRight, ExternalLink, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useWallet } from '@solana/wallet-adapter-react';
import { doc, collection, serverTimestamp, increment } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  walletPublicKey: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileLoadingSkeleton() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { publicKey } = useWallet();
  const { toast } = useToast();
  
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [taxIdFile, setTaxIdFile] = useState<File | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<any>(userDocRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      walletPublicKey: '',
    },
  });

  // THIS IS THE KEY FIX: Optimistically generate the referral code on the client for new users.
  // This logic determines if the user just registered (e.g., within the last 60 seconds).
  const isNewUser = user && (Date.now() - new Date(user.metadata.creationTime || 0).getTime() < 60000);
  
  // The display referral code now has a reliable fallback.
  // 1. Try to get it from the loaded Firestore document.
  // 2. If that's loading AND the user is new, calculate it on the client. This is the optimistic UI part.
  // 3. Otherwise, show "Generating..."
  const optimisticReferralCode = user ? `PGC-${user.uid.substring(0, 8).toUpperCase()}` : null;
  const displayReferralCode = userProfile?.referralCode || (isNewUser ? optimisticReferralCode : 'Generating...');


  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        walletPublicKey: userProfile.walletPublicKey || '',
      });
      setWithdrawAmount(userProfile.pgcBalance || 0);
    } else if (user) {
        form.reset({
            name: user.displayName || user.email?.split('@')[0] || 'User',
            walletPublicKey: ''
        })
    }
  }, [userProfile, user, form]);

  useEffect(() => {
    if (publicKey && !form.getValues('walletPublicKey')) {
       form.setValue('walletPublicKey', publicKey.toBase58());
    }
  }, [publicKey, form]);

  const handleProfileSubmit = (data: ProfileFormValues) => {
    if (!userDocRef || !user) return;
    updateDocumentNonBlocking(userDocRef, {
        name: data.name,
        walletPublicKey: data.walletPublicKey,
    });
    toast({
        title: 'Profile Updated',
        description: 'Your details have been saved.',
    });
  };

  const handleWithdrawalRequest = () => {
    if (!firestore || !user || !userProfile || !userProfile.walletPublicKey) {
        toast({
            variant: 'destructive',
            title: 'Cannot Request Withdrawal',
            description: 'Please ensure your wallet address is saved in your profile.',
        });
        return;
    }
    if (withdrawAmount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Withdrawal amount must be greater than zero.'});
        return;
    }
    if (withdrawAmount > (userProfile?.pgcBalance || 0)) {
        toast({ variant: 'destructive', title: 'Insufficient Balance', description: 'Withdrawal amount cannot exceed your balance.'});
        return;
    }

    const requestsCollection = collection(firestore, 'withdrawalRequests');
    addDocumentNonBlocking(requestsCollection, {
        userId: user.uid,
        userName: userProfile.name,
        amount: withdrawAmount,
        walletAddress: userProfile.walletPublicKey,
        requestedAt: serverTimestamp(),
        status: 'pending',
    });
    if (userDocRef) {
      updateDocumentNonBlocking(userDocRef, { pgcBalance: increment(-withdrawAmount) });
    }
    toast({
        title: 'Withdrawal Requested',
        description: `Your request to withdraw ${withdrawAmount.toLocaleString()} PGC has been submitted.`,
    });
    setIsWithdrawModalOpen(false);
  }

  const handleKycSubmit = async () => {
    if (!userDocRef) return;
    toast({
        title: 'KYC Submitted',
        description: 'Your documents are being processed. This is a placeholder as file uploads are not yet implemented.',
    });
    updateDocumentNonBlocking(userDocRef, {
        kycStatus: 'pending',
        nationalIdUrl: nationalIdFile ? `kyc_uploads/${user?.uid}/${nationalIdFile.name}` : '',
        taxIdUrl: taxIdFile ? `ky-uploads/${user?.uid}/${taxIdFile.name}` : '',
    });
  };

  const referralLink = displayReferralCode !== 'Generating...' ? `${window.location.origin}/register?ref=${displayReferralCode}` : null;

  const copyToClipboard = (textToCopy: string | null, toastMessage: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
        toast({
          title: 'Copied!',
          description: toastMessage,
        });
    });
  };

  if (isUserLoading || (user && isProfileLoading && !isNewUser)) {
    return <AppLayout><ProfileLoadingSkeleton /></AppLayout>;
  }

  if (!user) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be logged in to view your profile.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild><Link href="/login">Login</Link></Button>
          </CardFooter>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div>
          <h1 className="font-headline text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account details, team, and finances.</p>
        </div>

        {/* User Info & Profile Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleProfileSubmit)}>
            <Card>
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary">
                    <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user.uid}/96/96`} />
                    <AvatarFallback className="text-3xl">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 w-full">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input {...field} className="text-3xl font-bold border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <CardDescription className="text-base mt-1">{user?.email}</CardDescription>
                </div>
                <Button type="submit"><UserCog className="mr-2 h-4 w-4" /> Save Profile</Button>
              </CardHeader>

              <CardContent className="space-y-6">
                <Separator />
                <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2 text-primary"><Wallet className="h-5 w-5"/> Wallet Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="walletPublicKey" render={({ field }) => (<FormItem><FormLabel>Solana Wallet Address</FormLabel><FormControl><Input placeholder="Enter your Solana wallet address" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
        
        {/* Financial Hub Card */}
        <Card>
            <CardHeader>
                <CardTitle>Financial & Referral Hub</CardTitle>
                <CardDescription>Your financial overview, referral tools, and actions.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between rounded-lg border p-4 space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">In-App PGC Balance</p>
                        <div className="flex items-baseline gap-2">
                            <Image src="/pgc-logo.png" alt="PGC Coin" width={28} height={28} />
                            <span className="text-4xl font-bold">{userProfile?.pgcBalance?.toLocaleString() || 0}</span>
                            <span className="text-xl text-muted-foreground">PGC</span>
                        </div>
                    </div>
                    <Button onClick={() => setIsWithdrawModalOpen(true)} disabled={(userProfile?.pgcBalance || 0) === 0}><Send className="mr-2 h-4 w-4"/> Request Withdrawal</Button>
                </div>
                <div className="flex flex-col justify-between rounded-lg border p-4 space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Team & Staking</p>
                        <p className="text-lg">View your affiliate team, earnings, and staked assets.</p>
                    </div>
                     <Button asChild variant="outline">
                        <Link href="/team">Go to My Team <ChevronRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                     <Button asChild variant="outline">
                        <Link href="/staking">Go to Staking <ChevronRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="referral-link">Your Affiliate Link</Label>
                    <p className="text-xs text-muted-foreground">Share this link to have new users join your network. You can also give them just the code.</p>
                    <div className="flex items-center space-x-2 rounded-md border bg-muted p-3">
                         <Link href={referralLink || '#'} target="_blank" className="flex-1 text-primary hover:underline font-mono text-sm truncate">
                            {referralLink || 'Your link will appear here once your code is generated.'}
                        </Link>
                        <Button onClick={() => copyToClipboard(referralLink, 'Your referral link has been copied.')} size="icon" variant="ghost" disabled={!referralLink}>
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="referral-code-display">Your Unique Referral Code</Label>
                     <div className="flex items-center space-x-2">
                        <Input
                            id="referral-code-display"
                            readOnly
                            value={displayReferralCode}
                            className="font-mono text-lg text-primary flex-1"
                        />
                        <Button
                            onClick={() => copyToClipboard(displayReferralCode, 'Your referral code has been copied.')}
                            disabled={displayReferralCode === 'Generating...'}
                        >
                            <Copy className="mr-2 h-4 w-4"/> Copy Code
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* KYC Card */}
        <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>
                Upload your documents to get your account fully verified.
                {userProfile?.isVerified && <Badge variant="default" className="ml-2">Verified</Badge>}
                {userProfile?.kycStatus === 'pending' && <Badge variant="secondary" className="ml-2">In Review</Badge>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id-card">National ID Card</Label>
                <div className="flex items-center gap-4 rounded-md border p-3">
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">{nationalIdFile ? nationalIdFile.name : 'Click to upload or drag and drop'}</span>
                  <Button variant="outline" size="sm" asChild><Label htmlFor="id-card-file" className="cursor-pointer">Browse</Label></Button>
                  <Input id="id-card-file" type="file" className="sr-only" onChange={(e) => setNationalIdFile(e.target.files ? e.target.files[0] : null)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id-card">Income Tax ID Card (e.g., PAN Card)</Label>
                 <div className="flex items-center gap-4 rounded-md border p-3">
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">{taxIdFile ? taxIdFile.name : 'Click to upload or drag and drop'}</span>
                  <Button variant="outline" size="sm" asChild><Label htmlFor="tax-id-file" className="cursor-pointer">Browse</Label></Button>
                  <Input id="tax-id-file" type="file" className="sr-only" onChange={(e) => setTaxIdFile(e.target.files ? e.target.files[0] : null)} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleKycSubmit} disabled={!nationalIdFile || !taxIdFile || userProfile?.isVerified || userProfile?.kycStatus === 'pending'}>Submit for Verification</Button>
            </CardFooter>
        </Card>
      </div>

       {/* Withdrawal Modal */}
        <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request PGC Withdrawal</DialogTitle>
                    <DialogDescription>
                        Enter the amount of PGC you wish to withdraw to your linked Solana wallet: <strong className="font-mono text-xs">{userProfile?.walletPublicKey}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
                        <div className="relative">
                            <Input
                                id="withdraw-amount"
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                                max={userProfile?.pgcBalance || 0}
                            />
                            <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7" onClick={() => setWithdrawAmount(userProfile?.pgcBalance || 0)}>Max</Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Available Balance: {(userProfile?.pgcBalance || 0).toLocaleString()} PGC</p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleWithdrawalRequest}>Submit Request</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
  );
}

    