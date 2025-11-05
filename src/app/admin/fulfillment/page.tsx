
'use client';
import { useState, useEffect } from 'react';
import { useMemoFirebase, useUser, useFirestore, updateDocumentNonBlocking, useDoc, useCollection } from '@/firebase';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, User, Loader2 } from 'lucide-react';
import { collection, doc, query, where, writeBatch, orderBy, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type PresalePurchase = {
    id: string;
    userId: string;
    amountUSDT: number;
    pgcCredited: number;
    purchaseDate: any;
    status: 'PENDING_VERIFICATION' | 'COMPLETED';
    userName?: string; // We'll add this
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
);

// A new component to fetch and display the buyer's name
function BuyerName({ userId }: { userId: string }) {
    const firestore = useFirestore();
    const userDocRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'users', userId);
    }, [firestore, userId]);

    const { data: user, isLoading } = useDoc<{ name: string }>(userDocRef);

    if (isLoading) return <Skeleton className="h-4 w-24" />;
    return <>{user?.name || 'Unknown User'}</>;
}


function FulfillmentContent() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const presaleQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'presales'), where('status', '==', 'PENDING_VERIFICATION'), orderBy('purchaseDate', 'desc'));
    }, [firestore]);

    const { data: presalePurchases, isLoading: arePresalesLoading } = useCollection<PresalePurchase>(presaleQuery);

    const handleMarkPurchaseComplete = (purchaseId: string) => {
        if (!firestore) return;
        const purchaseDocRef = doc(firestore, 'presales', purchaseId);
        updateDocumentNonBlocking(purchaseDocRef, { status: 'COMPLETED' });
        toast({
            title: `Purchase Approved`,
            description: `Commission distribution has been triggered for this purchase.`
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Presale Verifications</CardTitle>
                <CardDescription>
                    A list of presale purchases awaiting admin verification. Approving a purchase will change its status to 'COMPLETED' and trigger the automatic, level-wise commission distribution to the referral network.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Buyer</TableHead>
                            <TableHead>Amount (USDT)</TableHead>
                            <TableHead>PGC to Credit (incl. bonus)</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {arePresalesLoading ? (
                           <>
                            <RowSkeleton />
                            <RowSkeleton />
                           </>
                        ) : presalePurchases && presalePurchases.length > 0 ? (
                            presalePurchases.map((purchase) => (
                                <TableRow key={purchase.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <BuyerName userId={purchase.userId} />
                                    </TableCell>
                                    <TableCell>${purchase.amountUSDT.toLocaleString()}</TableCell>
                                    <TableCell className="font-bold">{purchase.pgcCredited.toLocaleString()}</TableCell>
                                    <TableCell>{purchase.purchaseDate ? new Date(purchase.purchaseDate.seconds * 1000).toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={() => handleMarkPurchaseComplete(purchase.id)}>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Fulfill & Distribute Commission
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No pending presale purchases to verify.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function FulfillmentPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    const canAccessPage = !isUserLoading && user?.role === 'Super Admin';

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.replace('/admin/login');
        }
        if (!isUserLoading && user && !canAccessPage) {
            setTimeout(() => router.replace('/admin'), 3000);
        }
    }, [isUserLoading, user, canAccessPage, router]);

    return (
        <AppLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Fulfillment Center</h1>
                    <p className="text-muted-foreground">
                        Approve presale purchases to trigger commission distribution.
                    </p>
                </div>
                {isUserLoading && (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4">Verifying admin privileges...</p>
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
