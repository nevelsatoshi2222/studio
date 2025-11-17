
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
import { UserPlus, Crown, MapPin, Home, Building, Globe, AlertCircle, Star, Zap, Rocket, TrendingUp, Loader2 } from 'lucide-react';
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
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion, getDoc, increment } from 'firebase/firestore';
import { CommissionCalculator } from '@/lib/commission-calculator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { businessRoles, businessTypes, businessMappings } from '@/lib/business-data';
import { countries } from '@/lib/data';

const PAYMENT_TIERS = {
  free: { 
    usd: 0, 
    instantPgc: 1, 
    totalPgc: 1,
    label: 'Free Account',
    description: 'Perfect for getting started',
    bonus: 'First 20,000 users get 1 PGC bonus',
    stage1: 1,
    stage2: 1,
    stage3: 1,
  },
  basic: { 
    usd: 10, 
    instantPgc: 20, 
    totalPgc: 160,
    label: 'Basic - $10 USD',
    description: 'Great start with 20 PGC instantly',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    stage1: 40,
    stage2: 80,
    stage3: 160,
  },
  starter: { 
    usd: 50, 
    instantPgc: 100, 
    totalPgc: 800,
    label: 'Starter - $50 USD', 
    description: 'Good value with 100 PGC instantly',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    stage1: 200,
    stage2: 400,
    stage3: 800,
  },
  premium: { 
    usd: 100, 
    instantPgc: 200, 
    totalPgc: 1600,
    label: 'Premium - $100 USD',
    description: 'Best value with 200 PGC instantly',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    stage1: 400,
    stage2: 800,
    stage3: 1600,
  },
  advanced: { 
    usd: 250, 
    instantPgc: 500, 
    totalPgc: 4000,
    label: 'Advanced - $250 USD',
    description: 'Serious earning with 500 PGC instantly',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    stage1: 1000,
    stage2: 2000,
    stage3: 4000,
  },
  elite: { 
    usd: 1000, 
    instantPgc: 2000, 
    totalPgc: 16000,
    label: 'Elite - $1000 USD',
    description: 'Maximum benefits with 2000 PGC instantly',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
    stage1: 4000,
    stage2: 8000,
    stage3: 16000,
  }
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
  referredBy: z.string().optional(),
  accountType: z.enum(['free', 'basic', 'starter', 'premium', 'advanced', 'elite']),
  walletAddress: z.string().optional(),
  primaryRole: z.string().optional(),
  businessType: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'PGC-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};


function RegistrationForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const referredByCode = searchParams.get('ref') || '';
  const [availableBusinessTypes, setAvailableBusinessTypes] = useState<string[]>(businessTypes);

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      referredBy: referredByCode,
      email: '',
      password: '',
      country: 'India',
      state: '',
      district: '',
      taluka: '',
      village: '',
      street: '',
      accountType: 'free',
      walletAddress: '',
      primaryRole: '',
      businessType: '',
    },
  });

  const selectedAccountType = form.watch('accountType');
  const primaryRole = form.watch('primaryRole');

  useEffect(() => {
    if (primaryRole && businessMappings[primaryRole]) {
      setAvailableBusinessTypes(businessMappings[primaryRole]);
    } else {
      setAvailableBusinessTypes(businessTypes);
    }
    form.setValue('businessType', ''); // Reset business type when role changes
  }, [primaryRole, form]);

  const onSubmit = async (data: RegistrationFormValues) => {
    console.log('🔄 STARTING REGISTRATION...', data);
    setIsSubmitting(true);

    try {
      // Step 1: Create user in Firebase Auth
      console.log('📝 Creating auth user...');
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const authUser = userCredential.user;
      console.log('✅ AUTH USER CREATED:', authUser.uid);

      // Step 2: Update profile with name
      await updateProfile(authUser, { displayName: data.name });
      console.log('✅ USER PROFILE UPDATED');

      // Step 3: Generate referral code
      const newReferralCode = generateReferralCode();
      console.log('🎯 GENERATED REFERRAL CODE:', newReferralCode);

      // Step 4: Find referrer if referral code was used
      let referrerUserId = null;

      if (data.referredBy && data.referredBy.trim() !== '') {
        console.log('🔍 LOOKING UP REFERRER CODE:', data.referredBy);
        
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('referralCode', '==', data.referredBy.trim()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const referrerDoc = querySnapshot.docs[0];
          referrerUserId = referrerDoc.id;
          console.log('✅ REFERRER FOUND:', referrerDoc.data().email);
        } else {
          console.log('❌ REFERRER NOT FOUND');
        }
      }

      const tier = PAYMENT_TIERS[data.accountType];
      let pgcBalance = tier.instantPgc;
      let usdBalance = tier.usd;
      
      const userDocData = {
        email: data.email,
        name: data.name,
        referralCode: newReferralCode,
        referredByUserId: referrerUserId,
        role: 'User',
        status: 'Active',
        accountType: data.accountType,
        registeredAt: new Date(),
        country: data.country,
        state: data.state,
        district: data.district,
        taluka: data.taluka,
        village: data.village,
        street: data.street,
        countryDisplay: data.country,
        stateDisplay: data.state,
        districtDisplay: data.district,
        talukaDisplay: data.taluka,
        villageDisplay: data.village,
        streetDisplay: data.street,
        walletAddress: data.walletAddress || '',
        usdBalance: usdBalance,
        pgcBalance: pgcBalance,
        totalInvestment: usdBalance,
        currentStage: 0,
        potentialPgc: tier.totalPgc,
        totalCommission: 0,
        currentFreeRank: 'None',
        currentPaidRank: 'None',
        freeAchievers: { bronze: 0, silver: 0, gold: 0 },
        paidAchievers: { bronzeStar: 0, silverStar: 0, goldStar: 0 },
        direct_team: [],
        primaryRole: data.primaryRole || null,
        businessType: data.businessType || null,
      };

      console.log('💾 SAVING USER TO FIRESTORE...');
      await setDoc(doc(firestore, 'users', authUser.uid), userDocData);
      console.log('✅ USER DOCUMENT SAVED TO FIRESTORE');

      if (referrerUserId) {
        console.log('💰 UPDATING REFERRER TEAM & COMMISSIONS...');
        
        const referrerUpdateData: any = {
          direct_team: arrayUnion(authUser.uid),
        };

        if (data.accountType !== 'free') {
          await CommissionCalculator.calculateRegistrationCommissions(
            authUser.uid,
            data.name,
            referrerUserId,
            tier.usd
          );
        }

        await updateDoc(doc(firestore, 'users', referrerUserId), referrerUpdateData);
        console.log('✅ REFERRER UPDATED');
      }

      console.log('📧 SENDING VERIFICATION EMAIL...');
      await sendEmailVerification(authUser);
      console.log('✅ VERIFICATION EMAIL SENT');

      await signOut(auth);
      console.log('✅ USER SIGNED OUT');

      toast({
        title: 'Registration Successful! 🎉',
        description: "Please check your email to verify your account, then log in.",
      });

      console.log('🎉 REGISTRATION COMPLETED');
      router.push('/login');

    } catch (error: any) {
      console.error('❌ REGISTRATION ERROR:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email.';
      }

      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getTotalUsersCount = async () => {
    try {
      const usersRef = collection(firestore, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.size;
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  };


  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'free': return <UserPlus className="h-4 w-4" />;
      case 'basic': return <Star className="h-4 w-4 text-blue-500" />;
      case 'starter': return <Zap className="h-4 w-4 text-green-500" />;
      case 'premium': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'advanced': return <Rocket className="h-4 w-4 text-purple-500" />;
      case 'elite': return <Rocket className="h-4 w-4 text-red-500" />;
      default: return <UserPlus className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center gap-4 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-6 w-6" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Create Your Account</CardTitle>
                <CardDescription>Join the Public Governance platform - Choose your investment level</CardDescription>
            </div>
        </div>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Enter your complete address to participate in voting at all 8 levels (International to Street)
              </AlertDescription>
            </Alert>
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">1. Personal & Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password *</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormDescription>Min. 6 characters.</FormDescription><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="walletAddress" render={({ field }) => (<FormItem><FormLabel>Wallet Address (Optional)</FormLabel><FormControl><Input placeholder="For receiving PGC and rewards" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2"><MapPin className="h-5 w-5" /> 2. Geographical Area (for Voting)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel><Globe className="h-4 w-4 inline mr-1" />Country *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your country" /></SelectTrigger></FormControl><SelectContent className="max-h-60">{countries.map((c) => (<SelectItem key={c.value} value={c.label}>{c.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel><Building className="h-4 w-4 inline mr-1" />State *</FormLabel><FormControl><Input placeholder="e.g., Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="district" render={({ field }) => (<FormItem><FormLabel>District *</FormLabel><FormControl><Input placeholder="e.g., Mumbai" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="taluka" render={({ field }) => (<FormItem><FormLabel>Taluka/Block *</FormLabel><FormControl><Input placeholder="e.g., Andheri" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="village" render={({ field }) => (<FormItem><FormLabel><Home className="h-4 w-4 inline mr-1" />Village/Ward *</FormLabel><FormControl><Input placeholder="e.g., Juhu" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="street" render={({ field }) => (<FormItem><FormLabel>Street (Optional)</FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">3. Role & Business Type (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="primaryRole" render={({ field }) => (<FormItem><FormLabel>Primary Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your primary role" /></SelectTrigger></FormControl><SelectContent>{businessRoles.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="businessType" render={({ field }) => (<FormItem><FormLabel>Business Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger disabled={!primaryRole}><SelectValue placeholder={primaryRole ? "Select your business type" : "Select a role first"} /></SelectTrigger></FormControl><SelectContent className="max-h-60">{availableBusinessTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              </div>
            </div>
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-semibold">4. Choose Your Account Tier</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {Object.entries(PAYMENT_TIERS).map(([key, tier]) => (
                        <div key={key}>
                          <FormControl>
                            <RadioGroupItem value={key} id={key} className="peer sr-only" />
                          </FormControl>
                          <Label
                            htmlFor={key}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <div className="flex items-center gap-2 mb-2"> {getTierIcon(key)} <span className="font-semibold">{tier.label}</span></div>
                            <div className="text-center"><p className="text-lg font-bold">${tier.usd} USD</p><p className="text-sm text-green-600 font-semibold">Instant: {tier.instantPgc} PGC</p><p className="text-xs text-blue-600 font-semibold">Total: {tier.totalPgc} PGC</p><p className="text-xs text-muted-foreground mt-1">{tier.bonus}</p></div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referredBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Code (Optional)</FormLabel>
                  <FormControl><Input placeholder="Enter referral code" {...field} /></FormControl>
                  <FormDescription>If someone referred you, enter their code here</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Creating Account...' : 'Create Account & Start Voting'}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
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
