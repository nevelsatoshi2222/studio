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
import { Users, UserPlus, DollarSign, Award, Crown, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import React from 'react';

// Reward data structure
const freeTrackRewards = [
  { name: 'Bronze', reward: '1 Coin', requirement: '5 direct free referrals', limit: 'First 78,125 Achievers' },
  { name: 'Silver', reward: '2 Coins', requirement: '5 team members achieve Bronze', limit: 'First 15,625 Achievers' },
  { name: 'Gold', reward: '4 Coins', requirement: '5 team members achieve Silver', limit: 'First 3,125 Achievers' },
  { name: 'Emerald', reward: '10 Coins', requirement: '5 team members achieve Gold', limit: 'First 625 Achievers' },
  { name: 'Platinum', reward: '20 Coins', requirement: '5 team members achieve Emerald', limit: 'First 125 Achievers' },
  { name: 'Diamond', reward: '250 Coins', requirement: '5 team members achieve Platinum', limit: 'First 25 Achievers' },
  { name: 'Crown', reward: '1000 Coins', requirement: '5 team members achieve Diamond', limit: 'First 5 Achievers' },
];

const paidTrackRewards = [
  { name: 'Bronze Star', reward: '2.5 Coins', requirement: '5 direct paid members', limit: 'First 15,625 Achievers' },
  { name: 'Silver Star', reward: '5 Coins', requirement: '5 team members achieve Bronze Star', limit: 'First 3,125 Achievers' },
  { name: 'Gold Star', reward: '10 Coins', requirement: '5 team members achieve Silver Star', limit: 'First 625 Achievers' },
  { name: 'Emerald Star', reward: '20 Coins', requirement: '5 team members achieve Gold Star', limit: 'First 125 Achievers' },
  { name: 'Platinum Star', reward: '125 Coins', requirement: '5 team members achieve Emerald Star', limit: 'First 25 Achievers' },
  { name: 'Diamond Star', reward: '1250 Coins', requirement: '5 team members achieve Platinum Star', limit: 'First 5 Achievers' },
  { name: 'Crown Star', reward: '6250 Coins', requirement: '5 team members achieve Diamond Star', limit: 'First 1 Achiever' },
];

type TeamMember = {
  id: string;
  name: string;
  email: string;
  registeredAt: any;
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
    'Gold': Crown,
    'Emerald': Shield,
    'Platinum': Crown,
    'Diamond': Shield,
    'Crown': Crown,
    'Bronze Star': Award,
    'Silver Star': Award,
    'Gold Star': Crown,
    'Emerald Star': Shield,
    'Platinum Star': Crown,
    'Diamond Star': Shield,
    'Crown Star': Crown,
};

const RewardTierCard = ({ tier, progress, goal }: { tier: any; progress: number; goal: number }) => {
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
                    <p className="text-xs text-muted-foreground mt-1">{progress} / {goal} members</p>
                </div>

                <div className={`text-xs font-semibold mt-2 ${isAchieved ? 'text-green-700' : 'text-primary/80'}`}>{tier.limit}</div>
            </div>
        </div>
    );
};

// This component fetches data for a single member
function TeamMemberRow({ memberId }: { memberId: string }) {
    const firestore = useFirestore();
    const memberDocRef = doc(firestore, 'users', memberId);
    const { data: member, isLoading } = useDoc<TeamMember>(memberDocRef);

    if (isLoading) {
        return <UserRowSkeleton />;
    }

    if (!member) {
        return (
            <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground">Could not load member data</TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow key={member.id}>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar>
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
                <div className="flex gap-2">
                    {member.currentFreeRank && member.currentFreeRank !== 'None' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {member.currentFreeRank}
                        </span>
                    )}
                    {member.currentPaidRank && member.currentPaidRank !== 'None' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {member.currentPaidRank}
                        </span>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function TeamPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Fetch the current user's document
  const userDocRef = doc(firestore, 'users', user?.uid || 'temp');
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ 
    direct_team: string[];
    currentFreeRank: string;
    currentPaidRank: string;
    freeAchievers?: { bronze: number };
    paidAchievers?: { bronzeStar: number };
  }>(userDocRef);

  const directMemberIds = userProfile?.direct_team || [];
  const currentFreeRank = userProfile?.currentFreeRank || 'None';
  const currentPaidRank = userProfile?.currentPaidRank || 'None';
  const bronzeAchievers = userProfile?.freeAchievers?.bronze || 0;
  const bronzeStarAchievers = userProfile?.paidAchievers?.bronzeStar || 0;

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
                    Your affiliate program offers deep, multi-level rewards. You earn a percentage of the PGC purchased by members in your network, down to 15 levels.
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
                    <h4 className="font-semibold text-lg flex items-center gap-2">Total Commission: <span className="text-green-600">2% Distributed Across Levels</span></h4>
                    <p className="mt-1 text-green-800">This structure allows you to benefit from the network effect, as your earnings grow exponentially with your team's expansion.</p>
                </div>
            </CardContent>
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
            <CardDescription>Your current rank: <span className="font-bold text-primary">{currentFreeRank}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextFreeRank ? (
              <RewardTierCard 
                tier={nextFreeRank} 
                progress={bronzeAchievers} 
                goal={5} 
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
        <Card>
          <CardHeader>
            <CardTitle>Paid User (Star) Track</CardTitle>
            <CardDescription>Your current rank: <span className="font-bold text-primary">{currentPaidRank}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {nextPaidRank ? (
              <RewardTierCard 
                tier={nextPaidRank} 
                progress={bronzeStarAchievers} 
                goal={5} 
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
                    <div className="text-sm text-muted-foreground">Direct Referrals</div>
                    <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-16" /> : directMemberIds.length}</div>
                </div>
                 <div className="p-4 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Bronze Achievers</div>
                    <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-16" /> : bronzeAchievers}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Bronze Star Achievers</div>
                    <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-16" /> : bronzeStarAchievers}</div>
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
