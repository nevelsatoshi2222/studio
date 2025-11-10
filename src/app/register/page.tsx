'use client';
import { Suspense, useState } from 'react';
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
import { UserPlus, Crown } from 'lucide-react';
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
import { useAuth, useFirestore } from '@/firebase'; //fix
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion, getDoc, increment } from 'firebase/firestore';
import { CommissionCalculator } from '@/lib/commission-calculator';

// Simple registration schema - removed optional fields for testing
const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  country: z.string().min(1, { message: 'Please select a country' }),
  referredBy: z.string().optional(),
  accountType: z.enum(['free', 'paid']),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

// Generate UNIQUE referral code
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Simple countries list for testing
const countries = [
  { label: 'India', value: 'india' },
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
];

function RegistrationForm() {
  // ✅ FIX: Add auth and firestore hooks here
  const auth = useAuth();
  const firestore = useFirestore();
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const referredByCode = searchParams.get('ref') || '';

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      referredBy: referredByCode,
      email: '',
      password: '',
      country: '',
      accountType: 'free',
    },
  });

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
        
        const usersRef = collection(firestore, 'users'); // ✅ FIXED: db → firestore
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

      // Step 5: Create user document in Firestore
      const isPaidAccount = data.accountType === 'paid';
      const initialBalance = isPaidAccount ? 10000 : 1000;

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
        usdBalance: initialBalance,
        pgcBalance: initialBalance * 10,
        currentFreeRank: 'None',
        currentPaidRank: 'None',
        freeAchievers: { bronze: 0, silver: 0, gold: 0 },
        paidAchievers: { bronzeStar: 0, silverStar: 0, goldStar: 0 },
        freeAchievements: { bronze: false, silver: false, gold: false },
        paidAchievements: { bronzeStar: false, silverStar: false, goldStar: false },
        totalCommission: 0,
        walletAddress: '',
        direct_team: [],
      };

      console.log('💾 SAVING USER TO FIRESTORE...');
      await setDoc(doc(firestore, 'users', authUser.uid), userDocData); // ✅ FIXED: db → firestore
      console.log('✅ USER DOCUMENT SAVED TO FIRESTORE');

      // Step 6: Update referrer's team if exists
      if (referrerUserId) {
        console.log('💰 UPDATING REFERRER TEAM...');
        
        const referrerUpdateData: any = {
          direct_team: arrayUnion(authUser.uid),
        };

        if (data.accountType === 'free') {
          referrerUpdateData['freeAchievers.bronze'] = increment(1);
        } else if (data.accountType === 'paid') {
          referrerUpdateData['paidAchievers.bronzeStar'] = increment(1);
          
          // ✅ TRIGGER COMMISSION CALCULATION FOR PAID REGISTRATION ($100 in USDT)
          console.log('💰 CALCULATING COMMISSIONS FOR PAID ACCOUNT...');
          
          await CommissionCalculator.calculateRegistrationCommissions(
            authUser.uid, // new paid user
            data.name,    // user name
            referrerUserId // referrer
          );
        }

        await updateDoc(doc(firestore, 'users', referrerUserId), referrerUpdateData); // ✅ FIXED: db → firestore
        console.log('✅ REFERRER UPDATED');

        // ✅ ENHANCED: Check and update reward progression
        const referrerDoc = await getDoc(doc(firestore, 'users', referrerUserId)); // ✅ FIXED: db → firestore
        if (referrerDoc.exists()) {
          const referrerData = referrerDoc.data();
          const directTeamCount = referrerData.direct_team?.length || 0;
          
          // ✅ CHECK FOR FREE BRONZE RANK (5 direct members)
          if (directTeamCount >= 5 && (!referrerData.currentFreeRank || referrerData.currentFreeRank === 'None')) {
            console.log('🎉 AWARDING BRONZE TO REFERRER!');
            await updateDoc(doc(firestore, 'users', referrerUserId), { // ✅ FIXED: db → firestore
              currentFreeRank: 'Bronze',
              coins: increment(1),
              usdBalance: increment(10),
              'freeAchievements.bronze': true
            });
            
            // ✅ NOW UPDATE THE REFERRER'S UPLINE (for Silver rank progression)
            if (referrerData.referredByUserId) {
              console.log('🔄 UPDATING UPLINE FOR SILVER PROGRESSION...');
              const uplineRef = doc(firestore, 'users', referrerData.referredByUserId); // ✅ FIXED: db → firestore
              await updateDoc(uplineRef, {
                'freeAchievers.bronze': increment(1)
              });
              console.log('✅ UPLINE UPDATED FOR SILVER PROGRESSION');
            }
          }
          
          // ✅ CHECK FOR PAID BRONZE STAR RANK (5 direct paid members)
          const paidDirectMembers = referrerData.paidAchievers?.bronzeStar || 0;
          if (data.accountType === 'paid' && paidDirectMembers >= 4 && (!referrerData.currentPaidRank || referrerData.currentPaidRank === 'None')) {
            // This will be the 5th paid member, award Bronze Star
            console.log('🎉 AWARDING BRONZE STAR TO REFERRER!');
            await updateDoc(doc(firestore, 'users', referrerUserId), { // ✅ FIXED: db → firestore
              currentPaidRank: 'Bronze Star',
              coins: increment(2.5),
              usdBalance: increment(25),
              'paidAchievements.bronzeStar': true
            });
          }
        }
      }

      // Step 7: Send email verification
      console.log('📧 SENDING VERIFICATION EMAIL...');
      await sendEmailVerification(authUser);
      console.log('✅ VERIFICATION EMAIL SENT');

      // Step 8: Sign out
      await signOut(auth);
      console.log('✅ USER SIGNED OUT');

      // Step 9: Show success message
      toast({
        title: 'Registration Successful! 🎉',
        description: `Your referral code: ${newReferralCode}. Please check your email to verify your account.`,
      });

      console.log('🎉 REGISTRATION COMPLETED');
      router.push('/login');

    } catch (error: any) {
      console.error('❌ REGISTRATION ERROR:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check your email.';
      } else if (error.message) {
        errorMessage = error.message;
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
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
          <CardContent className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>Must be at least 6 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country Field */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Type */}
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          <span>Free Account</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="paid">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-yellow-600" />
                          <span>Paid Account - $100 USD</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {form.watch('accountType') === 'paid' 
                      ? 'Paid accounts earn higher commissions' 
                      : 'Free accounts can earn through referrals'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referral Code */}
            <FormField
              control={form.control}
              name="referredBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Code (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter referral code" {...field} />
                  </FormControl>
                  <FormDescription>If someone referred you, enter their code here</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
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