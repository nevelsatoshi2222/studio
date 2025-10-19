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
import { tokenStages, users, stakedPositions, lockDurations, adminAllocations, coinPackages, tokenSupplyDistribution } from '@/lib/data';
import { Lock, Unlock, Zap, Coins, Globe, Heart, Users as UsersIcon, Landmark, CircleDollarSign, Share2, Leaf, Brain, MessageSquare, Shield, Trophy, Briefcase, Building2, Palette, Handshake, Award, Scale, Settings, UserCog, Vote } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import React, { useState } from 'react';

const PIE_CHART_COLORS = ["#3b82f6", "#ef4444", "#0ea5e9", "#f97316", "#10b981", "#f59e0b", "#8b5cf6", "#22c55e", "#6366f1", "#d946ef", "#14b8a6", "#a855f7",];


const coinInfo = [
    { id: 'itc', name: 'ITC', fullName: 'International Trade Coin', icon: Globe, totalSupply: 8_000_000_000 },
    { id: 'ice', name: 'ICE', fullName: 'International Crypto Exchange', icon: Coins, totalSupply: 8_000_000_000 },
    { id: 'igc', name: 'IGC', fullName: 'Idea Governance Coin', icon: Scale, totalSupply: 8_000_000_000 },
    { id: 'job', name: 'JOB', fullName: 'Job Coin', icon: Briefcase, totalSupply: 1_000_000_000 },
    { id: 'frn', name: 'FRN', fullName: 'Franchise Coin', icon: Building2, totalSupply: 1_000_000_000 },
    { id: 'work', name: 'WORK', fullName: 'Work Coin', icon: UserCog, totalSupply: 1_000_000_000 },
    { id: 'genz', name: 'GenZ', fullName: 'GenZ', icon: UsersIcon, totalSupply: 1_000_000_000 },
]

