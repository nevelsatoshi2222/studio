import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NationalIssuesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">National Issues</h1>
          <p className="text-muted-foreground">
            Tackling country-specific challenges.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This page is under construction.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content for national issues will be available here shortly.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
