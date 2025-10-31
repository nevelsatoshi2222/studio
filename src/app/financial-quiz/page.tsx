
'use client';
import { useState } from 'react';
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
import { Award } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc, increment } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const quizPolls = [
    {
      question: "What is India's approximate Union budget for the fiscal year 2024-2025?",
      options: [
        "₹5 Lakh Crore",
        "₹50 Lakh Crore",
        "₹20 Lakh Crore",
        "₹50 Crore"
      ],
      explanation: "India's interim budget for 2024-25 estimates total expenditure at ₹47.66 lakh crore, making ₹50 Lakh Crore the closest approximation."
    },
    {
      question: "If India's entire budget were distributed equally among its ~1.4 billion people, approximately how much would each person receive?",
      options: [
        "₹10,000",
        "₹20,000",
        "₹25,000",
        "₹35,000"
      ],
      explanation: "Calculation: ₹47.66 lakh crore / 140 crore people ≈ ₹34,042 per person. ₹35,000 is the nearest option."
    },
    {
      question: "Based on the previous question, how much would an average family of 4 receive if the entire budget were distributed?",
      options: [
        "₹70,000 or below",
        "₹105,000",
        "₹140,000",
        "₹175,000 or above"
      ],
      explanation: "Calculation: Approximately ₹35,000 per person * 4 people = ₹140,000."
    },
    {
      question: "How much revenue does the Indian government earn from petroleum products annually (Centre + State taxes combined)?",
      options: [
        "₹2 Lakh Crore or below",
        "₹5 Lakh Crore",
        "₹10 Lakh Crore",
        "₹12 Lakh Crore or above"
      ],
      explanation: "The combined revenue from taxes on petroleum products for the Centre and States has been consistently around ₹9-10 lakh crore in recent years."
    },
    {
        question: "What is the approximate 'on-paper' revenue for the Indian government from mineral extraction (e.g., coal, iron ore) as per budget documents?",
        options: [
            "₹10,000 Crore",
            "₹70,000 Crore",
            "₹5,000 Crore",
            "₹25 Lakh Crore",
        ],
        explanation: "Official receipts from 'Mines and Minerals' are in the range of ₹70,000-₹80,000 crore, a figure far lower than the potential market value."
    },
    {
        question: "What is the approximate annual revenue collected from Goods and Services Tax (GST)?",
        options: [
            "₹1 Lakh Crore",
            "₹12 Lakh Crore",
            "₹15 Lakh Crore",
            "₹20 Lakh Crore or more"
        ],
        explanation: "GST collections have been robust, with the monthly average crossing ₹1.6 lakh crore, leading to an annual figure well over ₹20 lakh crore."
    },
    {
        question: "How much does the Indian government collect annually from Corporation Tax (tax on company profits)?",
        options: [
            "₹2 Lakh Crore",
            "₹5 Lakh Crore",
            "₹10 Lakh Crore",
            "₹20 Lakh Crore or more"
        ],
        explanation: "Corporation tax is a major source of revenue, with collections estimated to be around ₹10 lakh crore for the fiscal year."
    },
    {
        question: "If India's mineral wealth were sold at international market value instead of 'on-paper' royalty value, what could be the potential income?",
        options: [
            "₹1,00,000 Crore",
            "₹2,00,000 Crore",
            "₹5,00,000 Crore",
            "₹25 Lakh Crore and above"
        ],
        explanation: "This is a conceptual question. Experts suggest the actual market value of extracted minerals is orders of magnitude higher than the royalty collected, potentially running into tens of lakhs of crores."
    },
    {
        question: "With over 1,050 toll plazas, what is the approximate annual toll tax collected in India, and who primarily benefits?",
        options: [
            "₹10,000 Crore, used by Govt",
            "₹50,000 Crore, used by Govt",
            "₹1 Lakh Crore, used by Govt",
            "₹1.5 Lakh Crore, mostly used by private operators"
        ],
        explanation: "While the government gets a share, a majority of India's highways are operated by private companies under Build-Operate-Transfer (BOT) models, who are the primary collectors of toll revenue."
    },
    {
        question: "Considering these figures, if 35% of the Centre's budget and 35% of the State's budget were given directly to families, it's estimated each family could get over ₹1,20,000 per year. Would you support such a policy?",
        options: [
            "Yes, of course.",
            "No, we don't need free money.",
            "Yes, but it should be more than 50%",
            "Yes, it should be more than 50%"
        ],
        explanation: "This is a core question of public governance. It asks whether you believe in direct benefit transfers as a primary model for wealth distribution."
    }
];

type Poll = typeof quizPolls[0];

const agreementLevels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

function PollCard({ poll }: { poll: Poll }) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleCheckboxChange = (optionText: string, checked: boolean | 'indeterminate') => {
    setSelectedOptions(prev => {
      const newSelected = { ...prev };
      if (checked) {
        newSelected[optionText] = '100%'; // Default to 100% agreement
      } else {
        delete newSelected[optionText];
      }
      return newSelected;
    });
  };

  const handleAgreementChange = (optionText: string, agreement: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionText]: agreement,
    }));
  };
  
  const isAnyOptionSelected = Object.keys(selectedOptions).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mt-2">{poll.question}</CardTitle>
        <CardDescription>{poll.explanation}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Select options and your level of agreement:</h4>
          <div className="space-y-6">
            {poll.options.map((option, index) => (
              <div key={`${poll.question}-opt-${index}`} className="p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    id={`${poll.question}-opt-${index}`}
                    onCheckedChange={(checked) => handleCheckboxChange(option, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-4">
                    <Label htmlFor={`${poll.question}-opt-${index}`} className="font-normal text-base leading-snug">
                      {option}
                    </Label>
                    {selectedOptions[option] && (
                        <div className="w-full sm:w-1/2">
                          <Select 
                            value={selectedOptions[option]} 
                            onValueChange={(value) => handleAgreementChange(option, value)}
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
        <Button disabled={!isAnyOptionSelected}>
          Submit Votes
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function FinancialQuizPage() {
  const { user } = useUser();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Financial Awareness Poll</CardTitle>
            <CardDescription>Test your knowledge, become an informed citizen, and share your opinion on key financial topics.</CardDescription>
          </CardHeader>
          {!user ? (
            <CardContent>
              <Alert>
                <Award className="h-4 w-4" />
                <AlertTitle>Please Login to Participate</AlertTitle>
                <AlertDescription>
                  You must be logged in to participate in the poll.
                </AlertDescription>
              </Alert>
            </CardContent>
          ) : (
            <CardContent>
              <Alert className="border-primary">
                  <Award className="h-4 w-4 text-primary" />
                  <AlertTitle className="font-bold text-primary">Poll Instructions</AlertTitle>
                  <AlertDescription>
                      Review each question and its potential answers. Select the answers you agree with and specify your level of agreement. Your participation helps gauge community understanding and opinion.
                  </AlertDescription>
              </Alert>
            </CardContent>
          )}
        </Card>
        
        {user && (
            <div className="space-y-6">
                {quizPolls.map((poll, index) => (
                    <PollCard key={index} poll={poll} />
                ))}
            </div>
        )}
      </div>
    </AppLayout>
  );
}
