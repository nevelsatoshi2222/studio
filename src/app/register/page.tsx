
'use client';
import { Suspense, useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserPlus, Crown, MapPin, Home, Building, Globe, AlertCircle, Star, Zap, Rocket, TrendingUp, Loader2, Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore, useFirebaseApp } from '@/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion, getDoc, increment, serverTimestamp } from 'firebase/firestore';
import { CommissionCalculator } from '@/lib/commission-calculator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { countries } from '@/lib/data';
import { businessRoles, businessTypes } from '@/lib/business-data';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Updated Payment Tiers
const PAYMENT_TIERS = {
  free: { 
    usd: 0, 
    instantPgc: 1, 
    totalPgc: 1,
    label: 'Free Account',
    description: 'Get started and earn rewards.',
    bonus: 'First 20,000 users get 1 PGC bonus',
  },
  paid: { 
    usd: 100, 
    instantPgc: 200, 
    totalPgc: 1600,
    label: 'Paid Account - $100 USD',
    description: 'Unlock full earning potential.',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
  },
};

const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  country: z.string().min(1, { message: 'Please select your country' }),
  state: z.string().min(2, { message: 'Please enter your state/province' }),
  district: z.string().min(2, { message: 'Please enter your district' }),
  taluka: z.string().min(2, { message: 'Please enter your taluka/block' }),
  village: z.string().min(2, { message: 'Please enter your village/ward' }),
  street: z.string().optional(),
  referredByCode: z.string().optional(),
  accountType: z.enum(['free', 'paid']).default('free'),
  walletAddress: z.string().optional(),
  primaryRole: z.string().min(1, "Please select a primary role."),
  businessType: z.string().min(1, "Please select a business type."),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

function RegistrationForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{referralCode: string; email: string; accountType: string; pgcReward: number} | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      country: '',
      state: '',
      district: '',
      taluka: '',
      village: '',
      street: '',
      referredByCode: searchParams.get('ref') || '',
      accountType: 'free',
      walletAddress: '',
      primaryRole: '',
      businessType: '',
    },
  });
  
  const selectedAccountType = form.watch('accountType');

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const authUser = userCredential.user;

      await updateProfile(authUser, { displayName: data.name });

      const newReferralCode = `PGC-${authUser.uid.substring(0, 8).toUpperCase()}`;
      
      let referrerUserId: string | null = null;
      if (data.referredByCode) {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('referralCode', '==', data.referredByCode));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          referrerUserId = querySnapshot.docs[0].id;
        }
      }

      const tier = PAYMENT_TIERS[data.accountType];
      let pgcBalance = (data.accountType === 'paid') ? tier.instantPgc : 1;

      const userDocData = {
        name: data.name,
        email: data.email,
        referralCode: newReferralCode,
        referredByUserId: referrerUserId,
        role: 'User',
        status: 'Active',
        accountType: data.accountType,
        pgcBalance: pgcBalance,
        usdBalance: 0,
        totalCommission: 0,
        country: data.country,
        state: data.state,
        district: data.district,
        taluka: data.taluka,
        village: data.village,
        street: data.street || '',
        primaryRole: data.primaryRole,
        businessType: data.businessType,
        walletAddress: data.walletAddress || '',
        registeredAt: serverTimestamp(),
        direct_team: [],
        totalTeamSize: 0,
        paidTeamSize: 0,
        freeRank: 'None',
        paidRank: 'None',
        isPaid: data.accountType === 'paid',
        freeAchievers: { bronze: 0, silver: 0, gold: 0 },
        paidAchievers: { bronzeStar: 0, silverStar: 0, goldStar: 0 },
      };

      await setDoc(doc(firestore, 'users', authUser.uid), userDocData);

      if (referrerUserId) {
        const referrerRef = doc(firestore, 'users', referrerUserId);
        await updateDoc(referrerRef, { direct_team: arrayUnion(authUser.uid) });

        if (data.accountType === 'paid') {
           await CommissionCalculator.calculateRegistrationCommissions(authUser.uid, data.name, referrerUserId, tier.usd);
        }
      }

      await sendEmailVerification(authUser);

      setSuccessData({
        referralCode: newReferralCode,
        email: data.email,
        accountType: data.accountType,
        pgcReward: pgcBalance
      });
      
      await signOut(auth);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (successData) {
    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <CardTitle className="text-2xl">Registration Successful!</CardTitle>
                <CardDescription>A verification link has been sent to {successData.email}.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p>Your unique referral code is:</p>
                <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-lg font-mono p-2">{successData.referralCode}</Badge>
                    <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(successData.referralCode)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-green-600 font-semibold">You've been awarded {successData.pgcReward} PGC!</p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full"><Link href="/login">Go to Login</Link></Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center gap-4 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-6 w-6" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Create Your Account</CardTitle>
                <CardDescription>Join to participate in voting, earn rewards, and more.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Fill your complete geographical details to participate in voting at all 8 levels.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="name" render={({ field }) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="password" render={({ field }) => (<FormItem><FormLabel>Password *</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="referredByCode" render={({ field }) => (<FormItem><FormLabel>Referral Code (Optional)</FormLabel><FormControl><Input placeholder="Enter referral code" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <Separator />
             <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2"><MapPin className="h-5 w-5" /> Geographical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel><Globe className="inline mr-1 h-4 w-4"/>Country *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger></FormControl><SelectContent className="max-h-60">{countries.map(c => <SelectItem key={c.value} value={c.label}>{c.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField name="state" render={({ field }) => (<FormItem><FormLabel>State *</FormLabel><FormControl><Input placeholder="e.g., California" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="district" render={({ field }) => (<FormItem><FormLabel>District *</FormLabel><FormControl><Input placeholder="e.g., Los Angeles" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="taluka" render={({ field }) => (<FormItem><FormLabel>Taluka/Block *</FormLabel><FormControl><Input placeholder="e.g., Hollywood" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="village" render={({ field }) => (<FormItem><FormLabel>Village/Ward *</FormLabel><FormControl><Input placeholder="e.g., Central Hollywood" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="street" render={({ field }) => (<FormItem><FormLabel>Street (Optional)</FormLabel><FormControl><Input placeholder="e.g., Hollywood Blvd" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </div>
            <Separator />
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Business & Role</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="primaryRole" render={({ field }) => (<FormItem><FormLabel>Primary Role *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your primary role" /></SelectTrigger></FormControl><SelectContent>{businessRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="businessType" render={({ field }) => (<FormItem><FormLabel>Business Type *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select business type" /></SelectTrigger></FormControl><SelectContent className="max-h-60">{businessTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
            </div>
             <Separator />
            <FormField control={form.control} name="accountType" render={({ field }) => (<FormItem className="space-y-3"><FormLabel className="text-lg font-semibold">Choose Your Account Tier</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">{Object.entries(PAYMENT_TIERS).map(([key, tier]) => (<FormItem key={key} className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value={key} /></FormControl><FormLabel className="font-normal flex-1 cursor-pointer"><div className="p-4 border rounded-lg hover:border-primary peer-data-[state=checked]:border-primary"><span className="font-bold">{tier.label}</span><p className="text-sm text-muted-foreground">{tier.description}</p><p className="text-xs font-semibold text-green-600">{tier.bonus}</p></div></FormLabel></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : 'Create Account & Continue'}
             </Button>
             <p className="text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link></p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegistrationForm />
    </Suspense>
  );
}
