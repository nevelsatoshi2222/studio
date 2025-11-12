'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  DollarSign,
  Award,
  Crown,
  Star,
  Copy,
  Share2,
  TrendingUp,
  UserPlus,
  Gem,
  Shield,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

// Team member type
interface TeamMember {
  uid: string;
  name: string;
  email: string;
  accountType: 'free' | 'paid';
  country: string;
  registeredAt: any;
  currentFreeRank: string;
}

// User data type
interface UserData {
  name: string;
  email: string;
  referralCode: string;
  accountType: 'free' | 'paid';
  currentFreeRank: string;
  currentPaidRank: string;
  balances: {
    usd: number;
    pgc: number;
    totalCommission: number;
  };
  teamStats: {
    totalTeam: number;
    directTeam: number;
    level2Team: number;
    level3Team: number;
    level4Team: number;
    level5Team: number;
  };
  direct_team: string[];
  achievements: {
    bronze: boolean;
    silver: boolean;
    gold: boolean;
    emerald: boolean;
    platinum: boolean;
    diamond: boolean;
    crown: boolean;
  };
  stats: {
    totalReferrals: number;
    paidReferrals: number;
    totalEarned: number;
  };
}

export default function AffiliateDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user data and team members
  useEffect(() => {
    if (!user || !firestore) return;

    const unsubscribe = onSnapshot(
      doc(firestore, 'users', user.uid),
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as UserData;
          setUserData(data);
          
          // Fetch team members details
          if (data.direct_team && data.direct_team.length > 0) {
            const teamPromises = data.direct_team.map(async (memberId: string) => {
              const memberDoc = await getDoc(doc(firestore, 'users', memberId));
              if (memberDoc.exists()) {
                return { uid: memberId, ...memberDoc.data() } as TeamMember;
              }
              return null;
            });
            
            const teamResults = await Promise.all(teamPromises);
            setTeamMembers(teamResults.filter(Boolean) as TeamMember[]);
          } else {
            setTeamMembers([]);
          }
          
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, firestore]);

  // Copy referral code to clipboard
  const copyReferralCode = () => {
    if (userData?.referralCode) {
      navigator.clipboard.writeText(userData.referralCode);
      toast({
        title: 'Copied!',
        description: 'Referral code copied to clipboard',
      });
    }
  };

  // Copy referral link to clipboard
  const copyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${userData?.referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copied!',
      description: 'Referral link copied to clipboard',
    });
  };

  // Share referral link
  const shareReferralLink = async () => {
    const link = `${window.location.origin}/register?ref=${userData?.referralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Public Governance',
          text: 'Join me on Public Governance and start earning rewards!',
          url: link,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      copyReferralLink();
    }
  };

  // Get rank icon
  const getRankIcon = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'crown': return <Crown className="h-5 w-5 text-yellow-600" />;
      case 'diamond': return <Gem className="h-5 w-5 text-blue-400" />;
      case 'platinum': return <Shield className="h-5 w-5 text-gray-400" />;
      case 'gold': return <Award className="h-5 w-5 text-yellow-500" />;
      case 'silver': return <Award className="h-5 w-5 text-gray-400" />;
      case 'bronze': return <Award className="h-5 w-5 text-orange-800" />;
      default: return <Star className="h-5 w-5 text-gray-400" />;
    }
  };

  // Get next rank requirements
  const getNextRankInfo = () => {
    if (!userData) return { rank: '', required: 0, progress: 0 };
    
    const currentTotal = userData.teamStats?.totalTeam || 0;
    
    if (currentTotal < 10) return { rank: 'Bronze', required: 10, progress: (currentTotal / 10) * 100 };
    if (currentTotal < 100) return { rank: 'Silver', required: 100, progress: (currentTotal / 100) * 100 };
    if (currentTotal < 500) return { rank: 'Gold', required: 500, progress: (currentTotal / 500) * 100 };
    if (currentTotal < 1000) return { rank: 'Platinum', required: 1000, progress: (currentTotal / 1000) * 100 };
    if (currentTotal < 5000) return { rank: 'Diamond', required: 5000, progress: (currentTotal / 5000) * 100 };
    if (currentTotal < 10000) return { rank: 'Crown', required: 10000, progress: (currentTotal / 10000) * 100 };
    
    return { rank: 'Max', required: 0, progress: 100 };
  };

  if (isLoading) {
    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
    );
  }

  if (!userData) {
    return (
        <div className="flex flex-col items-center justify-center h-64">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Data Found</h2>
          <p className="text-muted-foreground">Unable to load affiliate data</p>
        </div>
    );
  }

  const nextRankInfo = getNextRankInfo();

  return (
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="font-headline text-3xl font-bold">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your team, track earnings, and grow your network
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Earnings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${userData.balances?.totalCommission?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{userData.balances?.pgc?.toLocaleString() || 0} PGC
              </p>
            </CardContent>
          </Card>

          {/* Team Size */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Size</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.teamStats?.totalTeam?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                {userData.teamStats?.directTeam || 0} direct members
              </p>
            </CardContent>
          </Card>

          {/* Current Rank */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
              {getRankIcon(userData.currentFreeRank)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.currentFreeRank}</div>
              <p className="text-xs text-muted-foreground">
                {userData.accountType === 'paid' ? 'Paid Account' : 'Free Account'}
              </p>
            </CardContent>
          </Card>

          {/* Referral Code */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Code</CardTitle>
              <UserPlus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{userData.referralCode}</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={copyReferralCode}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button size="sm" onClick={shareReferralLink}>
                  <Share2 className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Referral Link Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Your Referral Link
                  </CardTitle>
                  <CardDescription>
                    Share this link to invite others and earn rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input 
                      value={`${window.location.origin}/register?ref=${userData.referralCode}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button onClick={copyReferralLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={shareReferralLink} className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Referral Link
                  </Button>
                </CardFooter>
              </Card>

              {/* Rank Progress Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Rank Progress
                  </CardTitle>
                  <CardDescription>
                    Progress to next rank: {nextRankInfo.rank}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {userData.currentFreeRank}</span>
                      <span>Next: {nextRankInfo.rank}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${nextRankInfo.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground text-center">
                      {userData.teamStats?.totalTeam || 0} / {nextRankInfo.required} team members
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-muted-foreground">
                    Need {nextRankInfo.required - (userData.teamStats?.totalTeam || 0)} more members for {nextRankInfo.rank}
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    ${userData.balances?.usd?.toLocaleString() || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Available USD</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {userData.balances?.pgc?.toLocaleString() || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">PGC Balance</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {userData.stats?.paidReferrals || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Paid Referrals</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {userData.stats?.totalReferrals || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Team Members</CardTitle>
                <CardDescription>
                  Direct team members and their details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {teamMembers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Account Type</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Rank</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.uid}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Badge variant={member.accountType === 'paid' ? 'default' : 'secondary'}>
                              {member.accountType}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.country}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getRankIcon(member.currentFreeRank)}
                              <span>{member.currentFreeRank}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {member.registeredAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Team Members Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start sharing your referral link to build your team!
                    </p>
                    <Button onClick={shareReferralLink}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Your Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Statistics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Direct Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.teamStats?.directTeam || 0}</div>
                  <p className="text-xs text-muted-foreground">Level 1 members</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Level 2 Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.teamStats?.level2Team || 0}</div>
                  <p className="text-xs text-muted-foreground">Your team's referrals</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.teamStats?.totalTeam || 0}</div>
                  <p className="text-xs text-muted-foreground">All levels combined</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Breakdown</CardTitle>
                  <CardDescription>Earnings from your network</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Direct Referrals:</span>
                    <span className="font-semibold">
                      ${((userData.teamStats?.directTeam || 0) * 10).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level 2 Commissions:</span>
                    <span className="font-semibold">
                      ${((userData.teamStats?.level2Team || 0) * 5).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level 3+ Commissions:</span>
                    <span className="font-semibold">
                      ${((userData.teamStats?.level3Team || 0) * 3).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total Earned:</span>
                    <span>${userData.balances?.totalCommission?.toLocaleString() || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Balance Summary</CardTitle>
                  <CardDescription>Your available balances</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>USD Balance:</span>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        ${userData.balances?.usd?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Available for withdrawal</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>PGC Balance:</span>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">
                        {userData.balances?.pgc?.toLocaleString() || 0} PGC
                      </div>
                      <div className="text-sm text-muted-foreground">Platform rewards</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Commission:</span>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        ${userData.balances?.totalCommission?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Lifetime earnings</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled>
                    <Zap className="h-4 w-4 mr-2" />
                    Withdraw Funds (Coming Soon)
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rank Achievements</CardTitle>
                <CardDescription>Your progress through the reward ranks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown'].map((rank) => {
                    const isUnlocked = userData.achievements?.[rank.toLowerCase() as keyof typeof userData.achievements];
                    const isCurrent = userData.currentFreeRank === rank;
                    
                    return (
                      <Card key={rank} className={isCurrent ? 'border-primary' : ''}>
                        <CardContent className="p-4 text-center">
                          <div className="flex justify-center mb-2">
                            {getRankIcon(rank)}
                          </div>
                          <h3 className={`font-semibold ${isCurrent ? 'text-primary' : ''}`}>
                            {rank}
                          </h3>
                          <div className="text-sm text-muted-foreground mt-1">
                            {isUnlocked ? (
                              <Badge variant="default">Unlocked</Badge>
                            ) : isCurrent ? (
                              <Badge variant="secondary">Current</Badge>
                            ) : (
                              <Badge variant="outline">Locked</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Reward Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Rank Requirements</CardTitle>
                <CardDescription>Team size needed for each rank</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Team Size Required</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { rank: 'Bronze', required: 10, reward: '$10 + 100 PGC' },
                      { rank: 'Silver', required: 100, reward: '$50 + 500 PGC' },
                      { rank: 'Gold', required: 500, reward: '$100 + 1,000 PGC' },
                      { rank: 'Platinum', required: 1000, reward: '$500 + 5,000 PGC' },
                      { rank: 'Diamond', required: 5000, reward: '$1,000 + 10,000 PGC' },
                      { rank: 'Crown', required: 10000, reward: '$5,000 + 50,000 PGC' },
                    ].map(({ rank, required, reward }) => {
                      const isUnlocked = userData.achievements?.[rank.toLowerCase() as keyof typeof userData.achievements];
                      const isCurrent = userData.currentFreeRank === rank;
                      const hasTeam = (userData.teamStats?.totalTeam || 0) >= required;
                      
                      return (
                        <TableRow key={rank}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getRankIcon(rank)}
                              {rank}
                            </div>
                          </TableCell>
                          <TableCell>{required.toLocaleString()} members</TableCell>
                          <TableCell>{reward}</TableCell>
                          <TableCell>
                            {isUnlocked ? (
                              <Badge variant="default">Achieved</Badge>
                            ) : isCurrent ? (
                              <Badge variant="secondary">Current Rank</Badge>
                            ) : hasTeam ? (
                              <Badge variant="outline">Ready to Claim</Badge>
                            ) : (
                              <Badge variant="outline">
                                {required - (userData.teamStats?.totalTeam || 0)} more needed
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
