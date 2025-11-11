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
import { School, Hospital, Car, Factory } from 'lucide-react'; // FIXED: Road → Car

const agreementLevels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

const districtIssues = [
  {
    id: 'education-facilities',
    title: 'Education Facilities Upgrade',
    description: 'Improve schools and educational infrastructure across the district',
    icon: School,
    solutions: [
      { text: 'Build 5 new government schools in rural areas' },
      { text: 'Digital classroom setup in existing schools' },
      { text: 'Scholarship programs for underprivileged students' },
      { text: 'Vocational training centers for skill development' }
    ]
  },
  {
    id: 'healthcare-infrastructure',
    title: 'Healthcare Infrastructure',
    description: 'Enhance medical facilities and healthcare services in the district',
    icon: Hospital,
    solutions: [
      { text: 'Upgrade district hospital with modern equipment' },
      { text: 'Establish 24/7 emergency care centers' },
      { text: 'Mobile medical units for remote villages' },
      { text: 'Specialist doctor recruitment program' }
    ]
  },
  {
    id: 'road-connectivity',
    title: 'Road Connectivity Project',
    description: 'Improve road networks and transportation infrastructure',
    icon: Car, // FIXED: Road → Car
    solutions: [
      { text: 'Pave all major district roads with asphalt' },
      { text: 'Build bridges over rivers and streams' },
      { text: 'Install street lighting on all major roads' },
      { text: 'Develop public transportation system' }
    ]
  },
  {
    id: 'industrial-development',
    title: 'Industrial Development',
    description: 'Promote economic growth through industrial projects',
    icon: Factory,
    solutions: [
      { text: 'Establish industrial zones with tax benefits' },
      { text: 'Support small and medium enterprises (SMEs)' },
      { text: 'Develop agricultural processing units' },
      { text: 'Create employment generation programs' }
    ]
  }
];

function DistrictPollCard({ poll }: { poll: typeof districtIssues[0] }) {
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
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
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
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg"
        >
          Submit Votes for "{poll.title}"
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function DistrictVotingPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            🗺️ District Level Voting
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            Vote on district-wide development projects and policies
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            Select solutions and indicate your agreement level (0%-100%)
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            {districtIssues.map((issue) => (
                <DistrictPollCard key={issue.id} poll={issue} />
            ))}
        </div>
      </div>
    </AppLayout>
  );
}