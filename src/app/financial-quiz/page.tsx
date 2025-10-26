
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const quizQuestions = [
    {
      question: "What is India's approximate Union budget for the fiscal year 2024-2025?",
      options: [
        "₹5 Lakh Crore",
        "₹50 Lakh Crore",
        "₹20 Lakh Crore",
        "₹50 Crore"
      ],
      answer: "₹50 Lakh Crore",
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
      answer: "₹35,000",
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
      answer: "₹140,000",
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
      answer: "₹10 Lakh Crore",
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
        answer: "₹70,000 Crore",
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
        answer: "₹20 Lakh Crore or more",
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
        answer: "₹10 Lakh Crore",
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
        answer: "₹25 Lakh Crore and above",
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
        answer: "₹1.5 Lakh Crore, mostly used by private operators",
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
        answer: "Yes, of course.",
        explanation: "This is a core question of public governance. It asks whether you believe in direct benefit transfers as a primary model for wealth distribution."
    }
  ];

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export default function FinancialQuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === currentQuestion.answer) {
      setAnswerState('correct');
      setScore(score + 1);
    } else {
      setAnswerState('incorrect');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswerState('unanswered');
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerState('unanswered');
    setScore(0);
    setQuizFinished(false);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  
  let coinReward = 0;
  if (quizFinished) {
    if (score === 10) {
      coinReward = 10;
    } else if (score > 6) {
      coinReward = 5;
    } else if (score >= 4) {
      coinReward = 2.5;
    } else {
      coinReward = 1.25;
    }
  }


  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Financial Awareness Quiz Tournament</CardTitle>
            <CardDescription>Test your knowledge, become an informed citizen, and earn PGC rewards! Connect your wallet to receive rewards.</CardDescription>
          </CardHeader>
          
          {!quizFinished ? (
            <>
            <CardContent className="space-y-6">
                <Alert className="border-primary">
                    <Award className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-bold text-primary">Quiz Tournament Rules & Rewards</AlertTitle>
                    <AlertDescription>
                        <ul className="list-decimal space-y-3 pl-5 text-muted-foreground">
                            <li>
                                <span className="font-semibold text-foreground">Initial Round:</span>
                                <ul className="list-disc pl-5 space-y-1 mt-1">
                                    <li>Score under 4 correct to earn **1.25 PGC** (Limited to first 8,000 winners).</li>
                                    <li>Score 4 to 6 correct to earn **2.5 PGC** (Limited to first 4,000 winners).</li>
                                    <li>Score 7 to 9 correct to earn **5 PGC** (Limited to first 2,000 winners).</li>
                                    <li>Score a perfect 10 to earn a **10 PGC** bonus and qualify for the next round! (Limited to first 1,000 winners).</li>
                                </ul>
                            </li>
                             <li>
                                <span className="font-semibold text-foreground">Qualifying Round:</span>
                                <p>The top 2,000 from the initial round compete. Top 200 winners earn **20 PGC** each and advance.</p>
                            </li>
                            <li>
                                <span className="font-semibold text-foreground">Semi-Finals:</span>
                                <p>The top 200 compete. The top 20 scorers win **100 PGC** each and advance to the Grand Finale.</p>
                            </li>
                            <li>
                                <span className="font-semibold text-foreground">Grand Finale:</span>
                                 <ul className="list-disc pl-5 space-y-1 mt-1">
                                    <li>The final 20 competitors battle for the championship.</li>
                                    <li>**Grand Prize Winner (1st Place):** 4,000 PGC & the Champion's Trophy.</li>
                                     <li>**Runners-up (19 winners):** 1,000 PGC each.</li>
                                </ul>
                            </li>
                        </ul>
                    </AlertDescription>
                </Alert>
                <Progress value={progressPercentage} className="w-full" />
                <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
                <RadioGroup
                    value={selectedAnswer || ''}
                    onValueChange={setSelectedAnswer}
                    disabled={answerState !== 'unanswered'}
                >
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = currentQuestion.answer === option;
                        
                        let stateIndicator = null;
                        if(answerState !== 'unanswered' && isSelected) {
                            stateIndicator = isCorrect ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />;
                        } else if(answerState !== 'unanswered' && isCorrect) {
                             stateIndicator = <CheckCircle className="h-5 w-5 text-green-500" />;
                        }

                        return (
                        <Label
                            key={index}
                            className={`flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                                answerState !== 'unanswered' && isCorrect ? 'border-green-500 bg-green-500/10' : ''
                            } ${
                                answerState === 'incorrect' && isSelected ? 'border-red-500 bg-red-500/10' : ''
                            } ${
                                answerState === 'unanswered' && isSelected ? 'border-primary' : ''
                            }`}
                        >
                            <RadioGroupItem value={option} id={`option-${index}`} />
                            <span className="flex-1">{option}</span>
                            {stateIndicator}
                        </Label>
                        );
                    })}
                </RadioGroup>

                {answerState !== 'unanswered' && (
                    <div className="p-4 rounded-lg bg-muted">
                        <h3 className="font-semibold text-primary">Explanation</h3>
                        <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
            {answerState === 'unanswered' ? (
              <Button onClick={handleSubmit} disabled={!selectedAnswer}>Submit Answer</Button>
            ) : (
              <Button onClick={handleNext}>
                {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
            </>
          ) : (
            <>
            <CardContent className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-primary">Quiz Complete!</h2>
                <p className="text-lg text-muted-foreground">You scored</p>
                <p className="text-5xl font-bold">{score} / {quizQuestions.length}</p>
                
                {coinReward > 0 ? (
                    <Alert className="max-w-md mx-auto text-left border-green-500 bg-green-500/10">
                        <Award className="h-4 w-4 text-green-500" />
                        <AlertTitle className="text-green-600">Congratulations! You won {coinReward} PGC!</AlertTitle>
                        <AlertDescription className="text-green-800">
                            {score === 10 ?
                                `You've qualified for the next round!` :
                                `Keep playing to improve your score and win bigger prizes.`
                            } The reward has been sent to your connected wallet.
                        </AlertDescription>
                    </Alert>
                ) : (
                     <Alert className="max-w-md mx-auto text-left">
                        <Award className="h-4 w-4" />
                        <AlertTitle>Keep Learning!</AlertTitle>
                        <AlertDescription>
                            You didn't score high enough for a reward this time, but you've taken the first step to becoming an informed citizen. Try again!
                        </AlertDescription>
                    </Alert>
                )}

                <p className="max-w-md mx-auto text-muted-foreground">
                    This quiz is a crucial first step in understanding the power of public governance. Your participation is valuable.
                </p>
            </CardContent>
            <CardFooter className="justify-center">
                <Button onClick={handleRestart}><RotateCcw className="mr-2 h-4 w-4"/> Restart Quiz</Button>
            </CardFooter>
            </>
          )}

        </Card>
      </div>
    </AppLayout>
  );
}
