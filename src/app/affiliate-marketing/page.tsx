
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
import { Share2, Users, Star, Award, Gem, Shield, Crown, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { AffiliateRewardTier } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { freeTrackRewards, paidTrackRewards } from '@/lib/data';


const RewardCard = ({ tiers, title, description, badgeText }: { tiers: AffiliateRewardTier[], title: string, description: string, badgeText: string }) => (
    <Card>
        <CardHeader>
            <div className="flex items-start justify-between">
                <div>
                    <Badge variant="secondary" className="mb-2">{badgeText}</Badge>
                    <CardTitle className="text-2xl font-headline">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Share2 className="h-6 w-6" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                    <div key={tier.name} className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary mt-1">
                            <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-lg">{tier.name}</h4>
                                <div className="text-lg font-bold text-primary">{tier.reward}</div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{tier.requirement}</p>
                            <div className="text-xs font-semibold text-primary/80 mt-2">{tier.limit}</div>
                        </div>
                    </div>
                );
            })}
        </CardContent>
    </Card>
);

export default function AffiliatePage() {
  return (
      <div className="flex flex-col gap-8">
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="text-3xl font-headline">Presale Affiliate Rewards</CardTitle>
                <CardDescription className="text-lg max-w-3xl mx-auto">
                    A total of 11% of all presale coins (220,000 PGC) are reserved for our affiliate program. Build your network and earn rewards through two distinct tracks: one for free user acquisition and one for paid members.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
                <Button asChild size="lg">
                    <Link href="/register">Get Your Affiliate Link</Link>
                </Button>
            </CardFooter>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-8">
            <RewardCard 
                tiers={freeTrackRewards} 
                title="Free User Track"
                description="Earn rewards by inviting users who actively participate on the platform for free."
                badgeText="Free Referrals"
            />
            <RewardCard 
                tiers={paidTrackRewards}
                title="Paid User (Star) Track"
                description="Earn significantly higher rewards when your referred users make a payment or stake tokens."
                badgeText="Paid Referrals"
            />
        </div>
      </div>
  );
}
