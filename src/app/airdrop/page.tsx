
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Trophy, 
  Users, 
  Gift,
  CheckCircle,
  Calendar,
  UserPlus,
  ExternalLink,
  Send,
  MessageCircle,
  Video,
  Star,
  Award
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Updated Airdrop Rewards Data
const AIRDROP_REWARDS = [
  { tier: 'PIONEER', slots: 1000, reward: 5, color: 'text-yellow-400' },
  { tier: 'EXPLORER', slots: 2000, reward: 2.5, color: 'text-blue-400' },
  { tier: 'FOUNDER', slots: 25000, reward: 1, color: 'text-green-400' }
];

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
    requirement: 'MAKE 5 DIAMOND STAR'
  },
  { 
    level: 'CROWN STAR', 
    rewardSlots: 1, 
    reward: 5000, 
    requirement: 'MAKE 5 DIAMOND STAR'
  },
];


// Working Links Configuration
const WORKING_LINKS = {
  airdrop: '/register',
  financialQuiz: '/quiz-opinion',
  affiliate: '/affiliate-marketing',
  presale: '/presale',
  dashboard: '/',
};

export default function AirdropsRewardsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('airdrop');
  const [email, setEmail] = useState('');
  const [affiliateType, setAffiliateType] = useState('free');
  
  const handleAirdropRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "REGISTRATION SUCCESSFUL!",
      description: "YOU'VE BEEN REGISTERED FOR THE PGC AIRDROP. YOUR PGC WILL BE CREDITED AFTER PRESALE BASED ON YOUR JOINING ORDER.",
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
              1M PGC PRESALE REWARD POOL
            </Badge>
            <Badge className="bg-yellow-600 text-white border-yellow-500 text-xs py-1 px-3 font-medium">
              3-STAGE GROWTH
            </Badge>
            <Badge className="bg-yellow-600 text-white border-yellow-500 text-xs py-1 px-3 font-medium">
              NO STAKING REQUIRED
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
            <Card className="border border-yellow-500/30 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
              <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Gift className="h-5 w-5" />
                  EARLY REGISTRATION AIRDROP
                </CardTitle>
                <CardDescription className="text-yellow-100 text-sm">
                  BECOME AN EARLY SUPPORTER & GET FREE PGC. REWARDS ARE TIERED FOR THE FIRST 28,000 USERS!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {AIRDROP_REWARDS.map(tier => (
                        <div key={tier.tier} className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                            <div className={`text-3xl font-bold ${tier.color}`}>{tier.reward} PGC</div>
                            <div className="text-sm font-semibold text-yellow-300">FOR FIRST {tier.slots.toLocaleString()} USERS</div>
                            <div className="text-xs text-yellow-400 mt-1">{tier.tier} TIER</div>
                        </div>
                    ))}
                 </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <form onSubmit={handleAirdropRegistration} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">EMAIL ADDRESS</label>
                        <Input
                          type="email"
                          placeholder="ENTER YOUR EMAIL TO REGISTER"
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
                        REGISTER FOR AIRDROP
                      </Button>
                    </form>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">28,000</div>
                        <div className="text-xs text-yellow-300">TOTAL SLOTS</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">32,500</div>
                        <div className="text-xs text-yellow-300">TOTAL PGC REWARD</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-4 rounded-lg text-white text-center border border-yellow-500/30">
                      <div className="text-sm font-bold mb-1">FREE FOR ALL EARLY USERS</div>
                      <div className="text-2xl font-black">NO PURCHASE NECESSARY</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Financial Quiz & Affiliate Tabs (remain unchanged) */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <Card className="border border-blue-500/30 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Trophy className="h-5 w-5" />
                  FINANCIAL QUIZ REWARDS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      130,000 PGC
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
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'affiliate' && (
          <div className="space-y-6">
            <Card className="border border-green-500/30 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Users className="h-5 w-5" />
                  AFFILIATE REWARDS PROGRAM
                </CardTitle>
                <CardDescription className="text-green-100 text-sm">
                  REFER USERS AND EARN PGC. TOTAL POOL: 322,812.5 PGC
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <Button 
                    onClick={() => handleNavigation(WORKING_LINKS.affiliate)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 text-base"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    VIEW AFFILIATE DASHBOARD
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setAffiliateType('free')}
                      variant={affiliateType === 'free' ? "default" : "outline"}
                      className={`flex-1 text-xs ${ affiliateType === 'free' ? 'bg-green-600 text-white' : 'bg-slate-700 text-gray-300 border-slate-600' }`}
                    >
                      FREE USER REWARDS
                    </Button>
                    <Button
                      onClick={() => setAffiliateType('paid')}
                      variant={affiliateType === 'paid' ? "default" : "outline"}
                      className={`flex-1 text-xs ${ affiliateType === 'paid' ? 'bg-green-600 text-white' : 'bg-slate-700 text-gray-300 border-slate-600' }`}
                    >
                      PAID USER REWARDS
                    </Button>
                  </div>

                  {affiliateType === 'free' && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader><TableRow className="border-green-500/30"><TableHead className="text-green-300 font-semibold text-xs w-[120px]">LEVEL</TableHead><TableHead className="text-green-300 font-semibold text-xs w-[120px]">REWARD SLOTS</TableHead><TableHead className="text-green-300 font-semibold text-xs w-[100px]">REWARD (PGC)</TableHead><TableHead className="text-green-300 font-semibold text-xs w-[180px]">REQUIREMENT</TableHead><TableHead className="text-green-300 font-semibold text-xs w-[80px]">ACTION</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {AFFILIATE_FREE_REWARDS.map((level, index) => (
                            <TableRow key={index} className="border-green-500/10 text-xs">
                              <TableCell className="text-gray-300 font-medium">{level.level}</TableCell>
                              <TableCell className="text-gray-300">{level.rewardSlots.toLocaleString()}</TableCell>
                              <TableCell className="text-green-400 font-semibold">{level.reward}</TableCell>
                              <TableCell className="text-gray-300 text-xs">{level.requirement}</TableCell>
                              <TableCell><Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3">JOIN</Button></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {affiliateType === 'paid' && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader><TableRow className="border-green-500/30"><TableHead className="text-green-300 font-semibold text-xs w-[120px]">LEVEL</TableHead><TableHead className="text-green-300 font-semibold text-xs w-[120px]">REWARD SLOTS</TableHead><TableHead className="text-green-300 font-semibold text-xs w-[100px]">REWARD (PGC)</TableHead><TableHead className="text-green-300 font-semibold text-xs w-[180px]">REQUIREMENT</TableHead><TableHead className="text-green-300 font-semibold text-xs w-[80px]">ACTION</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {AFFILIATE_PAID_REWARDS.map((level, index) => (
                            <TableRow key={index} className="border-green-500/10 text-xs">
                              <TableCell className="text-gray-300 font-medium">{level.level}</TableCell>
                              <TableCell className="text-gray-300">{level.rewardSlots.toLocaleString()}</TableCell>
                              <TableCell className="text-green-400 font-semibold">{level.reward}</TableCell>
                              <TableCell className="text-gray-300 text-xs">{level.requirement}</TableCell>
                              <TableCell><Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3">JOIN</Button></TableCell>
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
      </div>
    </div>
  );
}

    