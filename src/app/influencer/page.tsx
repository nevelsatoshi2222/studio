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
import { Share2, Star, TrendingUp, Users, Award, Percent } from 'lucide-react';
import Link from 'next/link';

const EarningTiers = () => {
    const tiers = [
        {
            percentage: "0.50%",
            title: "Base Distribution (All Participants)",
            description: "This portion is distributed among all participating influencers. The total 0.5% fund is divided by the total views from every participant to create a 'per-view' price. You are then paid based on your total number of views.",
            icon: Users,
            views: "All Views"
        },
        {
            percentage: "0.25%",
            title: "High-Performer Bonus",
            description: "This fund is distributed only among influencers who achieve more than 10,000 views in a month. The calculation is similar, but the pool is smaller and more exclusive.",
            icon: TrendingUp,
            views: "> 10,000 Views"
        },
        {
            percentage: "0.10%",
            title: "Top-Tier Bonus",
            description: "Reserved for top influencers who generate more than 100,000 views. This provides a significant reward for major impact.",
            icon: Award,
            views: "> 100,000 Views"
        },
        {
            percentage: "0.10%",
            title: "Elite Influencer Bonus",
            description: "The highest reward tier, distributed among elite influencers who achieve over 1 million views in a single month.",
            icon: Star,
            views: "> 1 Million Views"
        },
        {
            percentage: "0.05%",
            title: "Staff & Management",
            description: "This portion is reserved for the operational costs of managing the influencer program, including verification and payouts.",
            icon: Percent,
            views: "Admin"
        }
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                        <Share2 className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-headline">Influencer Earning Logic</CardTitle>
                        <CardDescription>
                           1% of monthly coin sales revenue (excluding ITC) is reserved for you. Here’s how it’s distributed.
                        </CardDescription>
                    </div>
                </div>
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
                                    <div className="text-lg font-bold text-primary">{tier.percentage}</div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                                <div className="text-xs font-semibold text-primary mt-2 rounded-full bg-primary/10 px-2 py-1 inline-block">{tier.views}</div>
                           </div>
                        </div>
                    )
                })}
            </CardContent>
             <CardFooter>
                <Button asChild>
                    <Link href="/register?role=Influencer">Apply to be an Influencer</Link>
                </Button>
            </CardFooter>
        </Card>
    );
  };

export default function InfluencerPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <EarningTiers />
      </div>
    </AppLayout>
  );
}
