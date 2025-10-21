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
import { Loader2, Info } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useUser } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type PollSolution = {
  text: string;
};

type Poll = {
  title: string;
  description: string;
  solutions: PollSolution[];
};

const agreementLevels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

const gujaratIssues: Poll[] = [
    {
        title: "Water Scarcity & Management",
        description: "Large parts of Gujarat, especially Saurashtra and Kutch, are drought-prone, facing severe water shortages for agriculture and drinking.",
        solutions: [
            { text: "Expand the Narmada canal network to reach the most arid regions." },
            { text: "Promote mandatory rainwater harvesting and micro-irrigation (drip, sprinklers) with subsidies." },
            { text: "Invest in large-scale desalination plants along the coastline." },
            { text: "Revive and interlink traditional water bodies (talavs) to recharge groundwater." }
        ]
    },
    {
        title: "Employment for Youth",
        description: "Despite being an industrial hub, there's a mismatch between the skills of the youth and the jobs available, leading to underemployment.",
        solutions: [
            { text: "Launch skill development centers in partnership with industries for job-specific training." },
            { text: "Create a state-backed venture capital fund to support local startups and entrepreneurs." },
            { text: "Reform the curriculum in technical institutes (ITIs) to align with modern industry needs." }
        ]
    },
    {
        title: "Agricultural Distress",
        description: "Farmers face challenges like fluctuating market prices for cash crops (like cotton and groundnut), high input costs, and crop damage from unpredictable weather.",
        solutions: [
            { text: "Strengthen the MSP (Minimum Support Price) procurement process for key crops." },
            { text: "Promote crop diversification and horticulture, providing farmers with alternative income streams." },
            { text: "Establish a network of cold storages and food processing units at the taluka level." }
        ]
    },
    {
        title: "Industrial Pollution",
        description: "Industrial zones in the 'Golden Corridor' (Vapi to Mehsana) face severe air and water pollution, affecting public health.",
        solutions: [
            { text: "Enforce a 'zero liquid discharge' policy for all chemical and textile industries." },
            { text: "Set up real-time, online pollution monitoring systems for industrial estates." },
            { text: "Incentivize industries to adopt green technologies and renewable energy sources." }
        ]
    },
    {
        title: "Urban Infrastructure Strain",
        description: "Rapid urbanization in cities like Ahmedabad, Surat, and Rajkot is putting immense pressure on housing, transport, and waste management.",
        solutions: [
            { text: "Develop satellite towns with robust connectivity to major cities to decentralize population growth." },
            { text: "Invest in expanding public transportation like metro and electric bus networks." },
            { text: "Implement a city-wide solid waste segregation and recycling program." }
        ]
    }
];

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
  const canVote = !isUserLoading && user && user.country === state;

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
                    onCheckedChange={(checked) => handleCheckboxChange(solution.text, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-4">
                    <Label htmlFor={`${poll.title}-sol-${index}`} className="font-normal text-base leading-snug">
                      {solution.text}
                    </Label>
                    {selectedSolutions[solution.text] && (
                        <div className="w-full sm:w-1/2">
                          <Select
                            value={selectedSolutions[solution.text]}
                            onValueChange={(value) => handleAgreementChange(solution.text, value)}
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
              You can only vote on issues for your own state. Your profile indicates you are from '{user.country}', but these polls are for {state}. Please complete your profile KYC to participate.
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

  // For this example, we are hardcoding the issues for Gujarat.
  // A more dynamic app might fetch these based on the `state` param.
  const issues = state.toLowerCase() === 'gujarat' ? gujaratIssues : null;

  return (
    <AppLayout>
        {!issues && (
            <Card>
                <CardHeader>
                    <CardTitle>No Polls Available</CardTitle>
                    <CardDescription>There are currently no voting polls available for {state}.</CardDescription>
                </CardHeader>
            </Card>
        )}

        {issues && (
             <div className="space-y-6">
                <h1 className="font-headline text-3xl font-bold">Voting Polls for {state}</h1>
                <p className="text-muted-foreground">
                    Vote on the top problems and potential solutions for {state}.
                </p>
                {issues.map((issue, index) => (
                    <PollCard key={index} poll={issue} state={state} />
                ))}
            </div>
        )}
    </AppLayout>
  );
}
