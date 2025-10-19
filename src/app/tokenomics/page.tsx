
'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  stakedPositions,
  lockDurations,
  tokenStages,
  coinPackages,
  adminAllocations,
} from '@/lib/data';
import { StakedPosition, CoinPackage } from '@/lib/types';
import {
  Lightbulb,
  Banknote,
  Recycle,
  Sprout,
  Heart,
  Landmark,
  Scale,
  Award,
  Trophy,
  Briefcase,
  Building2,
  Globe,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';

const icons: { [key: string]: React.ElementType } = {
  'Global Peace & Development': Heart,
  'Anti-Corruption Initiative': Landmark,
  'AI Education': Lightbulb,
  'Plant a Tree Initiative': Sprout,
  'International Issues': Globe,
  'National Issues': Landmark,
  'Sports Development': Trophy,
  'Arts Development': Scale,
  'Niche-Based Job Creation': Briefcase,
  'Idea governance': Scale,
  'Creator Fund': Award,
};


const coins = [
    { id: 'ITC', name: 'International Trade Coin (ITC)', supply: 8_000_000_000 },
    { id: 'ICE', name: 'International Crypto Exchange (ICE)', supply: 8_000_000_000 },
    { id: 'IGC', name: 'Idea Governance Coin (IGC)', supply: 8_000_000_000, hasTokenomics: true },
    { id: 'FRC', name: 'Franchisee Coin (FRC)', supply: 1_000_000_000, hasTokenomics: true },
    { id: 'LOAN', name: 'Loan Coin (LOAN)', supply: 1_000_000_000, hasTokenomics: true },
    { id: 'JBC', name: 'Job Coin (JBC)', supply: 1_000_000_000, hasTokenomics: true },
    { id: 'COMP', name: 'Competition Coin (COMP)', supply: 8_000_000_000, hasTokenomics: true },
];

const PIE_CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#6b7280'
];

const tokenSupplyDistribution = [
  { name: 'Public Sale', value: 35.0 },
  { name: 'Coin Split Bonus', value: 5.1 },
  { name: 'Global Causes & Development', value: 20.0 },
  { name: 'Public Demand Fund', value: 39.9 }
];

