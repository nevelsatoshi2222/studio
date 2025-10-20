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
import { useWallet } from '@solana/wallet-adapter-react';
import { ADMIN_WALLET_ADDRESS } from '@/lib/config';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { publicKey } = useWallet();

  const isWalletAdmin = publicKey?.toBase58() === ADMIN_WALLET_ADDRESS;

  // Memoize the document reference
  const adminRoleRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminRole, isLoading: isRoleLoading } = useDoc(adminRoleRef);

  const isFirebaseAdmin = !!adminRole;

  useEffect(() => {
    // If not loading and the user is neither a Firebase admin nor a wallet admin
    if (!isUserLoading && !isRoleLoading && !isFirebaseAdmin && !isWalletAdmin) {
      router.replace('/admin/login');
    }
  }, [isUserLoading, isRoleLoading, isFirebaseAdmin, isWalletAdmin, router]);

  // Show a loading state while we verify auth and role
  if (isUserLoading || (user && isRoleLoading)) {
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

  // If user is verified as admin (either way), show the dashboard
  if (isFirebaseAdmin || isWalletAdmin) {
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
