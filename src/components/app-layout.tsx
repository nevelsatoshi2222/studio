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
  Lock,
  Rocket,
  Flame,
  Gift,
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
import { WalletButton } from './wallet-button';


const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/vision', icon: Rocket, label: 'Our Vision' },
  { href: '/presale', icon: Flame, label: 'Presale' },
  { href: '/social-media', icon: Rss, label: 'Social Media' },
  { href: '/users', icon: Users, label: 'User Management' },
  { href: '/transactions', icon: Repeat, label: 'Transactions' },
  { href: '/forum', icon: MessageSquare, label: 'Forum / Governance' },
  { href: '/exchange', icon: BarChart2, label: 'Crypto Exchange' },
  { href: '/tokenomics', icon: PieChartIcon, label: 'Coins & Tokenomics' },
  { href: '/staking', icon: Lock, label: 'Staking' },
  { href: '/airdrop', icon: Gift, label: 'Airdrop' },
  { href: '/voting', icon: Vote, label: 'Voting Hub'},
  { href: '/quiz', icon: Trophy, label: 'Quiz Competition'},
  { href: '/sports', icon: Trophy, label: 'Sports Competition'},
  { href: '/arts', icon: Paintbrush, label: 'Arts Competition'},
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
             <WalletButton />
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
