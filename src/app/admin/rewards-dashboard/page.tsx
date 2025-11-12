// app/admin/rewards-dashboard/page.tsx - UNIFIED REWARDS SYSTEM
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Crown, 
  Trophy, 
  Award, 
  Star, 
  Gem, 
  TrendingUp, 
  DollarSign,
  Video,
  FileText,
  Calculator
} from 'lucide-react';
import { REWARD_TIERS, QUIZ_REWARDS, INFLUENCER_TIERS, AFFILIATE_COMMISSION } from '@/lib/rewardConfig';

export default function RewardsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Real data structure - replace with actual API calls
  const dashboardStats = {
    totalUsers: 1250,
    activeAffiliates: 89,
    influencers: 23,
    quizParticipants: 456,
    totalRewards: 28450,
    bronzeStarUsers: 45,
    silverUsers: 18,
    goldUsers: 8,
    emeraldUsers: 3,
    platinumUsers: 1,
    diamondUsers: 0,
    crownUsers: 0
  };

  const recentRewards = [
    { id: 1, user: 'john_trader', type: 'affiliate', amount: '2.5 PGC', tier: 'Silver', time: '2 hours ago' },
    { id: 2, user: 'crypto_queen', type: 'quiz', amount: '5 PGC', tier: 'Gold', time: '4 hours ago' },
    { id: 3, user: 'tech_influencer', type: 'influencer', amount: '100 PGC', tier: 'Star', time: '1 day ago' },
    { id: 4, user: 'quiz_master', type: 'quiz', amount: '3 PGC', tier: 'Silver', time: '1 day ago' },
  ];

  const getTierIcon = (tier: string) => {
    const tierKey = tier.toUpperCase().replace(' ', '_');
    return REWARD_TIERS[tierKey as keyof typeof REWARD_TIERS]?.icon || '⭐';
  };

  const getTierColor = (tier: string) => {
    const tierKey = tier.toUpperCase().replace(' ', '_');
    return REWARD_TIERS[tierKey as keyof typeof REWARD_TIERS]?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Unified Rewards Dashboard</h1>
          <p className="text-gray-600">Manage all reward programs in one place</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="influencer">Influencer</TabsTrigger>
          <TabsTrigger value="tiers">Tier System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{dashboardStats.activeAffiliates}</div>
                    <div className="text-gray-600">Active Affiliates</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Video className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{dashboardStats.influencers}</div>
                    <div className="text-gray-600">Influencers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calculator className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">{dashboardStats.quizParticipants}</div>
                    <div className="text-gray-600">Quiz Participants</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tier Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Tier Distribution</CardTitle>
              <CardDescription>User distribution across reward tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(REWARD_TIERS).map(([key, tier]) => (
                  <div key={key} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">
                      {dashboardStats[`${tier.level.toLowerCase().replace(' ', '')}Users` as keyof typeof dashboardStats] || 0}
                    </div>
                    <Badge className={`${tier.color} text-white mt-2`}>
                      {tier.icon} {tier.level}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">{tier.pgc} PGC</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Rewards */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Rewards</CardTitle>
              <CardDescription>Latest reward distributions across all programs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium">{reward.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {reward.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTierColor(reward.tier)}>
                          {getTierIcon(reward.tier)} {reward.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">{reward.amount}</TableCell>
                      <TableCell className="text-gray-500">{reward.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Affiliate Tab */}
        <TabsContent value="affiliate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Program</CardTitle>
              <CardDescription>Manage affiliate rewards and tier progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Commission Structure</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Direct Paid User</span>
                      <span className="font-semibold">{AFFILIATE_COMMISSION.DIRECT_SIGNUP} PGC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Bonus</span>
                      <span className="font-semibold">{AFFILIATE_COMMISSION.TEAM_BONUS * 100}% of team earnings</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Tier Progression</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bronze Star → Silver</span>
                      <span>5 direct paid users</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Silver → Gold</span>
                      <span>5 Bronze Star in team</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gold → Emerald</span>
                      <span>5 Silver in team</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Rewards Program</CardTitle>
              <CardDescription>Manage quiz participation rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Performance Rewards</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span>Perfect Score (100%)</span>
                      <span className="font-semibold">{QUIZ_REWARDS.PERFECT_SCORE} PGC</span>
                    </div>
                    <div className="flex justify-between p-3 bg-blue-50 rounded">
                      <span>Excellent (80-99%)</span>
                      <span className="font-semibold">{QUIZ_REWARDS.EXCELLENT_SCORE} PGC</span>
                    </div>
                    <div className="flex justify-between p-3 bg-yellow-50 rounded">
                      <span>Good (60-79%)</span>
                      <span className="font-semibold">{QUIZ_REWARDS.GOOD_SCORE} PGC</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <span>Basic (Below 60%)</span>
                      <span className="font-semibold">{QUIZ_REWARDS.BASIC_SCORE} PGC</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Quiz Statistics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Total Participants</span>
                        <span>{dashboardStats.quizParticipants}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Average Score</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Completion Rate</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Influencer Tab */}
        <TabsContent value="influencer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Influencer Rewards Program</CardTitle>
              <CardDescription>Manage influencer tiers and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Influencer Tiers</h3>
                  <div className="space-y-3">
                    {Object.entries(INFLUENCER_TIERS).map(([key, tier]) => (
                      <div key={key} className="flex justify-between p-3 border rounded">
                        <div>
                          <div className="font-semibold">{tier.name}</div>
                          <div className="text-sm text-gray-600">{tier.followers.toLocaleString()}+ followers</div>
                        </div>
                        <div className="font-semibold text-green-600">{tier.reward} PGC</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Active Influencers</span>
                      <span className="font-semibold">{dashboardStats.influencers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Content Submissions</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Rate</span>
                      <span className="font-semibold">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Rewards Distributed</span>
                      <span className="font-semibold text-green-600">2,850 PGC</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tier System Tab */}
        <TabsContent value="tiers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unified Tier Reward System</CardTitle>
              <CardDescription>Complete tier progression across all programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(REWARD_TIERS).map(([key, tier]) => (
                  <Card key={key} className={`border-l-4 ${tier.color.replace('bg-', 'border-')}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${tier.color} text-white text-xl`}>
                            {tier.icon}
                          </div>
                          <div>
                            <div className="text-xl font-bold">{tier.level}</div>
                            <div className="text-gray-600">{tier.requirement}</div>
                            <div className="text-sm text-gray-500">
                              {tier.users.toLocaleString()} total users in team
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{tier.pgc} PGC</div>
                          <div className="text-sm text-gray-500">Reward</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progression Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Tier Progression Requirements</CardTitle>
              <CardDescription>Detailed requirements for advancing through tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Current Tier</TableHead>
                    <TableHead>Next Tier</TableHead>
                    <TableHead>Direct Requirements</TableHead>
                    <TableHead>Team Requirements</TableHead>
                    <TableHead>Reward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.values(REWARD_TIERS).map((tier, index, array) => {
                    if (index === array.length - 1) return null; // Skip last tier
                    const nextTier = array[index + 1];
                    return (
                      <TableRow key={tier.level}>
                        <TableCell>
                          <Badge className={`${tier.color} text-white`}>
                            {tier.icon} {tier.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${nextTier.color} text-white`}>
                            {nextTier.icon} {nextTier.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {index === 0 ? '5 direct paid users' : `5 ${tier.level} in direct team`}
                        </TableCell>
                        <TableCell>
                          {nextTier.requirement}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {nextTier.pgc} PGC
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