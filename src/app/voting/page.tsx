
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
import { votingPolls, indiaIssuesPolls } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import type { IndiaIssuePoll } from '@/lib/types';


const geographies = [
    'World', 'Continental', 'India Issues', 'Nation', 'State', 'Area', 'District', 'Taluka', 'Kasba/Block', 'Village', 'Street'
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

const IndiaIssuePollCard = ({ poll }: { poll: IndiaIssuePoll }) => {
  const [selectedSolutions, setSelectedSolutions] = useState<Record<string, string>>({});

  const handleCheckboxChange = (solutionId: string, checked: boolean | 'indeterminate') => {
    setSelectedSolutions(prev => {
      const newSelected = { ...prev };
      if (checked) {
        newSelected[solutionId] = '100%'; // Default to 100% agreement
      } else {
        delete newSelected[solutionId];
      }
      return newSelected;
    });
  };

  const handleAgreementChange = (solutionId: string, agreement: string) => {
    setSelectedSolutions(prev => ({
      ...prev,
      [solutionId]: agreement,
    }));
  };
  
  const isAnySolutionSelected = Object.keys(selectedSolutions).length > 0;

  return (
    <Card className="col-span-1 lg:col-span-2">
       <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="destructive">India Issues</Badge>
        </div>
        <CardTitle className="mt-2">{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Select solutions and your level of agreement:</h4>
          <div className="space-y-6">
            {poll.solutions.map(solution => (
              <div key={solution.id} className="p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    id={solution.id}
                    onCheckedChange={(checked) => handleCheckboxChange(solution.id, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-4">
                    <Label htmlFor={solution.id} className="font-normal text-base leading-snug">
                      {solution.text}
                    </Label>
                    {selectedSolutions[solution.id] && (
                        <div className="w-full sm:w-1/2">
                          <Select 
                            value={selectedSolutions[solution.id]} 
                            onValueChange={(value) => handleAgreementChange(solution.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Set agreement level" />
                            </SelectTrigger>
                            <SelectContent>
                              {agreementLevels.map(level => (
                                <SelectItem key={level} value={level}>{level} Agreement</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
            <h4 className="font-semibold">Community Consensus (Live Results)</h4>
            {poll.solutions.map(solution => (
                <div key={`result-${solution.id}`} className="p-4 border rounded-lg">
                    <p className="font-medium mb-3">{solution.text}</p>
                    <div className="space-y-2">
                        {solution.results.map(result => (
                             <div key={result.level} className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{result.level}</span>
                                    <span>{result.percentage}%</span>
                                </div>
                                <Progress value={result.percentage} className={cn("h-1.5", result.color)} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={!isAnySolutionSelected}>
          Submit Votes
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function VotingPage() {
  const [selectedGeography, setSelectedGeography] = useState('World');

  const getPollsByGeography = (geo: string) => {
    if (geo === 'India Issues') {
        return indiaIssuesPolls;
    }
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
        
        <Tabs defaultValue="India Issues" onValueChange={setSelectedGeography} className="w-full">
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
                                {geo === 'India Issues'
                                    ? (polls as IndiaIssuePoll[]).map(poll => <IndiaIssuePollCard key={poll.id} poll={poll} />)
                                    : (polls as typeof votingPolls).map(poll => <PollCard key={poll.id} poll={poll} />)
                                }
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
