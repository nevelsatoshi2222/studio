
'use client';
import { useState, useEffect } from 'react';
import { useMemoFirebase, useUser, useFirestore, updateDocumentNonBlocking, useDoc, useCollection } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Check, X, ShieldAlert, UserCog } from 'lucide-react';
import { collection, doc, query, Query, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type User = {
    id: string;
    name: string;
    email: string;
    country: string;
    status: 'Active' | 'Pending' | 'Rejected' | 'Banned';
    registeredAt: Timestamp;
    avatarId: string;
    role?: string;
};

const adminRoles = [
    'User',
    'User Management Admin',
    'Job Management Admin',
    'Franchisee Management Admin',
    'Social Media Management Admin',
    'Quiz Management Admin',
    'Super Admin'
];

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
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
)

function UsersTable({ canRunQuery }: { canRunQuery: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const usersQuery = useMemoFirebase(() => {
        if (!firestore || !canRunQuery) return null;
        return query(collection(firestore, 'users'));
    }, [firestore, canRunQuery]);

    const { data: users, isLoading: areUsersLoading } = useCollection<User>(usersQuery);

    const handleUpdateStatus = (userId: string, newStatus: 'Active' | 'Rejected' | 'Banned') => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', userId);
        updateDocumentNonBlocking(userDocRef, { status: newStatus });
        toast({ title: 'Status Updated', description: `User status changed to ${newStatus}.` });
    };
    
    const handleChangeRole = (userId: string, newRole: string) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', userId);
        updateDocumentNonBlocking(userDocRef, { role: newRole });
        toast({ title: 'Role Assigned', description: `User has been assigned the role: ${newRole}.` });
    }

    const getAvatarUrl = (avatarId: string) => {
        return `https://picsum.photos/seed/${avatarId}/40/40`;
    };
    
    return (
         <Card>
            <CardHeader>
                <CardTitle>All Registered Users</CardTitle>
                <CardDescription>
                    This table lists every user in the database. Use the action menu to manage roles and status.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Registered</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
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
                                        <Badge variant="outline">{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'Active' ? 'default' : user.status === 'Pending' ? 'secondary' : 'destructive'}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.registeredAt ? user.registeredAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
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
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        <UserCog className="mr-2 h-4 w-4" />
                                                        Assign Role
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent>
                                                        {adminRoles.map(role => (
                                                             <DropdownMenuItem key={role} onClick={() => handleChangeRole(user.id, role)}>
                                                                {role}
                                                             </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                 {user.status !== 'Active' && <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'Active')}>
                                                    <Check className="mr-2 h-4 w-4" /> Approve
                                                </DropdownMenuItem>}
                                                {user.status !== 'Rejected' && <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'Rejected')}>
                                                    <X className="mr-2 h-4 w-4" /> Reject
                                                </DropdownMenuItem>}
                                                <DropdownMenuSeparator />
                                                 <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(user.id, 'Banned')}>
                                                    <ShieldAlert className="mr-2 h-4 w-4" /> Ban User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
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

export default function AllUsersPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    const isSuperAdmin = user?.role === 'Super Admin';
    const isUserAdmin = user?.role === 'User Management Admin';
    const canAccessPage = isSuperAdmin || isUserAdmin;

    useEffect(() => {
        if (!isUserLoading && !canAccessPage) {
            router.replace('/admin/login');
        }
    }, [isUserLoading, canAccessPage, router]);
    
    return (
        <AppLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">
                        View and manage all users registered on the platform.
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
                {canAccessPage && <UsersTable canRunQuery={canAccessPage} />}
            </div>
        </AppLayout>
    );
}
