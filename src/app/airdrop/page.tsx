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

// Financial Quiz Rewards Data
const FINANCIAL_QUIZ_REWARDS = [
  { rewardSlots: 50000, reward: 1, stage: 'ROUND 1 - GENERAL QUIZ' },
  { rewardSlots: 20000, reward: 2, stage: 'ROUND 1 - GENERAL QUIZ' },
  { rewardSlots: 5000, reward: 3, stage: 'ROUND 1 - GENERAL QUIZ' },
  { rewardSlots: 2000, reward: 5, stage: 'ROUND 1 - QUALIFIERS' },
  { rewardSlots: 200, reward: 20, stage: 'SEMI-FINAL - QUALIFIERS' },
  { rewardSlots: 20, reward: 100, stage: 'FINAL - QUALIFIERS' },
  { rewardSlots: 4, reward: 1000, stage: 'FINAL - RUNNERS UP' },
  { rewardSlots: 1, reward: 5000, stage: 'FINAL - WINNER' },
];

// Updated Influencer Rewards Data
const INFLUENCER_REWARDS = {
  followerTiers: [
    { 
      tier: 'DIAMOND', 
      followers: 50000, 
      videoType: 'LONG VIDEO (15MIN - 2HR)', 
      rewardSlots: 1000, 
      reward: 20, 
      earlyBonus: 20 
    },
    { 
      tier: 'GOLD', 
      followers: 20000, 
      videoType: 'OVERVIEW VIDEO (3-8MIN)', 
      rewardSlots: 5000, 
      reward: 5, 
      earlyBonus: 5 
    },
    { 
      tier: 'SILVER', 
      followers: 5000, 
      videoType: 'SHORT VIDEO (<3MIN)', 
      rewardSlots: 10000, 
      reward: 2, 
      earlyBonus: 2 
    },
  ],
  viewRewards: [
    { views: 10000000, rewardSlots: 8, reward: 1000 },
    { views: 1000000, rewardSlots: 40, reward: 200 },
    { views: 100000, rewardSlots: 200, reward: 50 },
    { views: 10000, rewardSlots: 1000, reward: 10 },
    { views: 1000, rewardSlots: 5000, reward: 5 },
    { views: 1000, rewardSlots: 20000, reward: 2 },
  ],
  earlyBonuses: [
    { views: 100000, rewardSlots: 10, reward: 100 },
    { views: 10000, rewardSlots: 100, reward: 50 },
  ]
};

// Updated Affiliate Rewards Data - FREE ENTRY REWARDS
const AFFILIATE_FREE_REWARDS = [
  { 
    level: 'BRONZE', 
    rewardSlots: 78125, 
    reward: 1, 
    requirement: 'MAKE 5 FREE USER'
  },
  { 
    level: 'SILVER', 
    rewardSlots: 15625, 
    reward: 2.5, 
    requirement: 'MAKE 5 BRONZE'
  },
  { 
    level: 'GOLD', 
    rewardSlots: 3125, 
    reward: 10, 
    requirement: 'MAKE 5 SILVER'
  },
  { 
    level: 'EMERALD', 
    rewardSlots: 625, 
    reward: 20, 
    requirement: 'MAKE 5 GOLD'
  },
  { 
    level: 'PLATINUM', 
    rewardSlots: 125, 
    reward: 50, 
    requirement: 'MAKE 5 EMERALD'
  },
  { 
    level: 'DIAMOND', 
    rewardSlots: 25, 
    reward: 250, 
    requirement: 'MAKE 5 PLATINUM'
  },
  { 
    level: 'CROWN', 
    rewardSlots: 5, 
    reward: 1000, 
    requirement: 'MAKE 5 DIAMOND'
  },
];

// Updated Affiliate Rewards Data - PAID USER REWARDS
const AFFILIATE_PAID_REWARDS = [
  { 
    level: 'BRONZE STAR', 
    rewardSlots: 15625, 
    reward: 5, 
    requirement: 'MAKE 5 PAID USER'
  },
  { 
    level: 'SILVER STAR', 
    rewardSlots: 3125, 
    reward: 10, 
    requirement: 'MAKE 5 BRONZE STAR'
  },
  { 
    level: 'GOLD STAR', 
    rewardSlots: 625, 
    reward: 20, 
    requirement: 'MAKE 5 SILVER STAR'
  },
  { 
    level: 'EMERALD STAR', 
    rewardSlots: 125, 
    reward: 50, 
    requirement: 'MAKE 5 GOLD STAR'
  },
  { 
    level: 'PLATINUM STAR', 
    rewardSlots: 25, 
    reward: 250, 
    requirement: 'MAKE 5 EMERALD STAR'
  },
  { 
    level: 'DIAMOND STAR', 
    rewardSlots: 5, 
    reward: 1000, 
    requirement: 'MAKE 5 PLATINUM STAR'
  },
  { 
    level: 'CROWN STAR', 
    rewardSlots: 1, 
    reward: 5000, 
    requirement: 'MAKE 5 DIAMOND STAR'
  },
];

