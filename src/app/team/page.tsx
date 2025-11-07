
'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, DollarSign, Award, Crown, Shield, Gem } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import React, { useMemo } from 'react';
import type { AffiliateRewardTier, Transaction } from '@/lib/types';
import { freeTrackRewards, paidTrackRewards } from '@/lib/data';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  registeredAt: any;
  avatarId: string;
  freeRank?: string;
  paidRank?: string;
};

const UserRowSkeleton = () => (
    <TableRow>
        <TableCell>
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell>
            <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
            </div>
        </TableCell>
    </TableRow>
);

const rankIcons: { [key: string]: React.FC<any> } = {
    'Bronze': Users,
    'Silver': Award,
    'Gold': Gem,
    'Emerald': Shield,
    'Platinum': Star,
    'Diamond': Shield,
    'Crown': Crown,
    'Bronze Star': UserPlus,
    'Silver Star': Award,
    'Gold Star': Gem,
    'Emerald Star': Shield,
    'Platinum Star': Star,
    'Diamond Star': Shield,
    'Crown Star': Crown,
};


const RewardTierCard = ({ tier, progress, goal, isAchieved }: { tier: AffiliateRewardTier; progress: number; goal: number; isAchieved: boolean }) => {
    const Icon = rankIcons[tier.name] || Award;
    const progressPercent = goal > 0 ? Math.min((progress / goal) * 100, 100) : (isAchieved ? 100 : 0);

    return (
        <div className={`flex flex-col h-full rounded-lg border p-4 ${isAchieved ? 'bg-green-500/10 border-green-500' : 'bg-muted/30'}`}>
            <div className="flex-grow">
                <div className={`flex h-10 w-10 items-center justify-center rounded-md mb-4 ${isAchieved ? 'bg-green-500/20 text-green-600' : 'bg-primary/10 text-primary'}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg">{tier.name}</h4>
                <div className={`text-lg font-bold ${isAchieved ? 'text-green-600' : 'text-primary'}`}>{tier.reward}</div>
                <p className="text-sm text-muted-foreground mt-1">{tier.requirement}</p>
            </div>
            
            <div className="mt-4">
                <Progress value={progressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1 text-center">{progress} / {goal} Members</p>
            </div>
        </div>
    );
};

// This component fetches data for a single member
function TeamMemberRow({ memberId }: { memberId: string }) {
    const firestore = useFirestore();
    const memberDocRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return doc(firestore, 'users', memberId);
    }, [firestore, memberId]);
    
    const { data: member, isLoading } = useDoc<TeamMember>(memberDocRef);

    if (isLoading) {
        return <UserRowSkeleton />;
    }

    if (!member) {
        return (
            <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground">Could not load member data for ID: {memberId}</TableCell>
            </TableRow>
        );
    }
    
    const getAvatarUrl = (avatarId: string) => `https://picsum.photos/seed/${avatarId}/40/40`;

    return (
        <TableRow key={member.id}>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={getAvatarUrl(member.avatarId)} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                {member.registeredAt ? new Date(member.registeredAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1 text-xs">
                    {member.freeRank && member.freeRank !== 'None' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 w-fit">
                            {member.freeRank}
                        </span>
                    )}
                    {member.paidRank && member.paidRank !== 'None' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 w-fit">
                            {member.paidRank}
                        </span>
                    )}
                     {(!member.freeRank || member.freeRank === 'None') && (!member.paidRank || member.paidRank === 'None') && (
                        <span className="text-muted-foreground">No Rank</span>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function TeamPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ 
    directReferrals: string[];
    totalTeamSize: number;
    paidTeamSize: number;
    freeRank: string;
    paidRank: string;
  }>(userDocRef);

  const directMemberIds = userProfile?.directReferrals || [];
  const totalTeamSize = userProfile?.totalTeamSize || 0;
  const paidTeamSize = userProfile?.paidTeamSize || 0;
  const currentFreeRank = userProfile?.freeRank || 'None';
  const currentPaidRank = userProfile?.paidRank || 'None';

  const EarningTable = () => {
      const commissionQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
          collection(firestore, 'transactions'), 
          where('userId', '==', user.uid),
          where('type', '==', 'COMMISSION'),
          where('currency', '==', 'USDT') // Fetch only USDT commissions
        );
      }, [firestore, user]);
      
      const { data: commissions, isLoading: isLoadingCommissions } = useCollection<Transaction>(commissionQuery);

      const earningsByLevel = useMemo(() => {
        const levels = Array.from({ length: 15 }, (_, i) => ({ level: i + 1, total: 0 }));
        if (commissions) {
            commissions.forEach(tx => {
                if (tx.level && tx.level >= 1 && tx.level <= 15) {
                    levels[tx.level - 1].total += tx.amount;
                }
            });
        }
        return levels;
      }, [commissions]);

      const totalCommission = useMemo(() => earningsByLevel.reduce((acc, level) => acc + level.total, 0), [earningsByLevel]);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Commission Earnings by Level</CardTitle>
                <CardDescription>
                    This is a live breakdown of your USDT earnings from your referral network, updated automatically when commissions are paid.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="p-6 rounded-lg border bg-green-500/10 text-green-700 mb-6">
                    <h4 className="font-semibold text-sm uppercase tracking-wider">Total Commission Earned</h4>
                    <p className="text-4xl font-bold text-green-600">${totalCommission.toFixed(2)} USDT</p>
                 </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Level</TableHead>
                            <TableHead className="text-right">Total USDT Earned</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingCommissions ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : earningsByLevel.map((earning) => (
                            <TableRow key={earning.level}>
                                <TableCell>Level {earning.level}</TableCell>
                                <TableCell className="text-right font-medium">${earning.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
  };
  
  const RewardsDashboard = () => {
    const freeRankIndex = freeTrackRewards.findIndex(r => r.name === currentFreeRank);
    const nextFreeRank = freeRankIndex > -1 ? freeTrackRewards[freeRankIndex + 1] : freeTrackRewards[0];

    const paidRankIndex = paidTrackRewards.findIndex(r => r.name === currentPaidRank);
    const nextPaidRank = paidRankIndex > -1 ? paidTrackRewards[paidRankIndex + 1] : paidTrackRewards[0];

    return (
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Free User Track</CardTitle>
            <CardDescription>Your current rank: <span className="font-bold text-primary">{currentFreeRank}</span></CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {nextFreeRank ? (
              <RewardTierCard 
                tier={nextFreeRank} 
                progress={totalTeamSize} 
                goal={nextFreeRank.goal}
                isAchieved={freeRankIndex >= freeTrackRewards.indexOf(nextFreeRank)}
              />
            ) : (
                <Alert>
                    <Crown className="h-4 w-4" />
                    <AlertTitle>Congratulations!</AlertTitle>
                    <AlertDescription>You have achieved the highest rank in the Free User Track!</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Paid User (Star) Track</CardTitle>
            <CardDescription>Your current rank: <span className="font-bold text-primary">{currentPaidRank}</span></CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
             {nextPaidRank ? (
              <RewardTierCard 
                tier={nextPaidRank} 
                progress={paidTeamSize} 
                goal={nextPaidRank.goal}
                isAchieved={paidRankIndex >= paidTrackRewards.indexOf(nextPaidRank)}
              />
            ) : (
                <Alert>
                    <Crown className="h-4 w-4" />
                    <AlertTitle>Congratulations!</AlertTitle>
                    <AlertDescription>You have achieved the highest rank in the Paid User Track!</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isUserLoading) {
    return (
        <AppLayout>
            <div className="flex justify-center items-center h-full">
                <p>Loading your team...</p>
            </div>
        </AppLayout>
    );
  }

  if (!user) {
    return (
        <AppLayout>
            <Card>
                <CardHeader>
                    <CardTitle>Access Your Team</CardTitle>
                    <CardDescription>Please log in to view your affiliate network.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">My Team</h1>
          <p className="text-muted-foreground">
            Manage your affiliate team, track earnings, and view your network's growth.
          </p>
        </div>

        <Tabs defaultValue="team-summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
             <TabsTrigger value="team-summary">
              <Users className="mr-2 h-4 w-4" /> Team Summary
            </TabsTrigger>
            <TabsTrigger value="direct-members">
              <UserPlus className="mr-2 h-4 w-4" /> Direct Members
            </TabsTrigger>
             <TabsTrigger value="rewards">
              <Award className="mr-2 h-4 w-4" /> Rewards
            </TabsTrigger>
            <TabsTrigger value="earnings">
              <DollarSign className="mr-2 h-4 w-4" /> Commission
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="team-summary" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Summary</CardTitle>
                <CardDescription>
                  An overview of your network. This data updates automatically when new members join.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Direct Referrals (Level 1)</div>
                    <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-16" /> : directMemberIds.length}</div>
                </div>
                 <div className="p-4 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Total Team Size (All Members)</div>
                    <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-16" /> : totalTeamSize}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Total Paid Members</div>
                    <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-16" /> : paidTeamSize}</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/profile">Get Your Referral Link</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="direct-members" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Direct Members ({directMemberIds.length})</CardTitle>
                <CardDescription>
                  Users you have personally referred to the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Rank</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isProfileLoading ? (
                      <>
                        <UserRowSkeleton />
                        <UserRowSkeleton />
                      </>
                    ) : directMemberIds.length > 0 ? (
                      directMemberIds.map((memberId) => (
                        <TeamMemberRow key={memberId} memberId={memberId} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          You haven't referred any members yet. Share your referral link from your profile!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
           
          <TabsContent value="rewards" className="mt-6">
            <RewardsDashboard />
          </TabsContent>
          
          <TabsContent value="earnings" className="mt-6">
            <EarningTable />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

    