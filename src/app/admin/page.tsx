// app/admin/page.tsx - SIMPLIFIED WORKING VERSION
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
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
import { 
  Users, 
  ClipboardList, 
  Briefcase, 
  Megaphone, 
  HelpCircle, 
  UserPlus, 
  Wrench, 
  Users2,
  DollarSign, 
  BarChart3,
  Target,
  FileText
} from 'lucide-react';

const adminNavItems = [
    { href: '/admin/create-admin', icon: UserPlus, label: 'Create Admin', description: 'Create new admin accounts and assign roles.', requiredRole: 'Super Admin' },
    { href: '/users', icon: Users2, label: 'User Management', description: 'View, search, and manage all platform users.', requiredRole: ['Super Admin', 'User Management Admin'] },
    { href: '/admin/applications', icon: ClipboardList, label: 'Applications', description: 'Review and manage all user applications.', requiredRole: ['Super Admin', 'Franchisee Management Admin'] },
    { href: '/admin/jobs', icon: Briefcase, label: 'Job Management', description: 'Create and manage job postings.', requiredRole: ['Super Admin', 'Job Management Admin'] },
    { href: '/admin/social', icon: Megaphone, label: 'Social Media', description: 'Moderate social media content.', requiredRole: ['Super Admin', 'Social Media Management Admin'] },
    { href: '/admin/quiz', icon: HelpCircle, label: 'Quiz Management', description: 'Manage quiz questions and tournaments.', requiredRole: ['Super Admin', 'Quiz Management Admin'] },
    { href: '/admin/debug', icon: Wrench, label: 'Debug Tools', description: 'Tools for debugging and verification.', requiredRole: 'Super Admin' },
    // New modules with existing roles
    { href: '/admin/direct-offers', icon: Target, label: 'Influencer Offers', description: 'Manage direct offers and influencer tiers.', requiredRole: ['Super Admin', 'Social Media Management Admin'] },
    { href: '/admin/affiliate-rewards', icon: DollarSign, label: 'Affiliate Rewards', description: 'Manage affiliate program and rewards.', requiredRole: ['Super Admin', 'User Management Admin'] },
    { href: '/admin/submissions', icon: FileText, label: 'Content Submissions', description: 'Review influencer content submissions.', requiredRole: ['Super Admin', 'Social Media Management Admin'] },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics', description: 'View program analytics and reports.', requiredRole: ['Super Admin', 'User Management Admin'] },
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
          <p className="text-center text-muted-foreground">Loading admin dashboard...</p>
        </div>
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
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {user.displayName || user.email}. Role: {user.role}
          </p>
        </div>

        {/* Simple Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Modules</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visibleNavItems.length}</div>
              <p className="text-xs text-gray-500">Based on your role</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Role</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{userRole}</div>
              <p className="text-xs text-gray-500">Permission level</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Navigation Modules */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Management Modules</h2>
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
                                    <CardTitle className="text-lg">{item.label}</CardTitle>
                                    <CardDescription>{item.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href={item.href}>Access {item.label}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )
            })
            ) : (
               <Card className="md:col-span-3">
                  <CardHeader>
                      <CardTitle>No Modules Available</CardTitle>
                      <CardDescription>
                          Your admin role does not currently have access to any management modules. 
                          Please contact a Super Administrator.
                      </CardDescription>
                  </CardHeader>
               </Card>
            )}
          </div>
        </div>
      </div>
  );
}