'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Star, UserPlus, Share2, Award } from 'lucide-react';
import { airdropRewards } from '@/lib/data';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';


const iconMap: { [key: string]: React.FC<any> } = {
    'Early Registration': UserPlus,
    'Bronze Star Reward': Star,
    'Bronze Reward': UserPlus,
    'Silver Star Reward': Award,
    'Silver Reward': Award,
    'Gold Star Reward': Trophy,
    'Gold Reward': Trophy,
    'Influence & Reach Airdrop': Share2,
};

export default function AirdropPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-primary/10 to-background">
          <CardHeader className="text-center">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary mb-4">
                <Gift className="h-8 w-8" />
            </div>
            <h1 className="font-headline text-4xl font-bold">Airdrop Strategy</h1>
            <p className="text-muted-foreground text-lg">
              Rewarding our early adopters and community builders with a share of the presale.
            </p>
          </CardHeader>
          <CardContent className="text-center">
             <p className="text-muted-foreground max-w-2xl mx-auto">
                A total of 10% of the PGC presale is reserved for an airdrop to reward users who contribute to the platform's growth in its crucial early stages. Below are the categories for airdrop rewards.
             </p>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Airdrop Reward Tiers</CardTitle>
                <CardDescription>Complete these actions to become eligible for a share of the airdrop pool.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reward Tier</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Pool Share</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {airdropRewards.map((reward) => {
                            const Icon = iconMap[reward.name] || Gift;
                            return (
                                <TableRow key={reward.name}>
                                    <TableCell>
                                        <div className="flex items-center gap-3 font-medium">
                                            <Icon className="h-5 w-5 text-primary" />
                                            <span>{reward.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{reward.description}</TableCell>
                                    <TableCell className="text-right font-bold text-primary">{reward.percentage}%</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Button asChild>
                    <Link href="/register">Register Now to Participate</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
