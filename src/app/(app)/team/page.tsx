
'use client';
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
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

// Reward data structure
const freeTrackRewards = [
  { name: 'Bronze', reward: '1 Coin', requirement: '5 direct free referrals', limit: 'First 78,125 Achievers', key: 'bronze' },
  { name: 'Silver', reward: '2 Coins', requirement: '5 team members achieve Bronze', limit: 'First 15,625 Achievers', key: 'silver', dependsOn: 'bronze' },
  { name: 'Gold', reward: '4 Coins', requirement: '5 team members achieve Silver', limit: 'First 3,125 Achievers', key: 'gold', dependsOn: 'silver' },
  { name: 'Emerald', reward: '10 Coins', requirement: '5 team members achieve Gold', limit: 'First 625 Achievers', key: 'emerald', dependsOn: 'gold' },
  { name: 'Platinum', reward: '20 Coins', requirement: '5 team members achieve Emerald', limit: 'First 125 Achievers', key: 'platinum', dependsOn: 'emerald' },
  { name: 'Diamond', reward: '250 Coins', requirement: '5 team members achieve Platinum', limit: 'First 25 Achievers', key: 'diamond', dependsOn: 'platinum' },
  { name: 'Crown', reward: '1000 Coins', requirement: '5 team members achieve Diamond', limit: 'First 5 Achievers', key: 'crown', dependsOn: 'diamond' },
];

const paidTrackRewards = [
  { name: 'Bronze Star', reward: '2.5 Coins', requirement: '5 direct paid members', limit: 'First 15,625 Achievers', key: 'bronzeStar' },
  { name: 'Silver Star', reward: '5 Coins', requirement: '5 team members achieve Bronze Star', limit: 'First 3,125 Achievers', key: 'silverStar', dependsOn: 'bronzeStar' },
  { name: 'Gold Star', reward: '10 Coins', requirement: '5 team members achieve Silver Star', limit: 'First 625 Achievers', key: 'goldStar', dependsOn: 'silverStar' },
  { name: 'Emerald Star', reward: '20 Coins', requirement: '5 team members achieve Gold Star', limit: 'First 125 Achievers', key: 'emeraldStar', dependsOn: 'goldStar' },
  { name: 'Platinum Star', reward: '125 Coins', requirement: '5 team members achieve Emerald Star', limit: 'First 25 Achievers', key: 'platinumStar', dependsOn: 'emeraldStar' },
  { name: 'Diamond Star', reward: '1250 Coins', requirement: '5 team members achieve Platinum Star', limit: 'First 5 Achievers', key: 'diamondStar', dependsOn: 'platinumStar' },
  { name: 'Crown Star', reward: '6250 Coins', requirement: '5 team members achieve Diamond Star', limit: 'First 1 Achiever', key: 'crownStar', dependsOn: 'diamondStar' },
];

