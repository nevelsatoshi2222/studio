'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Trophy, 
  Crown, 
  Star, 
  Users, 
  Eye, 
  Award, 
  TrendingUp, 
  Calculator,
  Share2,
  Video,
  Zap,
  Coins,
  Gift,
  CheckCircle,
  Calendar,
  UserPlus,
  ExternalLink
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

// Financial Quiz Rewards Data
const FINANCIAL_QUIZ_REWARDS = [
  { achievers: 50000, reward: 1, stage: 'Round 1 - General Quiz' },
  { achievers: 20000, reward: 2, stage: 'Round 1 - General Quiz' },
  { achievers: 5000, reward: 3, stage: 'Round 1 - General Quiz' },
  { achievers: 2000, reward: 5, stage: 'Round 1 - Qualifiers' },
  { achievers: 200, reward: 20, stage: 'Semi-Final - Qualifiers' },
  { achievers: 20, reward: 100, stage: 'Final - Qualifiers' },
  { achievers: 4, reward: 1000, stage: 'Final - Runners Up' },
  { achievers: 1, reward: 5000, stage: 'Final - Winner' },
];

// Updated Influencer Rewards Data
const INFLUENCER_REWARDS = {
  followerTiers: [
    { 
      tier: 'DIAMOND', 
      followers: 50000, 
      videoType: 'LONG VIDEO (15min - 2hr)', 
      achievers: 1000, 
      reward: 20, 
      earlyBonus: 20 
    },
    { 
      tier: 'GOLD', 
      followers: 20000, 
      videoType: 'OVERVIEW VIDEO (3-8min)', 
      achievers: 5000, 
      reward: 5, 
      earlyBonus: 5 
    },
    { 
      tier: 'SILVER', 
      followers: 5000, 
      videoType: 'SHORT VIDEO (<3min)', 
      achievers: 10000, 
      reward: 2, 
      earlyBonus: 2 
    },
  ],
  viewRewards: [
    { views: 10000000, topAchievers: 8, reward: 1000 },
    { views: 1000000, topAchievers: 40, reward: 200 },
    { views: 100000, topAchievers: 200, reward: 50 },
    { views: 10000, topAchievers: 1000, reward: 10 },
    { views: 1000, topAchievers: 5000, reward: 5 },
    { views: 1000, topAchievers: 20000, reward: 2 },
  ],
  earlyBonuses: [
    { views: 100000, achievers: 10, reward: 100 },
    { views: 10000, achievers: 100, reward: 50 },
  ]
};

// Updated Affiliate Rewards Data
const AFFILIATE_REWARDS = [
  { 
    level: 'BRONZE STAR', 
    rewardSlots: 78125, 
    reward: 1, 
    firstAchiever: 15625, 
    firstReward: 5, 
    topEarly: 625, 
    extra: 5 
  },
  { 
    level: 'SILVER STAR', 
    rewardSlots: 15625, 
    reward: 2.5, 
    firstAchiever: 3125, 
    firstReward: 10, 
    topEarly: 125, 
    extra: 10 
  },
  { 
    level: 'GOLD STAR', 
    rewardSlots: 3125, 
    reward: 10, 
    firstAchiever: 625, 
    firstReward: 20, 
    topEarly: 25, 
    extra: 20 
  },
  { 
    level: 'EMERALD STAR', 
    rewardSlots: 625, 
    reward: 20, 
    firstAchiever: 125, 
    firstReward: 50, 
    topEarly: 5, 
    extra: 50 
  },
  { 
    level: 'PLATINUM STAR', 
    rewardSlots: 125, 
    reward: 50, 
    firstAchiever: 25, 
    firstReward: 250, 
    topEarly: 1, 
    extra: 250 
  },
  { 
    level: 'DIAMOND STAR', 
    rewardSlots: 25, 
    reward: 250, 
    firstAchiever: 5, 
    firstReward: 1000, 
    topEarly: 0, 
    extra: 0 
  },
  { 
    level: 'CROWN STAR', 
    rewardSlots: 5, 
    reward: 1000, 
    firstAchiever: 1, 
    firstReward: 5000, 
    topEarly: 0, 
    extra: 0 
  },
];

