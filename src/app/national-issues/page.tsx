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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { generateNationalIssues, type NationalIssuesOutput } from '@/ai/flows/national-issues-flow';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { countries } from '@/lib/data';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

const formSchema = z.object({
  country: z.string().min(2, {
    message: "You must select a country.",
  }),
});

type CountryFormValues = z.infer<typeof formSchema>;
type Poll = NationalIssuesOutput[0];

const agreementLevels = ['100%', '75%', '50%', '25%'];

function PollCard({ poll }: { poll: Poll }) {
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

  return (
    <Card className="col-span-1 lg:col-span-2">
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
      <CardFooter>
        <Button disabled={!isAnySolutionSelected}>
          Submit Votes for "{poll.title}"
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function NationalIssuesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [issues, setIssues] = useState<NationalIssuesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { country: '' },
  });

  async function onSubmit(values: CountryFormValues) {
    setIsLoading(true);
    setError(null);
    setIssues(null);
    try {
      const result = await generateNationalIssues(values.country);
      setIssues(result);
    } catch (e: any) {
      setError('Failed to generate issues. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">National Issues</h1>
          <p className="text-muted-foreground">
            Tackling country-specific challenges through community voting.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate National Polls</CardTitle>
            <CardDescription>Select a country to generate a voting page for its top 25 national problems and potential solutions.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Country Name</FormLabel>
                       <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? countries.find(
                                    (country) => country.label === field.value
                                  )?.label
                                : "Select country"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {countries.map((country) => (
                                <CommandItem
                                  value={country.label}
                                  key={country.value}
                                  onSelect={() => {
                                    form.setValue("country", country.label)
                                    form.handleSubmit(onSubmit)();
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      country.label === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {country.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </form>
          </Form>
        </Card>
        
        {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating polls for {form.getValues('country')}...</p>
            </div>
        )}
        
        {error && (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Error</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
            </Card>
        )}

        {issues && (
             <div className="space-y-6">
                <h2 className="font-headline text-2xl font-bold">Voting Polls for {form.getValues('country')}</h2>
                {issues.map((issue, index) => (
                    <PollCard key={index} poll={issue} />
                ))}
            </div>
        )}

      </div>
    </AppLayout>
  );
}
