'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  // Memoize the document reference
  const adminRoleRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminRole, isLoading: isRoleLoading } = useDoc(adminRoleRef);

  useEffect(() => {
    // If not loading and the user is either not logged in or doesn't have an admin role doc
    if (!isUserLoading && !isRoleLoading && (!user || !adminRole)) {
      router.replace('/admin/login');
    }
  }, [user, adminRole, isUserLoading, isRoleLoading, router]);

  // Show a loading state while we verify auth and role
  if (isUserLoading || isRoleLoading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // If user is verified as admin, show the dashboard
  if (user && adminRole) {
    return (
      <AppLayout>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, Administrator. Manage your platform here.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Overview of platform health.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>All systems operational.</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // This will be shown briefly during the redirect
  return null;
}
