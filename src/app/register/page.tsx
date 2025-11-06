
'use client';
import { Suspense, useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserPlus, Crown, Sparkles, Loader2 } from 'lucide-react';
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
import Link from 'next/link';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth as useMainAuth } from '@/firebase'; // Use the main auth hook

// --- Registration Schema ---
const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  country: z.string().min(1, { message: 'Please select a country' }),
  referredByCode: z.string().optional(),
  accountType: z.enum(['free', 'paid']),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

// --- Helper: Create a secondary Firebase app for isolated auth operations ---
function createSecondaryApp(): FirebaseApp {
    const apps = getApps();
    const secondaryAppName = 'secondaryRegistrationApp';
    const existingApp = apps.find(app => app.name === secondaryAppName);
    if (existingApp) {
        return existingApp;
    }
    // Initialize with a unique name
    return initializeApp(firebaseConfig, secondaryAppName);
}

// --- Country List ---
const countries = [
  { label: 'India', value: 'India' },
  { label: 'United States', value: 'United States' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' },
];

// --- The Registration Form Component ---
function RegistrationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const mainAuth = useMainAuth(); // Get the main auth instance from our provider

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      country: '',
      referredByCode: searchParams.get('ref') || '',
      accountType: 'free',
    },
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      // 1. Initialize a secondary, isolated Firebase app instance.
      // This is crucial to prevent the current user's session from interfering.
      const secondaryApp = createSecondaryApp();
      const secondaryAuth = getAuth(secondaryApp);
      
      // 2. Call the Cloud Function to set custom claims FIRST.
      // This attaches the referral code and country to the user's auth token before they are created.
      const functions = getFunctions(mainAuth.app); // Use main app's functions instance
      const setCustomClaims = httpsCallable(functions, 'setCustomClaims');

      // 3. Create the user in Firebase Auth using the secondary instance.
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
      const authUser = userCredential.user;

      // 4. Now that the user exists, set their claims.
      await setCustomClaims({
        uid: authUser.uid,
        claims: {
          role: 'User', // All new signups start as 'User'
          country: data.country,
          referredByCode: data.referredByCode || null,
          isPaid: data.accountType === 'paid',
        },
      });
      
      // 5. Update their display name in Auth. The backend `onUserCreate` function will read this.
      await updateProfile(authUser, { displayName: data.name });

      // 6. IMPORTANT: Sign out the new user from the secondary auth instance.
      // This prevents the new user's session from replacing the current user's (if any).
      await signOut(secondaryAuth);
      
      toast({
        title: 'Registration Successful! 🎉',
        description: "You will be redirected to the login page. Please check your email for a verification link.",
      });

      // 7. Redirect to login page for a clean user flow.
      router.push('/login');

    } catch (error: any) {
      console.error('❌ REGISTRATION ERROR:', error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login or use a different email.';
      }
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center gap-4 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-6 w-6" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Create Your Account</CardTitle>
                <CardDescription>Join the platform and start building your network.</CardDescription>
            </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select your country" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                  <FormDescription>Must be at least 6 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referredByCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Code (Optional)</FormLabel>
                  <FormControl><Input placeholder="Enter referral code from your inviter" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select account type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="free">Free Membership</SelectItem>
                      <SelectItem value="paid">Paid Membership ($100)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                     {form.watch('accountType') === 'paid' 
                      ? 'Paid members enable higher commission rates for their referrers.' 
                      : 'You can upgrade to a paid membership at any time.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting} size="lg">
              {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Registering...</> : 'Create Account'}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <RegistrationForm />
      </Suspense>
    </AppLayout>
  );
}
