
'use client';
import { useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ShieldAlert, UserPlus } from 'lucide-react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';

const adminRoles = [
    'User Management Admin',
    'Job Management Admin',
    'Franchisee Management Admin',
    'Social Media Management Admin',
    'Quiz Management Admin',
    'Super Admin'
];

const createAdminSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.string().min(1, { message: "Please select a role." }),
});

type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

// Create a secondary Firebase app instance for admin creation
function createSecondaryApp(): FirebaseApp {
    const apps = getApps();
    const secondaryAppName = 'secondaryAdminApp';
    const existingApp = apps.find(app => app.name === secondaryAppName);
    if (existingApp) {
        return existingApp;
    }
    return initializeApp(firebaseConfig, secondaryAppName);
}

function CreateAdminForm() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<CreateAdminFormValues>({
        resolver: zodResolver(createAdminSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: '',
        },
    });

    const onSubmit = async (data: CreateAdminFormValues) => {
        if (!firestore) return;

        try {
            const secondaryApp = createSecondaryApp();
            const secondaryAuth = getAuth(secondaryApp);

            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: data.name });

            const userDocRef = doc(firestore, 'users', user.uid);
            await setDoc(userDocRef, {
                id: user.uid,
                name: data.name,
                email: data.email,
                role: data.role,
                status: 'Active',
                registeredAt: serverTimestamp(),
                pgcBalance: 0,
                avatarId: `user-avatar-${Math.ceil(Math.random() * 4)}`,
            });
            
            toast({
                title: "Admin Created",
                description: `Successfully created admin user ${data.name} with the role ${data.role}.`,
            });

            form.reset();

        } catch (error: any) {
            console.error("Failed to create admin user:", error);
            toast({
                variant: 'destructive',
                title: "Creation Failed",
                description: error.message || "An unknown error occurred.",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus /> Create New Admin
                </CardTitle>
                <CardDescription>
                    Use this form to create a new administrator account and assign them a specific management role.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl><Input type="email" placeholder="admin@example.com" {...field} /></FormControl>
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
                                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role to assign" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {adminRoles.map(role => (
                                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Creating...' : 'Create Admin Account'}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default function CreateAdminPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    const isSuperAdmin = user?.role === 'Super Admin';

    useEffect(() => {
        if (!isUserLoading && !isSuperAdmin) {
            router.replace('/admin/login');
        }
    }, [isUserLoading, isSuperAdmin, router]);

    return (
        <AppLayout>
            <div className="flex flex-col gap-8">
                {isUserLoading && <p>Verifying admin privileges...</p>}
                {!isUserLoading && !isSuperAdmin && (
                    <Card className="mt-8 border-destructive">
                        <CardHeader className="text-center">
                            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
                            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
                            <CardDescription>
                                You do not have Super Admin privileges to access this page.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
                {isSuperAdmin && <CreateAdminForm />}
            </div>
        </AppLayout>
    );
}