export default function TokenomicsPage() {
  const adminUser = users.find(u => u.id === 'usr_admin');
  const totalStaked = stakedPositions.filter(p => p.status === 'Staked').reduce((acc, p) => acc + p.amount, 0);

  const [selectedStage, setSelectedStage] = useState('stage1');
  const [selectedCoinId, setSelectedCoinId] = useState('itc');

  const selectedCoin = coinInfo.find(c => c.id === selectedCoinId) || coinInfo[0];
  const totalSupply = selectedCoin.totalSupply;
  const circulatingSupply = totalSupply * (tokenStages.find(s => s.status === 'Active')?.supplyPercentage ?? 0) / 100;


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
    'Country Development': Landmark
  };

  const fixedAllocations = adminAllocations.filter(a => a.type === 'fixed');
  const geographicAllocations = adminAllocations.filter(a => a.type === 'geographic');
  const votingAllocations = adminAllocations.filter(a => a.type === 'voting');

  const FundAllocationCard = () => (
    <Card>
        <CardHeader>
            <CardTitle>Fund Allocation from Token Sales</CardTitle>
            <CardDescription>A transparent breakdown of how revenue from token sales is distributed across three core areas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {/* Geographic Public Demand */}
            <div className="rounded-lg border bg-card p-4">
                 <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-primary"/>
                    40% for Geographic Public Demand
                </h3>
                 <p className="mt-2 text-muted-foreground">
                    40% of all revenue is automatically allocated for development projects based on the geographic level where the revenue was generated.
                </p>
                <div className="mt-4 grid gap-8 md:grid-cols-2">
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie
                                data={geographicAllocations}
                                dataKey="percentage"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    return (
                                    <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                                        {`${geographicAllocations[index].percentage}%`}
                                    </text>
                                    );
                                }}
                            >
                                {geographicAllocations.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                }}
                            />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                        {geographicAllocations.map((alloc, index) => {
                            const Icon = icons[alloc.category] || CircleDollarSign;
                            return (
                                <div key={alloc.category} className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg mt-1 shrink-0" style={{ backgroundColor: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] + '1A' }}>
                                        <Icon className="h-5 w-5" style={{ color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] }}/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{alloc.category} - {alloc.percentage}%</p>
                                        <p className="text-sm text-muted-foreground">{alloc.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

             {/* Voting Public Demand */}
            <div className="rounded-lg border bg-card p-4">
                 <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                    <Vote className="h-5 w-5 text-primary"/>
                    40% for Voted Public Demand
                </h3>
                 <p className="mt-2 text-muted-foreground">
                   Another 40% of all revenue is held in a central fund. The community decides how to use these funds by discussing and voting for specific issues, problems, events, causes, and projects.
                </p>
            </div>

             {/* Fixed Allocations */}
            <div className="rounded-lg border bg-card p-4">
                 <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary"/>
                    20% for World Initiative
                </h3>
                 <p className="mt-2 text-muted-foreground">
                    The remaining 20% is allocated to fixed categories that support the platform's growth and core mission.
                </p>
                <div className="mt-4 grid gap-8 md:grid-cols-2">
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie
                                data={fixedAllocations}
                                dataKey="percentage"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    return (
                                    <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                                        {`${fixedAllocations[index].percentage}%`}
                                    </text>
                                    );
                                }}
                            >
                                {fixedAllocations.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                }}
                            />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                        {fixedAllocations.map((alloc, index) => {
                            const Icon = icons[alloc.category] || CircleDollarSign;
                            return (
                                <div key={alloc.category} className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg mt-1 shrink-0" style={{ backgroundColor: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] + '1A' }}>
                                        <Icon className="h-5 w-5" style={{ color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] }}/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{alloc.category} - {alloc.percentage}%</p>
                                        <p className="text-sm text-muted-foreground">{alloc.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );

    const TokenomicsChartCard = ({ coinName }: { coinName: string }) => (
        <Card>
            <CardHeader>
                <CardTitle>{coinName} Token Supply Distribution</CardTitle>
                <CardDescription>A breakdown of the total supply allocation for {coinName}.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={tokenSupplyDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                            >
                                {tokenSupplyDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                }}
                                formatter={(value: number, name: string) => [`${value}%`, name]}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Coins n Tokenomics</h1>
          <p className="text-muted-foreground">
            Understand the distribution, supply, and staking mechanisms of the platform's tokens.
          </p>
        </div>
        
        <Tabs defaultValue="itc" onValueChange={setSelectedCoinId} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
                {coinInfo.map(coin => (
                    <TabsTrigger key={coin.id} value={coin.id}>{coin.name}</TabsTrigger>
                ))}
            </TabsList>
            {coinInfo.map(coin => {
                const Icon = coin.icon;
                return (
                    <TabsContent key={coin.id} value={coin.id} className="mt-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{coin.name} Total Supply</CardTitle>
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-3xl font-bold">{coin.totalSupply.toLocaleString('en-US')} {coin.name}</div>
                                <p className="text-xs text-muted-foreground">The maximum number of {coin.name} to ever exist.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Circulating Supply</CardTitle>
                                <Zap className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-3xl font-bold">{(coin.totalSupply * (tokenStages.find(s => s.status === 'Active')?.supplyPercentage ?? 0) / 100).toLocaleString('en-US')} {coin.name}</div>
                                <p className="text-xs text-muted-foreground">The amount of {coin.name} currently in circulation.</p>
                                </CardContent>
                            </Card>
                             <Card className="lg:col-span-2">
                                <CardHeader>
                                <CardTitle>Supply Release Schedule ({coin.name})</CardTitle>
                                <CardDescription>{coin.name} is released in controlled stages to ensure stability.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between gap-1">
                                        {tokenStages.map((stage) => (
                                            <div key={stage.stage} className="flex flex-col items-center gap-2 text-center flex-1">
                                                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border-2", 
                                                    stage.status === 'Active' ? 'bg-primary/20 border-primary' : '',
                                                    stage.status === 'Completed' ? 'bg-muted border-muted-foreground' : 'border-border'
                                                )}>
                                                    {stage.status === 'Locked' ? <Lock className="h-4 w-4 text-muted-foreground"/> : <Unlock className="h-4 w-4 text-primary"/>}
                                                </div>
                                                <div className="text-xs font-semibold">{stage.supplyPercentage}%</div>
                                            </div>
                                        ))}
                                    </div>
                                    <Progress value={tokenStages.filter(s => s.status !== 'Locked').length * (100 / tokenStages.length)} className="mt-2 h-2" />
                                </CardContent>
                            </Card>
                        </div>

                        {['ice', 'igc', 'job', 'frn', 'work'].includes(coin.id) && (
                            <div className="grid gap-6 lg:grid-cols-2">
                                <TokenomicsChartCard coinName={coin.name} />
                                <FundAllocationCard />
                            </div>
                        )}

                        {['igc', 'job', 'frn', 'work'].includes(coin.id) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{coin.name} Price Mechanics: Locker &amp; Split System</CardTitle>
                                    <CardDescription>A unique system for the first 4 stages to ensure stable growth and reward early stakers.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                                        <div className="border p-4 rounded-lg">
                                            <h4 className="font-semibold">Stage 1</h4>
                                            <p className="text-sm text-muted-foreground">0.1% Supply ({ (coin.totalSupply * 0.001).toLocaleString('en-US') } Coins)</p>
                                            <p className="text-sm text-muted-foreground">1000 Lockers of { (coin.totalSupply * 0.001 / 1000).toLocaleString('en-US') }</p>
                                            <p className="font-mono text-xs">Price: $1.001 - $2.000</p>
                                        </div>
                                        <div className="border p-4 rounded-lg">
                                            <h4 className="font-semibold">Stage 2</h4>
                                            <p className="text-sm text-muted-foreground">0.2% Supply ({ (coin.totalSupply * 0.002).toLocaleString('en-US') } Coins)</p>
                                            <p className="text-sm text-muted-foreground">1000 Lockers of { (coin.totalSupply * 0.002 / 1000).toLocaleString('en-US') }</p>
                                            <p className="font-mono text-xs">Price: $1.001 - $2.000</p>
                                        </div>
                                        <div className="border p-4 rounded-lg">
                                            <h4 className="font-semibold">Stage 3</h4>
                                            <p className="text-sm text-muted-foreground">0.4% Supply ({ (coin.totalSupply * 0.004).toLocaleString('en-US') } Coins)</p>
                                            <p className="text-sm text-muted-foreground">1000 Lockers of { (coin.totalSupply * 0.004 / 1000).toLocaleString('en-US') }</p>
                                            <p className="font-mono text-xs">Price: $1.001 - $2.000</p>
                                        </div>
                                        <div className="border p-4 rounded-lg">
                                            <h4 className="font-semibold">Stage 4</h4>
                                            <p className="text-sm text-muted-foreground">1% Supply ({ (coin.totalSupply * 0.01).toLocaleString('en-US') } Coins)</p>
                                            <p className="text-sm text-muted-foreground">1000 Lockers of { (coin.totalSupply * 0.01 / 1000).toLocaleString('en-US') }</p>
                                            <p className="font-mono text-xs">Price: $1.001 - $2.000</p>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-6">
                                        <h4 className="font-semibold text-lg">How It Works: A Detailed Breakdown</h4>
                                        <ol className="list-decimal list-inside space-y-4 mt-4 text-muted-foreground text-sm">
                                            <li>
                                                <span className="font-semibold text-foreground">The Locker System:</span> Each of the first 4 stages divides its coin supply into 1,000 "lockers". As each locker sells out, the price for the next locker increases by a tiny fraction ($0.001), ensuring a steady, predictable price appreciation within each stage.
                                            </li>
                                            <li>
                                                <span className="font-semibold text-foreground">What is a Coin Split?</span> When all 1,000 lockers in a stage are sold, the stage is complete. At this moment, a "Coin Split" is triggered. This is a powerful event that doubles the holdings of every user who has their {coin.name} staked.
                                            </li>
                                            <li>
                                                <span className="font-semibold text-foreground">The 1:1 Staking Bonus:</span> If you have your {coin.name} staked in our Smart Contract Locker when a split occurs, you receive an equal number of coins as a bonus. For every 1 coin you have staked, you get 1 additional coin, instantly doubling your staked amount.
                                            </li>
                                            <li>
                                                <span className="font-semibold text-foreground">How Early Buyers Get More Benefit (An Example):</span> The power of this system is in compounding. An early buyer benefits from every subsequent split.
                                                <ul className="list-disc list-inside pl-6 mt-2 space-y-2 text-sm bg-background/50 p-4 rounded-md border">
                                                    <li><strong>You buy and stake 100 {coin.name} during Stage 1.</strong></li>
                                                    <li>At the end of Stage 1, a split occurs. Your 100 coins become <span className="font-bold text-primary">200 coins</span>.</li>
                                                    <li>At the end of Stage 2, another split occurs. Your 200 coins become <span className="font-bold text-primary">400 coins</span>.</li>
                                                    <li>At the end of Stage 3, a third split happens. Your 400 coins become <span className="font-bold text-primary">800 coins</span>.</li>
                                                    <li>At the end of Stage 4, the final split happens. Your 800 coins become <span className="font-bold text-primary">1,600 coins</span>.</li>
                                                    <li className="font-semibold text-foreground">Your initial 100 coins have grown to 1,600 coins simply by staking early!</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span className="font-semibold text-foreground">Price Reset &amp; Market Trading:</span> After each split, the {coin.name} market price resets to ~$1.000 for the start of the next stage. This ensures a fair entry point for new buyers. From Stage 5 onwards, the price is determined by the free market on the exchange.
                                            </li>
                                        </ol>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
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
                    <TabsList className="grid w-full grid-cols-7 mt-4">
                        <TabsTrigger value="itc">Stake ITC</TabsTrigger>
                        <TabsTrigger value="ice">Stake ICE</TabsTrigger>
                        <TabsTrigger value="igc">Stake IGC</TabsTrigger>
                        <TabsTrigger value="job">Stake JOB</TabsTrigger>
                        <TabsTrigger value="frn">Stake FRN</TabsTrigger>
                        <TabsTrigger value="work">Stake WORK</TabsTrigger>
                        <TabsTrigger value="genz">Stake GenZ</TabsTrigger>
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
                                    <Label htmlFor="igc-duration">Lock-in Period</Label>
                                    <Select>
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
                    <TabsContent value="genz">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="text-lg font-medium">Staking GenZ</h3>
                                <p className="text-sm text-muted-foreground">Rules and rewards for staking GenZ.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="genz-amount">Amount to Stake</Label>
                                    <Input id="genz-amount" type="number" placeholder="1000 GenZ" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="genz-duration">Lock-in Period</Label>
                                    <Select>
                                        <SelectTrigger id="genz-duration">
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
                                <Button>Stake GenZ</Button>
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
