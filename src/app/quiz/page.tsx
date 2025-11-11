
'use client';
import AppLayout from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Ticket, Users, ArrowRight, TrendingUp, HandHeart, PlusCircle } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const prizeLevels = [
    { level: 1, name: "Street Level", groupSize: 10, prize: "1 Quiz Coin", description: "Winners advance from groups of 10." },
    { level: 2, name: "Village/Ward Level", groupSize: 10, prize: "5 Quiz Coins", description: "10 winners from Level 1 compete." },
    { level: 3, name: "Kasba / Block Level", groupSize: 10, prize: "25 Quiz Coins", description: "10 winners from Level 2 compete." },
    { level: 4, name: "Taluka/City Level", groupSize: 10, prize: "125 Quiz Coins", description: "10 winners from Level 3 compete." },
    { level: 5, name: "District Level", groupSize: 10, prize: "1,250 Quiz Coins", description: "10 winners from Level 4 compete." },
    { level: 6, name: "10 District Level", groupSize: 10, prize: "12,500 Quiz Coins", description: "10 winners from Level 5 compete." },
    { level: 7, name: "State Level", groupSize: 10, prize: "125,000 Quiz Coins", description: "10 winners from Level 6 compete." },
    { level: 8, name: "National Level", groupSize: 10, prize: "1.25 Million Quiz Coins", description: "10 winners from Level 7 compete." },
    { level: 9, name: "Continental Level", groupSize: 10, prize: "12.5 Million Quiz Coins", description: "10 winners from Level 8 compete." },
    { level: 10, name: "Global Championship", groupSize: 10, prize: "125 Million Quiz Coins", description: "The final showdown between the world's best." },
];

export default function QuizCompetitionPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold">The Global Quiz Tournament</h1>
            <p className="text-muted-foreground">
              From your street to the world stage: prove your knowledge and win big.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Quiz Question
            </Link>
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-headline mt-4">How It Works</CardTitle>
            <CardDescription>A weekly competition where knowledge is power.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4 rounded-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary">
                    <Ticket className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">1. Get Your Quiz Coin</h3>
                <p className="mt-1 text-muted-foreground">
                    Purchase one "Quiz Coin" for approximately $10 USD to gain entry for the entire week's competition.
                </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary">
                    <Users className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">2. Join a Group</h3>
                <p className="mt-1 text-muted-foreground">
                    You'll be placed in a Level 1 group with 9 other participants from your local area to start the challenge.
                </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary">
                    <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">3. Climb the Ranks</h3>
                <p className="mt-1 text-muted-foreground">
                    Win your group to advance to the next level. The competition gets tougher, and the prizes get bigger!
                </p>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
              <Button size="lg">Purchase Quiz Coin & Enter Now</Button>
          </CardFooter>
        </Card>
        
        <div>
            <h2 className="font-headline text-2xl font-bold text-center mb-6">Tournament Levels & Prize Structure</h2>
            <div className="relative flex flex-col items-center gap-8">
                {prizeLevels.map((level, index) => (
                    <React.Fragment key={level.level}>
                        <Card className="w-full max-w-4xl shadow-lg">
                            <CardHeader className="grid grid-cols-3 items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <Badge className="text-lg py-1 px-3">Level {level.level}</Badge>
                                    <h3 className="text-xl font-semibold hidden md:block">{level.name}</h3>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-primary text-xl">{level.prize}</p>
                                    <p className="text-xs text-muted-foreground">Guaranteed Prize for Winner</p>
                                </div>
                                <div className="text-right text-sm text-muted-foreground hidden md:block">
                                    <p>{level.description}</p>
                                </div>
                            </CardHeader>
                        </Card>
                        {index < prizeLevels.length - 1 && (
                            <ArrowRight className="h-8 w-8 text-muted-foreground/50 -rotate-90 md:hidden" />
                        )}
                   </React.Fragment>
                ))}
            </div>
        </div>

        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                        <HandHeart className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-headline">More Than a Game</CardTitle>
                        <CardDescription>Every entry contributes to a better world.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Even if you don't win the grand prize, every participant receives a consolation prize nearly equivalent to their entry fee. More importantly, all surplus funds generated from the quiz competition are automatically allocated to our global cause initiatives. By playing, you are directly contributing to peace, anti-corruption, and environmental projects worldwide.
                </p>
            </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
