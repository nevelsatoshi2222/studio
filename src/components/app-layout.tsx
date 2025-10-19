
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  BarChart2,
  FileText,
  Settings,
  HelpCircle,
  Repeat,
  PieChart as PieChartIcon,
  Globe,
  Landmark,
  Trophy,
  Paintbrush,
  Vote,
  Share2,
  Megaphone,
  ShoppingCart,
  Building2,
  BookUser,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/data';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/users', icon: Users, label: 'User Management' },
  { href: '/transactions', icon: Repeat, label: 'Transactions' },
  { href: '/forum', icon: MessageSquare, label: 'Forum / Governance' },
  { href: '/exchange', icon: BarChart2, label: 'Crypto Exchange' },
  { href: '/tokenomics', icon: PieChartIcon, label: 'Coins & Tokenomics' },
  { href: '/international-issues', icon: Globe, label: 'International Issues'},
  { href: '/national-issues', icon: Landmark, label: 'National Issues'},
  { href: '/quiz', icon: Trophy, label: 'Quiz Competition'},
  { href: '/sports', icon: Trophy, label: 'Sports Competition'},
  { href: '/arts', icon: Paintbrush, label: 'Arts Competition'},
  { href: '/voting', icon: Vote, label: 'Voting'},
  { href: '/affiliate-marketing', icon: Share2, label: 'Affiliate Marketing'},
  { href: '/influencer', icon: Megaphone, label: 'Influencer'},
  { href: '/ecommerce', icon: ShoppingCart, label: 'E-commerce'},
  { href: '/franchisee', icon: Building2, label: 'Franchisee'},
  { href: '/jobs', icon: BookUser, label: 'Jobs & Career'},
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const adminUser = users.find(user => user.id === 'usr_admin');

  const sidebarContent = (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">IBC Platform</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton asChild>
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <HelpCircle />
                    <span>Support</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider>
      <Sidebar>{sidebarContent}</Sidebar>
      <div className="flex flex-col w-full">
         <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold hidden md:block">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
             <Avatar>
                <AvatarImage src={`https://picsum.photos/seed/${adminUser?.avatarId}/40/40`} />
                <AvatarFallback>{adminUser?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{adminUser?.name}</p>
              <p className="text-xs text-muted-foreground">{adminUser?.email}</p>
            </div>
          </div>
        </header>
        <SidebarInset className="p-4 md:p-6">
            {children}
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
