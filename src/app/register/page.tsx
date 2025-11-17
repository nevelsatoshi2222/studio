
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
import { useFirebaseApp } from '@/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { countries, businessRoles, businessTypes, businessMappings } from '@/lib/data';

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
  primaryRole: z.string().optional(),
  businessType: z.string().optional(),
  referredByCode: z.string().optional(),
  isPaid: z.boolean().default(false),
  walletAddress: z.string().optional(),
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
      email: '',
      password: '',
      country: '',
      state: '',
      district: '',
      taluka: '',
      village: '',
      street: '',
      primaryRole: '',
      businessType: '',
      referredByCode: searchParams.get('ref') || '',
      isPaid: false,
      walletAddress: '',
    },
  });

  const selectedPrimaryRole = form.watch('primaryRole');
  const availableBusinessTypes = selectedPrimaryRole ? businessMappings[selectedPrimaryRole as keyof typeof businessMappings] || [] : businessTypes;

  useEffect(() => {
    form.resetField('businessType');
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
      
      const result = await createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
        claims: { 
          role: data.primaryRole || 'User',
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center gap-4 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-6 w-6" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Create Your Account</CardTitle>
                <CardDescription>Join the Public Governance platform</CardDescription>
            </div>
        </div>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">1. Personal & Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password *</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormDescription>Min. 6 characters.</FormDescription><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="walletAddress" render={({ field }) => (<FormItem><FormLabel>Wallet Address (Optional)</FormLabel><FormControl><Input placeholder="For receiving PGC and rewards" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="referredByCode" render={({ field }) => (<FormItem><FormLabel>Referral Code (Optional)</FormLabel><FormControl><Input placeholder="Enter referral code" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">2. Business & Role (Optional)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="primaryRole" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Primary Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select your primary role" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {businessRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="businessType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Specific Business Type</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value} disabled={!selectedPrimaryRole}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select your business type" /></SelectTrigger></FormControl>
                                <SelectContent className="max-h-60">
                                    {availableBusinessTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2"><MapPin className="h-5 w-5" /> 3. Geographical Area (for Voting)</h3>
              <Alert><AlertCircle className="h-4 w-4" /><AlertDescription>This is crucial for enabling your voting rights at local levels.</AlertDescription></Alert>
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
                <h3 className="font-semibold text-lg">4. Account Type</h3>
                 <FormField
                    control={form.control}
                    name="isPaid"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-base">Register with $100 Paid Package?</FormLabel>
                                <FormDescription>
                                    Select this to get a 200 PGC bonus and activate commissions for your referrer. This is required for the "Paid User Track" in the affiliate program.
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
