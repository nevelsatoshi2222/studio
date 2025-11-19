// app/admin/direct-offers/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Crown, Target, CheckCircle, Plus, Mail } from 'lucide-react';
import { InfluencerRewardCalculator } from '@/lib/influencerRewardCalculator';

export default function DirectOffersAdmin() {
  const [influencers, setInfluencers] = useState({});
  const [tierStats, setTierStats] = useState({});
  const [newInfluencer, setNewInfluencer] = useState({
    id: '',
    name: '',
    email: '',
    platform: 'youtube',
    followerCount: '',
    tier: 'tier1'
  });

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = () => {
    const allInfluencers = InfluencerRewardCalculator.getDirectOfferInfluencers();
    const stats = InfluencerRewardCalculator.getTierStatistics();
    setInfluencers(allInfluencers);
    setTierStats(stats);
  };

  const handleAddInfluencer = () => {
    if (!newInfluencer.id || !newInfluencer.name) {
      alert('Please fill in all required fields');
      return;
    }

    const influencerData = {
      tier: newInfluencer.tier,
      name: newInfluencer.name,
      email: newInfluencer.email,
      platform: newInfluencer.platform,
      followerCount: parseInt(newInfluencer.followerCount),
      baseOffer: InfluencerRewardCalculator.DIRECT_OFFER_TIERS[newInfluencer.tier].baseOffer,
      addedAt: new Date().toISOString()
    };

    InfluencerRewardCalculator.addInfluencerToDirectOffer(newInfluencer.id, influencerData);
    
    alert('Influencer added to direct offer program!');
    setNewInfluencer({ id: '', name: '', email: '', platform: 'youtube', followerCount: '', tier: 'tier1' });
    loadInfluencers();
  };

  const getTierColor = (tier) => {
    const colors = {
      tier1: 'bg-blue-100 text-blue-800',
      tier2: 'bg-green-100 text-green-800',
      tier3: 'bg-yellow-100 text-yellow-800',
      tier4: 'bg-orange-100 text-orange-800',
      tier5: 'bg-purple-100 text-purple-800'
    };
    return colors[tier] || colors.tier1;
  };

  const getTierLabel = (tier) => {
    const labels = {
      tier1: '10K+ Followers',
      tier2: '50K+ Followers',
      tier3: '100K+ Followers', 
      tier4: '250K+ Followers',
      tier5: '1M+ Followers'
    };
    return labels[tier] || tier;
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Direct Influencer Offers</h1>
            <p className="text-gray-600">Manage special offers for selected influencers</p>
          </div>
        </div>

        {/* Tier Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(tierStats).map(([tierId, tier]) => (
            <Card key={tierId} className={`border-l-4 ${getTierColor(tierId).replace('bg-', 'border-')}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Crown className="h-8 w-8 text-gray-400" />
                  <div>
                    <div className="text-2xl font-bold">{tier.currentCount}/{tier.targetCount}</div>
                    <div className="text-gray-500">{getTierLabel(tierId)}</div>
                    <div className="text-sm text-gray-400">{tier.baseOffer} PGC Base</div>
                  </div>
                </div>
                <Progress value={tier.filledPercentage} className="mt-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {tier.filledPercentage}% filled • {tier.remainingSpots} spots left
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Influencer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Influencer to Direct Offer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Influencer ID *</Label>
                <Input
                  placeholder="unique_id"
                  value={newInfluencer.id}
                  onChange={(e) => setNewInfluencer({...newInfluencer, id: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  placeholder="Influencer Name"
                  value={newInfluencer.name}
                  onChange={(e) => setNewInfluencer({...newInfluencer, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={newInfluencer.email}
                  onChange={(e) => setNewInfluencer({...newInfluencer, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Tier *</Label>
                <Select value={newInfluencer.tier} onValueChange={(value) => setNewInfluencer({...newInfluencer, tier: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tier1">Tier 1: 10K+ (25 PGC)</SelectItem>
                    <SelectItem value="tier2">Tier 2: 50K+ (50 PGC)</SelectItem>
                    <SelectItem value="tier3">Tier 3: 100K+ (100 PGC)</SelectItem>
                    <SelectItem value="tier4">Tier 4: 250K+ (250 PGC)</SelectItem>
                    <SelectItem value="tier5">Tier 5: 1M+ (500 PGC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={newInfluencer.platform} onValueChange={(value) => setNewInfluencer({...newInfluencer, platform: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Follower Count</Label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={newInfluencer.followerCount}
                  onChange={(e) => setNewInfluencer({...newInfluencer, followerCount: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={handleAddInfluencer} className="mt-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              Add to Direct Offer Program
            </Button>
          </CardContent>
        </Card>

        {/* Current Influencers List */}
        <Card>
          <CardHeader>
            <CardTitle>Approved Influencers</CardTitle>
            <CardDescription>
              {Object.keys(influencers).length} influencers in direct offer program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(influencers).map(([id, influencer]) => (
                <div key={id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-semibold">{influencer.name}</div>
                      <div className="text-sm text-gray-500">ID: {id}</div>
                      {influencer.email && (
                        <div className="text-sm text-gray-500">{influencer.email}</div>
                      )}
                      <div className="text-sm text-gray-500">
                        {influencer.platform} • {influencer.followerCount?.toLocaleString()} followers
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={getTierColor(influencer.tier)}>
                      {getTierLabel(influencer.tier)}
                    </Badge>
                    <div className="text-lg font-bold text-green-600 mt-1">
                      {influencer.baseOffer} PGC
                    </div>
                    <Button size="sm" variant="outline" className="mt-2">
                      <Mail className="h-3 w-3 mr-1" />
                      Send Offer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}