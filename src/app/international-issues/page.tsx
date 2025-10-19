'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Globe, ChevronRight } from 'lucide-react';

const issues = [
  { href: '/issues/climate-change', label: 'Climate Change' },
  { href: '/issues/global-health', label: 'Global Health' },
  { href: '/issues/cybersecurity', label: 'Cybersecurity' },
  { href: '/issues/refugee-crisis', label: 'Refugee Crisis' },
  { href: '/issues/trade-disputes', label: 'Trade Disputes' },
];

export default function InternationalIssuesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">International Issues</h1>
          <p className="text-muted-foreground">
            Explore and discuss pressing global challenges.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-headline">Global Discussion Topics</CardTitle>
                <CardDescription>Select an issue to view related proposals, discussions, and voting polls.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This section is dedicated to addressing the most critical issues facing the international community. Your participation through proposals and voting can help shape global policy and direct funding toward effective solutions.
            </p>
            <div className="space-y-2">
                {issues.map((issue) => (
                    <Link href="#" key={issue.href} className="block">
                        <Card className="hover:bg-accent hover:border-primary transition-colors">
                            <CardContent className="p-4 flex justify-between items-center">
                                <span className="font-medium">{issue.label}</span>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
