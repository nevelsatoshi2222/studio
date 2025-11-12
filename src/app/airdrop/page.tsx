// app/admin/affiliate-rewards/page.tsx - UPDATED WITH TIER SYSTEM
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Plus, Search, Filter, Download, Mail, Crown, Star, Gem, Trophy, Award, Users } from 'lucide-react';

// Tier structure
const REWARD_TIERS = [
  { level: 'Bronze', pgc: 1, requirement: '5 direct free users', color: 'bg-amber-500', users: 5 },
  { level: 'Silver', pgc: 2.5, requirement: '5 Bronze in your team', color: 'bg-gray-400', users: 25 },
  { level: 'Gold', pgc: 10, requirement: '5 Silver in your team', color: 'bg-yellow-500', users: 125 },
  { level: 'Emerald', pgc: 20, requirement: '5 Gold in your team', color: 'bg-emerald-500', users: 625 },
  { level: 'Platinum', pgc: 50, requirement: '5 Emerald in your team', color: 'bg-blue-400', users: 3125 },
  { level: 'Diamond', pgc: 250, requirement: '5 Platinum in your team', color: 'bg-cyan-400', users: 15625 },
  { level: 'Crown', pgc: 1000, requirement: '5 Diamond in your team', color: 'bg-purple-500', users: 78125 }
];

export default function AffiliateRewards() {
  const [affiliates, setAffiliates] = useState([
    { 
      id: 1, 
      name: 'John Trader', 
      email: 'john@example.com', 
      signups: 45, 
      teamSize: 128,
      currentTier: 'Gold',
      nextTier: 'Emerald',
      progress: 65,
      rewards: 10,
      joinDate: '2024-01-15' 
    },
    { 
      id: 2, 
      name: 'Crypto Queen', 
      email: 'queen@example.com', 
      signups: 128, 
      teamSize: 420,
      currentTier: 'Emerald',
      nextTier: 'Platinum',
      progress: 42,
      rewards: 20,
      joinDate: '2024-01-10' 
    },
    { 
      id: 3, 
      name: 'Bitcoin Maxi', 
      email: 'maxi@example.com', 
      signups: 23, 
      teamSize: 45,
      currentTier: 'Silver',
      nextTier: 'Gold',
      progress: 80,
      rewards: 2.5,
      joinDate: '2024-02-01' 
    },
    { 
      id: 4, 
      name: 'DeFi Degen', 
      email: 'degen@example.com', 
      signups: 67, 
      teamSize: 210,
      currentTier: 'Gold',
      nextTier: 'Emerald',
      progress: 55,
      rewards: 10,
      joinDate: '2024-01-20' 
    },
  ]);

  const [newAffiliate, setNewAffiliate] = useState({
    name: '',
    email: '',
    referralCode: ''
  });

  const addAffiliate = () => {
    if (!newAffiliate.name || !newAffiliate.email) return;
    
    const affiliate = {
      id: affiliates.length + 1,
      name: newAffiliate.name,
      email: newAffiliate.email,
      signups: 0,
      teamSize: 0,
      currentTier: 'Bronze',
      nextTier: 'Silver',
      progress: 0,
      rewards: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setAffiliates([...affiliates, affiliate]);
    setNewAffiliate({ name: '', email: '', referralCode: '' });
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Crown': return <Crown className="h-4 w-4" />;
      case 'Diamond': return <Gem className="h-4 w-4" />;
      case 'Platinum': return <Award className="h-4 w-4" />;
      case 'Emerald': return <Star className="h-4 w-4" />;
      case 'Gold': return <Trophy className="h-4 w-4" />;
      case 'Silver': return <Star className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    const tierObj = REWARD_TIERS.find(t => t.level === tier);
    return tierObj?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Rewards</h1>
          <p className="text-gray-600">Manage affiliate program with tier-based rewards</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Reward Tiers Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Affiliate Reward Tiers
          </CardTitle>
          <CardDescription>
            Progress through tiers by building your team and earn increasing PGC rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {REWARD_TIERS.map((tier, index) => (
              <Card key={tier.level} className={`border-l-4 ${tier.color.replace('bg-', 'border-')}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tier.color} text-white`}>
                      {getTierIcon(tier.level)}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{tier.level}</div>
                      <div className="text-2xl font-bold text-green-600">{tier.pgc} PGC</div>
                      <div className="text-xs text-gray-500">{tier.requirement}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{affiliates.length}</div>
            <div className="text-gray-600">Total Affiliates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {affiliates.reduce((sum, aff) => sum + aff.signups, 0)}
            </div>
            <div className="text-gray-600">Total Direct Sign-ups</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {affiliates.reduce((sum, aff) => sum + aff.teamSize, 0)}
            </div>
            <div className="text-gray-600">Total Team Size</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {affiliates.reduce((sum, aff) => sum + aff.rewards, 0)} PGC
            </div>
            <div className="text-gray-600">Total Rewards Distributed</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Affiliate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Affiliate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                placeholder="Affiliate Name"
                value={newAffiliate.name}
                onChange={(e) => setNewAffiliate({...newAffiliate, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="affiliate@example.com"
                value={newAffiliate.email}
                onChange={(e) => setNewAffiliate({...newAffiliate, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Referral Code (Optional)</Label>
              <Input
                placeholder="UNIQUE_CODE"
                value={newAffiliate.referralCode}
                onChange={(e) => setNewAffiliate({...newAffiliate, referralCode: e.target.value})}
              />
            </div>
            <Button onClick={addAffiliate} className="w-full">
              Add Affiliate
            </Button>
          </CardContent>
        </Card>

        {/* Affiliates Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Affiliate Partners</CardTitle>
            <CardDescription>Manage and track affiliate performance with tier system</CardDescription>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="Search affiliates..." className="pl-8" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Direct Sign-ups</TableHead>
                  <TableHead>Team Size</TableHead>
                  <TableHead>Current Tier</TableHead>
                  <TableHead>Progress to Next</TableHead>
                  <TableHead>Rewards</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map((affiliate) => (
                  <TableRow key={affiliate.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{affiliate.name}</div>
                        <div className="text-sm text-gray-500">{affiliate.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{affiliate.signups}</TableCell>
                    <TableCell>{affiliate.teamSize}</TableCell>
                    <TableCell>
                      <Badge className={`${getTierColor(affiliate.currentTier)} text-white`}>
                        {affiliate.currentTier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{affiliate.nextTier}</span>
                          <span>{affiliate.progress}%</span>
                        </div>
                        <Progress value={affiliate.progress} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-green-600">
                        {affiliate.rewards} PGC
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Tier Requirements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Progression Requirements</CardTitle>
          <CardDescription>Detailed requirements for each reward tier</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>PGC Reward</TableHead>
                <TableHead>Direct Requirements</TableHead>
                <TableHead>Team Requirements</TableHead>
                <TableHead>Total Users Needed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REWARD_TIERS.map((tier, index) => (
                <TableRow key={tier.level}>
                  <TableCell>
                    <Badge className={`${tier.color} text-white`}>
                      {tier.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {tier.pgc} PGC
                  </TableCell>
                  <TableCell>
                    {index === 0 ? '5 free users' : `5 ${REWARD_TIERS[index-1].level} affiliates`}
                  </TableCell>
                  <TableCell>
                    {tier.requirement}
                  </TableCell>
                  <TableCell>
                    {tier.users.toLocaleString()} users
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}