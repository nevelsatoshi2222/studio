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
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

const jobPostings = [
  {
    title: "Sales Manager",
    description: "10 posts available for every Taluka.",
  },
  {
    title: "Affiliate Marketing Job",
    description: "Commission-based earnings.",
  },
  {
    title: "Influencer Marketing",
    description: "Commission-based earnings.",
  },
  {
    title: "Franchise Opportunities",
    description: "120 different types of franchises available.",
  },
  {
    title: "International Army Soldier",
    description: "Serve in a global peacekeeping force.",
  },
  {
    title: "Anti-Corruption Officer",
    description: "Earn rewards on a case-by-case basis.",
  },
];


export default function JobsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold">Jobs & Career</h1>
            <p className="text-muted-foreground">
              Find opportunities within the IBC ecosystem.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Job Post
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobPostings.map((job, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full">Apply Now</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    </AppLayout>
  );
}
