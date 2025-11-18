
'use client';
import React from 'react';
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
  SidebarSeparator,
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
  Lock,
  Rocket,
  Flame,
  Gift,
  HelpCircleIcon,
  ClipboardList,
  CheckCircle,
  RefreshCcw,
  Award,
  Crown,
  Star,
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
import { SafeWalletButton } from './safe-wallet-button';
import { GlobalFooter } from './GlobalFooter';

const mainNavItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/vision', label: 'Our Vision', icon: Rocket },
  { href: '/presale', label: 'Presale', icon: Flame },
  { href: '/social-media', label: 'Social Media', icon: Rss },
  { href: '/exchange', label: 'Crypto Exchange', icon: BarChart2 },
  { href: '/tokenomics', label: 'Coins & Tokenomics', icon: PieChartIcon },
  { href: '/help', label: 'Help & Support', icon: HelpCircle },
];

const programNavItems = [
  { href: '/staking', label: 'Staking', icon: Lock },
  { href: '/airdrop', label: 'Airdrop', icon: Gift },
  { href: '/voting', label: 'Voting Hub', icon: Vote },
  { href: '/quiz', label: 'Quiz Competition', icon: Trophy },
  { href: '/sports', label: 'Sports Competition', icon: Trophy },
  { href: '/arts', label: 'Arts Competition', icon: Paintbrush },
  { href: '/affiliate-marketing', label: 'Affiliate Marketing', icon: Share2 },
  { href: '/influencer-rewards', label: 'Influencer Rewards', icon: Megaphone },
  { href: '/franchisee', label: 'Franchisee Program', icon: Building2 },
  { href: '/jobs', label: 'Jobs & Career', icon: BookUser },
];

const eCommerceSubItems = [
  { href: '/ecommerce', label: 'Products Marketplace', icon: ShoppingCart },
  { href: '/my-web-store', label: 'My Web Store', icon: Star },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const userRole = user?.role;
  const isSuperAdmin = userRole === 'Super Admin';
  const hasAdminRole = userRole && userRole.includes('Admin');

  const handleLogout = async () => {
    if (!auth) return;
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

  const UserAccountDropdown = () => {
      if (isUserLoading) {
          return <Skeleton className="h-8 w-8 rounded-full" />
      }

      return (
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-9 w-9">
                          {user ? (
                              <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/32/32`} alt={user.email || ''} />
                          ) : (
                              <AvatarImage src={`https://picsum.photos/seed/guest/32/32`} alt="Guest" />
                          )}
                          <AvatarFallback>
                              {user ? user.email?.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                          </AvatarFallback>
                      </Avatar>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                  {user ? (
                      <>
                          <DropdownMenuLabel className="font-normal">
                              <div className="flex flex-col space-y-1">
                                  <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                                  <p className="text-xs leading-none text-muted-foreground">
                                      {user.email}
                                  </p>
                              </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                              <Link href="/profile">Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                              <Link href="/team">My Team</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                              <Link href="/commission">Commission</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                              <Link href="/quiz-opinion">Quiz Opinion</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                              <Link href="/settings">Settings</Link>
                          </DropdownMenuItem>
                          {hasAdminRole && (
                            <>
                                <DropdownMenuSeparator />
                                 <DropdownMenuItem asChild>
                                    <Link href="/admin">Admin Dashboard</Link>
                                </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleLogout}>
                              Log out
                          </DropdownMenuItem>
                      </>
                  ) : (
                      <>
                          <DropdownMenuItem asChild>
                              <Link href="/login">Log In</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                              <Link href="/register">Register</Link>
                          </DropdownMenuItem>
                      </>
                  )}
              </DropdownMenuContent>
          </DropdownMenu>
      )
  }

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
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild>
                <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <SidebarSeparator />
        
        {hasAdminRole && (
            <SidebarMenu>
                <SidebarMenuItem>
                    <Collapsible>
                        <CollapsibleTrigger asChild className="w-full">
                            <SidebarMenuButton>
                                <Shield />
                                <span>Admin Panel</span>
                                <ChevronDown className="h-4 w-4 ml-auto" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem><SidebarMenuSubButton asChild><Link href="/admin">Dashboard</Link></SidebarMenuSubButton></SidebarMenuSubItem>
                                {isSuperAdmin && (
                                    <>
                                        <SidebarMenuSubItem><SidebarMenuSubButton asChild><Link href="/admin/create-admin">Create Admin</Link></SidebarMenuSubButton></SidebarMenuSubItem>
                                    </>
                                )}
                                {(isSuperAdmin || userRole === 'User Management Admin') && (
                                    <SidebarMenuSubItem><SidebarMenuSubButton asChild><Link href="/users">User Management</Link></SidebarMenuSubButton></SidebarMenuSubItem>
                                )}
                                {(isSuperAdmin || userRole === 'Franchisee Management Admin') && (
                                    <SidebarMenuSubItem><SidebarMenuSubButton asChild><Link href="/admin/applications">Applications</Link></SidebarMenuSubButton></SidebarMenuSubItem>
                                )}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarMenuItem>
                <SidebarSeparator />
            </SidebarMenu>
        )}

        <SidebarMenu>
            {/* Standard Program Items */}
            {programNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}

            {/* E-commerce Collapsible Menu */}
            <SidebarMenuItem>
                <Collapsible>
                    <CollapsibleTrigger asChild className="w-full">
                        <SidebarMenuButton>
                            <ShoppingCart />
                            <span>E-commerce</span>
                            <ChevronDown className="h-4 w-4 ml-auto" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {eCommerceSubItems.map((item) => (
                                <SidebarMenuSubItem key={item.label}>
                                    <SidebarMenuSubButton asChild>
                                        <Link href={item.href}>
                                            <item.icon className="h-3.5 w-3.5 mr-2" />
                                            {item.label}
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         {!user && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/login">
                      <LogIn />
                      <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/register">
                      <UserPlus />
                      <span>Register</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
      </SidebarFooter>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <Sidebar>{sidebarContent}</Sidebar>
        <div className="flex flex-col w-full flex-1">
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="hidden md:flex items-center">
                <Scale className="h-6 w-6 text-primary mr-2" />
                <span className="text-lg font-semibold">Public Governance</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SafeWalletButton />
              <UserAccountDropdown />
            </div>
          </header>
          <div className="flex-1 flex flex-col">
            <SidebarInset className="flex-1 p-4 md:p-6">
              {children}
            </SidebarInset>
            <GlobalFooter />
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </div>
  );
}
