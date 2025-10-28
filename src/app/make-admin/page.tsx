
'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MakeAdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'no-user'>('idle');

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (!user) {
      setStatus('no-user');
      return;
    }

    if (firestore && user && status === 'idle') {
      setStatus('processing');
      const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
      
      // Use setDocumentNonBlocking to create the admin role.
      // This won't throw a permission error if the rules are set correctly for creation.
      // We are simply creating a document, not handling complex logic here.
      setDocumentNonBlocking(adminRoleRef, { userId: user.uid }, { merge: true })
        .then(() => {
            setStatus('success');
            // No need to await, but we can optimistically assume success
        })
        .catch((err) => {
            // This catch is for network errors, not security rules if using non-blocking writes.
            console.error("Failed to set admin role:", err);
            setStatus('error');
        });
    }
  }, [user, firestore, isUserLoading, status]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p>Assigning admin privileges to {user?.email}...</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="font-bold">Admin privileges have been assigned successfully!</p>
            <p>You can now access all admin pages.</p>
            <Button asChild>
              <Link href="/admin/users">Go to User Management Page</Link>
            </Button>
          </div>
        );
      case 'no-user':
         return (
          <div className="flex flex-col items-center gap-4 text-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
            <p className="font-bold">You are not logged in.</p>
            <p>Please log in to assign admin rights.</p>
            <Button asChild>
              <Link href={`/login?redirect=/make-admin`}>Login</Link>
            </Button>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
            <p className="font-bold">An error occurred.</p>
            <p>Could not assign admin privileges. Check the browser console and Firestore rules.</p>
          </div>
        );
      default:
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p>Preparing to assign admin role...</p>
            </div>
        );
    }
  };

  return (
    <AppLayout>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Admin Role Assignment</CardTitle>
          <CardDescription>
            This page automatically grants admin rights to the logged-in user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
