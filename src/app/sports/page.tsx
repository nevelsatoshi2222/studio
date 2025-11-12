'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Globe, Rocket, Award } from 'lucide-react';
import React from 'react';
import { sportsList } from '@/lib/data';

const competitionPhases = [
    { phase: 1, name: "Online Qualification", description: "Submit your scores, videos, or highlights online to enter the initial qualification round.", icon: Globe },
    { phase: 2, name: "Continental Finals", description: "Top qualifiers from each region compete in continental championships, held live and streamed globally.", icon: Rocket },
    { phase: 3, name: "Global Grand Event", description: "The world's best meet in a final showdown, a massive live and metaverse event to crown the world champion.", icon: Award },
];

export default function SportsCompetitionPage() {
  return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">The World Talent Championship: Sports</h1>
          <p className="text-muted-foreground">
            From local talent to global legends: compete, win, and get sponsored.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-headline mt-4">Competition Structure</CardTitle>
            <CardDescription>A multi-phase tournament designed to discover and elevate talent from around the world.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-3">
            {competitionPhases.map(phase => {
                const Icon = phase.icon;
                return (
                    <div key={phase.phase} className="flex flex-col items-center text-center p-4 rounded-lg">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary">
                            <Icon className="h-8 w-8" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">Phase {phase.phase}: {phase.name}</h3>
                        <p className="mt-1 text-muted-foreground">
                           {phase.description}
                        </p>
                    </div>
                );
            })}
          </CardContent>
          <CardFooter className="justify-center">
              <Button size="lg">Register for the Competition</Button>
          </CardFooter>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Competition Categories</CardTitle>
                <CardDescription>We host competitions across 25 major global sports.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sportsList.map((sport) => (
                    <div key={sport.id} className="p-4 rounded-lg border bg-card/50">
                        <h3 className="font-semibold text-lg">{sport.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{sport.description}</p>
                    </div>
                ))}
            </CardContent>
        </Card>

      </div>
  );
}
