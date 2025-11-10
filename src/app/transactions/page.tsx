
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { transactions } from '@/lib/data';

export default function TransactionsPage() {
  return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Browse the latest transactions on the network.
          </p>
        </div>
        <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                An overview of the latest transactions on the network.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hash</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.hash}>
                      <TableCell className="font-mono text-xs">{tx.hash}</TableCell>
                       <TableCell>{tx.block}</TableCell>
                       <TableCell className="font-mono text-xs">{tx.from}</TableCell>
                       <TableCell className="font-mono text-xs">{tx.to}</TableCell>
                      <TableCell>{tx.value} ITC</TableCell>
                      <TableCell className="text-right">{tx.age}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </div>
  );
}