type TeamMember = {
  id: string;
  name: string;
  email: string;
  registeredAt: any;
  currentFreeRank?: string;
  currentPaidRank?: string;
  isPaid?: boolean;
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
                     {member.isPaid && <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>}
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
  const [commissionData, setCommissionData] = useState({
    totalCommission: 0,
    commissions: [] as any[],
    isLoading: true
  });
  const [directTeamMembers, setDirectTeamMembers] = useState<TeamMember[]>([]);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ 
    direct_team: string[];
    currentFreeRank: string;
    currentPaidRank: string;
    freeAchievers?: { bronze: number; silver: number; gold: number; };
    paidAchievers?: { bronzeStar: number; silverStar: number; goldStar: number; };
    isPaid?: boolean;
    paidTeamSize?: number;
    totalTeamSize?: number;
  }>(userDocRef);

  // Fetch commission data
  useEffect(() => {
    const fetchCommissionData = async () => {
      if (!user) return;
      
      try {
        const commQuery = query(collection(firestore, 'commissions'), where('userId', '==', user.uid));
        const commSnapshot = await getDocs(commQuery);
        const commissionsData = commSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const totalCommission = commissionsData.reduce((sum, comm) => sum + (comm.amount || comm.commissionAmount || 0), 0);

        setCommissionData({
          totalCommission,
          commissions: commissionsData,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching commissions:', error);
        setCommissionData(prev => ({ ...prev, isLoading: false }));
      }
    };

    if (user) {
      fetchCommissionData();
    }
  }, [user, firestore]);
  
  // Fetch direct team member details
  useEffect(() => {
    const fetchDirectTeam = async () => {
        if (!userProfile?.direct_team || userProfile.direct_team.length === 0 || !firestore) {
            setDirectTeamMembers([]);
            return;
        }

        const memberPromises = userProfile.direct_team.map(memberId => 
            getDoc(doc(firestore, 'users', memberId))
        );

        const memberDocs = await Promise.all(memberPromises);
        const membersData = memberDocs
            .filter(doc => doc.exists())
            .map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
        
        setDirectTeamMembers(membersData);
    };

    fetchDirectTeam();
}, [userProfile?.direct_team, firestore]);

  const directMemberIds = userProfile?.direct_team || [];
  const currentFreeRank = userProfile?.currentFreeRank || 'None';
  const currentPaidRank = userProfile?.currentPaidRank || 'None';

  // Level-wise earnings calculation
  const levelEarnings: Record<number, { total: number, count: number }> = {};
  commissionData.commissions.forEach(commission => {
    const level = commission.level || 1;
    const amount = commission.amount || commission.commissionAmount || 0;
    
    if (!levelEarnings[level]) {
      levelEarnings[level] = { total: 0, count: 0 };
    }
    levelEarnings[level].total += amount;
    levelEarnings[level].count += 1;
  });

  const levelEarningsArray = Object.entries(levelEarnings)
    .map(([level, data]) => ({
      level: parseInt(level),
      earnings: data.total,
      count: data.count
    }))
    .sort((a, b) => a.level - b.level);
  
  const RewardsDashboard = () => {
    const freeRankIndex = freeTrackRewards.findIndex(r => r.name === currentFreeRank);
    const nextFreeRank = freeTrackRewards[freeRankIndex + 1];

    const paidRankIndex = paidTrackRewards.findIndex(r => r.name === currentPaidRank);
    const nextPaidRank = paidTrackRewards[paidRankIndex + 1];
    
    const getProgressForRank = (rank: any, isPaidTrack: boolean) => {
        if (!rank || !userProfile) return 0;
    
        if (isPaidTrack) {
            // For Bronze Star, the requirement is direct paid members.
            if (rank.key === 'bronzeStar') {
                return directTeamMembers.filter(m => m.isPaid).length;
            }
            // For subsequent paid ranks, it depends on the achievements of the team.
            const dependsOnKey = rank.dependsOn as keyof NonNullable<typeof userProfile.paidAchievers>;
            return userProfile.paidAchievers?.[dependsOnKey] || 0;
        } else {
            // For Bronze, the requirement is direct members (free or paid).
            if (rank.key === 'bronze') {
                return userProfile.direct_team?.length || 0;
            }
            // For subsequent free ranks, it depends on the achievements of the team.
            const dependsOnKey = rank.dependsOn as keyof NonNullable<typeof userProfile.freeAchievers>;
            return userProfile.freeAchievers?.[dependsOnKey] || 0;
        }
    };

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
                progress={getProgressForRank(nextFreeRank, false)} 
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
                progress={getProgressForRank(nextPaidRank, true)} 
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
  
    const EarningTable = () => {
    if (commissionData.isLoading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Commission Earnings</CardTitle>
            <CardDescription>Loading your commission data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Commission Earnings</CardTitle>
            <CardDescription>
              Real commissions earned from your team's purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  ${commissionData.totalCommission.toFixed(2)}
                </div>
                <p className="text-sm text-green-800">Total Earned</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {commissionData.commissions.length}
                </div>
                <p className="text-sm text-blue-800">Transactions</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Earnings by Level</h4>
              {levelEarningsArray.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {levelEarningsArray.map((level) => (
                    <div key={level.level} className="text-center p-3 rounded-lg bg-gray-50 border border-green-200">
                      <div className="font-semibold text-lg">Level {level.level}</div>
                      <div className="text-green-600 font-bold text-xl">${level.earnings.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{level.count} transactions</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No commission earnings yet</p>
                  <p className="text-sm">Earnings will appear when your team makes purchases</p>
                </div>
              )}
            </div>
            
            <div className="p-4 rounded-lg border bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Commission Structure</h4>
              <p className="text-sm text-blue-700">
                You earn 0.2% from levels 1-5 and 0.1% from levels 6-15 of your team's purchases.
                Total commission pool: 2% distributed across all levels.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isUserLoading || (user && isProfileLoading)) {
    return (
        <div className="flex justify-center items-center h-full">
            <p>Loading your team...</p>
        </div>
    );
  }

  if (!user) {
    return (
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
    );
  }

  return (
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
                  <div className="text-sm text-muted-foreground">Total Team Size</div>
                  <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-16" /> : userProfile?.totalTeamSize || 0}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                  <div className="text-sm text-muted-foreground">Paid Team Members</div>
                  <div className="text-3xl font-bold">{isProfileLoading ? <Skeleton className="h-8 w-16" /> : userProfile?.paidTeamSize || 0}</div>
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
                    <TableHead>Status & Rank</TableHead>
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
  );
}

