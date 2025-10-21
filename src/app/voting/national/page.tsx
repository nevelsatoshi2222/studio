
'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countries } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function NationalIssuesPage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const handleNavigate = () => {
    if (selectedCountry) {
      router.push(`/voting/national/${encodeURIComponent(selectedCountry)}`);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">National Issues</h1>
          <p className="text-muted-foreground">
            Select a country to view and vote on its top national challenges.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select a Country</CardTitle>
            <CardDescription>
              Choose a country from the list below to generate its voting page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row">
            <Select onValueChange={setSelectedCountry} value={selectedCountry}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a country..." />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.label}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleNavigate} disabled={!selectedCountry}>
              View Issues
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
