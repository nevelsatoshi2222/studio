

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tokenStages, users, stakedPositions, lockDurations, adminAllocations, coinPackages } from '@/lib/data';
import { Lock, Unlock, Zap, Coins, Globe, Heart, Users as UsersIcon, Landmark, CircleDollarSign, Share2, Leaf, Brain, MessageSquare, Shield, Trophy, Briefcase, Building2, Palette, Handshake, Award, Scale, Settings, UserCog, Vote, Network, Key, UserCheck, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import React from 'react';
import Image from 'next/image';

const PIE_CHART_COLORS = ["#3b82f6", "#ef4444", "#0ea5e9", "#f97316", "#10b981", "#f59e0b", "#8b5cf6", "#22c55e", "#6366f1", "#d946ef", "#14b8a6", "#a855f7",];


const coinInfo = [
    { id: 'igc', name: 'IGC', fullName: 'Idea Governance Coin', icon: Network, totalSupply: 8_000_000_000 },
    { id: 'pgc', name: 'PGC', fullName: 'Public Governance Coin', icon: UsersIcon, totalSupply: 8_000_000_000 },
    { id: 'itc', name: 'ITC', fullName: 'International Trade Coin', icon: Globe, totalSupply: 8_000_000_000 },
    { id: 'ice', name: 'ICE', fullName: 'International Crypto Exchange', icon: Coins, totalSupply: 8_000_000_000 },
    { id: 'job', name: 'JOB', fullName: 'Job Coin', icon: Briefcase, totalSupply: 1_000_000_000 },
    { id: 'frn', name: 'FRN', fullName: 'Franchise Coin', icon: Building2, totalSupply: 1_000_000_000 },
    { id: 'work', name: 'WORK', fullName: 'Work Coin', icon: UserCog, totalSupply: 1_000_000_000 },
    { id: 'quiz', name: 'Quiz', fullName: 'Quiz Coin', icon: Trophy, totalSupply: 1_000_000_000 },
]

export default function TokenomicsPage() {
  const adminUser = users.find(u => u.id === 'usr_admin');
  const totalStaked = stakedPositions.filter(p => p.status === 'Staked').reduce((acc, p) => acc + p.amount, 0);

  const [selectedCoinId, setSelectedCoinId] = React.useState('igc');
  const selectedCoin = coinInfo.find(c => c.id === selectedCoinId) || coinInfo[0];
  const totalSupply = selectedCoin.totalSupply;
  
  const totalUnlockedSupplyPercentage = tokenStages
    .filter(s => s.status === 'Active' || s.status === 'Completed')
    .reduce((acc, stage) => acc + stage.supplyPercentage, 0);

  const circulatingSupply = totalSupply * totalUnlockedSupplyPercentage / 100;
  
  const progressValue = tokenStages.filter(s => s.status !== 'Locked').length * (100 / tokenStages.length);


  const icons: { [key: string]: React.ElementType } = {
    'Creator': UserCog,
    'System Management': Settings,
    'Global Peace & Development': Handshake,
    'Anti-Corruption': Shield,
    'AI Education': Brain,
    'Plant a Tree Initiative': Leaf,
    'International Issues': Globe,
    'National Issues': Landmark,
    'Niche Job Creation': Briefcase,
    'Influencer Prize Pool': Share2,
    'Sports Development': Trophy,
    'Arts Development': Palette,
    'Idea governance': Scale,
    'Affiliate Marketing': Share2,
    'Public Demand (Geographic)': UsersIcon,
    'Public Demand (Voting)': Vote,
    'Society/Street Development': Building2,
    'Village/Ward Development': Building2,
    'Block/Kasbah Development': Building2,
    'Taluka Development': Building2,
    'District Development': Building2,
    'State Development': Building2,
    'Country Development': Landmark,
    'Main franchisee commission': Building2,
    'Guide benefit': UserCheck,
    'Initial investor': Key,
  };

  const fixedAllocations = adminAllocations.filter(a => a.type === 'fixed');
  const geographicAllocations = adminAllocations.filter(a => a.type === 'geographic');
  const votingAllocations = adminAllocations.filter(a => a.type === 'voting');

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Coins & Tokenomics</h1>
          <p className="text-muted-foreground">
            Understand the distribution, supply, and staking mechanisms of the platform's tokens.
          </p>
        </div>
        
        <Tabs defaultValue="igc" onValueChange={setSelectedCoinId} className="w-full">
            <TabsList className="grid w-full grid-cols-8">
                {coinInfo.map(coin => (
                    <TabsTrigger key={coin.id} value={coin.id}>{coin.name}</TabsTrigger>
                ))}
            </TabsList>
            {coinInfo.map(coin => {
                const Icon = coin.icon;
                const currentTotalSupply = coin.totalSupply;
                const currentCirculatingSupply = currentTotalSupply * totalUnlockedSupplyPercentage / 100;
                
                return (
                    <TabsContent key={coin.id} value={coin.id} className="mt-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{coin.name} Total Supply</CardTitle>
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-3xl font-bold">{currentTotalSupply.toLocaleString('en-US')} {coin.name}</div>
                                <p className="text-xs text-muted-foreground">The maximum number of {coin.name} to ever exist.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Circulating Supply</CardTitle>
                                <Zap className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-3xl font-bold">{currentCirculatingSupply.toLocaleString('en-US')} {coin.name}</div>
                                <p className="text-xs text-muted-foreground">The amount of {coin.name} currently in circulation.</p>
                                </CardContent>
                            </Card>
                             {(coin.id === 'igc' || coin.id === 'pgc') && (
                                <div className="relative lg:col-span-2 row-span-2 h-full min-h-[160px] rounded-lg overflow-hidden border">
                                    <Image
                                        src="https://storage.googleapis.com/stey-dev-public-resources/public-governance-859029-c316e-logo.png"
                                        alt={`${coin.name} Logo`}
                                        fill
                                        style={{ objectFit: 'contain', padding: '1rem' }}
                                        data-ai-hint="governance coin"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <Card>
                            <CardHeader>
                            <CardTitle>Supply Release Schedule ({coin.name})</CardTitle>
                            <CardDescription>{coin.name} is released in controlled stages to ensure stability.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Progress value={progressValue} className="h-2" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        {tokenStages.map(stage => (
                                            <div key={stage.stage} className="flex-1 text-center">
                                                <p className={cn("font-semibold", stage.status !== 'Locked' && 'text-primary')}>
                                                    Stage {stage.stage}
                                                </p>
                                                <p>{stage.supplyPercentage}%</p>
                                                <p className={cn(
                                                    "capitalize",
                                                    stage.status === 'Active' && 'text-green-500',
                                                    stage.status === 'Completed' && 'text-blue-500'
                                                )}>
                                                    {stage.status}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )
            })}
        </Tabs>

        <Card>
            <CardHeader>
                <CardTitle>Buy Coin Packages</CardTitle>
                <CardDescription>Purchase coins in pre-defined packages. Availability is for the entire project lifecycle.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Package Tier</TableHead>
                            <TableHead>Coins per Package</TableHead>
                            <TableHead>Packages Available</TableHead>
                            <TableHead>Total Coins in Tier</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coinPackages.map((pkg) => (
                            <TableRow key={pkg.name}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-2.5 w-2.5 rounded-full", pkg.color)}></div>
                                        <span className="font-medium">{pkg.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{pkg.coins.toLocaleString('en-US')}</TableCell>
                                <TableCell>{pkg.packagesAvailable.toLocaleString('en-US')}</TableCell>
                                <TableCell>{(pkg.coins * pkg.packagesAvailable).toLocaleString('en-US')}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" disabled={pkg.name === 'Diamond'}>Buy Package</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        <Tabs defaultValue="igc" className="w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Smart Contract Staking Locker</CardTitle>
                    <CardDescription>Lock your coins for a fixed period to earn rewards, including coin split bonuses for IGC.</CardDescription>
                    <TabsList className="grid w-full grid-cols-8 mt-4">
                        <TabsTrigger value="itc">Stake ITC</TabsTrigger>
                        <TabsTrigger value="ice">Stake ICE</TabsTrigger>
                        <TabsTrigger value="igc">Stake IGC</TabsTrigger>
                        <TabsTrigger value="pgc">Stake PGC</TabsTrigger>
                        <TabsTrigger value="job">Stake JOB</TabsTrigger>
                        <TabsTrigger value="frn">Stake FRN</TabsTrigger>
                        <TabsTrigger value="work">Stake WORK</TabsTrigger>
                        <TabsTrigger value="quiz">Stake Quiz</TabsTrigger>
                    </TabsList>
                </CardHeader>
                <CardContent>
                    <TabsContent value="itc">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="text-lg font-medium">Staking ITC</h3>
                                <p className="text-sm text-muted-foreground">Rules and rewards for staking International Trade Coin.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="itc-amount">Amount to Stake</Label>
                                    <Input id="itc-amount" type="number" placeholder="1000 ITC" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="itc-duration">Lock-in Period</Label>
                                    <Select>
                                        <SelectTrigger id="itc-duration">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lockDurations.map(duration => (
                                                <SelectItem key={`${duration.value}-${duration.unit}`} value={`${duration.value}-${duration.unit}`}>{duration.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="rounded-md border bg-muted/50 p-3 text-sm">
                                    <p>Estimated Rewards: <span className="font-medium text-primary">Calculated upon confirmation...</span></p>
                                </div>
                                <Button>Stake ITC</Button>
                            </div>
                        </div>
                    </TabsContent>
                     <TabsContent value="ice">
                        <div className="grid gap-6 md:grid-cols-2">
                           <div>
                                <h3 className="text-lg font-medium">Staking ICE</h3>
                                <p className="text-sm text-muted-foreground">Rules and rewards for staking International Crypto Exchange coin.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ice-amount">Amount to Stake</Label>
                                    <Input id="ice-amount" type="number" placeholder="1000 ICE" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ice-duration">Lock-in Period</Label>
                                    <Select>
                                        <SelectTrigger id="ice-duration">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lockDurations.map(duration => (
                                                <SelectItem key={`${duration.value}-${duration.unit}`} value={`${duration.value}-${duration.unit}`}>{duration.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="rounded-md border bg-muted/50 p-3 text-sm">
                                    <p>Estimated Rewards: <span className="font-medium text-primary">Calculated upon confirmation...</span></p>
                                </div>
                                <Button>Stake ICE</Button>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="igc">
                        <div className="grid gap-6 md:grid-cols-2">
                             <div>
                                <h3 className="text-lg font-medium">Staking IGC</h3>
                                <p className="text-sm text-muted-foreground">Stake IGC to be eligible for coin split bonuses at the end of each of the first 4 stages.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="igc-amount">Amount to Stake</Label>
                                    <Input id="igc-amount" type="number" placeholder="1000 IGC" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="igc-duration">Lock-in Period</Label>                                    <Select>
                                        <SelectTrigger id="igc-duration">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lockDurations.map(duration => (
                                                <SelectItem key={`${duration.value}-${duration.unit}`} value={`${duration.value}-${duration.unit}`}>{duration.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="rounded-md border bg-muted/50 p-3 text-sm">
                                    <p>Estimated Rewards: <span className="font-medium text-primary">1:1 Coin Bonus per split + standard APY.</span></p>
                                </div>
                                <Button>Stake IGC</Button>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="pgc">
                        <div className="grid gap-6 md:grid-cols-2">
                             <div>
                                <h3 className="text-lg font-medium">Staking PGC</h3>
                                <p className="text-sm text-muted-foreground">Stake PGC to be eligible for coin split bonuses at the end of each of the first 4 stages.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pgc-amount">Amount to Stake</Label>
                                    <Input id="pgc-amount" type="number" placeholder="1000 PGC" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pgc-duration">Lock-in Period</Label>
                                    <Select>
                                        <SelectTrigger id="pgc-duration">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lockDurations.map(duration => (
                                                <SelectItem key={`${duration.value}-${duration.unit}`} value={`${duration.value}-${duration.unit}`}>{duration.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="rounded-md border bg-muted/50 p-3 text-sm">
                                    <p>Estimated Rewards: <span className="font-medium text-primary">1:1 Coin Bonus per split + standard APY.</span></p>
                                </div>
                                <Button>Stake PGC</Button>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="job">
                        <div className="grid gap-6 md:grid-cols-2">
                             <div>
                                <h3 className="text-lg font-medium">Staking JOB</h3>
                                <p className="text-sm text-muted-foreground">Stake JOB to be eligible for coin split bonuses at the end of each of the first 4 stages.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="job-amount">Amount to Stake</Label>
                                    <Input id="job-amount" type="number" placeholder="1000 JOB" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="job-duration">Lock-in Period</Label>
                                    <Select>
                                        <SelectTrigger id="job-duration">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lockDurations.map(duration => (
                                                <SelectItem key={`${duration.value}-${duration.unit}`} value={`${duration.value}-${duration.unit}`}>{duration.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="rounded-md border bg-muted/50 p-3 text-sm">
                                    <p>Estimated Rewards: <span className="font-medium text-primary">1:1 Coin Bonus per split + standard APY.</span></p>
                                </div>
                                <Button>Stake JOB</Button>
                            </div>
                        </div>
                    </TabsContent>
                     <TabsContent value="frn">
                        <div className="grid gap-6 md:grid-cols-2">
                             <div>
                                <h3 className="text-lg font-medium">Staking FRN</h3>
                                <p className="text-sm text-muted-foreground">Stake FRN to be eligible for coin split bonuses at the end of each of the first 4 stages.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="frn-amount">Amount to Stake</Label>
                                    <Input id="frn-amount" type="number" placeholder="1000 FRN" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="frn-duration">Lock-in Period</Label>
                                    <Select>
                                        <SelectTrigger id="frn-duration">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lockDurations.map(duration => (
                                                <SelectItem key={`${duration.value}-${duration.unit}`} value={`${duration.value}-${duration.unit}`}>{duration.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="rounded-md border bg-muted/50 p-3 text-sm">
                                    <p>Estimated Rewards: <span className="font-medium text-primary">1:1 Coin Bonus per split + standard APY.</span></p>
                                </div>
                                <Button>Stake FRN</Button>
                            </div>
                        </div>
                    </TabsContent>
                     <TabsContent value="work">
                        <div className="grid gap-6 md:grid-cols-2">
                             <div>
                                <h3 className="text-lg font-medium">Staking WORK</h3>
                                <p className="text-sm text-muted-foreground">Stake WORK to be eligible for coin split bonuses at the end of each of the first 4 stages.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="work-amount">Amount to Stake</Label>
                                    <Input id="work-amount" type="number" placeholder="1000 WORK" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="work-duration">Lock-in Period</Label>
                                    <Select>
                                        <SelectTrigger id="work-duration">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lockDurations.map(duration => (
                                                <SelectItem key={`${duration.value}-${duration.unit}`} value={`${duration.value}-${duration.unit}`}>{duration.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="rounded-md border bg-muted/50 p-3 text-sm">
                                    <p>Estimated Rewards: <span className="font-medium text-primary">1:1 Coin Bonus per split + standard APY.</span></p>
                                </div>
                                <Button>Stake WORK</Button>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="quiz">
                        <div className="grid gap-6 md:grid-cols-2">
                             <div>
                                <h3 className="text-lg font-medium">Staking Quiz</h3>
                                <p className="text-sm text-muted-foreground">Stake Quiz coin to be eligible for coin split bonuses at the end of each of the first 4 stages.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quiz-amount">Amount to Stake</Label>
                                    <Input id="quiz-amount" type="number" placeholder="1000 Quiz" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quiz-duration">Lock-in Period</Label>
                                    <Select>
                                        <SelectTrigger id="quiz-duration">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lockDurations.map(duration => (
                                                <SelectItem key={`${duration.value}-${duration.unit}`} value={`${duration.value}-${duration.unit}`}>{duration.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="rounded-md border bg-muted/50 p-3 text-sm">
                                    <p>Estimated Rewards: <span className="font-medium text-primary">1:1 Coin Bonus per split + standard APY.</span></p>
                                </div>
                                <Button>Stake Quiz</Button>
                            </div>
                        </div>
                    </TabsContent>
                </CardContent>
            </Card>
        </Tabs>

         <Card>
          <CardHeader>
            <CardTitle>My Staked Positions</CardTitle>
            <CardDescription>A list of your current and past fixed deposits across all coins.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stakedPositions.map(pos => (
                  <TableRow key={pos.id}>
                    <TableCell><Badge variant="secondary">{pos.asset}</Badge></TableCell>
                    <TableCell className="font-medium">{pos.amount.toLocaleString('en-US')}</TableCell>
                    <TableCell>{pos.startDate}</TableCell>
                    <TableCell>{pos.endDate}</TableCell>
                    <TableCell>{pos.durationMonths} Months</TableCell>
                    <TableCell>
                      <Badge variant={pos.status === 'Staked' ? 'default' : 'destructive'}>{pos.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled={pos.status === 'Staked'}>
                        Unstake
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
                <p className="font-bold text-lg">Total Staked Value (USD): $15,500.00</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
