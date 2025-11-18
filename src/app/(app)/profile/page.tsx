
'use client';
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
import { Copy, UploadCloud, UserCog, Wallet, Landmark, Send, DollarSign, ChevronRight, ExternalLink, Key, MapPin, Shield, CheckCircle, XCircle, Globe, Building, Home } from 'lucide-react';
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

const PGC_LOGO_URL = "https://storage.googleapis.com/public-governance-859029-c316e.firebasestorage.app/IMG_20251111_165229.png";


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
  const [isSavingGeoData, setIsSavingGeoData] = useState(false);
  const [referralLink, setReferralLink] = useState<string | null>(null);

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

  const isNewUser = user && user.metadata.creationTime && (Date.now() - new Date(user.metadata.creationTime).getTime() < 60000);
  
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

  useEffect(() => {
    if (displayReferralCode !== 'Generating...') {
      setReferralLink(`${window.location.origin}/register?ref=${displayReferralCode}`);
    }
  }, [displayReferralCode]);

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

  const updateGeographicalField = (field: string, value: string) => {
    if (!userDocRef) return;
    
    updateDocumentNonBlocking(userDocRef, {
      [field]: value,
      geoDataUpdatedAt: new Date(),
    });
  };

  const saveGeographicalData = async () => {
    if (!userDocRef || !user) return;
    
    setIsSavingGeoData(true);
    try {
      await updateDocumentNonBlocking(userDocRef, {
        geoDataVerified: false, // Reset verification when data changes
        geoDataUpdatedAt: new Date(),
      });
      
      toast({
        title: 'Geographical Data Updated',
        description: 'Your location information has been saved. It will be used for voting eligibility.',
      });
    } catch (error) {
      console.error('Error saving geographical data:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'There was an error saving your geographical data.',
      });
    } finally {
      setIsSavingGeoData(false);
    }
  };

  const getVotingEligibility = () => {
    if (!userProfile) return {};
    
    return {
      international: true, // All users can vote internationally
      national: !!userProfile.country,
      state: !!userProfile.country && !!userProfile.state,
      district: !!userProfile.country && !!userProfile.state && !!userProfile.district,
      taluka: !!userProfile.country && !!userProfile.state && !!userProfile.district && !!userProfile.taluka,
      village: !!userProfile.country && !!userProfile.state && !!userProfile.district && !!userProfile.taluka && !!userProfile.village,
      street: !!userProfile.country && !!userProfile.state && !!userProfile.district && !!userProfile.taluka && !!userProfile.village && !!userProfile.street,
    };
  };

  const copyToClipboard = (textToCopy: string | null, toastMessage: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
        toast({
          title: 'Copied!',
          description: toastMessage,
        });
    });
  };

  const eligibility = getVotingEligibility();

  if (isUserLoading || (user && isProfileLoading && !isNewUser)) {
    return <ProfileLoadingSkeleton />;
  }

  if (!user) {
    return (
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be logged in to view your profile.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild><Link href="/login">Login</Link></Button>
          </CardFooter>
        </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div>
          <h1 className="font-headline text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal, financial, and geographical information.</p>
        </div>

        {/* User Info & Profile Form - 1st */}
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

        {/* Financial Hub Card - 2nd */}
        <Card>
            <CardHeader>
                <CardTitle>Financial Hub</CardTitle>
                <CardDescription>An overview of your financial activities on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between rounded-lg border p-4 space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">PGC Balance</p>
                        <div className="flex items-baseline gap-2">
                             <Image src={PGC_LOGO_URL} alt="PGC Coin" width={28} height={28} />
                            <span className="text-4xl font-bold">{userProfile?.pgcBalance?.toLocaleString() || 0}</span>
                            <span className="text-xl text-muted-foreground">PGC</span>
                        </div>
                    </div>
                    <Button onClick={() => setIsWithdrawModalOpen(true)} disabled={(userProfile?.pgcBalance || 0) === 0}><Send className="mr-2 h-4 w-4"/> Request Withdrawal</Button>
                </div>
                <div className="flex flex-col justify-between rounded-lg border p-4 space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Team & Staking</p>
                        <p className="text-lg">Earn more by growing your team and staking your tokens.</p>
                    </div>
                     <Button asChild variant="outline">
                        <Link href="/team">Go to My Team <ChevronRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                     <Button asChild variant="outline">
                        <Link href="/staking">Go to Staking <ChevronRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* Unique Referral Code - 3rd */}
        <Card>
          <CardHeader>
            <CardTitle>Your Unique Referral Code</CardTitle>
            <CardDescription>Share this code with others to invite them to the platform and build your team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="referral-code-display">Your Referral Code</Label>
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

        {/* Referral Link - 4th */}
        <Card>
          <CardHeader>
            <CardTitle>Your Affiliate Link</CardTitle>
            <CardDescription>Share this single link for easy registration and team building.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="referral-link">Your Affiliate Link</Label>
              <div className="flex items-center space-x-2 rounded-md border bg-muted p-3">
                {referralLink ? (
                  <Link href={referralLink} target="_blank" className="flex-1 text-primary hover:underline font-mono text-sm truncate">
                    {referralLink}
                  </Link>
                ) : (
                  <span className="flex-1 text-muted-foreground font-mono text-sm truncate">
                    Generating link... please wait.
                  </span>
                )}
                <Button onClick={() => copyToClipboard(referralLink, 'Your referral link has been copied.')} size="icon" variant="ghost" disabled={!referralLink}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographical Data Form - 5th */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geographical Information
            </CardTitle>
            <CardDescription>
              Complete your geographical details to be eligible for voting on local issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={userProfile?.stateDisplay || userProfile?.state || ''}
                  onChange={(e) => updateGeographicalField('stateDisplay', e.target.value)}
                  placeholder="e.g., Maharashtra, California"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={userProfile?.districtDisplay || userProfile?.district || ''}
                  onChange={(e) => updateGeographicalField('districtDisplay', e.target.value)}
                  placeholder="e.g., Mumbai, Los Angeles"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taluka">Taluka/Block</Label>
                <Input
                  id="taluka"
                  value={userProfile?.talukaDisplay || userProfile?.taluka || ''}
                  onChange={(e) => updateGeographicalField('talukaDisplay', e.target.value)}
                  placeholder="e.g., Andheri, Saran"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="village">Village/Ward</Label>
                <Input
                  id="village"
                  value={userProfile?.villageDisplay || userProfile?.village || ''}
                  onChange={(e) => updateGeographicalField('villageDisplay', e.target.value)}
                  placeholder="e.g., Juhu, Downtown"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  value={userProfile?.streetDisplay || userProfile?.street || ''}
                  onChange={(e) => updateGeographicalField('streetDisplay', e.target.value)}
                  placeholder="e.g., MG Road, Main Street"
                />
              </div>
            </div>

            <Button 
              onClick={saveGeographicalData}
              disabled={isSavingGeoData}
              className="w-full md:w-auto"
            >
              {isSavingGeoData ? 'Saving...' : 'Save Geographical Data'}
            </Button>
          </CardContent>
        </Card>

        {/* Voting Eligibility Status - 6th */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Voting Eligibility Status
            </CardTitle>
            <CardDescription>
              Your eligibility to vote at different governance levels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>International Voting</span>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Eligible
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  <span>National Voting</span>
                </div>
                {eligibility.national ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Eligible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Add Country
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>State Voting</span>
                </div>
                {eligibility.state ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Eligible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Add State
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>District Voting</span>
                </div>
                {eligibility.district ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Eligible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Add District
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Taluka Voting</span>
                </div>
                {eligibility.taluka ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Eligible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Add Taluka
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Village/Ward Voting</span>
                </div>
                {eligibility.village ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Eligible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Add Village/Ward
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Street Voting</span>
                </div>
                {eligibility.street ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Eligible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Add Street
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                To vote on local issues, ensure your geographical data is complete and accurate. Eligibility is based on having data for that level and all levels above it.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KYC Card - 7th */}
        <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>
                Submit your documents for full platform access and higher withdrawal limits.
                {userProfile?.isVerified && <Badge variant="default" className="ml-2">Verified</Badge>}
                {userProfile?.kycStatus === 'pending' && <Badge variant="secondary" className="ml-2">In Review</Badge>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id-card">National ID (Aadhaar, Passport, etc.)</Label>
                <div className="flex items-center gap-4 rounded-md border p-3">
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">{nationalIdFile ? nationalIdFile.name : 'Upload your national ID card...'}</span>
                  <Button variant="outline" size="sm" asChild><Label htmlFor="id-card-file" className="cursor-pointer">Browse</Label></Button>
                  <Input id="id-card-file" type="file" className="sr-only" onChange={(e) => setNationalIdFile(e.target.files ? e.target.files[0] : null)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id-card">Tax ID (PAN Card, SSN, etc.)</Label>
                 <div className="flex items-center gap-4 rounded-md border p-3">
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">{taxIdFile ? taxIdFile.name : 'Upload your tax identification document...'}</span>
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
                        Your PGC will be sent to your saved wallet address: <strong className="font-mono text-xs">{userProfile?.walletPublicKey}</strong>
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
    </>
  );
}
