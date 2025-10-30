
'use client';
import { Suspense, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { countries } from '@/lib/data';
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
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, getDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { AppUser } from '@/firebase/provider';


const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  street: z.string().min(1, { message: 'Street is required.' }),
  village: z.string().min(1, { message: 'Village/Town is required.' }),
  block: z.string().optional(),
  taluka: z.string().min(1, { message: 'Taluka is required.' }),
  district: z.string().min(1, { message: 'District is required.' }),
  area: z.string().optional(),
  state: z.string().min(1, { message: 'State is required.' }),
  country: z.string().min(1, { message: 'Country is required.' }),
  referrerId: z.string(),
  role: z.string().optional(),
  jobTitle: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

// Helper function to generate a unique referral code
function generateReferralCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


function RegistrationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const referrerId = searchParams.get('ref') || 'ADMIN_ROOT_USER';
  const role = searchParams.get('role');
  const jobTitle = searchParams.get('title');

  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      referrerId: referrerId,
      role: role || 'User', // Default to 'User' if no role in query param
      jobTitle: jobTitle || '',
      email: '',
      password: '',
      phone: '',
      street: '',
      village: '',
      block: '',
      taluka: '',
      district: '',
      area: '',
      state: '',
      country: '',
    },
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    if (!firestore || !auth) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Firebase is not initialized. Please try again later.',
        });
        return;
    }
    try {
      // 1. Get referrer's data to build the ancestor path
      let ancestors: string[] = [];
      let finalReferrerId = data.referrerId.trim();

      if (!finalReferrerId) {
        finalReferrerId = 'ADMIN_ROOT_USER';
      }

      if (finalReferrerId && finalReferrerId !== 'ADMIN_ROOT_USER') {
        const referrerDocRef = doc(firestore, 'users', finalReferrerId);
        const referrerSnap = await getDoc(referrerDocRef);
        if (referrerSnap.exists()) {
          const referrerData = referrerSnap.data() as AppUser;
          // New ancestor list is the referrer's own ancestors, plus the referrer themselves.
          ancestors = [...(referrerData.ancestors || []), finalReferrerId].slice(-15); // Keep max 15 levels
        } else {
          // If referrer doesn't exist, treat them as a root user for safety.
          finalReferrerId = 'ADMIN_ROOT_USER';
        }
      }

      // 2. Create the new user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: data.name });

      // 3. Create the user document in Firestore with the new MLM structure
      const userDocRef = doc(firestore, 'users', user.uid);
      
      let finalRole = data.role || 'User';
      if (data.email.toLowerCase() === 'admin@publicgovernance.com') {
        finalRole = 'Super Admin';
      }
      
      const userDocumentData = {
        id: user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        street: data.street,
        village: data.village,
        block: data.block || '',
        taluka: data.taluka,
        district: data.district,
        area: data.area || '',
        state: data.state,
        country: data.country,
        pgcBalance: 0,
        referrerId: finalReferrerId,
        referralCode: generateReferralCode(), // Generate a unique code for this new user
        ancestors: ancestors, // The new materialized path
        freeAchievers: { bronze: 0, silver: 0, gold: 0 },
        paidAchievers: { bronzeStar: 0, silverStar: 0, goldStar: 0 },
        currentFreeRank: 'None',
        currentPaidRank: 'None',
        registeredAt: serverTimestamp(),
        status: finalRole.includes('Admin') || finalRole === 'User' ? 'Active' : 'Pending',
        avatarId: `user-avatar-${Math.ceil(Math.random() * 4)}`,
        role: finalRole,
        jobTitle: data.jobTitle || '',
      };

      await setDoc(userDocRef, userDocumentData);
      
      // 4. Create user wallet document
      await setDoc(doc(firestore, 'user_wallets', user.uid), {
          userId: user.uid,
          solanaWalletAddress: '' // To be filled in by user on their profile
      });

      // 5. Send verification email
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      };
      await sendEmailVerification(user, actionCodeSettings);

      // 6. Sign the user out to force email verification
      await signOut(auth);

      toast({
        title: 'Registration Successful!',
        description: 'Please check your email to verify your account before logging in.',
      });
      
      router.push('/login');
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email address is already registered. Please use a different email or log in.';
      } else if (error.message) {
          description = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-6 w-6" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Create Your Account</CardTitle>
                <CardDescription>Join the Public Governance platform and be part of the future.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
              {role && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applying for Role</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted"/>
                      </FormControl>
                      {jobTitle && <FormDescription>Position: {jobTitle}</FormDescription>}
                    </FormItem>
                  )}
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              
              <div className="space-y-2">
                  <Label>Address</Label>
                   <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className="pl-4">
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="village"
                    render={({ field }) => (
                      <FormItem className="pl-4">
                        <FormLabel>Village / Town</FormLabel>
                        <FormControl>
                          <Input placeholder="Springfield" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="block"
                    render={({ field }) => (
                      <FormItem className="pl-4">
                        <FormLabel>Block / Kasba (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Kasba" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="taluka"
                    render={({ field }) => (
                      <FormItem className="pl-4">
                        <FormLabel>Taluka / Sub-district</FormLabel>
                        <FormControl>
                          <Input placeholder="Springfield Taluka" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem className="pl-4">
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input placeholder="Shelbyville District" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem className="pl-4">
                        <FormLabel>Area (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Downtown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="pl-4">
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Illinois" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="pl-4">
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              {countries.map(country => (
                                  <SelectItem key={country.value} value={country.label}>
                                      {country.label}
                                  </SelectItem>
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
                name="referrerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referrer ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter referrer ID or use a referral link" {...field} />
                    </FormControl>
                    <FormDescription>This is the ID of the user who referred you.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Registering...' : 'Create Account'}
            </Button>
          </CardFooter>
        </form>
      </Form>
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
    

    
