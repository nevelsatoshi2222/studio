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
import { Droplets, Wifi, Book, Shield } from 'lucide-react'; // FIXED: Water → Droplets

const agreementLevels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

const talukaIssues = [
  {
    id: 'water-supply',
    title: 'Water Supply System',
    description: 'Improve drinking water availability and distribution across taluka',
    icon: Droplets, // FIXED: Water → Droplets
    solutions: [
      { text: 'Install new water purification plants' },
      { text: 'Repair and maintain existing water pipelines' },
      { text: 'Build overhead water tanks in villages' },
      { text: 'Groundwater recharge projects' }
    ]
  },
  {
    id: 'digital-connectivity',
    title: 'Digital Connectivity',
    description: 'Enhance internet and digital infrastructure in the taluka',
    icon: Wifi,
    solutions: [
      { text: 'Install high-speed internet towers' },
      { text: 'Establish digital literacy centers' },
      { text: 'Provide free WiFi in public spaces' },
      { text: 'Digital service centers for government services' }
    ]
  },
  {
    id: 'education-support',
    title: 'Education Support Programs',
    description: 'Support educational initiatives at taluka level',
    icon: Book,
    solutions: [
      { text: 'After-school tutoring programs' },
      { text: 'Library and reading room development' },
      { text: 'Computer education in all schools' },
      { text: 'Sports and cultural activities funding' }
    ]
  },
  {
    id: 'public-safety',
    title: 'Public Safety & Security',
    description: 'Enhance safety measures and emergency services',
    icon: Shield,
    solutions: [
      { text: 'Install CCTV cameras in public areas' },
      { text: 'Establish emergency response teams' },
      { text: 'Fire safety equipment in public buildings' },
      { text: 'Community policing initiatives' }
    ]
  }
];

function TalukaPollCard({ poll }: { poll: typeof talukaIssues[0] }) {
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
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
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
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg"
        >
          Submit Votes for "{poll.title}"
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function TalukaVotingPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🏛️ Taluka/Block Level Voting
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            Vote on sub-district level projects and community initiatives
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            Select solutions and indicate your agreement level (0%-100%)
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            {talukaIssues.map((issue) => (
                <TalukaPollCard key={issue.id} poll={issue} />
            ))}
        </div>
      </div>
    </AppLayout>
  );
}