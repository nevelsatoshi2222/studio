
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
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }).optional(),
  street: z.string().optional(),
  village: z.string().optional(),
  block: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
  area: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  referredBy: z.string().optional(),
  role: z.string().optional(),
  jobTitle: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

function RegistrationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const referredByCode = searchParams.get('ref') || '';
  const role = searchParams.get('role');
  const jobTitle = searchParams.get('title');

  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      referredBy: referredByCode,
      role: role || 'User',
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
    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Authentication service is not available. Please try again later.',
        });
        return;
    }
    try {
      // Step 1: Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      // Step 2: Update the user's display name. This is what the onUserCreate Cloud Function will see.
      await updateProfile(user, { displayName: data.name });

      // Step 3: Send verification email.
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      };
      await sendEmailVerification(user, actionCodeSettings);

      // Step 4: Sign the user out to force them to verify their email.
      // The onUserCreate Cloud Function will handle creating the Firestore document securely on the backend.
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
                  <Label>Address (Optional)</Label>
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
                name="referredBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referrer Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter referrer code or use a referral link" {...field} />
                    </FormControl>
                    <FormDescription>This is the code of the user who referred you. Leave blank if you don't have one.</FormDescription>
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
