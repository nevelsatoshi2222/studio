
'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Users, UserPlus, DollarSign, Award, Info, Gem, Star as StarIcon, Crown, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { freeTrackRewards, paidTrackRewards } from '@/lib/data';
import { AffiliateRewardTier } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import React from 'react';


type TeamMember = {
  id: string;
  name: string;
  avatarId: string;
  registeredAt: any;
  email: string;
  currentFreeRank?: string;
  currentPaidRank?: string;
};

const UserRowSkeleton = () => (
    <TableRow>
        <TableCell>
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    </TableRow>
);

const rankIcons: { [key: string]: React.FC<any> } = {
    'Bronze': Users,
    'Silver': Award,
    'Gold': Gem,
    'Emerald': Shield,
    'Platinum': StarIcon,
    'Diamond': Shield,
    'Crown': Crown,
    'Bronze Star': StarIcon,
    'Silver Star': Award,
    'Gold Star': Gem,
    'Emerald Star': Shield,
    'Platinum Star': StarIcon,
    'Diamond Star': Shield,
    'Crown Star': Crown,
};

const RewardTierCard = ({ tier, progress, goal }: { tier: AffiliateRewardTier; progress: number; goal: number }) => {
    const Icon = rankIcons[tier.name] || Award;
    const isAchieved = progress >= goal;
    const progressPercent = goal > 0 ? Math.min((progress / goal) * 100, 100) : 0;

    return (
        <div className={`flex items-start gap-4 rounded-lg border p-4 ${isAchieved ? 'bg-green-500/10 border-green-500' : 'bg-muted/30'}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-md mt-1 ${isAchieved ? 'bg-green-500/20 text-green-600' : 'bg-primary/10 text-primary'}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-lg">{tier.name}</h4>
                    <div className={`text-lg font-bold ${isAchieved ? 'text-green-600' : 'text-primary'}`}>{tier.reward}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{tier.requirement}</p>
                
                <div className="mt-2">
                    <Progress value={progressPercent} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{progress.toLocaleString()} / {goal.toLocaleString()} members</p>
                </div>

                <div className={`text-xs font-semibold mt-2 ${isAchieved ? 'text-green-700' : 'text-primary/80'}`}>{tier.limit}</div>
            </div>
        </div>
    );
};

// This component fetches data for a single member using their ID.
function TeamMemberRow({ memberId }: { memberId: string }) {
    const firestore = useFirestore();
    const memberDocRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'users', memberId);
    }, [firestore, memberId]);

    const { data: member, isLoading } = useDoc<TeamMember>(memberDocRef);

    const getAvatarUrl = (avatarId: string) => `https://picsum.photos/seed/${avatarId}/40/40`;

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

    return (
        <TableRow key={member.id}>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={getAvatarUrl(member.avatarId)} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                </div>
            </TableCell>
            <TableCell>{member.registeredAt ? new Date(member.registeredAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell className="text-right">{member.email}</TableCell>
        </TableRow>
    );
}

export default function TeamPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Fetch the current user's document to get referral IDs, ranks, and team sizes
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
    const earningsData = Array.from({ length: 15 }, (_, i) => {
      const level = i + 1;
      let commission = level <= 5 ? 0.2 : 0.1;
      return { level, commission: `${commission}%` };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Earning Commission by Level</CardTitle>
                <CardDescription>
                    Your affiliate program offers deep, multi-level rewards. You earn a percentage of the PGC purchased by members in your network, down to 15 levels. This is calculated and paid out automatically by a secure Cloud Function.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Level</TableHead>
                            <TableHead className="text-right">Commission Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {earningsData.map((earning) => (
                            <TableRow key={earning.level}>
                                <TableCell>Level {earning.level}</TableCell>
                                <TableCell className="text-right font-medium">{earning.commission}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <div className="p-4 rounded-lg border bg-green-500/10 text-green-700 mt-6">
                    <h4 className="font-semibold text-lg flex items-center gap-2">Total Commission: <span className="text-green-600">2% Distributed</span></h4>
                    <p className="mt-1 text-green-800">This structure allows you to benefit from the network effect, as your earnings grow exponentially with your team's expansion.</p>
                </div>
            </CardContent>
             <CardFooter>
                <Button asChild>
                    <Link href="/affiliate-marketing">Learn More About the Program</Link>
                </Button>
            </CardFooter>
        </Card>
    );
  };
  
  const RewardsDashboard = () => {
    const freeRankIndex = freeTrackRewards.findIndex(r => r.name === currentFreeRank);
    const nextFreeRank = freeTrackRewards[freeRankIndex + 1];

    const paidRankIndex = paidTrackRewards.findIndex(r => r.name === currentPaidRank);
    const nextPaidRank = paidTrackRewards[paidRankIndex + 1];

    return (
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Free User Track</CardTitle>
            <CardDescription>Your current rank is: <span className="font-bold text-primary">{currentFreeRank}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextFreeRank ? (
              <RewardTierCard tier={nextFreeRank} progress={totalTeamSize} goal={nextFreeRank.requirement} />
            ) : (
                <Alert>
                    <Crown className="h-4 w-4" />
                    <AlertTitle>Congratulations!</AlertTitle>
                    <AlertDescription>You have achieved the highest rank in the Free User Track!</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Paid User (Star) Track</CardTitle>
            <CardDescription>Your current rank is: <span className="font-bold text-primary">{currentPaidRank}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {nextPaidRank ? (
              <RewardTierCard tier={nextPaidRank} progress={paidTeamSize} goal={nextPaidRank.requirement} />
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
                  An overview of your network depth. This data is updated automatically when a new member joins your downline.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Direct Referrals (Level 1)</div>
                    <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-16" /> : directMemberIds.length}</div>
                </div>
                 <div className="p-4 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Total Free Team Size</div>
                    <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-24" /> : totalTeamSize}</div>
                </div>
                 <div className="p-4 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Total Paid Team Size</div>
                    <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-24" /> : paidTeamSize}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="direct-members" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Direct Members ({directMemberIds.length})</CardTitle>
                <CardDescription>
                  Users you have personally referred to the platform (Level 1).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isProfileLoading ? (
                      <><UserRowSkeleton /><UserRowSkeleton /></>
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
