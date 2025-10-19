
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AffiliateMarketingPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Affiliate Marketing</h1>
          <p className="text-muted-foreground">
            Earn rewards by promoting the platform.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This page is under construction.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content for affiliate marketing will be available here shortly.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
