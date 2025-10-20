'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useAuth, useDoc, useMemoFirebase } from '@/firebase';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Shield, LogIn } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { useWallet } from '@solana/wallet-adapter-react';
import { ADMIN_WALLET_ADDRESS } from '@/lib/config';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function AdminLoginForm() {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Let the main page component handle redirection based on admin role
      toast({
        title: 'Login Successful',
        description: 'Redirecting to admin dashboard...',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid credentials.',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <Shield className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-headline mt-4">Admin Access</CardTitle>
            <CardDescription>Please sign in to continue.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { wallet, publicKey } = useWallet();

  const isWalletAdmin = publicKey?.toBase58() === ADMIN_WALLET_ADDRESS;

  const adminRoleRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminRole, isLoading: isRoleLoading } = useDoc(adminRoleRef);

  useEffect(() => {
    // Redirect if wallet admin is connected
    if (isWalletAdmin) {
      router.replace('/admin');
      return;
    }

    // Redirect if Firebase user is admin
    if (!isUserLoading && user && !isRoleLoading && adminRole) {
      router.replace('/admin');
      return;
    }
  
    // If a user is logged in but not an admin, redirect them away.
    if (!isUserLoading && user && !isRoleLoading && !adminRole) {
       router.replace('/');
       return;
    }
  }, [user, adminRole, isUserLoading, isRoleLoading, router, isWalletAdmin]);


  // While checking auth, show loading
  if (isUserLoading || (user && isRoleLoading) || (wallet && publicKey === null)) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  // If user is already identified as an admin (either via wallet or Firebase), they'll be redirected.
  // We return null here to prevent flashing the login form during the redirect.
  if (isWalletAdmin || (user && adminRole)) {
    return null;
  }

  // Show login form only if no admin is identified.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
