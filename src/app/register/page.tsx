
'use client';
import { Suspense, useState, useEffect, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserPlus, Crown, MapPin, Home, Building, Globe, AlertCircle, Star, Zap, Rocket, TrendingUp, Loader2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
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
import { useFirebaseApp } from '@/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { businessRoles, businessMappings } from '@/lib/business-data';

// Payment tiers remain the same
const PAYMENT_TIERS = {
  free: { 
    usd: 0, 
    instantPgc: 1, 
    totalPgc: 1,
    label: 'Free Account',
    description: 'Perfect for getting started',
    bonus: 'First 20,000 users get 1 PGC bonus',
  },
  basic: { 
    usd: 10, 
    instantPgc: 20, 
    totalPgc: 160,
    label: 'Basic - $10 USD',
    description: 'Great start with 20 PGC instantly',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
  },
  starter: { 
    usd: 50, 
    instantPgc: 100, 
    totalPgc: 800,
    label: 'Starter - $50 USD', 
    description: 'Good value with 100 PGC instantly',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
  },
  premium: { 
    usd: 100, 
    instantPgc: 200, 
    totalPgc: 1600,
    label: 'Premium - $100 USD',
    description: 'Best value with 200 PGC instantly',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
  },
  advanced: { 
    usd: 250, 
    instantPgc: 500, 
    totalPgc: 4000,
    label: 'Advanced - $250 USD',
    description: 'Serious earning with 500 PGC instantly',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
  },
  elite: { 
    usd: 1000, 
    instantPgc: 2000, 
    totalPgc: 16000,
    label: 'Elite - $1000 USD',
    description: 'Maximum benefits with 2000 PGC instantly',
    bonus: '1:1 Instant Bonus + 3 Stage Doubling',
  }
};

const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  country: z.string().min(2, { message: 'Please enter your country' }),
  state: z.string().min(2, { message: 'Please enter your state/province' }),
  district: z.string().min(2, { message: 'Please enter your district' }),
  taluka: z.string().min(2, { message: 'Please enter your taluka/block' }),
  village: z.string().min(2, { message: 'Please enter your village/ward' }),
  street: z.string().optional(),
  referredBy: z.string().optional(),
  accountType: z.enum(['free', 'basic', 'starter', 'premium', 'advanced', 'elite']),
  walletAddress: z.string().optional(),
  primaryRole: z.string().min(1, { message: 'Please select a primary role' }),
  businessType: z.string().min(1, { message: 'Please select a business type' }),
  specificCrop: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

function RegistrationForm() {
  const firebaseApp = useFirebaseApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      referredBy: searchParams.get('ref') || '',
      email: '',
      password: '',
      country: '',
      state: '',
      district: '',
      taluka: '',
      village: '',
      street: '',
      accountType: 'free',
      walletAddress: '',
      primaryRole: '',
      businessType: '',
      specificCrop: '',
    },
  });

  const selectedAccountType = form.watch('accountType');
  const selectedPrimaryRole = useWatch({ control: form.control, name: 'primaryRole' });
  const selectedBusinessType = useWatch({ control: form.control, name: 'businessType' });
  
  const businessTypesForRole = useMemo(() => {
    if (!selectedPrimaryRole) return [];
    return businessMappings[selectedPrimaryRole as keyof typeof businessMappings] || [];
  }, [selectedPrimaryRole]);

  useEffect(() => {
    form.resetField('businessType', { defaultValue: '' });
  }, [selectedPrimaryRole, form]);

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    if (!firebaseApp) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firebase services not available.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const functions = getFunctions(firebaseApp);
      const createUser = httpsCallable(functions, 'createUser');
      
      const investmentTier = PAYMENT_TIERS[data.accountType].usd;
      const isPaid = investmentTier >= 100;
      const finalBusinessType = data.businessType === 'Vegetable Farming' && data.specificCrop 
        ? `Vegetable Farming: ${data.specificCrop}`
        : data.businessType;

      const result = await createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
        claims: { 
          role: 'User',
          country: data.country,
          state: data.state,
          district: data.district,
          taluka: data.taluka,
          village: data.village,
          street: data.street,
          referredByCode: data.referredBy || null,
          isPaid: isPaid,
          investmentTier: investmentTier,
          primaryRole: data.primaryRole,
          businessType: finalBusinessType,
          walletAddress: data.walletAddress || null
        }
      });
      
      const resultData = result.data as { success: boolean, message: string, userId?: string };

      if (resultData.success && resultData.userId) {
        toast({
          title: 'Registration Initiated!',
          description: "Your account is being set up. You can now log in.",
        });
        router.push('/login');
      } else {
        throw new Error(resultData.message || 'An unknown error occurred during user creation.');
      }
    } catch (error: any) {
      console.error('REGISTRATION ERROR:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.code === 'functions/already-exists' 
          ? 'This email address is already in use.' 
          : error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
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
             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">1. Personal & Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="name" render={({ field }) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="password" render={({ field }) => (<FormItem><FormLabel>Password *</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormDescription>Min. 6 characters.</FormDescription><FormMessage /></FormItem>)} />
                  <FormField name="walletAddress" render={({ field }) => (<FormItem><FormLabel>Wallet Address (Optional)</FormLabel><FormControl><Input placeholder="For receiving PGC and rewards" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="referredBy" render={({ field }) => (<FormItem><FormLabel>Referral Code (Optional)</FormLabel><FormControl><Input placeholder="Enter referral code" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2"><MapPin className="h-5 w-5" /> 2. Geographical Area (for Voting)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="country" render={({ field }) => (<FormItem><FormLabel><Globe className="h-4 w-4 inline mr-1" />Country *</FormLabel><FormControl><Input placeholder="e.g., India" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="state" render={({ field }) => (<FormItem><FormLabel><Building className="h-4 w-4 inline mr-1" />State *</FormLabel><FormControl><Input placeholder="e.g., Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="district" render={({ field }) => (<FormItem><FormLabel>District *</FormLabel><FormControl><Input placeholder="e.g., Mumbai" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="taluka" render={({ field }) => (<FormItem><FormLabel>Taluka/Block *</FormLabel><FormControl><Input placeholder="e.g., Andheri" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="village" render={({ field }) => (<FormItem><FormLabel><Home className="h-4 w-4 inline mr-1" />Village/Ward *</FormLabel><FormControl><Input placeholder="e.g., Juhu" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="street" render={({ field }) => (<FormItem><FormLabel>Street (Optional)</FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>

             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">3. Business & Role</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="primaryRole" render={({ field }) => (<FormItem><FormLabel>Primary Role *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your primary role" /></SelectTrigger></FormControl><SelectContent>{businessRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="businessType" render={({ field }) => (<FormItem><FormLabel>Business Type *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select business type" /></SelectTrigger></FormControl><SelectContent>{businessTypesForRole.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                 </div>
                 {selectedBusinessType === 'Vegetable Farming' && (
                    <FormField control={form.control} name="specificCrop" render={({ field }) => (<FormItem><FormLabel>Specific Crop/Vegetable</FormLabel><FormControl><Input placeholder="e.g., Tomato, Onion, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  )}
            </div>
            
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-semibold">4. Choose Your Account Tier</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(PAYMENT_TIERS).map(([key, tier]) => (
                        <FormItem key={key}>
                          <FormControl>
                            <RadioGroupItem value={key} id={key} className="peer sr-only" />
                          </FormControl>
                          <Label htmlFor={key} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                            <div className="flex items-center gap-2 mb-2"> {getTierIcon(key)} <span className="font-semibold">{tier.label}</span></div>
                            <div className="text-center"><p className="text-lg font-bold">${tier.usd} USD</p><p className="text-sm text-green-600 font-semibold">Instant: {tier.instantPgc} PGC</p><p className="text-xs text-blue-600 font-semibold">Total: {tier.totalPgc} PGC</p><p className="text-xs text-muted-foreground mt-1">{tier.bonus}</p></div>
                          </Label>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Creating Account...' : 'Create Account & Start Voting'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
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
