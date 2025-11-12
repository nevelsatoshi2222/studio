
'use client';
import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Search, Wrench, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';

type FoundUser = {
    id: string;
    name: string;
    email: string;
};

function DebugTools() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const [referralCode, setReferralCode] = useState('');
    const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!firestore || !referralCode.trim()) {
            toast({ variant: 'destructive', title: 'Invalid Input', description: 'Please enter a referral code to search.' });
            return;
        }
        setIsLoading(true);
        setSearched(true);
        setFoundUser(null);
        try {
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('referralCode', '==', referralCode.trim()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast({ variant: 'destructive', title: 'Not Found', description: `No user found with referral code: ${referralCode}` });
            } else {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                setFoundUser({
                    id: userDoc.id,
                    name: userData.name,
                    email: userData.email,
                });
                toast({ title: 'User Found!', description: `Displaying details for user with code ${referralCode}` });
            }
        } catch (error: any) {
            console.error("Error searching for user:", error);
            toast({ variant: 'destructive', title: 'Search Failed', description: error.message || 'An unknown error occurred.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search /> Find User by Referral Code
                </CardTitle>
                <CardDescription>
                    Enter a user's referral code to find their name and email address.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Input
                        id="referral-code"
                        placeholder="Enter referral code (e.g., PGC-ABC123DE)"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                    />
                    <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                    </Button>
                </div>
                {isLoading && (
                    <div className="text-center p-4">
                        <p className="text-muted-foreground">Searching database...</p>
                    </div>
                )}
                {searched && !isLoading && foundUser && (
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle>User Found</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><span className="font-semibold">Name:</span> {foundUser.name}</p>
                            <p><span className="font-semibold">Email:</span> {foundUser.email}</p>
                            <p><span className="font-semibold">User ID:</span> <code className="text-xs">{foundUser.id}</code></p>
                        </CardContent>
                    </Card>
                )}
                 {searched && !isLoading && !foundUser && (
                    <div className="text-center p-4">
                        <p className="text-destructive font-medium">No user found for that code.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function DebugPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    const isSuperAdmin = user?.role === 'Super Admin';

    useEffect(() => {
        if (!isUserLoading && !isSuperAdmin) {
            router.replace('/admin/login');
        }
    }, [isUserLoading, isSuperAdmin, router]);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold flex items-center gap-2"><Wrench/> Debug Tools</h1>
                <p className="text-muted-foreground">
                    A collection of tools for debugging and verifying platform data. Available only to Super Admins.
                </p>
            </div>
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
            {isSuperAdmin && <DebugTools />}
        </div>
    );
}
