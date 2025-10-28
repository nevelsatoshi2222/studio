

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
                <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
                  <CardHeader>
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

      </div>
    </AppLayout>
  );
}

    