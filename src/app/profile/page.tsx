
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
import { Copy, UploadCloud, UserCog, Wallet, Landmark, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useWallet } from '@solana/wallet-adapter-react';
import { doc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
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

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  solanaWalletAddress: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  accountHolderName: z.string().optional(),
  nationalId: z.any().optional(),
  taxId: z.any().optional(),
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
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [taxIdFile, setTaxIdFile] = useState<File | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<any>(userDocRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      solanaWalletAddress: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        solanaWalletAddress: userProfile.solanaWalletAddress || '',
        bankName: userProfile.bankName || '',
        accountNumber: userProfile.accountNumber || '',
        ifscCode: userProfile.ifscCode || '',
        accountHolderName: userProfile.accountHolderName || '',
      });
    } else if (user) {
        form.reset({
            name: user.displayName || user.email?.split('@')[0] || 'User',
        })
    }
  }, [userProfile, user, form]);

  useEffect(() => {
    // Automatically pre-fill wallet address if connected and not already saved
    if (publicKey && !form.getValues('solanaWalletAddress')) {
       form.setValue('solanaWalletAddress', publicKey.toBase58());
    }
  }, [publicKey, form]);

  const handleFinancialDetailsSubmit = (data: ProfileFormValues) => {
    if (!userDocRef) return;
    updateDocumentNonBlocking(userDocRef, {
        solanaWalletAddress: data.solanaWalletAddress,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        accountHolderName: data.accountHolderName,
    });
    toast({
        title: 'Profile Updated',
        description: 'Your financial details have been saved.',
    });
  };

  const handleWithdrawalRequest = () => {
    if (!firestore || !user || !userProfile || !userProfile.solanaWalletAddress) {
        toast({
            variant: 'destructive',
            title: 'Cannot Request Withdrawal',
            description: 'Please ensure you are logged in and your wallet is connected and linked.',
        });
        return;
    }
    const withdrawalAmount = userProfile.pgcBalance || 0;
    if (withdrawalAmount <= 0) {
        toast({
            variant: 'destructive',
            title: 'No Balance to Withdraw',
            description: 'You do not have any PGC in your in-app balance.',
        });
        return;
    }

    const requestsCollection = collection(firestore, 'withdrawal_requests');
    addDocumentNonBlocking(requestsCollection, {
        userId: user.uid,
        userName: userProfile.name,
        amount: withdrawalAmount,
        solanaAddress: userProfile.solanaWalletAddress,
        requestedAt: serverTimestamp(),
        status: 'pending',
    });
    // Reset the in-app balance after requesting
    if (userDocRef) {
      updateDocumentNonBlocking(userDocRef, { pgcBalance: 0 });
    }
    toast({
        title: 'Withdrawal Requested',
        description: `Your request to withdraw ${withdrawalAmount.toLocaleString()} PGC has been submitted for admin approval.`,
    });
  }

  const handleKycSubmit = async () => {
    if (!userDocRef) return;
    toast({
        title: 'KYC Submitted',
        description: 'Your documents are being processed. This is a placeholder as file uploads are not yet implemented.',
    });
    // In a real app, you would upload files to Firebase Storage here and save the URLs
    // For now, we'll just update a status
     updateDocumentNonBlocking(userDocRef, {
        kycStatus: 'pending',
        nationalIdUrl: nationalIdFile ? `kyc_uploads/${user?.uid}/${nationalIdFile.name}` : '',
        taxIdUrl: taxIdFile ? `kyc_uploads/${user?.uid}/${taxIdFile.name}` : '',
    });
  };

  const referralLink = user ? `${window.location.origin}/register?ref=${user.uid}` : '';

  const copyToClipboard = (textToCopy: string, toastMessage: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copied to Clipboard!',
      description: toastMessage,
    });
  };

  if (isUserLoading || (user && isProfileLoading)) {
    return (
        <AppLayout>
            <ProfileLoadingSkeleton />
        </AppLayout>
    )
  }

  if (!user) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You must be logged in to view your profile.
            </CardDescription>
          </CardHeader>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div>
          <h1 className="font-headline text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account details and settings.
          </p>
        </div>

        {/* User Info Card */}
        <Form {...form}>
            <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary">
                    <AvatarImage src={user?.photoURL || (publicKey ? `https://api.dicebear.com/7.x/identicon/svg?seed=${publicKey.toBase58()}` : `https://picsum.photos/seed/${user.uid}/96/96`)} />
                    <AvatarFallback className="text-3xl">{user ? user.email?.charAt(0).toUpperCase() : 'G'}</AvatarFallback>
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
                <Button onClick={form.handleSubmit(handleFinancialDetailsSubmit)}>
                    <UserCog className="mr-2 h-4 w-4" /> Save Profile
                </Button>
            </CardHeader>
            </Card>
            
            {/* Referral Link Card */}
            <Card>
                <CardHeader>
                <CardTitle>Your Affiliate Referral Link</CardTitle>
                <CardDescription>
                    Share this link to invite new members and build your team.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="flex items-center space-x-2 rounded-md border bg-muted p-2">
                    <Input type="text" value={referralLink} readOnly className="flex-1 bg-transparent border-0 text-muted-foreground"/>
                    <Button onClick={() => copyToClipboard(referralLink, 'Your referral link has been copied.')} size="icon" variant="ghost">
                        <Copy className="h-5 w-5" />
                    </Button>
                </div>
                </CardContent>
            </Card>

             {/* PGC Wallet Card */}
            <Card>
                <CardHeader>
                    <CardTitle>PGC Wallet</CardTitle>
                    <CardDescription>Your in-app PGC balance. Request a withdrawal to move these funds to your linked Solana wallet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-lg border p-4">
                        <div>
                             <p className="text-sm text-muted-foreground">In-App Balance</p>
                             <div className="flex items-baseline gap-2">
                                <Image src="https://storage.googleapis.com/project-spark-348216.appspot.com/vision_public-governance-859029-c316e_1723055490400_0.png" alt="PGC Coin" width={28} height={28} />
                                <span className="text-4xl font-bold">{userProfile?.pgcBalance?.toLocaleString() || 0}</span>
                                <span className="text-xl text-muted-foreground">PGC</span>
                            </div>
                        </div>
                         <Button onClick={handleWithdrawalRequest} disabled={(userProfile?.pgcBalance || 0) === 0}>
                            <Send className="mr-2 h-4 w-4" /> Request Withdrawal
                        </Button>
                    </div>
                </CardContent>
                 <CardFooter>
                     <p className="text-xs text-muted-foreground">Withdrawal requests are processed manually by an administrator. This may take up to 24-48 hours.</p>
                 </CardFooter>
            </Card>

            {/* Financial Details Card */}
            <Card>
                <form onSubmit={form.handleSubmit(handleFinancialDetailsSubmit)}>
                    <CardHeader>
                        <CardTitle>Financial Details</CardTitle>
                        <CardDescription>Manage your wallet and bank information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-medium flex items-center gap-2 text-primary"><Wallet className="h-5 w-5"/> Solana Wallet</h3>
                             <FormField
                                control={form.control}
                                name="solanaWalletAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wallet Address for PGC</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your Solana wallet address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!connected && <p className="text-sm text-muted-foreground">Connect your wallet to auto-fill this field.</p>}
                        </div>
                        
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="font-medium flex items-center gap-2 text-primary"><Landmark className="h-5 w-5"/> Bank Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="bankName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Global Trust Bank" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                <FormField
                                    control={form.control}
                                    name="accountNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 1234567890" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                <FormField
                                    control={form.control}
                                    name="ifscCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>IFSC/SWIFT Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., GTB0123456" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                <FormField
                                    control={form.control}
                                    name="accountHolderName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Holder Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., John Doe" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Save Financial Details</Button>
                    </CardFooter>
                </form>
            </Card>
        </Form>
        {/* KYC Card */}
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>
                Upload your documents to get your account fully verified.
                {userProfile?.kycStatus === 'pending' && <Badge variant="secondary" className="ml-2">In Review</Badge>}
                {userProfile?.kycStatus === 'verified' && <Badge variant="default" className="ml-2">Verified</Badge>}
                {userProfile?.kycStatus === 'rejected' && <Badge variant="destructive" className="ml-2">Rejected</Badge>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id-card">National ID Card</Label>
                <div className="flex items-center gap-4 rounded-md border p-3">
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">
                    {nationalIdFile ? nationalIdFile.name : 'Click to upload or drag and drop'}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Label htmlFor="id-card-file" className="cursor-pointer">Browse</Label>
                  </Button>
                  <Input 
                    id="id-card-file" 
                    type="file" 
                    className="sr-only" 
                    onChange={(e) => setNationalIdFile(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id-card">Income Tax ID Card (e.g., PAN Card)</Label>
                 <div className="flex items-center gap-4 rounded-md border p-3">
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">
                    {taxIdFile ? taxIdFile.name : 'Click to upload or drag and drop'}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Label htmlFor="tax-id-file" className="cursor-pointer">Browse</Label>
                  </Button>
                  <Input 
                    id="tax-id-file" 
                    type="file" 
                    className="sr-only" 
                    onChange={(e) => setTaxIdFile(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleKycSubmit} disabled={!nationalIdFile || !taxIdFile || userProfile?.kycStatus === 'pending' || userProfile?.kycStatus === 'verified'}>Submit for Verification</Button>
            </CardFooter>
          </Card>
      </div>
    </AppLayout>
  );
}
