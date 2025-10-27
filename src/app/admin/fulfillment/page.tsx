
'use client';
import { useState, useEffect } from 'react';
import { useMemoFirebase, useUser, useFirestore, updateDocumentNonBlocking, useDoc, useCollection, setDocumentNonBlocking } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, Copy, Loader2, ListCollapse, ListChecks } from 'lucide-react';
import { collection, doc, query, where, serverTimestamp, writeBatch, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { ADMIN_WALLET_ADDRESS } from '@/lib/config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type WithdrawalRequest = {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    solanaAddress: string;
    requestedAt: any; 
    status: 'pending' | 'completed' | 'failed';
};

const RowSkeleton = () => (
    <TableRow>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-8 w-24" /></TableCell>
    </TableRow>
)

export default function FulfillmentPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { publicKey } = useWallet();
    const { toast } = useToast();

    const [isBulkPayoutModalOpen, setIsBulkPayoutModalOpen] = useState(false);
    const [payoutList, setPayoutList] = useState('');

    const isWalletAdmin = publicKey?.toBase58() === ADMIN_WALLET_ADDRESS;

    const adminRoleRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'roles_admin', user.uid);
    }, [firestore, user]);

    const { data: adminRole, isLoading: isRoleLoading } = useDoc(adminRoleRef);
    const isFirebaseAdmin = !!adminRole;
    const isAdmin = isWalletAdmin || isFirebaseAdmin;

    const withdrawalRequestsQuery = useMemoFirebase(() => {
        if (!firestore || !isAdmin) return null;
        return query(collection(firestore, 'withdrawal_requests'), where('status', '==', 'pending'), orderBy('requestedAt', 'desc'));
    }, [firestore, isAdmin]);

    // This is a placeholder for presale purchases. In a real app, this would come from a 'purchases' collection.
    const [presalePurchases, setPresalePurchases] = useState([
        { id: 'ps1', userName: 'Alice Johnson', package: '$100 USDT', pgcAmount: 200, wallet: 'Epa6e5a7pYEj2e4s2w8cZ5fG3xH1vR9jK6bN4mD0uF7' },
        { id: 'ps2', userName: 'Bob Williams', package: '$1,000 USDT', pgcAmount: 2000, wallet: '5tG8hJkLuMvNpoQrStUvXyZ1a2b3c4d5e6f7g8h9i' },
    ]);

    const { data: withdrawalRequests, isLoading: areRequestsLoading } = useCollection<WithdrawalRequest>(withdrawalRequestsQuery);
    
    useEffect(() => {
        if (!isUserLoading && !isRoleLoading && !isFirebaseAdmin && !isWalletAdmin) {
            router.replace('/admin/login');
        }
    }, [isUserLoading, isRoleLoading, isFirebaseAdmin, isWalletAdmin, router]);


    const handleUpdateRequestStatus = (requestId: string, newStatus: 'completed' | 'failed') => {
        if (!firestore) return;
        const requestDocRef = doc(firestore, 'withdrawal_requests', requestId);
        updateDocumentNonBlocking(requestDocRef, { status: newStatus });
        toast({ title: `Request marked as ${newStatus}` });
    };

    const copyToClipboard = (text: string, entity: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied to Clipboard!',
            description: `${entity} has been copied.`,
        });
    };
    
    const generatePayoutList = () => {
        if (!withdrawalRequests || withdrawalRequests.length === 0) {
            toast({ variant: 'destructive', title: 'No pending requests to process.' });
            return;
        }
        const csvContent = withdrawalRequests
            .map(req => `${req.solanaAddress},${req.amount}`)
            .join('\n');
        setPayoutList(csvContent);
        setIsBulkPayoutModalOpen(true);
    };

    const handleMarkAllComplete = async () => {
        if (!firestore || !withdrawalRequests || withdrawalRequests.length === 0) return;

        const batch = writeBatch(firestore);
        withdrawalRequests.forEach(req => {
            const docRef = doc(firestore, 'withdrawal_requests', req.id);
            batch.update(docRef, { status: 'completed' });
        });

        try {
            await batch.commit();
            toast({
                title: 'Bulk Update Successful',
                description: `${withdrawalRequests.length} requests have been marked as completed.`,
            });
        } catch (error) {
            console.error("Bulk update failed:", error);
            toast({ variant: 'destructive', title: 'Bulk Update Failed', description: 'Could not update all requests. Please check the logs.' });
        }
    };


    if (!isAdmin && !isUserLoading) {
        return (
            <AppLayout>
                <Card className="mt-8 border-destructive">
                    <CardHeader className="text-center">
                        <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
                        <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
                        <CardDescription>
                            You do not have permissions to view this page.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Fulfillment Center</h1>
                    <p className="text-muted-foreground">
                        Process presale purchases and user withdrawal requests.
                    </p>
                </div>
                <Tabs defaultValue="withdrawals">
                    <TabsList>
                        <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
                        <TabsTrigger value="presale">Presale Purchases</TabsTrigger>
                    </TabsList>
                    <TabsContent value="withdrawals" className="mt-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div>
                                        <CardTitle>Pending PGC Withdrawal Requests</CardTitle>
                                        <CardDescription>Users have requested to withdraw their in-app PGC to their Solana wallet. Verify and send the tokens, then mark as complete.</CardDescription>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button variant="outline" onClick={generatePayoutList} disabled={!withdrawalRequests || withdrawalRequests.length === 0}>
                                            <ListCollapse className="mr-2 h-4 w-4"/> Generate Payout List
                                        </Button>
                                        <Button variant="secondary" onClick={handleMarkAllComplete} disabled={!withdrawalRequests || withdrawalRequests.length === 0}>
                                            <ListChecks className="mr-2 h-4 w-4"/> Mark All Complete
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Amount (PGC)</TableHead>
                                            <TableHead>Destination Wallet</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {areRequestsLoading ? (
                                            <RowSkeleton />
                                        ) : withdrawalRequests && withdrawalRequests.length > 0 ? (
                                            withdrawalRequests.map((req) => (
                                                <TableRow key={req.id}>
                                                    <TableCell className="font-medium">{req.userName}</TableCell>
                                                    <TableCell>{req.amount.toLocaleString()}</TableCell>
                                                    <TableCell className="font-mono text-xs flex items-center gap-2">
                                                        {req.solanaAddress}
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(req.solanaAddress, 'Wallet address')}>
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>{req.requestedAt ? new Date(req.requestedAt.seconds * 1000).toLocaleString() : 'N/A'}</TableCell>
                                                    <TableCell><Badge variant="secondary">{req.status}</Badge></TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="sm" onClick={() => handleUpdateRequestStatus(req.id, 'completed')}>
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center">
                                                    No pending withdrawal requests.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="presale" className="mt-4">
                         <Card>
                            <CardHeader>
                                <CardTitle>Presale Purchases</CardTitle>
                                <CardDescription>This is a list of simulated presale purchases. Manually send the PGC amount to the buyer's wallet.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Package</TableHead>
                                            <TableHead>Total PGC to Send</TableHead>
                                            <TableHead>Buyer Wallet</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {presalePurchases.map((purchase) => (
                                            <TableRow key={purchase.id}>
                                                <TableCell>{purchase.userName}</TableCell>
                                                <TableCell>{purchase.package}</TableCell>
                                                <TableCell className="font-bold">{purchase.pgcAmount.toLocaleString()}</TableCell>
                                                <TableCell className="font-mono text-xs flex items-center gap-2">
                                                    {purchase.wallet}
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(purchase.wallet, 'Wallet address')}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
             <Dialog open={isBulkPayoutModalOpen} onOpenChange={setIsBulkPayoutModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Bulk Payout List (CSV)</DialogTitle>
                        <DialogDescription>
                            Copy this list and use it with a bulk-sending tool to process all withdrawals in one batch. The format is `address,amount`.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        readOnly
                        value={payoutList}
                        className="h-48 font-mono text-xs"
                    />
                    <DialogFooter>
                         <Button onClick={() => copyToClipboard(payoutList, 'Payout list')}>
                            <Copy className="mr-2 h-4 w-4" /> Copy List
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

    