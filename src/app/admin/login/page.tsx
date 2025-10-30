
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
import { Shield } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function AdminLoginForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!auth || !firestore) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // THIS IS THE CRITICAL FIX:
      // Securely fetch ONLY the document for the user that just logged in.
      // This is a 'get' operation on a specific document, which the rules allow.
      // It replaces the insecure 'list' operation that was causing the error.
      const userDocRef = doc(firestore, 'users', userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let hasAdminRole = false;
      let userData: any = {};

      if (userDocSnap.exists()) {
        userData = userDocSnap.data();
        if (userData.role && userData.role.includes('Admin')) {
            hasAdminRole = true;
        }
      }
      
      // If the special admin logs in but doesn't have the role, assign it.
      // This 'setDoc' operation is on a specific user and is secure.
      if (data.email.toLowerCase() === 'admin@publicgovernance.com' && userData.role !== 'Super Admin') {
        await setDoc(userDocRef, { role: 'Super Admin' }, { merge: true });
        hasAdminRole = true; // Ensure they are treated as an admin immediately
        toast({
            title: 'Admin Role Assigned',
            description: 'Your Super Admin privileges have been set.',
        });
      }

      if (hasAdminRole) {
            toast({
                title: 'Admin Login Successful',
                description: 'Redirecting to admin dashboard...',
            });
            router.push('/admin');
            router.refresh(); // Force refresh to ensure new role is picked up everywhere
      } else {
             toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'This account does not have admin privileges.',
            });
            await auth.signOut();
      }

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
  const router = useRouter();

  const hasAdminRole = user?.role?.includes('Admin');

  useEffect(() => {
    if (isUserLoading) return;

    if (user && hasAdminRole) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, hasAdminRole, router]);

  if (isUserLoading || (user && hasAdminRole)) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
