
'use client';
import { Suspense } from 'react';
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
import { UserPlus, Loader2 } from 'lucide-react';
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
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDocs, collection, query, where, writeBatch } from 'firebase/firestore';


const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  country: z.string().min(1, { message: 'Please select a country' }),
  referredByCode: z.string().optional(),
  accountType: z.enum(['free', 'paid']),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const countries = [
  { label: 'India', value: 'India' },
  { label: 'United States', value: 'United States' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' },
];

function RegistrationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth(); 
  const firestore = useFirestore();

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
    if (!auth || !firestore) {
      toast({ variant: 'destructive', title: 'Firebase not initialized.' });
      return;
    }

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: data.name });

      // 2. Prepare the user document. The onUserCreate function will handle the rest.
      const newUserDocRef = doc(firestore, 'users', user.uid);
      const referralCode = `PGC-${user.uid.substring(0, 8).toUpperCase()}`;
      
      const userDocumentData = {
        uid: user.uid,
        name: data.name,
        email: data.email,
        phone: null,
        street: '',
        village: '',
        block: '',
        taluka: '',
        district: '',
        area: '',
        state: '',
        country: data.country,
        pgcBalance: 0,
        usdtBalance: 0,
        referredByCode: data.referredByCode || null, // Pass the code for the backend function
        referralCode: referralCode,
        walletPublicKey: null,
        isVerified: false,
        status: 'Active',
        role: 'User',
        avatarId: `avatar-${Math.ceil(Math.random() * 4)}`,
        registeredAt: serverTimestamp(),
        directReferrals: [],
        totalTeamSize: 0,
        paidTeamSize: 0,
        freeRank: 'None',
        paidRank: 'None',
        isPaid: data.accountType === 'paid'
      };
      
      // Set the document. This will trigger the onUserCreate function on the backend.
      await setDoc(newUserDocRef, userDocumentData);
      
      toast({
        title: 'Registration Successful! 🎉',
        description: "Your account has been created. Please log in.",
      });

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
    
