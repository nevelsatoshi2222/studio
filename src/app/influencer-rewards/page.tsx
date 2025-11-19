
// src/app/influencer-rewards/page.tsx
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Video } from 'lucide-react';
import { RequestOfferCard } from '@/components/request-offer-card';


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

const WORKING_LINKS = {
  influencer: '/influencer-rewards' // In a real app, this could be a submission form link
};

export default function InfluencerRewardsPage() {
  const [activeTab, setActiveTab] = useState('influencer');

  const handleNavigation = (link: string) => {
    // For now, it just reloads the page, but could navigate to a form
    window.location.href = link;
  };

  return (
    <div className="space-y-6">
      <Card className="border border-purple-500/30 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Video className="h-5 w-5" />
            INFLUENCER REWARDS PROGRAM
          </CardTitle>
          <CardDescription className="text-purple-100 text-sm">
            CREATE CONTENT AND EARN PGC REWARDS. TOTAL POOL: 250,000 PGC
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            <Button 
              onClick={() => handleNavigation(WORKING_LINKS.influencer)}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 text-base"
            >
              <Video className="h-4 w-4 mr-2" />
              JOIN INFLUENCER PROGRAM & SUBMIT VIDEO
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
                        <TableCell className="text-gray-300">{tier.followers.toLocaleString('en-US')}+</TableCell>
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
                        <TableCell className="text-gray-300 font-medium">{reward.views.toLocaleString('en-US')}</TableCell>
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
      <RequestOfferCard />
    </div>
  );
}
