
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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { generateNationalIssues, type NationalIssuesOutput } from '@/ai/flows/national-issues-flow';
import { Loader2, Info } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useUser } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { publicGovernancePoll as basePublicGovernancePoll } from '@/lib/data';

const publicGovernancePoll = {
  title: basePublicGovernancePoll.title,
  description: basePublicGovernancePoll.description,
  solutions: basePublicGovernancePoll.solutions.map(s => s.text)
};

type Poll = NationalIssuesOutput[0];

const agreementLevels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

function PollCard({ poll, country }: { poll: Poll; country: string }) {
  const { user, isUserLoading } = useUser();
  const [selectedSolutions, setSelectedSolutions] = useState<Record<string, string>>({});

  const handleCheckboxChange = (solutionText: string, checked: boolean | 'indeterminate') => {
    setSelectedSolutions(prev => {
      const newSelected = { ...prev };
      if (checked) {
        newSelected[solutionText] = '100%'; // Default to 100% agreement
      } else {
        delete newSelected[solutionText];
      }
      return newSelected;
    });
  };

  const handleAgreementChange = (solutionText: string, agreement: string) => {
    setSelectedSolutions(prev => ({
      ...prev,
      [solutionText]: agreement,
    }));
  };
  
  const isAnySolutionSelected = Object.keys(selectedSolutions).length > 0;
  const canVote = !isUserLoading && user && user.country === country;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mt-2">{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Select solutions and your level of agreement:</h4>
          <div className="space-y-6">
            {poll.solutions.map((solution, index) => (
              <div key={`${poll.title}-sol-${index}`} className="p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-4">
                  <Checkbox
                    id={`${poll.title}-sol-${index}`}
                    onCheckedChange={(checked) => handleCheckboxChange(solution, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-4">
                    <Label htmlFor={`${poll.title}-sol-${index}`} className="font-normal text-base leading-snug">
                      {solution}
                    </Label>
                    {selectedSolutions[solution] && (
                        <div className="w-full sm:w-1/2">
                          <Select
                            value={selectedSolutions[solution]}
                            onValueChange={(value) => handleAgreementChange(solution, value)}
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
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <Button disabled={!isAnySolutionSelected || !canVote}>
          Submit Votes for "{poll.title}"
        </Button>
        {!isUserLoading && user && !canVote && (
          <Alert variant="destructive" className="w-full">
            <Info className="h-4 w-4" />
            <AlertTitle>Voting Restricted</AlertTitle>
            <AlertDescription>
              You can only vote on issues for your own country. Your profile country is set to '{user.country}', but these polls are for {country}. Please complete KYC on your profile page to participate in your country's governance.
            </AlertDescription>
          </Alert>
        )}
         {!isUserLoading && !user && (
          <Alert className="w-full">
            <Info className="h-4 w-4" />
            <AlertTitle>Login Required</AlertTitle>
            <AlertDescription>
              Please log in and complete your profile KYC to vote on national issues.
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};


export default function CountryIssuesPage() {
  const params = useParams();
  const country = params.country ? decodeURIComponent(params.country as string) : '';

  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState<NationalIssuesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!country) return;

    async function fetchIssues() {
      setIsLoading(true);
      setError(null);
      setIssues(null);
      try {
        const result = await generateNationalIssues(country);
        // Prepend the public governance poll to the AI-generated issues
        setIssues([publicGovernancePoll, ...result]);
      } catch (e: any) {
        setError('Failed to generate issues. Please try again.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIssues();
  }, [country]);

  return (
    <AppLayout>
        <div className="flex flex-col gap-6">
            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg border">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <h1 className="font-headline text-2xl font-bold">Generating Polls for {country}</h1>
                    <p className="text-muted-foreground">Please wait while our AI analyzes the top national issues...</p>
                </div>
            )}
            
            {error && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error Generating Polls</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            )}

            {issues && (
                 <div className="space-y-6">
                    <h1 className="font-headline text-3xl font-bold">Voting Polls for {country}</h1>
                    <p className="text-muted-foreground">
                        Vote on the top national problems and potential solutions for {country}, including the foundational proposal for a new constitution.
                    </p>
                    {issues.map((issue, index) => (
                        <PollCard key={index} poll={issue} country={country} />
                    ))}
                </div>
            )}
        </div>
    </AppLayout>
  );
}
