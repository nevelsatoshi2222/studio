
'use client';
import { useState, useEffect } from 'react';
import { useMemoFirebase, useUser, useFirestore, updateDocumentNonBlocking, useCollection } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RefreshCcw } from 'lucide-react';
import { collection, doc, query, Query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type User = {
    id: string;
    name: string;
    email: string;
    referralCode?: string;
};

// Helper function to generate a unique referral code
function generateReferralCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


const UserRowSkeleton = () => (
    <TableRow>
        <TableCell>
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-8 w-32" /></TableCell>
    </TableRow>
)

function RegenerateCodesTable({ canRunQuery }: { canRunQuery: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const usersQuery = useMemoFirebase(() => {
        if (!firestore || !canRunQuery) return null;
        return query(collection(firestore, 'users'));
    }, [firestore, canRunQuery]);

    const { data: users, isLoading: areUsersLoading } = useCollection<User>(usersQuery);

    const handleRegenerateCode = (userId: string) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', userId);
        const newCode = generateReferralCode();
        updateDocumentNonBlocking(userDocRef, { referralCode: newCode });
        toast({ title: 'Referral Code Regenerated', description: `New code for user has been set to ${newCode}.` });
    };

    const getAvatarUrl = (userId: string) => {
        return `https://picsum.photos/seed/${userId}/40/40`;
    };
    
    return (
         <Card>
            <CardHeader>
                <CardTitle>Regenerate Referral Codes</CardTitle>
                <CardDescription>
                    This table lists every user in the database. Use the action button to generate a new, unique referral code for a user.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Current Referral Code</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(areUsersLoading && canRunQuery) ? (
                            <>
                                <UserRowSkeleton />
                                <UserRowSkeleton />
                                <UserRowSkeleton />
                            </>
                        ) : users && users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={getAvatarUrl(user.id)} alt={user.name} />
                                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{user.referralCode || 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => handleRegenerateCode(user.id)}>
                                            <RefreshCcw className="mr-2 h-4 w-4" />
                                            Regenerate
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default function RegenerateCodesPage() {
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
                <div>
                    <h1 className="font-headline text-3xl font-bold">Code Regeneration Utility</h1>
                    <p className="text-muted-foreground">
                        A tool for Super Admins to manually regenerate user referral codes if necessary.
                    </p>
                </div>
                {isUserLoading && (
                     <div className="flex items-center justify-center h-64">
                        <p>Verifying admin privileges...</p>
                    </div>
                )}
                {!isUserLoading && !isSuperAdmin && (
                     <Card className="mt-8 border-destructive">
                        <CardHeader className="text-center">
                            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
                            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
                            <CardDescription>
                                You do not have the necessary permissions to view this page. Redirecting...
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
                {isSuperAdmin && <RegenerateCodesTable canRunQuery={isSuperAdmin} />}
            </div>
        </AppLayout>
    );
}
