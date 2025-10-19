
'use client';
import { AppLayout } from '@/components/app-layout';
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
import {
  ArrowRight,
  User as UserIcon,
  MessageSquare,
  Repeat,
  ArrowUpRight,
} from 'lucide-react';
import { users, transactions, forumPosts } from '@/lib/data';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images.json';

function getAvatar(avatarId: string) {
  const image = placeholderImages.find((img) => img.id === avatarId);
  return image ? image.imageUrl : `https://picsum.photos/seed/${avatarId}/40/40`;
}

export default function DashboardPage() {
  const adminUser = users.find(user => user.id === 'usr_admin');

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {adminUser?.name}! Here's a snapshot of your platform.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUser?.balance.toLocaleString('en-US')} ITC</div>
              <p className="text-xs text-muted-foreground">
                Across all your wallets
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Transactions
              </CardTitle>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{transactions.length}</div>
              <p className="text-xs text-muted-foreground">
                In the last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forum Activity</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{forumPosts.length} new posts</div>
              <p className="text-xs text-muted-foreground">
                Check out the latest discussions
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Go to Exchange
              </CardTitle>
               <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <Link href="/exchange">
                    <Button>Trade Now</Button>
                </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
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
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map((tx) => (
                    <TableRow key={tx.hash}>
                      <TableCell className="font-mono text-xs">{tx.hash.substring(0,15)}...</TableCell>
                      <TableCell>{tx.value} ITC</TableCell>
                      <TableCell className="text-right">{tx.age}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Forum Activity</CardTitle>
               <Button variant="ghost" size="sm" className="absolute top-4 right-4">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {forumPosts.map(post => (
                    <div key={post.id} className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src={getAvatar(post.authorAvatar)} alt={post.author} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium leading-none">{post.title}</p>
                            <p className="text-sm text-muted-foreground">by {post.author}</p>
                        </div>
                         <div className="ml-auto text-right">
                            <p className="text-sm font-medium">{post.upvotes} upvotes</p>
                            <p className="text-sm text-muted-foreground">{post.comments} comments</p>
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
