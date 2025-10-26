
'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tradingPairs, orderBook, tradeHistory } from '@/lib/data';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const tabs = [
  { id: 'PGC', name: 'Trade PGC' },
  { id: 'IGC', name: 'Trade IGC' },
  { id: 'ITC', name: 'Trade ITC' },
  { id: 'ICE', name: 'Trade ICE' },
  { id: 'LOAN', name: 'Trade LOAN' },
  { id: 'JBC', name: 'Trade JBC' },
  { id: 'COMP', name: 'Trade COMP' },
  { id: 'JOB', name: 'Trade JOB' },
  { id: 'FRN', name: 'Trade FRN' },
  { id: 'WORK', name: 'Trade WORK' },
];

const chartData = [
  { date: "2024-05-20", price: 2.80 },
  { date: "2024-05-21", price: 2.90 },
  { date: "2024-05-22", price: 3.10 },
  { date: "2024-05-23", price: 3.05 },
  { date: "2024-05-24", price: 3.20 },
  { date: "2024-05-25", price: 3.25 },
  { date: "2024-05-26", price: 3.40 },
];

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
};

function TradingWidget({ coin, isBuy }: { coin: string; isBuy: boolean }) {
    const action = isBuy ? 'Buy' : 'Sell';
    return (
        <div className="space-y-4">
          <Tabs defaultValue="market">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-2">
            <Label htmlFor={`${action.toLowerCase()}-price`}>Price</Label>
            <Input id={`${action.toLowerCase()}-price`} value={`Market Price (USDT)`} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${action.toLowerCase()}-amount`}>Amount</Label>
            <Input id={`${action.toLowerCase()}-amount`} placeholder={`0.00 ${coin}`} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${action.toLowerCase()}-total`}>Total</Label>
            <Input id={`${action.toLowerCase()}-total`} placeholder="0.00 USDT" />
          </div>
          <Button className={`w-full ${isBuy ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
            {action} {coin}
          </Button>
        </div>
    );
}

function TradingInterface({ coinId }: { coinId: string }) {
    const [selectedPair, setSelectedPair] = useState(`${coinId}/USDT`);
    const availablePairs = tradingPairs.filter(p => p.from === coinId).map(p => `${p.from}/${p.to}`);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <Select value={selectedPair} onValueChange={setSelectedPair}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select pair" />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePairs.map(pair => (
                                    <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CardDescription>Price chart for {selectedPair}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ChartContainer config={chartConfig} className="h-[300px] w-full">
                          <AreaChart data={chartData} margin={{ left: -20, right: 20, top: 10, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="date"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                             <YAxis
                                domain={['dataMin - 0.2', 'dataMax + 0.2']}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => `$${value.toFixed(2)}`}
                            />
                            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                            <Area
                              dataKey="price"
                              type="natural"
                              fill="var(--color-price)"
                              fillOpacity={0.4}
                              stroke="var(--color-price)"
                              stackId="a"
                            />
                          </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Buy {coinId}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TradingWidget coin={coinId} isBuy={true} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Sell {coinId}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TradingWidget coin={coinId} isBuy={false} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Book</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Price (USDT)</TableHead>
                                    <TableHead>Amount ({coinId})</TableHead>
                                    <TableHead className="text-right">Total (USDT)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderBook.sells.slice(0, 5).reverse().map((order, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="text-red-500">{order.price.toFixed(4)}</TableCell>
                                        <TableCell>{order.amount.toFixed(4)}</TableCell>
                                        <TableCell className="text-right">{(order.price * order.amount).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} className="text-lg font-bold text-center py-2">
                                        $3.10
                                    </TableCell>
                                </TableRow>
                                {orderBook.buys.slice(0, 5).map((order, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="text-green-500">{order.price.toFixed(4)}</TableCell>
                                        <TableCell>{order.amount.toFixed(4)}</TableCell>
                                        <TableCell className="text-right">{(order.price * order.amount).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Trade History</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Price (USDT)</TableHead>
                                    <TableHead>Amount ({coinId})</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tradeHistory.map((trade, i) => (
                                     <TableRow key={i}>
                                        <TableCell className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                                            {trade.price.toFixed(4)}
                                        </TableCell>
                                        <TableCell>{trade.amount.toFixed(4)}</TableCell>
                                        <TableCell className="text-right">{trade.time}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ExchangePage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Crypto Exchange</h1>
          <p className="text-muted-foreground">
            Trade ITC, ICE, and other coins with USDT, BTC, and other pairs.
          </p>
        </div>

        <Tabs defaultValue="PGC" className="w-full">
          <TabsList className="grid w-full grid-cols-10">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.name}</TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <TradingInterface coinId={tab.id} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}
