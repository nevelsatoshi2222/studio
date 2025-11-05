
'use client';
import { useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';
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
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

const adminRoles = [
    { value: 'User Management Admin', label: 'User Management' },
    { value: 'Job Management Admin', label: 'Job Management' },
    { value: 'Franchisee Management Admin', label: 'Franchisee Management' },
    { value: 'Social Media Management Admin', label: 'Social Media Management' },
    { value: 'Quiz Management Admin', label: 'Quiz Management' },
    { value: 'Super Admin', label: 'Super Admin (ROOT)' }
];

const createAdminSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.string().min(1, { message: "Please select a role." }),
});

type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

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
    const { toast } = useToast();
    const mainAuth = useAuth(); // Use the main auth from the provider

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
        try {
            // Use a secondary Firebase app instance to create admins
            // This avoids conflicts with the currently logged-in user's session
            const secondaryApp = createSecondaryApp();
            const secondaryAuth = getAuth(secondaryApp);
            
            // Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
            const user = userCredential.user;

            // Update their display name in Auth
            await updateProfile(user, { displayName: data.name });

            // Call a Cloud Function to set their custom role claim
            // This ensures the `onUserCreate` function has the role info it needs.
            const functions = getFunctions(mainAuth.app); // Use the main app for calling functions
            const setCustomClaims = httpsCallable(functions, 'setCustomClaims');
            await setCustomClaims({ 
                uid: user.uid, 
                claims: { 
                  role: data.role,
                  country: 'N/A' // Admins don't need a country for voting
                } 
            });

            // IMPORTANT: Sign out the newly created admin from the secondary auth instance
            // This prevents the new user's session from interfering with the current admin's session.
            await signOut(secondaryAuth);
            
            toast({
                title: "Admin Account Initiated",
                description: `Successfully created admin user ${data.name}. The onUserCreate function will now build their Firestore document.`,
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
                    Use this form to create a new administrator account and assign them a specific management role. The `onUserCreate` Cloud Function will automatically create their corresponding document in Firestore.
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
                                                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
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
