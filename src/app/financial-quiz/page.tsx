
'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { Award, CheckCircle, Loader2, Trophy, Star, Shield, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, increment, collection, where, query } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { QuizRewardTier } from '@/lib/types';
import React from 'react';

const quizRewardTiers: QuizRewardTier[] = [
  {
    level: 'Initial Qualification',
    icon: Users,
    rewards: [
      { score: '< 40% Correct', prize: '2 PGC', limit: 'First 20,000 Achievers' },
      { score: '> 40% Correct', prize: '3 PGC', limit: 'First 5,000 Achievers' },
      { score: '100% Correct', prize: '5 PGC', limit: 'First 2,000 Achievers (Qualifies for next round)' },
    ],
  },
  {
    level: 'Qualifier Round',
    icon: Shield,
    rewards: [
      { score: 'Top 200 Scorers', prize: '20 PGC', limit: 'Qualifies for Semi-Finals' },
    ],
  },
  {
    level: 'Semi-Final Round',
    icon: Star,
    rewards: [
      { score: 'Top 20 Scorers', prize: '100 PGC', limit: 'Qualifies for Finals' },
    ],
  },
  {
    level: 'Final Round',
    icon: Trophy,
    rewards: [
      { score: '1st Place Winner', prize: '5,000 PGC', limit: '' },
      { score: '4 Runners-up', prize: '1,000 PGC', limit: '' },
    ],
  },
];

const quizPolls = [
    {
      id: 'budget_2024_2025',
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
      id: 'per_capita_distribution',
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
      id: 'family_distribution',
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
      id: 'petroleum_revenue',
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
        id: 'mineral_extraction_revenue',
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
        id: 'gst_revenue',
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
        id: 'corporation_tax_revenue',
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
        id: 'mineral_potential_income',
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
        id: 'toll_tax_collection',
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
        id: 'direct_benefit_policy',
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

function PollCard({ poll, userHasSubmitted }: { poll: Poll; userHasSubmitted: boolean }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  
  const handleSubmit = async () => {
    if (!user || !firestore || Object.keys(selectedOptions).length === 0) return;

    setIsSubmitting(true);
    try {
      // 1. Save the response
      const responseRef = doc(firestore, 'poll_responses', `${user.uid}_${poll.id}`);
      await setDoc(responseRef, {
        userId: user.uid,
        pollId: poll.id,
        responses: selectedOptions,
        submittedAt: new Date(),
      });

      // 2. Award PGC for participation (if not already awarded)
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        pgcBalance: increment(2) // Award base 2 PGC for participation
      });

      toast({
        title: "Vote Submitted!",
        description: `Your response for "${poll.question.substring(0, 30)}..." has been recorded. You've earned 2 PGC for participating!`,
      });

      // The parent component's state will update via useCollection, automatically disabling this card.
    } catch (error: any) {
      console.error("Error submitting poll:", error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'An error occurred while submitting your vote.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnyOptionSelected = Object.keys(selectedOptions).length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="mt-2">{poll.question}</CardTitle>
            {userHasSubmitted && <Badge variant="secondary" className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Completed</Badge>}
        </div>
        <CardDescription>{poll.explanation}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Select options and your level of agreement:</h4>
          <div className="space-y-6">
            {poll.options.map((option, index) => (
              <div key={`${poll.id}-opt-${index}`} className="p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    id={`${poll.id}-opt-${index}`}
                    onCheckedChange={(checked) => handleCheckboxChange(option, checked)}
                    className="mt-1"
                    disabled={userHasSubmitted}
                  />
                  <div className="flex-1 space-y-4">
                    <Label htmlFor={`${poll.id}-opt-${index}`} className={`font-normal text-base leading-snug ${userHasSubmitted ? 'text-muted-foreground' : ''}`}>
                      {option}
                    </Label>
                    {selectedOptions[option] && !userHasSubmitted && (
                        <div className="w-full sm:w-1/2">
                          <Select 
                            value={selectedOptions[option]} 
                            onValueChange={(value) => handleAgreementChange(option, value)}
                            disabled={userHasSubmitted}
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
        <Button onClick={handleSubmit} disabled={!isAnyOptionSelected || isSubmitting || userHasSubmitted}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {userHasSubmitted ? 'Vote Submitted' : 'Submit & Earn PGC'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function FinancialQuizPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // Hook to fetch all of the current user's poll responses
  const userResponsesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'poll_responses'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: userResponses } = useCollection<{ pollId: string }>(userResponsesQuery);
  
  // Create a quick-lookup Set of poll IDs the user has already submitted
  const submittedPollIds = useMemo(() => {
    return new Set(userResponses?.map(r => r.pollId) || []);
  }, [userResponses]);

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Financial Awareness Quiz</CardTitle>
            <CardDescription>Test your knowledge on key financial topics to earn rewards and qualify for the main tournament.</CardDescription>
          </CardHeader>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Trophy className="h-6 w-6 text-primary" /> Quiz Tournament Rules & Rewards</CardTitle>
                <CardDescription>Achieve high scores to earn PGC and advance through the tournament rounds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {quizRewardTiers.map((tier, index) => {
                    const Icon = tier.icon;
                    return (
                         <div key={index} className="rounded-lg border">
                             <div className="p-4 bg-muted/50 rounded-t-lg">
                                <h3 className="font-bold text-lg flex items-center gap-3"><Icon className="h-5 w-5 text-primary" /> {tier.level}</h3>
                            </div>
                            <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {tier.rewards.map((reward, rewardIndex) => (
                                     <div key={rewardIndex} className="p-3 rounded-md bg-background border">
                                        <p className="font-semibold text-primary text-xl">{reward.prize}</p>
                                        <p className="text-sm text-muted-foreground font-medium">{reward.score}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{reward.limit}</p>
                                    </div>
                                ))}
                            </div>
                         </div>
                    )
                })}
            </CardContent>
        </Card>

        {!user ? (
          <Alert>
            <Award className="h-4 w-4" />
            <AlertTitle>Please Login to Participate</AlertTitle>
            <AlertDescription>
              You must be logged in to participate in the polls and earn rewards. <Link href="/login" className="font-bold text-primary hover:underline">Login Now</Link>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-primary">
              <Award className="h-4 w-4 text-primary" />
              <AlertTitle className="font-bold text-primary">Poll Instructions</AlertTitle>
              <AlertDescription>
                  Review each question and select the answers you agree with. You will earn **2 PGC** for each poll you complete as a participation reward. Your final score will determine eligibility for further tournament rounds.
              </AlertDescription>
          </Alert>
        )}
        
        {user && (
            <div className="space-y-6">
                {quizPolls.map((poll) => (
                    <PollCard 
                      key={poll.id} 
                      poll={poll} 
                      userHasSubmitted={submittedPollIds.has(poll.id)}
                    />
                ))}
            </div>
        )}
      </div>
    </AppLayout>
  );
}
