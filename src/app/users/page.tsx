
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { collection } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function UsersPage() {
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading } = useCollection<User>(usersQuery);

  return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            View and manage platform users.
          </p>
        </div>
        <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                A list of all users in the system, fetched live from Firestore.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>PGC Balance</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <>
                      <TableRow>
                        <TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell>
                      </TableRow>
                    </>
                  ) : users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={`https://picsum.photos/seed/${user.avatarId}/40/40`} alt={user.name} />
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
                            <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{user.pgcBalance.toLocaleString()}</TableCell>
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
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                               <DropdownMenuItem className="text-destructive">Ban</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found in the database.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </div>
  );
}
