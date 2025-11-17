'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Users, Star, Award, Gem, Shield, Crown, UserPlus, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const AffiliateRewardCard = ({ tier, isPaid = false }: { tier: any; isPaid?: boolean }) => {
  const getIcon = (level: string) => {
    switch (level) {
      case 'Bronze Star': return <Star className="h-5 w-5 text-amber-500" />;
      case 'Silver': return <Award className="h-5 w-5 text-gray-400" />;
      case 'Gold': return <Award className="h-5 w-5 text-yellow-500" />;
      case 'Emerald': return <Gem className="h-5 w-5 text-emerald-500" />;
      case 'Platinum': return <Shield className="h-5 w-5 text-blue-400" />;
      case 'Diamond': return <Gem className="h-5 w-5 text-cyan-400" />;
      case 'Crown': return <Crown className="h-5 w-5 text-purple-500" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex items-start gap-4 rounded-lg border p-4 hover:border-primary transition-colors">
      <div className={`flex h-12 w-12 items-center justify-center rounded-md ${tier.color} text-white mt-1`}>
        {getIcon(tier.level)}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-lg">{tier.level}</h4>
          <div className="text-lg font-bold text-primary">{tier.pgc} PGC</div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{tier.requirement}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-semibold text-primary/80">{tier.icon} {tier.users} users needed</span>
          {isPaid && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Paid Track
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

// Reward tiers configuration
const REWARD_TIERS = {
  BRONZE_STAR: { level: 'Bronze Star', pgc: 1, requirement: '5 direct paid users', color: 'bg-amber-500', icon: '⭐', users: 5 },
  SILVER: { level: 'Silver', pgc: 2.5, requirement: '5 Bronze Star in team', color: 'bg-gray-400', icon: '🔹', users: 25 },
  GOLD: { level: 'Gold', pgc: 10, requirement: '5 Silver in team', color: 'bg-yellow-500', icon: '🔶', users: 125 },
  EMERALD: { level: 'Emerald', pgc: 20, requirement: '5 Gold in team', color: 'bg-emerald-500', icon: '💚', users: 625 },
  PLATINUM: { level: 'Platinum', pgc: 50, requirement: '5 Emerald in team', color: 'bg-blue-400', icon: '🔷', users: 3125 },
  DIAMOND: { level: 'Diamond', pgc: 250, requirement: '5 Platinum in team', color: 'bg-cyan-400', icon: '💎', users: 15625 },
  CROWN: { level: 'Crown', pgc: 1000, requirement: '5 Diamond in team', color: 'bg-purple-500', icon: '👑', users: 78125 }
};

export default function AffiliateMarketingPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <Card className="text-center bg-gradient-to-r from-purple-50 to-blue-50 border-0">
        <CardHeader>
          <CardTitle className="text-4xl font-headline">Affiliate Marketing Program</CardTitle>
          <CardDescription className="text-lg max-w-3xl mx-auto">
            Earn PGC tokens and real USDT commissions by building your team. 
            A total of 11% of all presale coins (220,000 PGC) are reserved for our affiliate program.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/profile" className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Get Your Referral Link
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Commission Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            Real Commission Structure (USDT)
          </CardTitle>
          <CardDescription>
            Earn real USDT commissions from your team's purchases and registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg bg-green-50">
              <div className="text-3xl font-bold text-green-600">0.2%</div>
              <div className="font-semibold">Level 1 (Direct)</div>
              <p className="text-sm text-muted-foreground mt-2">
                Earn 0.2% from direct referrals (Level 1)
              </p>
              <Badge variant="secondary" className="mt-2">$0.20 per $100</Badge>
            </div>
            
            <div className="text-center p-6 border rounded-lg bg-blue-50">
              <div className="text-3xl font-bold text-blue-600">0.2%</div>
              <div className="font-semibold">Levels 2-5</div>
              <p className="text-sm text-muted-foreground mt-2">
                Earn 0.2% from levels 2-5 of your team
              </p>
              <Badge variant="secondary" className="mt-2">$0.20 per $100</Badge>
            </div>
            
            <div className="text-center p-6 border rounded-lg bg-purple-50">
              <div className="text-3xl font-bold text-purple-600">0.1%</div>
              <div className="font-semibold">Levels 6-15</div>
              <p className="text-sm text-muted-foreground mt-2">
                Earn 0.1% from levels 6-15 of your team
              </p>
              <Badge variant="secondary" className="mt-2">$0.10 per $100</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Tiers */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
                Paid User Track
              </Badge>
              <CardTitle className="text-2xl font-headline">Affiliate Reward Tiers</CardTitle>
              <CardDescription>
                Earn PGC tokens as you advance through affiliate tiers by building your team
              </CardDescription>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.values(REWARD_TIERS).map((tier) => (
            <AffiliateRewardCard key={tier.level} tier={tier} isPaid={true} />
          ))}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Simple steps to start earning with our affiliate program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h4 className="font-semibold">Get Your Link</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Copy your unique referral code from your profile
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h4 className="font-semibold">Share & Invite</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Share your link with friends and community
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h4 className="font-semibold">They Join</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Friends register using your referral code
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                4
              </div>
              <h4 className="font-semibold">You Earn</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Earn commissions and climb reward tiers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-center">
        <CardContent className="pt-6">
          <h3 className="text-2xl font-bold mb-2">Ready to Start Earning?</h3>
          <p className="mb-4 opacity-90">
            Join thousands of affiliates already earning with Public Governance
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/profile" className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Get Started Now
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}