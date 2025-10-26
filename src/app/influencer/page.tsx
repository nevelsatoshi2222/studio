
'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Star, TrendingUp, Users, Award, Gem, Shield, Crown } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AffiliateRewardTier } from '@/lib/types';


const viewBasedRewards: Omit<AffiliateRewardTier, 'icon' | 'limit' | 'requirement'>[] = [
    { name: "Gold Reward Achiever", reward: "4 Coins Extra" },
    { name: "Emerald Reward Achiever", reward: "8 Coins Extra" },
    { name: "Platinum Reward Achiever", reward: "25 Coins Extra" },
    { name: "Diamond Reward Achiever", reward: "100 Coins Extra" },
    { name: "Crown Reward Achiever", reward: "1000 Coins Extra" },
];

const tiers = [
    {
        icon: Users,
        title: "Total Views Basis Reward",
        description: "A pool of 50,000 PGC is reserved for everyone. After the presale, submit links to your videos (max 25). Our system will calculate a 'per-view' value, and you'll be rewarded based on your total verified views.",
        criteria: "Minimum 100 views to be eligible for claim."
    },
    {
        icon: Gem,
        title: "Gold Reward Achiever",
        description: "Get an extra 4 PGC on top of your view-based reward. Limited to the first 5,000 achievers.",
        criteria: "1,000 to 9,999 Views"
    },
    {
        icon: Shield,
        title: "Emerald Reward Achiever",
        description: "Get an extra 8 PGC. Limited to the first 1,000 achievers.",
        criteria: "10,000 to 99,999 Views"
    },
    {
        icon: Star,
        title: "Platinum Reward Achiever",
        description: "Get an extra 25 PGC. Limited to the first 200 achievers.",
        criteria: "100,000 to 999,999 Views"
    },
    {
        icon: Award,
        title: "Diamond Reward Achiever",
        description: "Get an extra 100 PGC. Limited to the first 40 achievers.",
        criteria: "1 Million to 9.99 Million Views"
    },
    {
        icon: Crown,
        title: "Crown Reward Achiever",
        description: "Get an extra 1,000 PGC plus all lower-tier rewards. Limited to the first 8 achievers.",
        criteria: "Above 10 Million Views"
    }
];

export default function InfluencerPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Presale Influencer Rewards</CardTitle>
                <CardDescription className="text-lg max-w-3xl mx-auto">
                   5% of total presale coins (100,000 PGC) are reserved to reward content creators. Promote the platform, submit your content, and earn rewards based on your reach and impact.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {tiers.map((tier) => {
                    const Icon = tier.icon;
                    return (
                        <div key={tier.title} className="flex items-start gap-4 rounded-lg border p-4">
                           <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary mt-1">
                                <Icon className="h-6 w-6"/>
                           </div>
                           <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-lg">{tier.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                                <div className="text-sm font-semibold text-primary mt-2 rounded-full bg-primary/10 px-3 py-1 inline-block">{tier.criteria}</div>
                           </div>
                        </div>
                    )
                })}
            </CardContent>
             <CardFooter className="flex-col gap-4 text-center">
                <Button asChild size="lg">
                    <Link href="/register?role=Influencer">Apply to be an Influencer</Link>
                </Button>
                <p className="text-xs text-muted-foreground">Content submission form will be available after the presale concludes.</p>
            </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
