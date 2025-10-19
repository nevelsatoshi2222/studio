'use client';
import { AppLayout } from '@/components/app-layout';
import { IceTicker } from '@/components/ice-ticker';
import { ItcTicker } from '@/components/itc-ticker';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, MessageSquare } from 'lucide-react';
import { transactions, forumPosts, users } from '@/lib/data';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images.json';

export default function Dashboard() {
  const adminUser = users.find(u => u.id === 'usr_admin');

  const getAvatarUrl = (avatarId: string) => {
    const image = placeholderImages.find((img) => img.id === avatarId);
    return image ? image.imageUrl : `https://picsum.photos/seed/${avatarId}/40/40`;
  }
  
  const getAvatarHint = (avatarId: string) => {
      const image = placeholderImages.find((img) => img.id === avatarId);
      return image ? image.imageHint : 'user avatar';
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your overview of the Idea Governance platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>ITC Ticker</CardTitle>
              <CardDescription>Stablecoin pegged to 100mg of Gold, backed by physical reserves.</CardDescription>
            </CardHeader>
            <CardContent>
              <ItcTicker />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>ICE Ticker</CardTitle>
              <CardDescription>Live International Crypto Exchange coin price.</CardDescription>
            </CardHeader>
            <CardContent>
              <IceTicker />
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>My Wallet</CardTitle>
              <CardDescription>Your personal ITC wallet details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
                <p className="font-mono text-sm break-all">
                  0x1a2B3c4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0B
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">{adminUser?.balance.toLocaleString('en-US') ?? '0'} ITC</p>
              </div>
              <Button>Send / Receive</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest ITC transactions.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/transactions">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 4).map(tx => (
                    <TableRow key={tx.hash}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                        <span>{tx.from.slice(0, 6)}...{tx.from.slice(-4)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{tx.value} ITC</Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{tx.age}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Latest Forum Activity</CardTitle>
                <CardDescription>Discussions happening right now.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/forum">Go to Forums</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {forumPosts.slice(0, 3).map(post => {
                  return (
                    <div key={post.id} className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={getAvatarUrl(post.authorAvatar)} alt={post.author} data-ai-hint={getAvatarHint(post.authorAvatar)} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                        <div>
                          <Link href="#" className="font-medium hover:underline">{post.title}</Link>
                          <div className="text-sm text-muted-foreground">
                            by {post.author} in <Badge variant="outline">{post.topic}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}