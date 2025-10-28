
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
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
import { useWallet } from '@solana/wallet-adapter-react';
import { ADMIN_WALLET_ADDRESS } from '@/lib/config';
import { doc } from 'firebase/firestore';


const mainNavItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/vision', icon: Rocket, label: 'Our Vision' },
  { href: '/presale', icon: Flame, label: 'Presale' },
  { href: '/social-media', icon: Rss, label: 'Social Media' },
  { href: '/exchange', icon: BarChart2, label: 'Crypto Exchange' },
  { href: '/tokenomics', icon: PieChartIcon, label: 'Coins & Tokenomics' },
];

const programNavItems = [
  { href: '/staking', icon: Lock, label: 'Staking' },
  { href: '/airdrop', icon: Gift, label: 'Airdrop' },
  { href: '/financial-quiz', icon: HelpCircleIcon, label: 'Financial Quiz' },
  { href: '/voting', icon: Vote, label: 'Voting Hub'},
  { href: '/quiz', icon: Trophy, label: 'Quiz Competition'},
  { href: '/sports', icon: Trophy, label: 'Sports Competition'},
  { href: '/arts', icon: Paintbrush, label: 'Arts Competition'},
  { href: '/affiliate-marketing', icon: Share2, label: 'Affiliate Marketing'},
  { href: '/influencer', icon: Megaphone, label: 'Influencer'},
  { href: '/ecommerce', icon: ShoppingCart, label: 'E-commerce'},
  { href: '/franchisee', icon: Building2, label: 'Franchisee Program' },
  { href: '/jobs', icon: BookUser, label: 'Jobs & Career'},
];


export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { publicKey } = useWallet();

  const isWalletAdmin = publicKey?.toBase58() === ADMIN_WALLET_ADDRESS;

  const adminRoleRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminRole, isLoading: isRoleLoading } = useDoc(adminRoleRef);
  const isFirebaseAdmin = !!adminRole;
  const isAdmin = isWalletAdmin || isFirebaseAdmin;


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
                              <Link href="/settings">Settings</Link>
                          </DropdownMenuItem>
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
              <Link href={item.href} passHref>
                <SidebarMenuButton>
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <SidebarSeparator />
        
        {(user || isAdmin) && (
        <SidebarMenu>
             {user && (
                 <SidebarMenuItem>
                    <Collapsible>
                        <CollapsibleTrigger asChild className="w-full">
                             <SidebarMenuButton>
                                <Users />
                                <span>User Panel</span>
                                <ChevronDown className="h-4 w-4 ml-auto" />
                             </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <Link href="/profile"><SidebarMenuSubButton>Profile</SidebarMenuSubButton></Link>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                   <Link href="/team"><SidebarMenuSubButton>My Team</SidebarMenuSubButton></Link>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarMenuItem>
             )}
            {isAdmin && (
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
                                <SidebarMenuSubItem><Link href="/admin"><SidebarMenuSubButton>Dashboard</SidebarMenuSubButton></Link></SidebarMenuSubItem>
                                <SidebarMenuSubItem><Link href="/admin/applications"><SidebarMenuSubButton>Applications</SidebarMenuSubButton></Link></SidebarMenuSubItem>
                                <SidebarMenuSubItem><Link href="/admin/users"><SidebarMenuSubButton>All Users</SidebarMenuSubButton></Link></SidebarMenuSubItem>
                                <SidebarMenuSubItem><Link href="/admin/fulfillment"><SidebarMenuSubButton>Fulfillment</SidebarMenuSubButton></Link></SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarMenuItem>
            )}
        </SidebarMenu>
        )}

        <SidebarSeparator />

        <SidebarMenu>
          {programNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton>
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         {!user && !isAdmin && (
            <SidebarMenu>
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
            </SidebarMenu>
          )}
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
          </div>
          <div className="flex items-center gap-4">
             <SafeWalletButton />
             <UserAccountDropdown />
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
