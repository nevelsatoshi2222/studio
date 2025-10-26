'use client';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { lockDurations, stakedPositions } from '@/lib/data';
import { Lock, Unlock, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

const stakeableCoins = [
    { id: 'pgc', name: 'PGC' },
    { id: 'igc', name: 'IGC' },
    { id: 'itc', name: 'ITC' },
    { id: 'ice', name: 'ICE' },
    { id: 'job', name: 'JOB' },
    { id: 'frn', name: 'FRN' },
    { id: 'work', name: 'WORK' },
    { id: 'quiz', name: 'Quiz' },
];

export default function StakingPage() {
    const [selectedCoinId, setSelectedCoinId] = useState('pgc');

    return (
        <AppLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Smart Contract Staking Locker</h1>
                    <p className="text-muted-foreground">
                        Lock your tokens in a secure, non-custodial smart contract to earn rewards.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create a New Stake</CardTitle>
                        <CardDescription>Select a coin, enter an amount, and choose a lock duration.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                             <div>
                                <Label htmlFor="coin-select">Coin to Stake</Label>
                                <Select value={selectedCoinId} onValueChange={setSelectedCoinId}>
                                    <SelectTrigger id="coin-select">
                                        <SelectValue placeholder="Select Coin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stakeableCoins.map(coin => (
                                            <SelectItem key={coin.id} value={coin.id}>{coin.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="amount">Amount</Label>
                                <Input id="amount" placeholder="e.g., 1000" type="number" />
                            </div>
                            <div>
                                <Label htmlFor="lock-duration">Lock Duration</Label>
                                <Select>
                                    <SelectTrigger id="lock-duration">
                                        <SelectValue placeholder="Select Duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lockDurations.map((duration) => (
                                            <SelectItem key={duration.label} value={duration.label}>
                                                {duration.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg">
                            <Lock className="mr-2 h-4 w-4" /> Stake Now
                        </Button>
                    </CardFooter>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>My Staked Positions</CardTitle>
                        <CardDescription>
                            An overview of your current and past staked assets.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stakedPositions.map((pos) => (
                                    <TableRow key={pos.id}>
                                        <TableCell className="font-medium">{pos.asset}</TableCell>
                                        <TableCell>{pos.amount.toLocaleString()}</TableCell>
                                        <TableCell>{pos.startDate}</TableCell>
                                        <TableCell>{pos.endDate}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    pos.status === 'Staked'
                                                        ? 'default'
                                                        : pos.status === 'Unstaking'
                                                            ? 'secondary'
                                                            : 'outline'
                                                }
                                            >
                                                {pos.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={pos.status !== 'Unstaked'}
                                            >
                                                <Unlock className="mr-2 h-4 w-4" /> Withdraw
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
