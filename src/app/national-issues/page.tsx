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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { countries } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function NationalIssuesPage() {
  const router = useRouter();

  const handleCountrySelect = (countryLabel: string) => {
    // Navigate to the dynamic route for the selected country
    router.push(`/national-issues/${encodeURIComponent(countryLabel)}`);
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
          <CardContent>
            <Command className="rounded-lg border shadow-md">
              <CommandInput placeholder="Search for a country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.value}
                      onSelect={() => handleCountrySelect(country.label)}
                      className="cursor-pointer flex justify-between items-center"
                    >
                      <span>{country.label}</span>
                      <ChevronRight className="h-4 w-4" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
