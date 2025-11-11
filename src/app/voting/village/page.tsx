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
import { Users, Heart, Trees, Activity } from 'lucide-react'; // FIXED: Tree → Trees

const agreementLevels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

const villageIssues = [
  {
    id: 'community-center',
    title: 'Community Center Development',
    description: 'Create spaces for community gatherings and activities',
    icon: Users,
    solutions: [
      { text: 'Build multi-purpose community hall' },
      { text: 'Develop outdoor gathering spaces' },
      { text: 'Create childrens play area' },
      { text: 'Establish senior citizen meeting point' }
    ]
  },
  {
    id: 'health-wellness',
    title: 'Health & Wellness Programs',
    description: 'Improve healthcare access and wellness initiatives in the village',
    icon: Heart,
    solutions: [
      { text: 'Regular health check-up camps' },
      { text: 'Yoga and meditation classes' },
      { text: 'Clean drinking water initiatives' },
      { text: 'Sanitation and hygiene awareness' }
    ]
  },
  {
    id: 'environment-conservation',
    title: 'Environment Conservation',
    description: 'Protect and enhance the village natural environment',
    icon: Trees, // FIXED: Tree → Trees
    solutions: [
      { text: 'Tree plantation drives' },
      { text: 'Waste management and recycling' },
      { text: 'Protection of water bodies' },
      { text: 'Organic farming promotion' }
    ]
  },
  {
    id: 'recreation-sports',
    title: 'Recreation & Sports Facilities',
    description: 'Develop sports and recreational infrastructure',
    icon: Activity,
    solutions: [
      { text: 'Build sports ground with equipment' },
      { text: 'Organize village sports tournaments' },
      { text: 'Create walking and jogging tracks' },
      { text: 'Develop public gardens and parks' }
    ]
  }
];

function VillagePollCard({ poll }: { poll: typeof villageIssues[0] }) {
  const [selectedSolutions, setSelectedSolutions] = useState<Record<string, string>>({});

  const handleCheckboxChange = (solutionText: string, checked: boolean | 'indeterminate') => {
    setSelectedSolutions(prev => {
      const newSelected = { ...prev };
      if (checked) {
        newSelected[solutionText] = '100%';
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
          <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
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
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 text-lg"
        >
          Submit Votes for "{poll.title}"
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function VillageVotingPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            🏡 Village/Ward Level Voting
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            Vote on village-specific community projects and initiatives
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            Select solutions and indicate your agreement level (0%-100%)
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            {villageIssues.map((issue) => (
                <VillagePollCard key={issue.id} poll={issue} />
            ))}
        </div>
      </div>
    </AppLayout>
  );
}