// Airdrop Data
const AIRDROP_DATA = {
  totalSlots: 20000,
  reward: 1,
  description: 'FIRST 20,000 EARLY REGISTRATIONS'
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
  const [affiliateType, setAffiliateType] = useState('free');

  const calculateAffiliateEarnings = (referrals: number, type: string) => {
    let total = 0;
    const rewards = type === 'free' ? AFFILIATE_FREE_REWARDS : AFFILIATE_PAID_REWARDS;
    
    rewards.forEach(level => {
      if (referrals >= level.rewardSlots) {
        total += level.reward;
      }
    });
    return total;
  };

  const handleAirdropRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "REGISTRATION SUCCESSFUL!",
      description: "YOU'VE BEEN REGISTERED FOR THE PGC AIRDROP. 1 PGC WILL BE CREDITED AFTER PRESALE.",
    });
    setEmail('');
    window.location.href = WORKING_LINKS.airdrop;
  };

  const handleNavigation = (link: string) => {
    window.location.href = link;
  };

  const tabs = [
    { id: 'airdrop', label: 'AIRDROPS', icon: Gift, color: 'yellow' },
    { id: 'financial', label: 'FINANCIAL QUIZ', icon: Trophy, color: 'blue' },
    { id: 'influencer', label: 'INFLUENCER', icon: Video, color: 'purple' },
    { id: 'affiliate', label: 'AFFILIATE', icon: Users, color: 'green' },
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
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-sans tracking-tight">
                PGC REWARDS & AIRDROPS
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mt-2 font-light">
                EXCLUSIVE REWARDS FOR EARLY SUPPORTERS
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
                  EARLY REGISTRATION AIRDROP
                </CardTitle>
                <CardDescription className="text-yellow-100 text-sm">
                  GET 1 PGC FREE FOR EARLY REGISTRATION - LIMITED TO FIRST 20,000 USERS!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Registration Form */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-yellow-400 mb-2">1 PGC</div>
                      <div className="text-base font-semibold text-yellow-300">FREE PER REGISTRATION</div>
                      <div className="text-xs text-yellow-400 mt-1">LIMITED TO FIRST 20,000 USERS</div>
                    </div>

                    <form onSubmit={handleAirdropRegistration} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">EMAIL ADDRESS</label>
                        <Input
                          type="email"
                          placeholder="ENTER YOUR EMAIL"
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
                        CLAIM MY 1 PGC AIRDROP
                      </Button>
                    </form>

                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                      <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4" />
                        INSTANT QUALIFICATION
                      </h4>
                      <ul className="text-xs text-yellow-300 space-y-1">
                        <li>✅ NO COMPLEX REQUIREMENTS</li>
                        <li>✅ FIRST 20,000 REGISTRATIONS ONLY</li>
                        <li>✅ 1 PGC CREDITED AFTER PRESALE</li>
                        <li>✅ SIMPLE EMAIL REGISTRATION</li>
                      </ul>
                    </div>
                  </div>

                  {/* Airdrop Stats */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">20,000</div>
                        <div className="text-xs text-yellow-300">TOTAL SLOTS</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">1 PGC</div>
                        <div className="text-xs text-yellow-300">PER USER</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">15,247</div>
                        <div className="text-xs text-yellow-300">REGISTERED</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">4,753</div>
                        <div className="text-xs text-yellow-300">REMAINING</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300 font-semibold">REGISTRATION PROGRESS</span>
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
                      <div className="text-sm font-bold mb-1">TOTAL AIRDROP BUDGET</div>
                      <div className="text-2xl font-black">20,000 PGC</div>
                      <div className="text-yellow-200 text-xs mt-1">1 PGC × 20,000 USERS</div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleNavigation(WORKING_LINKS.presale)}
                        variant="outline" 
                        className="flex-1 text-xs bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        VIEW PRESALE
                      </Button>
                      <Button 
                        onClick={() => handleNavigation(WORKING_LINKS.dashboard)}
                        variant="outline" 
                        className="flex-1 text-xs bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        MY DASHBOARD
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
                    SIMPLE PROCESS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-xs">JUST REGISTER WITH EMAIL. NO COMPLEX KYC OR VERIFICATION NEEDED.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-yellow-500/30 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Calendar className="h-4 w-4 text-yellow-400" />
                    FIRST COME FIRST SERVE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-xs">ONLY THE FIRST 20,000 REGISTRATIONS QUALIFY FOR THE AIRDROP.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-yellow-500/30 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    POST-PRESALE DISTRIBUTION
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-xs">1 PGC WILL BE CREDITED TO YOUR WALLET AFTER PRESALE COMPLETION.</p>
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
                  FINANCIAL QUIZ REWARDS
                </CardTitle>
                <CardDescription className="text-blue-100 text-sm">
                  TEST YOUR FINANCIAL KNOWLEDGE AND WIN BIG REWARDS!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      {FINANCIAL_QUIZ_REWARDS.reduce((total, reward) => total + (reward.rewardSlots * reward.reward), 0).toLocaleString()} PGC
                    </div>
                    <div className="text-base font-semibold text-blue-300">TOTAL QUIZ REWARDS POOL</div>
                  </div>

                  <Button 
                    onClick={() => handleNavigation(WORKING_LINKS.financialQuiz)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 text-base"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    START FINANCIAL QUIZ
                  </Button>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-blue-500/30">
                          <TableHead className="text-blue-300 font-semibold text-xs w-[200px]">STAGE</TableHead>
                          <TableHead className="text-blue-300 font-semibold text-xs w-[120px]">REWARD SLOTS</TableHead>
                          <TableHead className="text-blue-300 font-semibold text-xs w-[100px]">REWARD (PGC)</TableHead>
                          <TableHead className="text-blue-300 font-semibold text-xs w-[80px]">ACTION</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {FINANCIAL_QUIZ_REWARDS.map((reward, index) => (
                          <TableRow key={index} className="border-blue-500/10 text-xs">
                            <TableCell className="text-gray-300 font-medium">{reward.stage}</TableCell>
                            <TableCell className="text-gray-300">{reward.rewardSlots.toLocaleString()}</TableCell>
                            <TableCell className="text-blue-400 font-semibold">{reward.reward}</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleNavigation(WORKING_LINKS.financialQuiz)}
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3"
                              >
                                JOIN
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
                  INFLUENCER REWARDS PROGRAM
                </CardTitle>
                <CardDescription className="text-purple-100 text-sm">
                  CREATE CONTENT AND EARN PGC REWARDS BASED ON YOUR REACH AND ENGAGEMENT
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <Button 
                    onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 text-base"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    JOIN INFLUENCER PROGRAM
                  </Button>

                  {/* Follower Tiers Table */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                      FOLLOWER TIER REWARDS
                    </h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-purple-500/30">
                            <TableHead className="text-purple-300 font-semibold text-xs w-[120px]">LEVEL</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[140px]">FOLLOWERS REQUIRED</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[180px]">VIDEO TYPE</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[100px]">REWARD (PGC)</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[80px]">BONUS</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[80px]">ACTION</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {INFLUENCER_REWARDS.followerTiers.map((tier, index) => (
                            <TableRow key={index} className="border-purple-500/10 text-xs">
                              <TableCell className="text-purple-300 font-semibold">{tier.tier}</TableCell>
                              <TableCell className="text-gray-300">{tier.followers.toLocaleString()}+</TableCell>
                              <TableCell className="text-gray-300">{tier.videoType}</TableCell>
                              <TableCell className="text-purple-400 font-semibold">{tier.reward}</TableCell>
                              <TableCell className="text-green-400 font-semibold">+{tier.earlyBonus}</TableCell>
                              <TableCell>
                                <Button 
                                  onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                  size="sm" 
                                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                                >
                                  JOIN
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* View-Based Rewards Table */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                      VIEW-BASED PERFORMANCE REWARDS
                    </h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-purple-500/30">
                            <TableHead className="text-purple-300 font-semibold text-xs w-[150px]">VIEWS</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[120px]">REWARD SLOTS</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[120px]">REWARD (PGC)</TableHead>
                            <TableHead className="text-purple-300 font-semibold text-xs w-[80px]">ACTION</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {INFLUENCER_REWARDS.viewRewards.map((reward, index) => (
                            <TableRow key={index} className="border-purple-500/10 text-xs">
                              <TableCell className="text-gray-300 font-medium">{reward.views.toLocaleString()}</TableCell>
                              <TableCell className="text-gray-300">{reward.rewardSlots}</TableCell>
                              <TableCell className="text-purple-400 font-semibold">{reward.reward}</TableCell>
                              <TableCell>
                                <Button 
                                  onClick={() => handleNavigation(WORKING_LINKS.influencer)}
                                  size="sm" 
                                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                                >
                                  JOIN
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
                  AFFILIATE REWARDS PROGRAM
                </CardTitle>
                <CardDescription className="text-green-100 text-sm">
                  REFER USERS AND EARN PGC THROUGH OUR MULTI-LEVEL AFFILIATE SYSTEM
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {calculateAffiliateEarnings(referralCount, affiliateType)} PGC
                    </div>
                    <div className="text-base font-semibold text-green-300">YOUR ESTIMATED EARNINGS</div>
                    <div className="text-xs text-green-400 mt-1">BASED ON {referralCount} REFERRALS</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="ENTER REFERRAL COUNT"
                        value={referralCount}
                        onChange={(e) => setReferralCount(Number(e.target.value))}
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                      />
                      <Button 
                        onClick={() => handleNavigation(WORKING_LINKS.affiliate)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        GET LINK
                      </Button>
                    </div>
                    
                    {/* Affiliate Type Selector */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setAffiliateType('free')}
                        variant={affiliateType === 'free' ? "default" : "outline"}
                        className={`flex-1 text-xs ${
                          affiliateType === 'free' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-slate-700 text-gray-300 border-slate-600'
                        }`}
                      >
                        FREE USER REWARDS
                      </Button>
                      <Button
                        onClick={() => setAffiliateType('paid')}
                        variant={affiliateType === 'paid' ? "default" : "outline"}
                        className={`flex-1 text-xs ${
                          affiliateType === 'paid' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-slate-700 text-gray-300 border-slate-600'
                        }`}
                      >
                        PAID USER REWARDS
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleNavigation(WORKING_LINKS.affiliate)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 text-base"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    START EARNING NOW
                  </Button>

                  {/* Free Entry Rewards Table */}
                  {affiliateType === 'free' && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-green-500/30">
                            <TableHead className="text-green-300 font-semibold text-xs w-[120px]">LEVEL</TableHead>
                            <TableHead className="text-green-300 font-semibold text-xs w-[120px]">REWARD SLOTS</TableHead>
                            <TableHead className="text-green-300 font-semibold text-xs w-[100px]">REWARD (PGC)</TableHead>
                            <TableHead className="text-green-300 font-semibold text-xs w-[180px]">REQUIREMENT</TableHead>
                            <TableHead className="text-green-300 font-semibold text-xs w-[80px]">ACTION</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {AFFILIATE_FREE_REWARDS.map((level, index) => (
                            <TableRow key={index} className="border-green-500/10 text-xs">
                              <TableCell className="text-gray-300 font-medium">{level.level}</TableCell>
                              <TableCell className="text-gray-300">{level.rewardSlots.toLocaleString()}</TableCell>
                              <TableCell className="text-green-400 font-semibold">{level.reward}</TableCell>
                              <TableCell className="text-gray-300 text-xs">{level.requirement}</TableCell>
                              <TableCell>
                                <Button 
                                  onClick={() => handleNavigation(WORKING_LINKS.affiliate)}
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
                                >
                                  JOIN
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Paid User Rewards Table */}
                  {affiliateType === 'paid' && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-green-500/30">
                            <TableHead className="text-green-300 font-semibold text-xs w-[120px]">LEVEL</TableHead>
                            <TableHead className="text-green-300 font-semibold text-xs w-[120px]">REWARD SLOTS</TableHead>
                            <TableHead className="text-green-300 font-semibold text-xs w-[100px]">REWARD (PGC)</TableHead>
                            <TableHead className="text-green-300 font-semibold text-xs w-[180px]">REQUIREMENT</TableHead>
                            <TableHead className="text-green-300 font-semibold text-xs w-[80px]">ACTION</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {AFFILIATE_PAID_REWARDS.map((level, index) => (
                            <TableRow key={index} className="border-green-500/10 text-xs">
                              <TableCell className="text-gray-300 font-medium">{level.level}</TableCell>
                              <TableCell className="text-gray-300">{level.rewardSlots.toLocaleString()}</TableCell>
                              <TableCell className="text-green-400 font-semibold">{level.reward}</TableCell>
                              <TableCell className="text-gray-300 text-xs">{level.requirement}</TableCell>
                              <TableCell>
                                <Button 
                                  onClick={() => handleNavigation(WORKING_LINKS.affiliate)}
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
                                >
                                  JOIN
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
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
              TOTAL REWARDS BUDGET SUMMARY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-yellow-400">20,000 PGC</div>
                <div className="text-yellow-300 text-xs">AIRDROP PROGRAM</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-400">{FINANCIAL_QUIZ_REWARDS.reduce((total, reward) => total + (reward.rewardSlots * reward.reward), 0).toLocaleString()} PGC</div>
                <div className="text-blue-300 text-xs">FINANCIAL QUIZ</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">250,000 PGC</div>
                <div className="text-purple-300 text-xs">INFLUENCER PROGRAM</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">{
                  (AFFILIATE_FREE_REWARDS.reduce((total, level) => total + (level.rewardSlots * level.reward), 0) +
                  AFFILIATE_PAID_REWARDS.reduce((total, level) => total + (level.rewardSlots * level.reward), 0)).toLocaleString()
                } PGC</div>
                <div className="text-green-300 text-xs">AFFILIATE PROGRAM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}