export default function TokenomicsPage() {
  const [currentStage, setCurrentStage] = useState(1);
  const [selectedCoin, setSelectedCoin] = useState('IGC');

  const handleStageChange = (stage: number) => {
    setCurrentStage(stage);
  };

  const getPackagesForStage = (stage: number): CoinPackage[] => {
    const multiplier = stage === 1 ? 1 : stage === 2 ? 2 : 5;
    return coinPackages.map(pkg => ({
      ...pkg,
      available: pkg.available * multiplier
    }));
  };
  
  const currentPackages = getPackagesForStage(currentStage);

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Coins n Tokenomics</h1>
          <p className="text-muted-foreground">
            Understand the economic model of the platform's tokens.
          </p>
        </div>

        <Tabs defaultValue="IGC" className="w-full" onValueChange={setSelectedCoin}>
          <TabsList className="grid w-full grid-cols-7">
            {coins.map(coin => (
              <TabsTrigger key={coin.id} value={coin.id}>{coin.id}</TabsTrigger>
            ))}
          </TabsList>
          {coins.map(coin => (
            <TabsContent key={coin.id} value={coin.id} className="mt-6 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{coin.name}</CardTitle>
                  <CardDescription>Supply details and release schedule.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                   <div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Total Supply</h3>
                            <span className="text-lg font-bold text-primary">{coin.supply.toLocaleString('en-US')} {coin.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Circulating Supply</h3>
                            <span className="text-lg font-bold">{(coin.supply * 0.001).toLocaleString('en-US')} {coin.id}</span>
                        </div>
                        <Progress value={0.1} />
                        <p className="text-sm text-muted-foreground">Next unlock: Stage 2 in ~15 days</p>
                    </div>
                     <div className="mt-6 space-y-4">
                        <h3 className="font-semibold">Supply Release Schedule</h3>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {tokenStages.map(stage => (
                              <div key={stage.stage} className={`p-2 rounded-md ${stage.stage <= 1 ? 'bg-primary/20' : 'bg-muted'}`}>
                                  <p className="text-sm font-bold">Stage {stage.stage}</p>
                                  <p className="text-xs">{stage.supplyPercentage}%</p>
                              </div>
                          ))}
                        </div>
                    </div>
                  </div>
                  { (coin.hasTokenomics) &&
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Token Supply Distribution</h3>
                     <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={tokenSupplyDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {tokenSupplyDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend iconSize={10} />
                        </PieChart>
                      </ResponsiveContainer>
                  </div>
                  }
                </CardContent>
              </Card>

              {coin.id === 'IGC' && (
                <Card>
                  <CardHeader>
                    <CardTitle>IGC Tokenomics: Locker & Split</CardTitle>
                    <CardDescription>A unique price and supply model for the first 4 stages.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <h3 className="font-semibold">How It Works</h3>
                        <div className="text-muted-foreground text-sm space-y-2">
                          <p>
                            IGC's initial price is $1.00. The first 0.1% of supply is divided into 1,000 "lockers."
                            Each locker contains 8,000 coins. The price for each subsequent locker increases by $0.001.
                          </p>
                          <p>
                            At the end of each of the first four stages, a "coin split" occurs.
                            If you have staked your IGC, you receive a 1:1 bonus—doubling your staked amount. The price then resets to $1.00 for the next stage.
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-semibold text-primary">How Early Buyers Get More Benefit (An Example):</h4>
                        <p className="text-muted-foreground text-sm mt-2">
                          The power of this system is in compounding. An early buyer benefits from every subsequent split.
                        </p>
                        <ul className="text-muted-foreground text-sm mt-2 list-disc pl-5 space-y-1">
                          <li>You buy and stake <strong>100 IGC</strong> during Stage 1.</li>
                          <li>At the end of Stage 1, a split occurs. Your 100 coins become <strong>200 coins</strong>.</li>
                          <li>At the end of Stage 2, another split occurs. Your 200 coins become <strong>400 coins</strong>.</li>
                          <li>At the end of Stage 3, a third split happens. Your 400 coins become <strong>800 coins</strong>.</li>
                          <li>At the end of Stage 4, the final split happens. Your 800 coins become <strong>1,600 coins</strong>.</li>
                        </ul>
                         <p className="text-muted-foreground text-sm mt-2 font-semibold">
                          Your initial 100 coins have grown to 1,600 coins simply by staking early!
                        </p>
                      </div>
                  </CardContent>
                </Card>
              )}
                
              {coin.hasTokenomics && (
                <Card>
                  <CardHeader>
                    <CardTitle>Phase 2: Post-Creator Funding Allocation</CardTitle>
                    <CardDescription>
                      After the initial Creator Fund milestone, revenue from {coin.id} sales is allocated to these global causes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      {adminAllocations.map((item, index) => {
                          const Icon = icons[item.name];
                          return (
                            <div key={item.name} className="flex items-center">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-4" style={{ color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] }}>
                                {Icon && <Icon className="w-5 h-5" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="font-semibold text-primary">{item.value}%</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                            </div>
                          );
                      })}
                    </div>
                    <div>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={adminAllocations} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} labelLine={false} label>
                            {adminAllocations.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Buy Coin Packages</CardTitle>
                   <div className="flex items-center space-x-2">
                    <Tabs defaultValue="stage-1" className="w-auto">
                      <TabsList>
                        <TabsTrigger value="stage-1" onClick={() => handleStageChange(1)}>Stage 1</TabsTrigger>
                        <TabsTrigger value="stage-2" onClick={() => handleStageChange(2)}>Stage 2</TabsTrigger>
                        <TabsTrigger value="stage-3" onClick={() => handleStageChange(3)}>Stage 3</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Badge variant="secondary">Packages available for Stage {currentStage}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead>Coins</TableHead>
                        <TableHead>Available Packages</TableHead>
                        <TableHead>Total Coins in Tier</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPackages.map(pkg => (
                        <TableRow key={pkg.name}>
                          <TableCell className="font-semibold flex items-center">
                            <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: pkg.color }}></span>
                            {pkg.name}
                          </TableCell>
                          <TableCell>{pkg.coins.toLocaleString('en-US')}</TableCell>
                          <TableCell>{pkg.available.toLocaleString('en-US')}</TableCell>
                          <TableCell>{(pkg.coins * pkg.available).toLocaleString('en-US')}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">Buy Package</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Smart Contract Staking Locker</CardTitle>
                  <CardDescription>
                    Lock your {coin.id} for a set period to earn rewards.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select an amount of {coin.id} and a lock duration. Your coins will be locked in a smart contract and will be automatically released to your wallet once the time period is complete.
                    </p>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lock duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {lockDurations.map(duration => (
                          <SelectItem key={duration.value} value={String(duration.value)}>
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button className="w-full">Stake {coin.id}</Button>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">My Staked Positions</h3>
                    <div className="space-y-3">
                      {stakedPositions.filter(p => p.coin === coin.id).map((pos, i) => (
                        <div key={i} className="flex justify-between items-center rounded-lg border p-3">
                          <div>
                            <p className="font-semibold">{pos.amount.toLocaleString('en-US')} {pos.coin}</p>
                            <p className="text-xs text-muted-foreground">
                              Staked for {pos.duration > 12 ? `${pos.duration/12} years` : `${pos.duration} months`}
                            </p>
                          </div>
                          <Badge variant={pos.status === 'Staked' ? 'default' : 'secondary'}>{pos.status}</Badge>
                        </div>
                      ))}
                      {stakedPositions.filter(p => p.coin === coin.id).length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">You have no active staking positions for {coin.id}.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}
