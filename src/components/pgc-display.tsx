'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { pgcSaleStages, pgcPotAllocations } from '@/lib/pgc-data';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function PgcDisplay() {
    
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 border rounded-lg bg-background/80 shadow-lg">
          <p className="font-bold text-primary">{`${payload[0].name}`}</p>
          <p className="text-sm text-muted-foreground">{`Allocation: ${payload[0].value}%`}</p>
           <p className="text-sm text-muted-foreground">{`${payload[0].payload.coinsB}B PGC`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-bold">Public Governance Coin (PGC)</h1>
          <p className="text-muted-foreground">
            A deep-dive into the staged sale, deflationary mechanics, and community-governed reserve funds of PGC.
          </p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>9-Stage Token Sale Schedule</CardTitle>
          <CardDescription>
            PGC is sold in 9 sequential stages, each with unique pricing,
            supply, and reward mechanics. The price resets after Stage 3.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead>% of Total Supply</TableHead>
                <TableHead>Coins Sold (Billion)</TableHead>
                <TableHead>Price Range (USD)</TableHead>
                <TableHead>Action at End</TableHead>
                <TableHead>Bonus/Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pgcSaleStages.map((stage) => (
                <TableRow key={stage.stage} className={stage.stage <= 3 ? 'bg-blue-500/10' : stage.stage <= 7 ? 'bg-green-500/10' : 'bg-purple-500/10'}>
                  <TableCell className="font-bold">{stage.stage}</TableCell>
                  <TableCell>{stage.percentOfTs}</TableCell>
                  <TableCell>{stage.coinsSoldB.toFixed(2)}</TableCell>
                  <TableCell>{stage.priceRange}</TableCell>
                  <TableCell>{stage.action}</TableCell>
                  <TableCell className="font-medium">{stage.reward}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Total Supply Allocation (800 Billion PGC)</CardTitle>
            <CardDescription>
                98.88% of the total supply is reserved in isolated smart contract pots, governed by the community and predefined rules.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 items-center">
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pgcPotAllocations}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="allocation"
                            nameKey="name"
                        >
                            {pgcPotAllocations.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "0.8rem"}}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-4">
                {pgcPotAllocations.map(pot => (
                    <div key={pot.name} className="flex items-start gap-4">
                        <div className="h-3 w-3 rounded-full mt-1.5" style={{backgroundColor: pot.color}} />
                        <div>
                            <h4 className="font-semibold">{pot.name} ({pot.allocation}%)</h4>
                            <p className="text-sm text-muted-foreground">{pot.use}</p>
                            <p className="text-xs font-mono text-primary/80">{pot.coinsB}B PGC = ~${pot.valueT}T at target price</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
