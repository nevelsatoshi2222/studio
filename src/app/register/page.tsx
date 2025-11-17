
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserPlus, MapPin, Home, Building, Globe, AlertCircle, Loader2 } from 'lucide-react';
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
import { useFirebaseApp } from '@/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { countries } from '@/lib/data';
import { businessRoles, businessTypes, businessMappings } from '@/lib/business-data';

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
  isPaid: z.boolean().default(false),
  walletAddress: z.string().optional(),
  primaryRole: z.string().optional(),
  businessType: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

function RegistrationForm() {
  const firebaseApp = useFirebaseApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableBusinessTypes, setAvailableBusinessTypes] = useState<string[]>(businessTypes);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      country: 'India', // Default to India
      state: '',
      district: '',
      taluka: '',
      village: '',
      street: '',
      referredByCode: searchParams.get('ref') || '',
      isPaid: false,
      walletAddress: '',
      primaryRole: '',
      businessType: ''
    },
  });

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
    setIsSubmitting(true);
    if (!firebaseApp) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firebase services not available.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const functions = getFunctions(firebaseApp);
      const createUser = httpsCallable(functions, 'createUser');
      
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
          referredByCode: data.referredByCode || null,
          isPaid: data.isPaid,
          walletAddress: data.walletAddress || null,
          primaryRole: data.primaryRole || null,
          businessType: data.businessType || null,
        }
      });

      const resultData = result.data as { success: boolean, message: string, userId?: string };

      if (resultData.success && resultData.userId) {
        toast({
          title: 'Registration Initiated!',
          description: "Your account is being set up. Please check your email for verification before logging in.",
          duration: 7000,
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <UserPlus className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-2xl font-headline mt-4">Create Your Account</CardTitle>
        <CardDescription>Join the Public Governance platform and start making a difference.</CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
             <div className="space-y-4 p-4 border rounded-lg bg-card">
                <h3 className="font-semibold text-lg">1. Personal & Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="name" render={({ field }) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="password" render={({ field }) => (<FormItem><FormLabel>Password *</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormDescription>Min. 6 characters.</FormDescription><FormMessage /></FormItem>)} />
                  <FormField name="walletAddress" render={({ field }) => (<FormItem><FormLabel>Wallet Address (Optional)</FormLabel><FormControl><Input placeholder="For receiving PGC and rewards" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="referredByCode" render={({ field }) => (<FormItem><FormLabel>Referral Code (Optional)</FormLabel><FormControl><Input placeholder="Enter referral code" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2"><MapPin className="h-5 w-5" /> 2. Geographical Area (for Voting)</h3>
              <Alert><AlertCircle className="h-4 w-4" /><AlertDescription>This information is required to determine your eligibility for local, state, and national voting.</AlertDescription></Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel><Globe className="h-4 w-4 inline mr-1" />Country *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your country" /></SelectTrigger></FormControl><SelectContent className="max-h-60">{countries.map((c) => (<SelectItem key={c.value} value={c.label}>{c.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField name="state" render={({ field }) => (<FormItem><FormLabel><Building className="h-4 w-4 inline mr-1" />State *</FormLabel><FormControl><Input placeholder="e.g., Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="district" render={({ field }) => (<FormItem><FormLabel>District *</FormLabel><FormControl><Input placeholder="e.g., Mumbai" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="taluka" render={({ field }) => (<FormItem><FormLabel>Taluka/Block *</FormLabel><FormControl><Input placeholder="e.g., Andheri" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="village" render={({ field }) => (<FormItem><FormLabel><Home className="h-4 w-4 inline mr-1" />Village/Ward *</FormLabel><FormControl><Input placeholder="e.g., Juhu" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="street" render={({ field }) => (<FormItem><FormLabel>Street (Optional)</FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>

             <div className="space-y-4 p-4 border rounded-lg bg-card">
                <h3 className="font-semibold text-lg">3. Role & Business Type (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="primaryRole" render={({ field }) => (<FormItem><FormLabel>Primary Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your primary role" /></SelectTrigger></FormControl><SelectContent>{businessRoles.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="businessType" render={({ field }) => (<FormItem><FormLabel>Business Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger disabled={!primaryRole}><SelectValue placeholder={primaryRole ? "Select your business type" : "Select a role first"} /></SelectTrigger></FormControl><SelectContent className="max-h-60">{availableBusinessTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
            </div>

             <div className="space-y-4 p-4 border rounded-lg bg-card">
                <h3 className="font-semibold text-lg">4. Account Type</h3>
                 <FormField
                    control={form.control}
                    name="isPaid"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                                <Input 
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={e => field.onChange(e.target.checked)}
                                    className="h-6 w-6 mt-1 accent-primary"
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-base font-bold">Register with $100 Paid Package?</FormLabel>
                                <FormDescription>
                                    Select this to get a 200 PGC bonus and activate commissions for your referrer.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
            </div>
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
