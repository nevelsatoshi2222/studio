
'use client';

import { useState, useEffect } from 'react';
import { useMemoFirebase, useUser, useFirestore } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection } from '@/firebase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Check, X, ShieldAlert } from 'lucide-react';
import { collection, doc, query, where, Query, updateDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type User = {
    id: string;
    name: string;
    email: string;
    country: string;
    status: 'Active' | 'Pending' | 'Rejected' | 'Banned';
    registeredAt: any;
    avatarId: string;
    role?: string;
};

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
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
)

function ApplicationsTable({ canAccessPage }: { canAccessPage: boolean }) {
    const [filter, setFilter] = useState('All');
    const firestore = useFirestore();
    const { toast } = useToast();

    // **CRITICAL FIX:** Only construct the query if the user has access rights.
    // This prevents unauthorized users from triggering a query that violates security rules.
    const usersQuery = useMemoFirebase(() => {
        if (!firestore || !canAccessPage) return null; // Do not query if user cannot access
        if (filter === 'All') {
            return query(collection(firestore, 'users'), where('status', '==', 'Pending'));
        }
        return query(collection(firestore, 'users'), where('role', '==', filter), where('status', '==', 'Pending'));
    }, [filter, firestore, canAccessPage]);

    // The useCollection hook will now safely receive `null` if the user doesn't have access,
    // preventing any database operation and the subsequent permission error.
    const { data: users, isLoading: areUsersLoading } = useCollection<User>(usersQuery);

    const handleUpdateStatus = (user: User, newStatus: 'Active' | 'Rejected') => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', user.id);
        updateDoc(userDocRef, { status: newStatus });
        toast({
            title: `Applicant ${newStatus}`,
            description: `${user.name} has been ${newStatus.toLowerCase()}.`,
        });
    };

    const getAvatarUrl = (avatarId: string) => {
        return `https://picsum.photos/seed/${avatarId}/40/40`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Applicants</CardTitle>
                <CardDescription>
                    Filter and manage new applications. Approving a user will change their status to 'Active'.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={filter} onValueChange={setFilter} className="mb-4">
                    <TabsList>
                        <TabsTrigger value="All">All Roles</TabsTrigger>
                        <TabsTrigger value="Franchisee">Franchisee</TabsTrigger>
                        <TabsTrigger value="Influencer">Influencer</TabsTrigger>
                        <TabsTrigger value="Job Seeker">Job Seekers</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applying For</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {areUsersLoading ? (
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
                                                <AvatarImage src={getAvatarUrl(user.avatarId)} alt={user.name} />
                                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.country}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>{user.registeredAt ? new Date(user.registeredAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(user, 'Active')}>
                                                    <Check className="mr-2 h-4 w-4" /> Approve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(user, 'Rejected')}>
                                                    <X className="mr-2 h-4 w-4" /> Reject
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No pending applications found for the selected filter.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function ApplicationsPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    const userRole = user?.role;
    const isSuperAdmin = userRole === 'Super Admin';
    const isFranchiseeAdmin = userRole === 'Franchisee Management Admin';
    const canAccessPage = !isUserLoading && (isSuperAdmin || isFranchiseeAdmin);
    
    useEffect(() => {
        if (!isUserLoading && !user) {
            router.replace('/admin/login');
        }
    }, [isUserLoading, user, router]);


    return (
        <AppLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Application Management</h1>
                    <p className="text-muted-foreground">
                        Review and manage all pending user applications for various roles.
                    </p>
                </div>
                {isUserLoading && (
                     <div className="flex items-center justify-center h-64">
                        <p>Verifying admin privileges...</p>
                    </div>
                )}

                {!isUserLoading && !canAccessPage && (
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

                {canAccessPage && <ApplicationsTable canAccessPage={canAccessPage} />}
            </div>
        </AppLayout>
    );
}
