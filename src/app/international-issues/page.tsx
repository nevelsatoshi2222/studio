
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function InternationalIssuesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">International Issues</h1>
          <p className="text-muted-foreground">
            Addressing global challenges through community proposals.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This page is under construction.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content for international issues will be available here shortly.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
