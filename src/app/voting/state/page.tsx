

'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// The indiaGeography data has been removed to fix a build error.
// This component now shows a placeholder message.
// You can add the state data back to src/lib/data.ts when it's corrected.
const statesOfIndia: { name: string }[] = [
    // Example data
    { name: 'Maharashtra' },
    { name: 'Gujarat' },
    { name: 'Karnataka' },
    { name: 'Tamil Nadu' },
    { name: 'Delhi' }
];

export default function StateVotingSelectionPage() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<string>('');

  const handleNavigate = () => {
    if (selectedState) {
      router.push(`/voting/state/${encodeURIComponent(selectedState)}`);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">State Level Voting</h1>
          <p className="text-muted-foreground">
            Select a state to engage with its proposals and challenges.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Select a State</CardTitle>
            <CardDescription>
              Choose a state from the list below to view its voting page. The full list is temporarily unavailable.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row">
            <Select onValueChange={setSelectedState} value={selectedState}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a state..." />
              </SelectTrigger>
              <SelectContent>
                {statesOfIndia.map((state) => (
                  <SelectItem key={state.name} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleNavigate} disabled={!selectedState}>
              View Issues
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

    