
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, ClipboardList, CheckCircle, Briefcase, Megaphone, HelpCircle, UserPlus, RefreshCcw } from 'lucide-react';

const adminNavItems = [
    { href: '/admin/create-admin', icon: UserPlus, label: 'Create Admin', description: 'Create new admin accounts and assign roles.', requiredRole: 'Super Admin' },
    { href: '/admin/applications', icon: ClipboardList, label: 'Applications', description: 'Review and manage all user applications.', requiredRole: ['Super Admin', 'Franchisee Management Admin'] },
    { href: '/admin/jobs', icon: Briefcase, label: 'Job Management', description: 'Create and manage job postings.', requiredRole: ['Super Admin', 'Job Management Admin'] },
    { href: '/admin/social', icon: Megaphone, label: 'Social Media', description: 'Moderate social media content.', requiredRole: ['Super Admin', 'Social Media Management Admin'] },
    { href: '/admin/quiz', icon: HelpCircle, label: 'Quiz Management', description: 'Manage quiz questions and tournaments.', requiredRole: ['Super Admin', 'Quiz Management Admin'] },
];

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const userRole = user?.role;
  const isSuperAdmin = userRole === 'Super Admin';
  const hasAdminRole = userRole && userRole.includes('Admin');

  useEffect(() => {
    if (isUserLoading) return;

    if (!user || !hasAdminRole) {
      router.replace('/admin/login');
    }
  }, [user, isUserLoading, router, hasAdminRole]);

  if (isUserLoading || !user || !hasAdminRole) {
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
           <p className="text-center text-muted-foreground">Verifying credentials and loading dashboard...</p>
        </div>
      </AppLayout>
    );
  }

  const getVisibleNavItems = () => {
      if (isSuperAdmin) {
          return adminNavItems;
      }
      return adminNavItems.filter(item => {
        if (Array.isArray(item.requiredRole)) {
            return item.requiredRole.includes(userRole as string);
        }
        return item.requiredRole === userRole;
      });
  }
  
  const visibleNavItems = getVisibleNavItems();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {user.displayName || user.email}. Role: {user.role}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleNavItems.length > 0 ? (
              visibleNavItems.map(item => {
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
          })
          ) : (
             <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>No Modules Assigned</CardTitle>
                    <CardDescription>
                        Your admin role does not currently have any management modules assigned to it. Please contact the Super Admin.
                    </CardDescription>
                </CardHeader>
             </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
