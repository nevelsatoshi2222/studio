// src/app/voting/street/page.tsx
'use client';
import { useState } from 'react';
import  AppLayout  from '@/components/app-layout';
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
import { Lightbulb, Droplets, Trash2, Trees } from 'lucide-react';

const agreementLevels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

// YOUR STREET ISSUES (only the questions and solutions)
const streetIssues = [
  {
    id: 'street-lights',
    title: 'Street Lighting Improvement',
    description: 'Install new LED street lights and improve existing lighting infrastructure',
    icon: Lightbulb,
    solutions: [
      { text: 'Install LED Lights' },
      { text: 'Solar Powered Lights' },
      { text: 'Motion Sensor Lights' }
    ]
  },
  {
    id: 'drainage-system',
    title: 'Drainage System Upgrade',
    description: 'Clear clogged drains and install new drainage pipes to prevent flooding',
    icon: Droplets,
    solutions: [
      { text: 'Underground Drainage' },
      { text: 'Surface Water Channels' },
      { text: 'Rainwater Harvesting' }
    ]
  },
  {
    id: 'waste-management',
    title: 'Smart Waste Management',
    description: 'Install smart bins and improve garbage collection frequency',
    icon: Trash2,
    solutions: [
      { text: 'Smart Sensor Bins' },
      { text: 'Daily Collection' },
      { text: 'Recycling Program' }
    ]
  },
  {
    id: 'clean-water',
    title: 'Free RO Water Plant',
    description: 'Install community RO water plant for free clean drinking water',
    icon: Trees,
    solutions: [
      { text: 'Central RO Plant' },
      { text: 'Multiple Small Units' },
      { text: 'Home Filter Subsidy' }
    ]
  }
];

function StreetPollCard({ poll }: { poll: typeof streetIssues[0] }) {
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
  const IconComponent = poll.icon;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">{poll.title}</CardTitle>
            <CardDescription className="text-base mt-2">{poll.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-4 text-lg">Select solutions and your level of agreement:</h4>
          <div className="space-y-4">
            {poll.solutions.map((solution, index) => (
              <div key={`${poll.id}-sol-${index}`} className="p-4 border-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    id={`${poll.id}-sol-${index}`}
                    onCheckedChange={(checked) => handleCheckboxChange(solution.text, checked)}
                    className="mt-1 h-5 w-5"
                  />
                  <div className="flex-1 space-y-4">
                    <Label htmlFor={`${poll.id}-sol-${index}`} className="font-semibold text-base leading-snug cursor-pointer">
                      {solution.text}
                    </Label>
                    {selectedSolutions[solution.text] && (
                        <div className="w-full sm:w-1/2">
                          <Select 
                            value={selectedSolutions[solution.text]} 
                            onValueChange={(value) => handleAgreementChange(solution.text, value)}
                          >
                            <SelectTrigger className="border-2">
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
      
      <CardFooter>
        <Button 
          disabled={!isAnySolutionSelected}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
        >
          Submit Votes for "{poll.title}"
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function StreetVotingPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🏘️ Street Community Voting
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            Vote on solutions for our street's most pressing local issues
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            Select solutions and indicate your agreement level (0%-100%)
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            {streetIssues.map((issue) => (
                <StreetPollCard key={issue.id} poll={issue} />
            ))}
        </div>
      </div>
    </AppLayout>
  );
}