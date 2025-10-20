'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy, UploadCloud, UserCog, Wallet, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useWallet } from '@solana/wallet-adapter-react';

function ProfileLoadingSkeleton() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const { publicKey } = useWallet();
  const { toast } = useToast();

  const isFullyLoaded = !isUserLoading && (user || publicKey);

  const referralLink = user ? `${window.location.origin}/register?ref=${user.uid}` : '';

  const copyToClipboard = (textToCopy: string, toastMessage: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copied to Clipboard!',
      description: toastMessage,
    });
  };

  if (isUserLoading) {
    return (
        <AppLayout>
            <ProfileLoadingSkeleton />
        </AppLayout>
    )
  }

  if (!user && !publicKey) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You must be logged in or connect your wallet to view your profile.
            </CardDescription>
          </CardHeader>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div>
          <h1 className="font-headline text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account details and settings.
          </p>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6">
             <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src={user?.photoURL || (publicKey ? `https://api.dicebear.com/7.x/identicon/svg?seed=${publicKey.toBase58()}` : `https://picsum.photos/seed/guest/96/96`)} />
                <AvatarFallback className="text-3xl">{user ? user.email?.charAt(0).toUpperCase() : 'G'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <CardTitle className="text-3xl">{user?.displayName || user?.email?.split('@')[0] || 'Wallet User'}</CardTitle>
                <CardDescription className="text-base">{user?.email || (publicKey ? `Connected: ${publicKey.toBase58().slice(0,6)}...${publicKey.toBase58().slice(-4)}` : '')}</CardDescription>
            </div>
            {user && (
              <Button variant="outline">
                  <UserCog className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </CardHeader>
        </Card>
        
        {/* Referral Link Card */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Your Affiliate Referral Link</CardTitle>
              <CardDescription>
                Share this link to invite new members and build your team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 rounded-md border bg-muted p-2">
                  <Input type="text" value={referralLink} readOnly className="flex-1 bg-transparent border-0 text-muted-foreground"/>
                  <Button onClick={() => copyToClipboard(referralLink, 'Your referral link has been copied.')} size="icon" variant="ghost">
                      <Copy className="h-5 w-5" />
                  </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Details Card */}
        <Card>
            <CardHeader>
                <CardTitle>Financial Details</CardTitle>
                <CardDescription>Manage your wallet and bank information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {publicKey && (
                  <div className="space-y-4">
                      <h3 className="font-medium flex items-center gap-2 text-primary"><Wallet className="h-5 w-5"/> Wallet Address</h3>
                      <div className="flex items-center space-x-2 rounded-md border bg-muted p-2">
                        <Input type="text" value={publicKey.toBase58()} readOnly className="flex-1 bg-transparent border-0 font-mono text-muted-foreground"/>
                        <Button onClick={() => copyToClipboard(publicKey.toBase58(), 'Your wallet address has been copied.')} size="icon" variant="ghost">
                            <Copy className="h-5 w-5" />
                        </Button>
                      </div>
                  </div>
                )}
                {user && (
                  <>
                  <Separator />
                  <div className="space-y-4">
                       <h3 className="font-medium flex items-center gap-2 text-primary"><Landmark className="h-5 w-5"/> Bank Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="bank-name">Bank Name</Label>
                              <Input id="bank-name" placeholder="e.g., Global Trust Bank" />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="account-number">Account Number</Label>
                              <Input id="account-number" placeholder="e.g., 1234567890" />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="ifsc-code">IFSC/SWIFT Code</Label>
                              <Input id="ifsc-code" placeholder="e.g., GTB0123456" />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="account-holder">Account Holder Name</Label>
                              <Input id="account-holder" placeholder="e.g., John Doe" />
                          </div>
                      </div>
                  </div>
                  </>
                )}
            </CardContent>
            {user && (
              <CardFooter>
                  <Button>Save Financial Details</Button>
              </CardFooter>
            )}
        </Card>

        {/* KYC Card */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>
                Upload your documents to get your account fully verified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id-card">National ID Card</Label>
                <div className="flex items-center gap-4 rounded-md border p-3">
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">Click to upload or drag and drop</span>
                  <Button variant="outline" size="sm" asChild><Label htmlFor="id-card-file" className="cursor-pointer">Browse</Label></Button>
                  <Input id="id-card-file" type="file" className="sr-only" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id-card">Income Tax ID Card (e.g., PAN Card)</Label>
                 <div className="flex items-center gap-4 rounded-md border p-3">
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">Click to upload or drag and drop</span>
                  <Button variant="outline" size="sm" asChild><Label htmlFor="tax-id-file" className="cursor-pointer">Browse</Label></Button>
                  <Input id="tax-id-file" type="file" className="sr-only" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Submit for Verification</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
