
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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { votingPolls } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';


const geographies = [
    'World', 'Continental', 'Nation', 'State', 'Area', 'District', 'Taluka', 'Kasba/Block', 'Village', 'Street'
];

const agreementLevels = ['100%', '75%', '50%', '25%'];

const PollCard = ({ poll }: { poll: typeof votingPolls[0] }) => {
  // This is the original simple poll card, we can enhance it later if needed.
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="destructive">{poll.geography}</Badge>
          <Badge variant="secondary">{poll.category}</Badge>
        </div>
        <CardTitle className="mt-2">{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <h4 className="font-semibold">Current Results</h4>
          <div className="space-y-3">
            {poll.results.map((result) => (
              <div key={result.option} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{result.option}</span>
                  <span className="font-medium">{result.percentage}%</span>
                </div>
                <Progress value={result.percentage} className={cn("h-2", result.color)} />
              </div>
            ))}
          </div>
      </CardContent>
      <CardFooter>
        <Button>View Details & Vote</Button>
      </CardFooter>
    </Card>
  );
};


export default function VotingPage() {
  const [selectedGeography, setSelectedGeography] = useState('World');

  const getPollsByGeography = (geo: string) => {
    return votingPolls.filter(poll => poll.geography === geo);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold">Community Voting</h1>
            <p className="text-muted-foreground">
              Participate in governance by voting on proposals, issues, and elections.
            </p>
          </div>
           <Button asChild>
            <Link href="/forum">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Proposal
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="World" onValueChange={setSelectedGeography} className="w-full">
            <ScrollArea>
              <TabsList>
                {geographies.map(geo => (
                    <TabsTrigger key={geo} value={geo}>{geo}</TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {geographies.map(geo => {
                const polls = getPollsByGeography(geo);
                return (
                    <TabsContent key={geo} value={geo} className="mt-6">
                        {polls.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                                {polls.map(poll => <PollCard key={poll.id} poll={poll} />)}
                            </div>
                        ) : (
                            <Card className="mt-6">
                                <CardContent className="flex flex-col items-center justify-center text-center p-12">
                                    <h3 className="text-xl font-semibold">No Polls Found</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        There are currently no active polls for the "{geo}" level.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                )
            })}
        </Tabs>
      </div>
    </AppLayout>
  );
}
