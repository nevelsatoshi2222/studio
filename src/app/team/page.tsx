
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
import { Users, UserPlus, DollarSign, Award } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { freeTrackRewards, paidTrackRewards } from '@/lib/data';
import { AffiliateRewardTier } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

type TeamMember = {
  id: string;
  name: string;
  avatarId: string;
  registeredAt: any;
  email: string;
  referralCode?: string;
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


const RewardTierCard = ({ tier, progress, goal }: { tier: AffiliateRewardTier, progress: number, goal: number }) => {
    const Icon = tier.icon;
    const isAchieved = progress >= goal;
    const progressPercent = Math.min((progress / goal) * 100, 100);

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

export default function TeamPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const directMembersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users'), where('referralCode', '==', user.uid));
  }, [firestore, user]);

  const { data: directMembers, isLoading: areDirectMembersLoading } = useCollection<TeamMember>(directMembersQuery);
  
  const [level2Count, setLevel2Count] = useState(0);
  const [bronzeAchievers, setBronzeAchievers] = useState(0);
  const [isTeamDataLoading, setIsTeamDataLoading] = useState(false);

  useEffect(() => {
    if (directMembers && firestore) {
      const fetchTeamDetails = async () => {
        setIsTeamDataLoading(true);
        let l2Count = 0;
        let bronzeCount = 0;

        // Create a batch of promises to fetch data for all direct members
        const promises = directMembers.map(async (member) => {
          // Query for level 2 members (referrals of our direct referrals)
          const level2Query = query(collection(firestore, 'users'), where('referralCode', '==', member.id));
          const level2Snapshot = await getDocs(level2Query);
          l2Count += level2Snapshot.size;

          // Check if this direct member has achieved Bronze (has >= 5 referrals)
          if (level2Snapshot.size >= 5) {
            bronzeCount++;
          }
        });

        await Promise.all(promises);

        setLevel2Count(l2Count);
        setBronzeAchievers(bronzeCount);
        setIsTeamDataLoading(false);
      };

      fetchTeamDetails();
    }
  }, [directMembers, firestore]);

  const getAvatarUrl = (avatarId: string) => {
    const image = placeholderImages.find((img) => img.id === avatarId);
    return image ? image.imageUrl : `https://picsum.photos/seed/${avatarId}/40/40`;
  };

  const getAvatarHint = (avatarId: string) => {
    const image = placeholderImages.find((img) => img.id === avatarId);
    return image ? image.imageHint : 'user avatar';
  };
  
  const EarningTable = () => {
    const earningsData = [];
    for (let i = 1; i <= 15; i++) {
      let commission = 0;
      if (i <= 5) {
        commission = 0.2;
      } else {
        commission = 0.1;
      }
      earningsData.push({ level: i, commission: `${commission}%` });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Earning Commission by Level</CardTitle>
                <CardDescription>
                    Your affiliate program offers deep, multi-level rewards. You earn a percentage of the revenue generated by members in your network, down to 15 levels.
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
                    <p className="text-muted-foreground mt-1 text-green-800">This structure allows you to benefit from the network effect, as your earnings grow exponentially with your team's expansion.</p>
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
    const directReferralCount = directMembers?.length || 0;
    
    return (
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Free User Track</CardTitle>
            <CardDescription>Rewards for growing your network with free members.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RewardTierCard tier={freeTrackRewards[0]} progress={directReferralCount} goal={5} />
            {isTeamDataLoading ? <Skeleton className="h-24 w-full" /> : <RewardTierCard tier={freeTrackRewards[1]} progress={bronzeAchievers} goal={5} />}
            <Alert>
              <AlertTitle>More Tiers Available</AlertTitle>
              <AlertDescription>
                As your team achieves new tiers, more reward levels will unlock here.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Paid User (Star) Track</CardTitle>
            <CardDescription>Higher rewards when your referrals purchase or stake.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <RewardTierCard tier={paidTrackRewards[0]} progress={0} goal={5} />
            <Alert>
              <AlertTitle>Feature in Development</AlertTitle>
              <AlertDescription>
                Tracking for paid user achievements is being built. This section will update automatically once live.
              </AlertDescription>
            </Alert>
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

        <Tabs defaultValue="direct-members" className="w-full">
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
                  An overview of your network depth.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Direct Referrals (Level 1)</p>
                    <p className="text-3xl font-bold">{areDirectMembersLoading ? <Skeleton className="h-8 w-16" /> : directMembers?.length || 0}</p>
                </div>
                 <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Team Members (Level 2)</p>
                    <p className="text-3xl font-bold">{isTeamDataLoading ? <Skeleton className="h-8 w-16" /> : level2Count}</p>
                </div>
                 <div className="p-4 rounded-lg bg-muted md:col-span-2">
                    <p className="text-sm text-muted-foreground">Full Team Tree (Levels 3-15)</p>
                    <Alert className="mt-2">
                      <AlertTitle>Under Development</AlertTitle>
                      <AlertDescription>
                        Calculating the full team tree across 15 levels is a complex operation. We are building an efficient backend process to provide this data. Please check back soon!
                      </AlertDescription>
                    </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="direct-members" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Direct Members ({directMembers?.length || 0})</CardTitle>
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
                    {areDirectMembersLoading ? (
                        <>
                            <UserRowSkeleton />
                            <UserRowSkeleton />
                        </>
                    ) : directMembers && directMembers.length > 0 ? (
                        directMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={getAvatarUrl(member.avatarId)} alt={member.name} data-ai-hint={getAvatarHint(member.avatarId)} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{member.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{member.registeredAt ? new Date(member.registeredAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell className="text-right">{member.email}</TableCell>
                          </TableRow>
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