// Airdrop Data
const AIRDROP_DATA = {
  totalSlots: 20000,
  reward: 1,
  description: 'First 20,000 early registrations'
};

// Working Links Configuration
const WORKING_LINKS = {
  airdrop: '/airdrop/register',
  financialQuiz: '/quiz/start',
  influencer: '/influencer/signup',
  affiliate: '/affiliate/dashboard',
  presale: '/presale',
  dashboard: '/dashboard',
  documentation: '/docs',
  support: '/support'
};

export default function AirdropsRewardsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('airdrop');
  const [referralCount, setReferralCount] = useState(0);
  const [email, setEmail] = useState('');

  const calculateAffiliateEarnings = (referrals: number) => {
    let total = 0;
    AFFILIATE_REWARDS.forEach(level => {
      if (referrals >= level.rewardSlots) {
        total += level.reward;
      }
    });
    return total;
  };

  const handleAirdropRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Registration Successful!",
      description: "You've been registered for the PGC airdrop. 1 PGC will be credited after presale.",
    });
    setEmail('');
    // Redirect to airdrop registration page
    window.location.href = WORKING_LINKS.airdrop;
  };

  const handleNavigation = (link: string) => {
    window.location.href = link;
  };

  const tabs = [
    { id: 'airdrop', label: 'Airdrops', icon: Gift, color: 'yellow' },
    { id: 'financial', label: 'Financial Quiz', icon: Trophy, color: 'blue' },
    { id: 'influencer', label: 'Influencer', icon: Video, color: 'purple' },
    { id: 'affiliate', label: 'Affiliate', icon: Users, color: 'green' },
  ];

  const getTabColors = (color: string) => {
    const colors = {
      blue: {
        gradient: 'from-blue-600 to-blue-700',
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        light: 'bg-blue-100',
        dark: 'bg-blue-800'
      },
      yellow: {
        gradient: 'from-yellow-500 to-yellow-600',
        border: 'border-yellow-400',
        bg: 'bg-yellow-50',
        text: 'text-yellow-800',
        light: 'bg-yellow-100',
        dark: 'bg-yellow-600'
      },
      purple: {
        gradient: 'from-purple-600 to-purple-700',
        border: 'border-purple-500',
        bg: 'bg-purple-50',
        text: 'text-purple-800',
        light: 'bg-purple-100',
        dark: 'bg-purple-800'
      },
      green: {
        gradient: 'from-green-600 to-green-700',
        border: 'border-green-500',
        bg: 'bg-green-50',
        text: 'text-green-800',
        light: 'bg-green-100',
        dark: 'bg-green-800'
      }
    };
    return colors[color as keyof typeof colors] || colors.yellow;
  };

  const currentColors = getTabColors(tabs.find(tab => tab.id === activeTab)?.color || 'yellow');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 py-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-4 mb-4">
            {/* PGC Coin Image */}
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-lg">
              <div className="text-center">
                <div className="text-[10px] font-bold text-white leading-tight">PUBLIC</div>
                <div className="text-[10px] font-bold text-white leading-tight">GOVERNANCE</div>
                <div className="text-[10px] font-bold text-white leading-tight">COIN</div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-sans tracking-tight">
                PGC Rewards & Airdrops
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mt-2 font-light">
                Exclusive Rewards for Early Supporters
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2">
            <Badge className="bg-yellow-600 text-white border-yellow-500 text-xs py-1 px-3 font-medium">
              2M PGC SUPPLY
            </Badge>
            <Badge className="bg-yellow-600 text-white border-yellow-500 text-xs py-1 px-3 font-medium">
              1:1 BONUS
            </Badge>
            <Badge className="bg-yellow-600 text-white border-yellow-500 text-xs py-1 px-3 font-medium">
              3-STAGE GROWTH
            </Badge>
            <Badge className="bg-yellow-600 text-white border-yellow-500 text-xs py-1 px-3 font-medium">
              NO STAKING
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {tabs.map((tab) => {
            const tabColors = getTabColors(tab.color);
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r ${tabColors.gradient} text-white border ${tabColors.border} shadow-lg` 
                    : 'bg-slate-800 text-gray-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Airdrop Rewards */}
        {activeTab === 'airdrop' && (
          <div className="space-y-6">
            {/* Main Airdrop Card */}
            <Card className="border border-yellow-500/30 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
              <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Gift className="h-5 w-5" />
                  Early Registration Airdrop
                </CardTitle>
                <CardDescription className="text-yellow-100 text-sm">
                  Get 1 PGC FREE for early registration - Limited to first 20,000 users!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Registration Form */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-yellow-400 mb-2">1 PGC</div>
                      <div className="text-base font-semibold text-yellow-300">FREE per Registration</div>
                      <div className="text-xs text-yellow-400 mt-1">Limited to first 20,000 users</div>
                    </div>

                    <form onSubmit={handleAirdropRegistration} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Email Address</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-yellow-500"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 text-base transition-all duration-200"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Claim My 1 PGC Airdrop
                      </Button>
                    </form>

                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                      <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4" />
                        Instant Qualification
                      </h4>
                      <ul className="text-xs text-yellow-300 space-y-1">
                        <li>✅ No complex requirements</li>
                        <li>✅ First 20,000 registrations only</li>
                        <li>✅ 1 PGC credited after presale</li>
                        <li>✅ Simple email registration</li>
                      </ul>
                    </div>
                  </div>

                  {/* Airdrop Stats */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">20,000</div>
                        <div className="text-xs text-yellow-300">Total Slots</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">1 PGC</div>
                        <div className="text-xs text-yellow-300">Per User</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">15,247</div>
                        <div className="text-xs text-yellow-300">Registered</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">4,753</div>
                        <div className="text-xs text-yellow-300">Remaining</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300 font-semibold">Registration Progress</span>
                        <span className="text-yellow-400">76%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: '76%' }}
                        ></div>
                      </div>
                    </div>

                    {/* Total Budget */}
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-4 rounded-lg text-white text-center border border-yellow-500/30">
                      <div className="text-sm font-bold mb-1">Total Airdrop Budget</div>
                      <div className="text-2xl font-black">20,000 PGC</div>
                      <div className="text-yellow-200 text-xs mt-1">1 PGC × 20,000 users</div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleNavigation(WORKING_LINKS.presale)}
                        variant="outline" 
                        className="flex-1 text-xs bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Presale
                      </Button>
                      <Button 
                        onClick={() => handleNavigation(WORKING_LINKS.dashboard)}
                        variant="outline" 
                        className="flex-1 text-xs bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        My Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Airdrop Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800 border-yellow-500/30 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle className="h-4 w-4 text-yellow-400" />
                    Simple Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-xs">Just register with email. No complex KYC or verification needed.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-yellow-500/30 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Calendar className="h-4 w-4 text-yellow-400" />
                    First Come First Serve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-xs">Only the first 20,000 registrations qualify for the airdrop.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-yellow-500/30 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    Post-Presale Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-xs">1 PGC will be credited to your wallet after presale completion.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Financial Quiz Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <Card className="border border-blue-500/30 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Trophy className="h-5 w-5" />
                  Financial Quiz Rewards
                </CardTitle>
                <CardDescription className="text-blue-100 text-sm">
                  Test your financial knowledge and win big rewards!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      {FINANCIAL_QUIZ_REWARDS.reduce((total, reward) => total + (reward.achievers * reward.reward), 0).toLocaleString()} PGC
                    </div>
                    <div className="text-base font-semibold text-blue-300">Total Quiz Rewards Pool</div>
                  </div>

                  <Button 
                    onClick={() => handleNavigation(WORKING_LINKS.financialQuiz)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 text-base"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Start Financial Quiz
                  </Button>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-blue-500/30">
                          <TableHead className="text-blue-300 font-semibold text-xs w-[200px]">Stage</TableHead>
                          <TableHead className="text-blue-300 font-semibold text-xs w-[120px]">Reward Slots</TableHead>
                          <TableHead className="text-blue-300 font-semibold text-xs w-[100px]">Reward (PGC)</TableHead>
                          <TableHead className="text-blue-300 font-semibold text-xs w-[80px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {FINANCIAL_QUIZ_REWARDS.map((reward, index) => (
                          <TableRow key={index} className="border-blue-500/10 text-xs">
                            <TableCell className="text-gray-300 font-medium">{reward.stage}</TableCell>
                            <TableCell className="text-gray-300">{reward.achievers.toLocaleString()}</TableCell>
                            <TableCell className="text-blue-400 font-semibold">{reward.reward}</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.financialQuiz)}
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Influencer Tab */}
        {activeTab === 'influencer' && (
          <div className="space-y-6">
            <Card className="border border-purple-500/30 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Video className="h-5 w-5" />
                  Influencer Rewards Program
                </CardTitle>
                <CardDescription className="text-purple-100 text-sm">
                  Create content and earn PGC rewards based on your reach and engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <Button 
                    onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 text-base"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Influencer Program
                  </Button>

                  {/* Follower Tiers Table */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                      Follower Tier Rewards
                    </h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-purple-500/30">
                            <TableHead className="text-purple-300 font-semibold text-xs w-[120px]">Level</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[140px]">Followers Required</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[180px]">Video Type</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[100px]">Reward (PGC)</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[80px]">Bonus</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[80px]">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-purple-500/10 text-xs">
                            <TableCell className="text-purple-300 font-semibold">DIAMOND</TableCell>
                            <TableCell className="text-gray-300">50,000+</TableCell>
                            <TableCell className="text-gray-300">LONG VIDEO (15min - 2hr)</TableCell>
                            <TableCell className="text-purple-400 font-semibold">20</TableCell>
                            <TableCell className="text-green-400 font-semibold">+20</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-purple-500/10 text-xs">
                            <TableCell className="text-purple-300 font-semibold">GOLD</TableCell>
                            <TableCell className="text-gray-300">20,000+</TableCell>
                            <TableCell className="text-gray-300">OVERVIEW VIDEO (3-8min)</TableCell>
                            <TableCell className="text-purple-400 font-semibold">5</TableCell>
                            <TableCell className="text-green-400 font-semibold">+5</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-purple-500/10 text-xs">
                            <TableCell className="text-purple-300 font-semibold">SILVER</TableCell>
                            <TableCell className="text-gray-300">5,000+</TableCell>
                            <TableCell className="text-gray-300">SHORT VIDEO (&lt;3min)</TableCell>
                            <TableCell className="text-purple-400 font-semibold">2</TableCell>
                            <TableCell className="text-green-400 font-semibold">+2</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* View-Based Rewards Table */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                      View-Based Performance Rewards
                    </h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-purple-500/30">
                            <TableHead className="text-purple-300 font-semibold text-xs w-[150px]">Views</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[120px]">Reward Slots</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[120px]">Reward (PGC)</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[80px]">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-purple-500/10 text-xs">
                            <TableCell className="text-gray-300 font-medium">1,00,00,000</TableCell>
                            <TableCell className="text-gray-300">8</TableCell>
                            <TableCell className="text-purple-400 font-semibold">1000</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-purple-500/10 text-xs">
                            <TableCell className="text-gray-300 font-medium">10,00,000</TableCell>
                            <TableCell className="text-gray-300">40</TableCell>
                            <TableCell className="text-purple-400 font-semibold">200</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-purple-500/10 text-xs">
                            <TableCell className="text-gray-300 font-medium">1,00,000</TableCell>
                            <TableCell className="text-gray-300">200</TableCell>
                            <TableCell className="text-purple-400 font-semibold">50</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-purple-500/10 text-xs">
                            <TableCell className="text-gray-300 font-medium">10,000</TableCell>
                            <TableCell className="text-gray-300">1000</TableCell>
                            <TableCell className="text-purple-400 font-semibold">10</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-purple-500/10 text-xs">
                            <TableCell className="text-gray-300 font-medium">1,000</TableCell>
                            <TableCell className="text-gray-300">5000</TableCell>
                            <TableCell className="text-purple-400 font-semibold">5</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-purple-500/10 text-xs">
                            <TableCell className="text-gray-300 font-medium">1,000</TableCell>
                            <TableCell className="text-gray-300">20000</TableCell>
                            <TableCell className="text-purple-400 font-semibold">2</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Early Bonus Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                      Early Participant Bonuses
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-slate-700/50 border-purple-500/20">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-400">100,000+ views</div>
                          <div className="text-gray-300 text-sm mt-1">10 Reward Slots</div>
                          <div className="text-green-400 font-semibold text-sm">Bonus: 100 PGC each</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-700/50 border-purple-500/20">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-400">10,000+ views</div>
                          <div className="text-gray-300 text-sm mt-1">100 Reward Slots</div>
                          <div className="text-green-400 font-semibold text-sm">Bonus: 50 PGC each</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Affiliate Tab */}
        {activeTab === 'affiliate' && (
          <div className="space-y-6">
            <Card className="border border-green-500/30 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Users className="h-5 w-5" />
                  Affiliate Rewards Program
                </CardTitle>
                <CardDescription className="text-green-100 text-sm">
                  Refer users and earn PGC through our multi-level affiliate system
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {calculateAffiliateEarnings(referralCount)} PGC
                    </div>
                    <div className="text-base font-semibold text-green-300">Your Estimated Earnings</div>
                    <div className="text-xs text-green-400 mt-1">Based on {referralCount} referrals</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Enter referral count"
                        value={referralCount}
                        onChange={(e) => setReferralCount(Number(e.target.value))}
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                      />
                      <Button 
                        onClick={() => handleNavigation(WORKING_LINKS.affiliate)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Get Link
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleNavigation(WORKING_LINKS.affiliate)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 text-base"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Start Earning Now
                  </Button>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-green-500/30">
                          <TableHead className="text-green-300 font-semibold text-xs w-[150px]">Level</TableHead>
                          <TableHead className="text-green-300 font-semibold text-xs w-[120px]">Reward Slots</TableHead>
                          <TableHead className="text-green-300 font-semibold text-xs w-[120px]">Reward (PGC)</TableHead>
                          <TableHead className="text-green-300 font-semibold text-xs w-[80px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {AFFILIATE_REWARDS.map((level, index) => (
                          <TableRow key={index} className="border-green-500/10 text-xs">
                            <TableCell className="text-gray-300 font-medium">{level.level}</TableCell>
                            <TableCell className="text-gray-300">{level.rewardSlots.toLocaleString()}</TableCell>
                            <TableCell className="text-green-400 font-semibold">{level.reward}</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.affiliate)}
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
                              >
                                Join
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Summary Card */}
        <Card className="bg-slate-800 border-yellow-500/30 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              Total Rewards Budget Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-yellow-400">20,000 PGC</div>
                <div className="text-yellow-300 text-xs">Airdrop Program</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-400">{FINANCIAL_QUIZ_REWARDS.reduce((total, reward) => total + (reward.achievers * reward.reward), 0).toLocaleString()} PGC</div>
                <div className="text-blue-300 text-xs">Financial Quiz</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">250,000 PGC</div>
                <div className="text-purple-300 text-xs">Influencer Program</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">{AFFILIATE_REWARDS.reduce((total, level) => total + (level.rewardSlots * level.reward), 0).toLocaleString()} PGC</div>
                <div className="text-green-300 text-xs">Affiliate Program</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}