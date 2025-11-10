
'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { Award, CheckCircle, Loader2, Star, Trophy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, increment, collection, where, query, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
    correctAnswers: [1], // Index of correct options
    explanation: "India's interim budget for 2024-25 estimates total expenditure at ₹47.66 lakh crore, making ₹50 Lakh Crore the closest approximation."
  },
  // ADD MORE QUESTIONS HERE - I'll show you how
  {
    id: 'new_question_1',
    question: "Your new question here?",
    options: [
      "Option A",
      "Option B", 
      "Option C",
      "Option D"
    ],
    correctAnswers: [0, 2], // Can have multiple correct answers
    explanation: "Explanation here"
  }
  // ADD 10-20 MORE QUESTIONS
];

// Add this many more questions to reach 20-30 total
const agreementLevels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

function PollCard({ poll, userHasSubmitted, onAnswerUpdate }: { 
  poll: any; 
  userHasSubmitted: boolean;
  onAnswerUpdate: (pollId: string, hasAnswer: boolean) => void;
}) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has answered this poll
  useEffect(() => {
    const hasAnswer = Object.keys(selectedOptions).length > 0;
    onAnswerUpdate(poll.id, hasAnswer);
  }, [selectedOptions, poll.id, onAnswerUpdate]);

  const handleCheckboxChange = (optionText: string, checked: boolean | 'indeterminate') => {
    setSelectedOptions(prev => {
      const newSelected = { ...prev };
      if (checked) {
        newSelected[optionText] = '100%';
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
      const responseRef = doc(firestore, 'poll_responses', `${user.uid}_${poll.id}`);
      await setDoc(responseRef, {
        userId: user.uid,
        pollId: poll.id,
        responses: selectedOptions,
        submittedAt: new Date(),
      });

      toast({
        title: "Poll Submitted!",
        description: `Your response for "${poll.question.substring(0, 30)}..." has been recorded.`,
      });

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
            <CardTitle className="mt-2 text-lg">{poll.question}</CardTitle>
            {userHasSubmitted && <Badge variant="secondary" className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Completed</Badge>}
        </div>
        <CardDescription>{poll.explanation}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Select options and your level of agreement:</h4>
          <div className="space-y-6">
            {poll.options.map((option: string, index: number) => (
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
            {userHasSubmitted ? 'Poll Submitted' : 'Submit Poll'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function FinancialQuizPollPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [answeredPolls, setAnsweredPolls] = useState<Set<string>>(new Set());
  const [isCalculatingRewards, setIsCalculatingRewards] = useState(false);

  // Track answered polls
  const handleAnswerUpdate = (pollId: string, hasAnswer: boolean) => {
    setAnsweredPolls(prev => {
      const newSet = new Set(prev);
      if (hasAnswer) {
        newSet.add(pollId);
      } else {
        newSet.delete(pollId);
      }
      return newSet;
    });
  };

  // Calculate completion percentage
  const completionPercentage = (answeredPolls.size / quizPolls.length) * 100;
  const allPollsAnswered = answeredPolls.size === quizPolls.length;

  // Calculate and award rewards
  const calculateAndAwardRewards = async () => {
    if (!user || !firestore || !allPollsAnswered) return;

    setIsCalculatingRewards(true);
    try {
      // Calculate score based on correct answers (you can implement scoring logic)
      const scorePercentage = 80; // Example: Calculate based on correct answers
      
      // Determine PGC reward based on score
      let pgcReward = 0;
      if (scorePercentage >= 90) pgcReward = 10;
      else if (scorePercentage >= 70) pgcReward = 7;
      else if (scorePercentage >= 50) pgcReward = 5;
      else pgcReward = 3;

      // Add PGC to user balance
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        pgcBalance: increment(pgcReward)
      });

      // Record the reward
      const rewardRef = doc(collection(firestore, 'user_rewards'));
      await setDoc(rewardRef, {
        userId: user.uid,
        type: 'quiz_poll_completion',
        pgcAmount: pgcReward,
        scorePercentage: scorePercentage,
        awardedAt: new Date()
      });

      toast({
        title: "🎉 Rewards Awarded!",
        description: `You earned ${pgcReward} PGC for completing all polls with ${scorePercentage}% score!`,
      });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Reward Calculation Failed',
        description: error.message || 'Could not calculate rewards.',
      });
    } finally {
      setIsCalculatingRewards(false);
    }
  };

  // Fetch user's existing poll responses
  const userResponsesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'poll_responses'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: userResponses } = useCollection<{ pollId: string }>(userResponsesQuery);
  
  const submittedPollIds = useMemo(() => {
    return new Set(userResponses?.map(r => r.pollId) || []);
  }, [userResponses]);

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Header with Progress */}
      <Card className="bg-gradient-to-br from-blue-50 to-background">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-headline">Financial Awareness Poll</CardTitle>
              <CardDescription>Complete all polls to earn PGC rewards based on your score!</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {answeredPolls.size}/{quizPolls.length} Polls
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={completionPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress: {Math.round(completionPercentage)}%</span>
              <span>{answeredPolls.size} of {quizPolls.length} polls answered</span>
            </div>
            
            {allPollsAnswered && (
              <Alert className="border-green-200 bg-green-50">
                <Trophy className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">All Polls Completed! 🎉</AlertTitle>
                <AlertDescription className="text-green-700">
                  You've answered all polls. Click the button below to calculate and claim your PGC rewards!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        {allPollsAnswered && (
          <CardFooter>
            <Button 
              onClick={calculateAndAwardRewards} 
              disabled={isCalculatingRewards}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isCalculatingRewards ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating Rewards...</>
              ) : (
                <><Star className="mr-2 h-4 w-4" /> Claim Your PGC Rewards</>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {!user ? (
        <Card>
          <CardContent className="pt-6">
            <Alert>
              <Award className="h-4 w-4" />
              <AlertTitle>Please Login to Participate</AlertTitle>
              <AlertDescription>
                You must be logged in to participate in polls and earn rewards. <Link href="/login" className="font-bold text-primary hover:underline">Login Now</Link>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {quizPolls.map((poll) => (
            <PollCard 
              key={poll.id} 
              poll={poll} 
              userHasSubmitted={submittedPollIds.has(poll.id)}
              onAnswerUpdate={handleAnswerUpdate}
            />
          ))}
        </div>
      )}

      {/* Rewards Info */}
      <Card>
        <CardHeader>
          <CardTitle>Rewards Information</CardTitle>
          <CardDescription>How your PGC rewards are calculated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">3 PGC</div>
              <div className="text-sm text-muted-foreground">50-69% Score</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5 PGC</div>
              <div className="text-sm text-muted-foreground">70-89% Score</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">7 PGC</div>
              <div className="text-sm text-muted-foreground">90%+ Score</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">10 PGC</div>
              <div className="text-sm text-muted-foreground">Perfect Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}