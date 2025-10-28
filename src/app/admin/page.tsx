
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Briefcase, Megaphone, Building2, ClipboardList, CheckCircle } from 'lucide-react';

const adminNavItems = [
    { href: '/admin/applications', icon: ClipboardList, label: 'Applications', description: 'Review and manage all user applications.' },
    { href: '/admin/users', icon: Users, label: 'All Users', description: 'View and manage all registered users.' },
    { href: '/admin/fulfillment', icon: CheckCircle, label: 'Fulfillment', description: 'Process withdrawal requests and presale purchases.' },
]

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
    const isCheckingAuth = isUserLoading || (user && isRoleLoading);
    if (isCheckingAuth) {
        return; // Wait until authentication and role checks are complete
    }

    // If auth checks are done and the user is neither a Firebase admin nor a wallet admin, redirect
    if (!isFirebaseAdmin && !isWalletAdmin) {
      router.replace('/admin/login');
    }
  }, [isUserLoading, isRoleLoading, isFirebaseAdmin, isWalletAdmin, router, user]);

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
              Welcome, Administrator. Select a category below to manage your platform.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {adminNavItems.map(item => {
                const Icon = item.icon;
                return (
                    <Card key={item.label}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Icon className="h-8 w-8 text-primary"/>
                                <div>
                                    <CardTitle>{item.label}</CardTitle>
                                    <CardDescription>{item.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href={item.href}>Go to {item.label}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )
            })}
          </div>
        </div>
      </AppLayout>
    );
  }

  // This will be shown briefly during the redirect for non-admins
  return <AppLayout><p>Verifying access...</p></AppLayout>;
}
