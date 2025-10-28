

'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { ArrowRight, Globe, Landmark, Building, Map, MapPin, Home } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const votingLevels = [
  {
    title: 'International Issues',
    description: 'Vote on solutions for global challenges like climate change, health, and security.',
    href: '/voting/international',
    icon: Globe,
  },
  {
    title: 'National Issues',
    description: 'Participate in governance by selecting your country and voting on its top 25 issues.',
    href: '/voting/national',
    icon: Landmark,
  },
   {
    title: 'State Issues',
    description: 'Engage with proposals and challenges specific to your state.',
    href: '/voting/state',
    icon: Building,
  },
];

const localVotingLevels = [
    { title: 'District', href: '/voting/district', icon: Map, description: "Vote on district-wide policies and budgets." },
    { title: 'Taluka / Block', href: '/voting/taluka', icon: MapPin, description: "Address issues at the sub-district level." },
    { title: 'Village / Ward', href: '/voting/village', icon: Home, description: "Manage community-specific projects." },
    { title: 'Street', href: '/voting/street', icon: Home, description: "Handle hyper-local maintenance and improvements." },
]

export default function VotingHubPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Community Voting Hub</h1>
          <p className="text-muted-foreground">
            Select a governance level to view proposals and cast your vote.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {votingLevels.map((level) => {
            const Icon = level.icon;
            return (
              <Link href={level.href} key={level.title} className="group">
                <Card className="h-full hover:border-primary transition-colors hover:shadow-lg flex flex-col">
                  <CardHeader className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                    <CardTitle className="pt-4">{level.title}</CardTitle>
                    <CardDescription>{level.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Local Voting</CardTitle>
                <CardDescription>Engage in governance at the district, taluka, village, and street levels. This feature is coming soon.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                {localVotingLevels.map(level => {
                    const Icon = level.icon;
                    return (
                        <div key={level.title} className="p-4 rounded-lg border bg-muted/50 flex items-start gap-4">
                             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mt-1 flex-shrink-0">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">{level.title}</h4>
                                <p className="text-sm text-muted-foreground">{level.description}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
            <CardFooter>
                <Button disabled>Go to Local Voting (Coming Soon)</Button>
            </CardFooter>
        </Card>

      </div>
    </AppLayout>
  );
}
