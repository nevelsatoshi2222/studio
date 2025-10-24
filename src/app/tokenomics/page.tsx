'use client';

import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  tokenStages,
  lockDurations,
  coinPackages,
  fundAllocationsByStage,
} from '@/lib/data';
import {
  Lock,
  Unlock,
  Zap,
  Coins,
  Globe,
  Heart,
  Users as UsersIcon,
  Landmark,
  CircleDollarSign,
  Share2,
  Leaf,
  Brain,
  MessageSquare,
  Shield,
  Trophy,
  Briefcase,
  Building2,
  Palette,
  Handshake,
  Award,
  Scale,
  Settings,
  UserCog,
  Vote,
  Network,
  Key,
  UserCheck,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { FundAllocationCard } from '@/components/fund-allocation-card';
import { PgcDisplay } from '@/components/pgc-display';

const coinInfo = [
  { id: 'pgc', name: 'PGC', fullName: 'Public Governance Coin', icon: UsersIcon, totalSupply: 800_000_000_000, isPgc: true },
  { id: 'igc', name: 'IGC', fullName: 'Idea Governance Coin', icon: Network, totalSupply: 8_000_000_000 },
  { id: 'itc', name: 'ITC', fullName: 'International Trade Coin', icon: Globe, totalSupply: 8_000_000_000 },
  { id: 'ice', name: 'ICE', fullName: 'International Crypto Exchange', icon: Coins, totalSupply: 8_000_000_000 },
  { id: 'job', name: 'JOB', fullName: 'Job Coin', icon: Briefcase, totalSupply: 1_000_000_000 },
  { id: 'frn', name: 'FRN', fullName: 'Franchise Coin', icon: Building2, totalSupply: 1_000_000_000 },
  { id: 'work', name: 'WORK', fullName: 'Work Coin', icon: UserCog, totalSupply: 1_000_000_000 },
  { id: 'quiz', name: 'Quiz', fullName: 'Quiz Coin', icon: Trophy, totalSupply: 1_000_000_000 },
];

export default function TokenomicsPage() {
  const [selectedCoinId, setSelectedCoinId] = useState('pgc');
  const [selectedStage, setSelectedStage] = useState(1);

  const totalUnlockedSupplyPercentage = tokenStages
    .filter((s) => s.status === 'Active' || s.status === 'Completed')
    .reduce((acc, stage) => acc + stage.supplyPercentage, 0);

  const progressValue =
    tokenStages.filter((s) => s.status !== 'Locked').length *
    (100 / tokenStages.length);

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">
            Coins & Tokenomics
          </h1>
          <p className="text-muted-foreground">
            Understand the distribution, supply, and staking mechanisms of the
            platform's tokens.
          </p>
        </div>

        <Tabs
          defaultValue="pgc"
          onValueChange={setSelectedCoinId}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-8">
            {coinInfo.map((coin) => (
              <TabsTrigger key={coin.id} value={coin.id}>
                {coin.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {coinInfo.map((coin) => {
            const Icon = coin.icon;
            const currentTotalSupply = coin.totalSupply;
            const currentCirculatingSupply =
              currentTotalSupply * (totalUnlockedSupplyPercentage / 100);

            if (coin.isPgc) {
              return (
                <TabsContent key={coin.id} value={coin.id} className="mt-6 space-y-6">
                   <PgcDisplay />
                </TabsContent>
              )
            }

            return (
              <TabsContent
                key={coin.id}
                value={coin.id}
                className="mt-6 space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{coin.name} Total Supply</CardTitle>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {currentTotalSupply.toLocaleString('en-US')} {coin.name}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The maximum number of {coin.name} to ever exist.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Circulating Supply</CardTitle>
                      <Zap className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {currentCirculatingSupply.toLocaleString('en-US')}{' '}
                        {coin.name}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The amount of {coin.name} currently in circulation.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Supply Release Schedule ({coin.name})</CardTitle>
                    <CardDescription>
                      {coin.name} is released in controlled stages to ensure
                      stability.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={progressValue} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        {tokenStages.map((stage) => (
                          <div
                            key={stage.stage}
                            className="flex-1 text-center"
                          >
                            <p
                              className={cn(
                                'font-semibold',
                                stage.status !== 'Locked' && 'text-primary'
                              )}
                            >
                              Stage {stage.stage}
                            </p>
                            <p>{stage.supplyPercentage}%</p>
                            <p
                              className={cn(
                                'capitalize',
                                stage.status === 'Active' && 'text-green-500',
                                stage.status === 'Completed' && 'text-blue-500'
                              )}
                            >
                              {stage.status}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Fund Allocation by Stage</CardTitle>
            <CardDescription>
              A portion of incoming funds are automatically allocated to various
              development and community pots. The allocation changes as the
              project matures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="1"
              onValueChange={(v) => setSelectedStage(parseInt(v, 10))}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-8">
                {Object.keys(fundAllocationsByStage).map((stage) => (
                  <TabsTrigger key={stage} value={stage}>
                    Stage {stage}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(fundAllocationsByStage).map(([stage, allocations]) => (
                 <TabsContent key={stage} value={stage} className="mt-6">
                    <FundAllocationCard allocations={allocations} />
                 </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
