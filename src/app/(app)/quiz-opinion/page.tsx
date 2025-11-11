'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trophy, Star, Award, Users, Target, CheckCircle, Clock, Wallet, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp, getDoc, query, where, getDocs } from 'firebase/firestore';

export default function QuizOpinionPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState<number | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [hasAlreadyTakenQuiz, setHasAlreadyTakenQuiz] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user has already taken the quiz
  useEffect(() => {
    const checkQuizStatus = async () => {
      if (user && firestore) {
        try {
          // Check user balance
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserBalance(userDoc.data().pgcBalance || 0);
          }

          // Check if user already completed this quiz
          const quizQuery = query(
            collection(firestore, 'quiz_results'),
            where('userId', '==', user.uid),
            where('quizType', '==', 'financial_tournament')
          );
          const querySnapshot = await getDocs(quizQuery);
          
          if (!querySnapshot.empty) {
            setHasAlreadyTakenQuiz(true);
            setQuizCompleted(true);
            
            // Get previous results
            const previousResult = querySnapshot.docs[0].data();
            const previousCorrectAnswers = previousResult.score;
            const previousTotalQuestions = previousResult.totalQuestions;
            const previousPercentage = previousResult.percentage;
            const previousReward = previousResult.reward;
            
            // Set previous results for display
            setCorrectAnswers(previousCorrectAnswers);
            setTotalQuestions(previousTotalQuestions);
            setPercentageScore(previousPercentage);
            setRewardAmount(previousReward);
          }
        } catch (error) {
          console.error('Error checking quiz status:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkQuizStatus();
  }, [user, firestore]);

  const quizQuestions = [
    {
      id: 1,
      question: "What is India's approximate Union budget for the fiscal year 2024-2025?",
      options: [
        "₹5 Lakh Crore",
        "₹50 Lakh Crore", 
        "₹20 Lakh Crore",
        "₹50 Crore"
      ],
      correctAnswer: 1,
      explanation: "India's interim budget for 2024-25 estimates total expenditure at ₹47.66 lakh crore, making ₹50 Lakh Crore the closest approximation."
    },
    {
      id: 2,
      question: "If India's entire budget were distributed equally among its ~1.4 billion people, approximately how much would each person receive?",
      options: [
        "₹10,000",
        "₹20,000",
        "₹25,000", 
        "₹35,000"
      ],
      correctAnswer: 3,
      explanation: "Calculation: ₹47.66 lakh crore / 140 crore people ≈ ₹34,042 per person. ₹35,000 is the nearest option."
    },
    {
      id: 3,
      question: "What percentage of India's budget is allocated to interest payments on existing debt?",
      options: [
        "5-10%",
        "15-20%",
        "25-30%",
        "Over 35%"
      ],
      correctAnswer: 1,
      explanation: "Interest payments consume about 20-25% of India's total budget expenditure, making it one of the largest components."
    },
    {
      id: 4,
      question: "Which sector receives the highest allocation in India's budget?",
      options: [
        "Defense",
        "Education",
        "Infrastructure",
        "Subsidies and transfers"
      ],
      correctAnswer: 3,
      explanation: "Subsidies and transfers (including food, fertilizer, and other welfare schemes) typically receive the largest share of budget allocations."
    },
    {
      id: 5,
      question: "What is the approximate fiscal deficit target for India in 2024-2025?",
      options: [
        "3.5% of GDP",
        "4.5% of GDP",
        "5.5% of GDP",
        "6.5% of GDP"
      ],
      correctAnswer: 2,
      explanation: "India's fiscal deficit target for 2024-25 is 5.1% of GDP, with ₹16.85 lakh crore in borrowing."
    },
    {
      id: 6,
      question: "How much does India plan to spend on infrastructure development in 2024-2025?",
      options: [
        "₹5 Lakh Crore",
        "₹10 Lakh Crore",
        "₹15 Lakh Crore",
        "₹20 Lakh Crore"
      ],
      correctAnswer: 1,
      explanation: "Capital expenditure outlay for infrastructure has been increased to ₹11.11 lakh crore for 2024-25."
    },
    {
      id: 7,
      question: "What is the projected nominal GDP growth rate assumed in the 2024-2025 budget?",
      options: [
        "8-9%",
        "10-11%",
        "12-13%",
        "14-15%"
      ],
      correctAnswer: 1,
      explanation: "The budget assumes 10.5% nominal GDP growth for 2024-25, which is crucial for revenue projections."
    },
    {
      id: 8,
      question: "Which of these statements about India's tax revenue is most accurate?",
      options: [
        "Direct taxes contribute more than indirect taxes",
        "Indirect taxes contribute more than direct taxes",
        "Both contribute equally",
        "Corporate tax is the largest source"
      ],
      correctAnswer: 0,
      explanation: "In recent years, direct taxes (income tax, corporate tax) have surpassed indirect taxes (GST, customs) as the largest revenue source."
    },
    {
      id: 9,
      question: "What is the approximate size of India's stimulus packages during COVID-19 as percentage of GDP?",
      options: [
        "5%",
        "10%",
        "15%",
        "20%"
      ],
      correctAnswer: 1,
      explanation: "India's COVID-19 stimulus packages totaled around 10-12% of GDP, including monetary and fiscal measures."
    },
    {
      id: 10,
      question: "How does India's tax-to-GDP ratio compare with developed countries?",
      options: [
        "Much higher",
        "Slightly higher",
        "Comparable",
        "Significantly lower"
      ],
      correctAnswer: 3,
      explanation: "India's tax-to-GDP ratio is around 11-12%, significantly lower than OECD average of 34% and developed countries' 25-45%."
    },
    {
      id: 11,
      question: "What percentage of Indian households invest in stock markets?",
      options: [
        "1-2%",
        "5-7%",
        "10-12%",
        "15-20%"
      ],
      correctAnswer: 1,
      explanation: "Only about 5-7% of Indian households directly invest in stock markets, though mutual fund participation is growing rapidly."
    },
    {
      id: 12,
      question: "How satisfied are you with the current budget allocation for education and healthcare in India?",
      options: [
        "Very satisfied",
        "Somewhat satisfied", 
        "Neutral",
        "Not satisfied",
        "Very dissatisfied"
      ],
      correctAnswer: 0,
      explanation: "This is an opinion-based question to understand public sentiment about budget priorities. Your response helps gather valuable insights!"
    }
  ];

  // State for results
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [percentageScore, setPercentageScore] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (userAnswers[currentQuestion] === undefined) {
      toast({
        variant: "destructive",
        title: "Please select an answer",
        description: "You need to select an option before proceeding."
      });
      return;
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleCompleteQuiz = async () => {
    if (userAnswers.length !== quizQuestions.length) {
      toast({
        variant: "destructive",
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting."
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // For calculation, exclude the last poll question from scoring
      const questionsToScore = quizQuestions.slice(0, -1);
      const answersToScore = userAnswers.slice(0, -1);
      
      const correctCount = answersToScore.filter((answer, index) => 
        answer === questionsToScore[index].correctAnswer
      ).length;
      
      const percentage = (correctCount / questionsToScore.length) * 100;
      const reward = calculateReward(percentage);

      // Save quiz result to Firebase
      if (user && firestore) {
        const quizRef = collection(firestore, 'quiz_results');
        await addDoc(quizRef, {
          userId: user.uid,
          quizType: 'financial_tournament',
          score: correctCount,
          totalQuestions: questionsToScore.length,
          percentage: percentage,
          reward: reward,
          completedAt: serverTimestamp()
        });

        // Award PGC to user and update local balance
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, {
          pgcBalance: increment(reward)
        });

        // Update local balance
        setUserBalance(prev => prev + reward);
        
        // Set results for display
        setCorrectAnswers(correctCount);
        setTotalQuestions(questionsToScore.length);
        setPercentageScore(percentage);
        setRewardAmount(reward);
      }

      setQuizCompleted(true);
      setHasAlreadyTakenQuiz(true);
      
      toast({
        title: "Quiz Submitted Successfully! 🎉",
        description: `You scored ${correctCount}/${questionsToScore.length} (${percentage.toFixed(1)}%) and earned ${reward} PGC!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error saving your results. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateReward = (percentage: number) => {
    if (percentage === 100) return 5;
    if (percentage >= 70) return 3;
    return 2;
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setShowExplanation(null);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const allQuestionsAnswered = userAnswers.length === quizQuestions.length;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking quiz access...</p>
        </div>
      </div>
    );
  }

  // Access denied for non-team members or already completed
  if (hasAlreadyTakenQuiz) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto p-4">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Lock className="h-10 w-10" />
              </div>
            </div>
            <CardTitle className="text-2xl">Quiz Already Completed</CardTitle>
            <CardDescription className="text-lg">
              You have already taken this quiz and earned your rewards.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-green-600">{percentageScore.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Your Score</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-yellow-600">{rewardAmount} PGC</div>
                <div className="text-sm text-muted-foreground">Reward Earned</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-purple-600">{userBalance} PGC</div>
                <div className="text-sm text-muted-foreground">Total Balance</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Quiz Rules</h4>
              <p className="text-blue-700">
                Each user can attempt this quiz only once. You've already completed it and earned your rewards.
                {percentageScore === 100 && (
                  <span className="block mt-2 font-semibold">
                    🎊 Congratulations! You qualified for the next tournament round!
                  </span>
                )}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/">Return to Dashboard</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Main quiz interface
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">
          <Trophy className="h-3 w-3 mr-1" />
          Team Member Exclusive Quiz
        </Badge>
        <h1 className="font-headline text-3xl font-bold">Financial Awareness Quiz</h1>
        <p className="text-muted-foreground mt-2">
          Exclusive for team members. Complete once to earn PGC rewards.
        </p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {quizQuestions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={userAnswers[currentQuestion]?.toString() || ""}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-4"
          >
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Explanation Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => setShowExplanation(showExplanation === currentQuestion ? null : currentQuestion)}
          >
            {showExplanation === currentQuestion ? 'Hide Explanation' : 'Show Explanation'}
          </Button>

          {showExplanation === currentQuestion && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                {quizQuestions[currentQuestion].explanation}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          {currentQuestion === quizQuestions.length - 1 ? (
            <Button
              onClick={handleCompleteQuiz}
              disabled={!allQuestionsAnswered || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Complete Quiz'
              )}
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Next Question
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {quizQuestions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestion === index ? "default" : userAnswers[index] !== undefined ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestion(index)}
                className="h-10"
              >
                {index + 1}
                {userAnswers[index] !== undefined && (
                  <CheckCircle className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}