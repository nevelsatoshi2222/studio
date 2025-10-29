
'use client';
import { useState, useEffect } from 'react';
import { useMemoFirebase, useUser, useFirestore, updateDocumentNonBlocking, useDoc, useCollection, setDocumentNonBlocking } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, Copy, ListCollapse, ListChecks } from 'lucide-react';
import { collection, doc, query, where, writeBatch, orderBy, Query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
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

type PresalePurchase = {
    id: string;
    buyerWalletAddress: string;
    packageAmountUSD: number;
    totalPgc: number;
    purchaseDate: any;
    status: 'pending_verification' | 'completed';
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

function FulfillmentContent() {
    const [isBulkPayoutModalOpen, setIsBulkPayoutModalOpen] = useState(false);
    const [payoutList, setPayoutList] = useState('');
    const firestore = useFirestore();
    const { toast } = useToast();

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'withdrawal_requests'), where('status', '==', 'pending'), orderBy('requestedAt', 'desc'));
    }, [firestore]);
    
    const presaleQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'presale_purchases'), where('status', '==', 'pending_verification'), orderBy('purchaseDate', 'desc'));
    }, [firestore]);

    const { data: withdrawalRequests, isLoading: areRequestsLoading } = useCollection<WithdrawalRequest>(requestsQuery);
    const { data: presalePurchases, isLoading: arePresalesLoading } = useCollection<PresalePurchase>(presaleQuery);


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
    
    const handleMarkPurchaseComplete = (purchaseId: string) => {
        if (!firestore) return;
        const purchaseDocRef = doc(firestore, 'presale_purchases', purchaseId);
        updateDocumentNonBlocking(purchaseDocRef, { status: 'completed' });
        toast({ title: `Purchase marked as completed` });
    };

    return (
        <>
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
                            <CardDescription>A list of presale purchases awaiting USDT payment verification and PGC fulfillment.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Buyer Wallet</TableHead>
                                        <TableHead>Package</TableHead>
                                        <TableHead>Total PGC to Send</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {arePresalesLoading ? (
                                        <RowSkeleton />
                                    ) : presalePurchases && presalePurchases.length > 0 ? (
                                        presalePurchases.map((purchase) => (
                                            <TableRow key={purchase.id}>
                                                <TableCell className="font-mono text-xs flex items-center gap-2">
                                                    {purchase.buyerWalletAddress}
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(purchase.buyerWalletAddress, 'Wallet address')}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                                <TableCell>${purchase.packageAmountUSD}</TableCell>
                                                <TableCell className="font-bold">{purchase.totalPgc.toLocaleString()}</TableCell>
                                                <TableCell>{purchase.purchaseDate ? new Date(purchase.purchaseDate.seconds * 1000).toLocaleString() : 'N/A'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm" onClick={() => handleMarkPurchaseComplete(purchase.id)}>
                                                        <CheckCircle className="mr-2 h-4 w-4" /> Fulfill & Mark Complete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                No pending presale purchases.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
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
        </>
    )
}

export default function FulfillmentPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    
    const canAccessPage = user?.role === 'Super Admin';

    useEffect(() => {
        if (!isUserLoading && !canAccessPage) {
            router.replace('/admin/login');
        }
    }, [isUserLoading, canAccessPage, router]);

    return (
        <AppLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Fulfillment Center</h1>
                    <p className="text-muted-foreground">
                        Process presale purchases and user withdrawal requests.
                    </p>
                </div>
                 {isUserLoading && (
                     <div className="flex items-center justify-center h-64">
                        <p>Verifying admin privileges...</p>
                    </div>
                )}
                {!isUserLoading && !canAccessPage && (
                     <Card className="mt-8 border-destructive">
                        <CardHeader className="text-center">
                            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
                            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
                            <CardDescription>
                                You do not have the necessary permissions to view this page. Redirecting...
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
                {canAccessPage && <FulfillmentContent />}
            </div>
        </AppLayout>
    );
}

    