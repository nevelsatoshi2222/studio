'use client';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { IceTicker } from '@/components/ice-ticker';
import { ItcTicker } from '@/components/itc-ticker';
import { IgcTicker } from '@/components/igc-ticker';
import { PgcTicker } from '@/components/pgc-ticker';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, MessageSquare } from 'lucide-react';
import { transactions, forumPosts } from '@/lib/data';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { IGC_TOKEN_MINT_ADDRESS, PGC_TOKEN_MINT_ADDRESS } from '@/lib/config';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';

// Define the User type for the temporary display
type DisplayUser = {
  id: string;
  name: string;
  email: string;
  avatarId: string;
};

export default function Dashboard() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [igcBalance, setIgcBalance] = useState<number | null>(null);
  const [pgcBalance, setPgcBalance] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // --- Temporary code to display users ---
  const firestore = useFirestore();
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'));
  }, [firestore]);
  const { data: registeredUsers, isLoading: areUsersLoading } = useCollection<DisplayUser>(usersQuery);
  // --- End of temporary code ---


  useEffect(() => {
    if (publicKey && connection) {
      setIsBalanceLoading(true);
      const fetchBalances = async () => {
        try {
          // Fetch IGC Balance
          const igcMint = new PublicKey(IGC_TOKEN_MINT_ADDRESS);
          const igcTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            mint: igcMint,
          });
          if (igcTokenAccounts.value.length > 0) {
            const igcBal = igcTokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            setIgcBalance(igcBal);
          } else {
            setIgcBalance(0);
          }

          // Fetch PGC Balance
          const pgcMint = new PublicKey(PGC_TOKEN_MINT_ADDRESS);
          const pgcTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            mint: pgcMint,
          });

          if (pgcTokenAccounts.value.length > 0) {
            const pgcBal = pgcTokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            setPgcBalance(pgcBal);
          } else {
            setPgcBalance(0);
          }

        } catch (error) {
          console.error("Failed to fetch token balances:", error);
          setIgcBalance(null);
          setPgcBalance(null);
        } finally {
          setIsBalanceLoading(false);
        }
      };
      fetchBalances();
    } else {
      setIgcBalance(null);
      setPgcBalance(null);
    }
  }, [publicKey, connection]);

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

        {/* --- Temporary User Display Card --- */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>A temporary list to verify user registration is working.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areUsersLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">Loading users...</TableCell>
                  </TableRow>
                ) : registeredUsers && registeredUsers.length > 0 ? (
                  registeredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={getAvatarUrl(user.avatarId)} alt={user.name} data-ai-hint={getAvatarHint(user.avatarId)} />
                              <AvatarFallback>{user.name?.charAt(0) || ''}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No users have been registered yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* --- End of Temporary Card --- */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>IGC Ticker</CardTitle>
                <CardDescription>Idea Governance Coin.</CardDescription>
              </div>
              <Image src="https://storage.googleapis.com/project-spark-348216.appspot.com/vision_public-governance-859029-c316e_1721245050854_1.png" alt="IGC Coin" width={32} height={32} />
            </CardHeader>
            <CardContent>
              <IgcTicker />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>PGC Ticker</CardTitle>
                    <CardDescription>Public Governance Coin.</CardDescription>
                </div>
                <Image src="https://storage.googleapis.com/project-spark-348216.appspot.com/vision_public-governance-859029-c316e_1721831777732_0.png" alt="PGC Coin" width={40} height={40} />
            </CardHeader>
            <CardContent>
              <PgcTicker />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ITC Ticker</CardTitle>
              <CardDescription>Stablecoin pegged to Gold.</CardDescription>
            </CardHeader>
            <CardContent>
              <ItcTicker />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>ICE Ticker</CardTitle>
              <CardDescription>Exchange coin price.</CardDescription>
            </CardHeader>
            <CardContent>
              <IceTicker />
            </CardContent>
          </Card>
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>My Wallet</CardTitle>
              <CardDescription>Your personal wallet details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
                {publicKey ? (
                   <p className="font-mono text-sm break-all">
                     {publicKey.toBase58()}
                   </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Please connect your wallet.</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">IGC Balance</p>
                {isBalanceLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : publicKey ? (
                  <p className="text-2xl font-bold">{igcBalance?.toLocaleString('en-US') ?? '0'} IGC</p>
                ) : (
                   <p className="text-2xl font-bold">-- IGC</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">PGC Balance</p>
                {isBalanceLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : publicKey ? (
                  <p className="text-2xl font-bold">{pgcBalance?.toLocaleString('en-US') ?? '0'} PGC</p>
                ) : (
                   <p className="text-2xl font-bold">-- PGC</p>
                )}
              </div>
            </CardContent>
             <CardFooter>
                 <Button disabled={!publicKey}>Send / Receive</Button>
             </CardFooter>
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
    