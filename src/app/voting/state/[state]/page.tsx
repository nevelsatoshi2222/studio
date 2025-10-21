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
import { generateStateIssues, type StateIssuesOutput } from '@/ai/flows/state-issues-flow';
import { Loader2, Info } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useUser } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Poll = StateIssuesOutput[0];

const agreementLevels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

function PollCard({ poll, state }: { poll: Poll; state: string }) {
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
  // TODO: In a real app, user.state would come from a user profile in Firestore
  const canVote = !isUserLoading && user && user.state === state;

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
              You can only vote on issues for your own state. Your profile indicates you are from '{user.state}', but these polls are for {state}. Please complete your profile KYC to participate.
            </AlertDescription>
          </Alert>
        )}
         {!isUserLoading && !user && (
          <Alert className="w-full">
            <Info className="h-4 w-4" />
            <AlertTitle>Login Required</AlertTitle>
            <AlertDescription>
              Please log in and complete your profile KYC to vote on state issues.
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};


export default function StateIssuesPage() {
  const params = useParams();
  const state = params.state ? decodeURIComponent(params.state as string) : '';

  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState<StateIssuesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state) return;

    async function fetchIssues() {
      setIsLoading(true);
      setError(null);
      setIssues(null);
      try {
        const result = await generateStateIssues(state);
        setIssues(result);
      } catch (e: any) {
        setError('Failed to generate issues. Please try again.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIssues();
  }, [state]);

  return (
    <AppLayout>
      <div>
        <h1 className="font-headline text-3xl font-bold">Voting Polls for {state}</h1>
        <p className="text-muted-foreground">
            Vote on the top problems and potential solutions for {state}, generated by AI.
        </p>
      </div>

      {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg border mt-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating polls for {state}...</p>
          </div>
      )}
      
      {error && (
          <Card className="border-destructive mt-6">
              <CardHeader>
                  <CardTitle className="text-destructive">Error</CardTitle>
                  <CardDescription>{error}</CardDescription>
              </CardHeader>
          </Card>
      )}

      {issues && (
           <div className="space-y-6 mt-6">
              {issues.map((issue, index) => (
                  <PollCard key={index} poll={issue} state={state} />
              ))}
          </div>
      )}
    </AppLayout>
  );
}
