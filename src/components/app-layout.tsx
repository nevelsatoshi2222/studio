
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
  ChevronDown,
  UserPlus,
  Users2,
  DollarSign,
  LogIn,
  LogOut,
  Shield,
  Scale,
  Rss,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useAuth } from '@/firebase';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/social-media', icon: Rss, label: 'Social Media' },
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
  { href: '/jobs', icon: BookUser, label: 'Jobs & Career'},
];

const franchiseeSubmenu = [
    { name: 'Main' },
    { name: 'Services' },
    { name: 'Food' },
    { name: 'Vegetables' },
    { name: 'Grains' },
    { name: 'Pulses' },
    { name: 'Milk' },
    { name: 'Dairy products' },
    { name: 'Beverages' },
    { name: 'Oils' },
    { name: 'Education' },
    { name: 'Travel' },
];

const franchiseeLevels = [
    { name: 'Street Franchisee' },
    { name: 'Village/Ward Franchisee' },
    { name: 'Block/Kasba Franchisee' },
    { name: 'Taluka franchisee' },
    { name: 'District franchisee' },
    { name: 'Area Franchisee' },
    { name: 'State Franchisee' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [openFranchiseSubMenu, setOpenFranchiseSubMenu] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out: ", error);
       toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "There was an error signing you out. Please try again.",
      });
    }
  };

  const sidebarContent = (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">Public Governance</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton>
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {!user && (
            <>
              <SidebarMenuItem>
                <Link href="/login" passHref>
                  <SidebarMenuButton>
                      <LogIn />
                      <span>Login</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/register" passHref>
                  <SidebarMenuButton>
                      <UserPlus />
                      <span>Register</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </>
          )}
            <SidebarMenuItem>
                <Collapsible>
                    <CollapsibleTrigger asChild className="w-full">
                        <SidebarMenuButton>
                            <Building2 />
                            <span>Franchisee</span>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                         <SidebarMenuSub>
                            {franchiseeSubmenu.map((item) => (
                                <SidebarMenuSubItem key={item.name}>
                                     <Collapsible>
                                        <CollapsibleTrigger asChild className="w-full">
                                            <a href="#" className="w-full">
                                                <SidebarMenuSubButton>
                                                    <span>{item.name}</span>
                                                    <ChevronDown className={cn("h-4 w-4 ml-auto shrink-0 transition-transform", openFranchiseSubMenu === item.name && "rotate-180")} />
                                                </SidebarMenuSubButton>
                                            </a>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {franchiseeLevels.map((level) => (
                                                    <SidebarMenuSubItem key={level.name}>
                                                        <Link href="#" passHref>
                                                            <a href="#">
                                                                <SidebarMenuSubButton>
                                                                    - {level.name}
                                                                </SidebarMenuSubButton>
                                                            </a>
                                                        </Link>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Collapsible>
                    <CollapsibleTrigger asChild className="w-full">
                         <a href="/team" className="w-full">
                            <SidebarMenuButton>
                                <Users2 />
                                <span>Team</span>
                            </SidebarMenuButton>
                         </a>
                    </CollapsibleTrigger>
                     <CollapsibleContent>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <Link href="/team#team-members" passHref>
                                    <a href="/team#team-members">
                                        <SidebarMenuSubButton>
                                            <Users className="mr-2"/>
                                            <span>Team Members</span>
                                        </SidebarMenuSubButton>
                                    </a>
                                </Link>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                                <Link href="/team#direct-members" passHref>
                                     <a href="/team#direct-members">
                                        <SidebarMenuSubButton>
                                            <UserPlus className="mr-2"/>
                                            <span>Direct Members</span>
                                        </SidebarMenuSubButton>
                                     </a>
                                </Link>
                            </SidebarMenuSubItem>
                             <SidebarMenuSubItem>
                                <Link href="/team#earnings" passHref>
                                    <a href="/team#earnings">
                                        <SidebarMenuSubButton>
                                            <DollarSign className="mr-2"/>
                                            <span>Earning</span>
                                        </SidebarMenuSubButton>
                                    </a>
                                </Link>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <Link href="/admin" passHref>
                  <SidebarMenuButton>
                      <Shield />
                      <span>Admin</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
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
             {isUserLoading ? (
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
             ) : user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`} />
                                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline">{user.displayName || user.email}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                             <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
             ) : (
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Register
                        </Link>
                    </Button>
                </div>
             )}
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
