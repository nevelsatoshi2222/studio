
'use client';
import { pgcSaleStages, fundDistributionModel } from '@/lib/pgc-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formatCurrencyForTable = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
};

function BreakdownTable({ title, dataSource }: { title: string; dataSource: 'incomingFund' | 'pdpFund' }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    This table shows the calculated dollar amount allocated to each category from the {dataSource === 'incomingFund' ? '"Incoming Fund from Sale"' : '"Value Released from PDP"'} for each stage.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Stage</TableHead>
                                {fundDistributionModel.map(item => (
                                    <TableHead key={item.category} className="text-right">{item.category} ({item.percentage}%)</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pgcSaleStages.map(stage => (
                                <TableRow key={stage.stage}>
                                    <TableCell className="font-medium">{stage.stage}</TableCell>
                                    {fundDistributionModel.map(item => {
                                        const fundSourceValue = dataSource === 'incomingFund' ? stage.incomingFundValue : stage.pdpFundValue;
                                        const allocatedAmount = fundSourceValue * (item.percentage / 100);
                                        return (
                                            <TableCell key={item.category} className="text-right font-mono text-xs">
                                                {formatCurrencyForTable(allocatedAmount)}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}


export function FundDistributionBreakdown() {
  return (
    <div className="space-y-6">
        <BreakdownTable title="Breakdown of Incoming Fund from Sale" dataSource="incomingFund" />
        <BreakdownTable title="Breakdown of Value Released from PDP" dataSource="pdpFund" />
    </div>
  );
}
