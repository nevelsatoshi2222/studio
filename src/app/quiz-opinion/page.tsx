
// app/quiz-opinion/page.tsx - UPDATED WITH ONE-TIME ATTEMPT & ACHIEVERS TRACKING
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, TrendingUp, Users, Calculator, Award, BookOpen, Trophy, Star, Lock, UserCheck } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  explanation: string;
  options: string[];
  correctAnswer: string;
  requiresAgreement?: boolean;
  noPenalty?: boolean;
}

// Achievement tiers with limited spots
const achievementTiers = [
  { id: 1, achievers: 2000, pgc: 5, rank: "🥇 Gold Tier", color: "from-yellow-400 to-orange-400", completed: 0 },
  { id: 2, achievers: 5000, pgc: 3, rank: "🥈 Silver Tier", color: "from-gray-400 to-gray-600", completed: 0 },
  { id: 3, achievers: 20000, pgc: 2, rank: "🥉 Bronze Tier", color: "from-amber-600 to-amber-800", completed: 0 },
  { id: 4, achievers: 50000, pgc: 1, rank: "🎯 Participant Tier", color: "from-blue-500 to-blue-700", completed: 0 }
];

const financialQuizQuestions: Question[] = [
  // 12 Mandatory Questions
  {
    id: 1,
    question: "What is India's approximate Union budget for the fiscal year 2024-2025?",
    explanation: "India's interim budget for 2024-25 estimates total expenditure at ₹47.66 lakh crore, making ₹50 Lakh Crore the closest approximation.",
    options: ["₹5 Lakh Crore", "₹50 Lakh Crore", "₹20 Lakh Crore", "₹50 Crore"],
    correctAnswer: "₹50 Lakh Crore"
  },
  {
    id: 2,
    question: "What is the approximate combined budget of all Indian states for 2024-2025?",
    explanation: "The combined budget expenditure of all states is projected to be around ₹50-55 Lakh Crore, making ₹50 Lakh Crore a reasonable estimate.",
    options: ["₹10 Lakh Crore", "₹25 Lakh Crore", "₹50 Lakh Crore", "₹100 Lakh Crore"],
    correctAnswer: "₹50 Lakh Crore"
  },
  {
    id: 3,
    question: "What is India's approximate total revenue (Centre + States) for a fiscal year?",
    explanation: "With both Centre and States having budgets around ₹50 Lakh Crore each, the total combined expenditure (and targeted revenue) is approximately ₹100 Lakh Crore.",
    options: ["₹20 Lakh Crore", "₹50 Lakh Crore", "₹100 Lakh Crore", "₹200 Lakh Crore"],
    correctAnswer: "₹100 Lakh Crore"
  },
  {
    id: 4,
    question: "Approximately how many families are there in India?",
    explanation: "With a population of about 140 crores and an average family size of 4-5, the number of families is estimated to be around 30-35 crores.",
    options: ["10 Crore", "20 Crore", "35 Crore", "50 Crore"],
    correctAnswer: "35 Crore"
  },
  {
    id: 5,
    question: "What is the approximate population of India?",
    explanation: "As of 2024, India's population has surpassed 140 crores (1.4 billion).",
    options: ["100 Crore", "120 Crore", "140 Crore", "160 Crore"],
    correctAnswer: "140 Crore"
  },
  {
    id: 6,
    question: "Approximately how many families in India live below the poverty line?",
    explanation: "Various estimates suggest that around 20-25% of the population lives below the poverty line, which translates to about 6-8 crore families.",
    options: ["1 Crore", "3 Crore", "8 Crore", "15 Crore"],
    correctAnswer: "8 Crore"
  },
  {
    id: 7,
    question: "Approximately how many people in India live below the poverty line?",
    explanation: "Based on official figures and World Bank estimates, over 20 crore people in India live in poverty.",
    options: ["5 Crore", "10 Crore", "20 Crore", "40 Crore"],
    correctAnswer: "20 Crore"
  },
  {
    id: 8,
    question: "What is the approximate annual cost to bring one family out of poverty in India?",
    explanation: "Based on various economic models and poverty line estimates, it would take roughly ₹1,20,000 per year to provide basic income support to a family.",
    options: ["₹10,000", "₹50,000", "₹1,20,000", "₹5,00,000"],
    correctAnswer: "₹1,20,000"
  },
  {
    id: 9,
    question: "What is the approximate total annual cost to eradicate poverty in India by providing basic income to all poor families?",
    explanation: "Multiplying the cost per family (₹1,20,000) by the number of poor families (approx. 8 crore) gives a figure around ₹9.6 Lakh Crore.",
    options: ["₹1 Lakh Crore", "₹5 Lakh Crore", "₹10 Lakh Crore", "₹20 Lakh Crore"],
    correctAnswer: "₹10 Lakh Crore"
  },
  {
    id: 10,
    question: "What is India's approximate GDP in USD?",
    explanation: "India's Gross Domestic Product (GDP) is projected to be around $3.7 to $4 trillion, making it one of the world's largest economies.",
    options: ["$1 Trillion", "$2 Trillion", "$4 Trillion", "$10 Trillion"],
    correctAnswer: "$4 Trillion"
  },
  {
    id: 11,
    question: "What is India's approximate national debt?",
    explanation: "India's total government debt (Centre and States combined) is approximately 85-90% of its GDP, which is around $3.4 trillion or ₹280 Lakh Crore.",
    options: ["₹50 Lakh Crore", "₹100 Lakh Crore", "₹150 Lakh Crore", "₹300 Lakh Crore"],
    correctAnswer: "₹300 Lakh Crore"
  },
  {
    id: 12,
    question: "If 35% of the central budget were directly transferred to families, what percentage of poverty could be eradicated?",
    explanation: "35% of the ₹50 Lakh Crore central budget is ₹17.5 Lakh Crore. Since it takes about ₹10 Lakh Crore to eradicate poverty, this amount could theoretically cover 100% of the cost with a surplus.",
    options: ["25%", "50%", "75%", "100%"],
    correctAnswer: "100%"
  },
  // 7 Topical Questions
  {
    id: 13,
    question: "What was the approximate capital outlay for the Indian Railways in the 2024-25 budget?",
    explanation: "The budget allocated a record capital outlay of ₹2.55 lakh crore for the Indian Railways, focusing on modernization and infrastructure.",
    options: ["₹1 Lakh Crore", "₹1.5 Lakh Crore", "₹2.5 Lakh Crore", "₹5 Lakh Crore"],
    correctAnswer: "₹2.5 Lakh Crore"
  },
  {
    id: 14,
    question: "What is India's approximate defense budget for 2024-25?",
    explanation: "The defense budget was increased to ₹6.2 Lakh Crore, emphasizing military modernization and self-reliance (Aatmanirbharta).",
    options: ["₹3 Lakh Crore", "₹4.5 Lakh Crore", "₹6.2 Lakh Crore", "₹8 Lakh Crore"],
    correctAnswer: "₹6.2 Lakh Crore"
  },
  {
    id: 15,
    question: "Which country is India's largest trading partner as of 2023-24 data?",
    explanation: "Surpassing the US, China has emerged as India's largest trading partner with two-way commerce of $118.4 billion.",
    options: ["USA", "China", "UAE", "Russia"],
    correctAnswer: "China"
  },
  {
    id: 16,
    question: "Which Indian state has the highest GDP?",
    explanation: "Maharashtra has the largest economy among all Indian states, with a GSDP (Gross State Domestic Product) of over $400 billion.",
    options: ["Gujarat", "Tamil Nadu", "Maharashtra", "Uttar Pradesh"],
    correctAnswer: "Maharashtra"
  },
  {
    id: 17,
    question: "What does 'UPI' stand for in the context of Indian digital payments?",
    explanation: "UPI, developed by NPCI, is a real-time payment system that has revolutionized digital transactions in India and is now expanding globally.",
    options: ["Unified Payment Interface", "Universal Payment ID", "Unique Public Infrastructure", "Unified Public aId"],
    correctAnswer: "Unified Payment Interface"
  },
  {
    id: 18,
    question: "The 'Make in India' initiative primarily aims to:",
    explanation: "Launched in 2014, the 'Make in India' initiative's main goal is to transform India into a global design and manufacturing hub.",
    options: ["Boost tourism", "Improve agricultural output", "Develop India into a manufacturing hub", "Enhance IT services exports"],
    correctAnswer: "Develop India into a manufacturing hub"
  },
  {
    id: 19,
    question: "What is the primary objective of the 'Swachh Bharat Mission'?",
    explanation: "The mission aims to achieve a clean and open-defecation-free (ODF) India through construction of toilets and promoting sanitation and hygiene.",
    options: ["Building highways", "Providing free electricity", "Universal sanitation and cleanliness", "Digital literacy for all"],
    correctAnswer: "Universal sanitation and cleanliness"
  },
  // 1 Final Poll Question
  {
    id: 20,
    question: "Considering these figures, if 35% of the Centre's budget and 35% of the State's budget were given directly to families, it's estimated each family could get over ₹1,20,000 per year. Would you support such a policy?",
    explanation: "This is a core question of public governance. It asks whether you believe in direct benefit transfers as a primary model for wealth distribution versus government-managed schemes.",
    options: ["Yes, of course.", "No, we don't need free money.", "Yes, but it should be less than 25%", "Yes, it should be more than 35%"],
    correctAnswer: "Yes, of course.",
    requiresAgreement: true,
    noPenalty: true
  }
];

// Storage keys
const QUIZ_ATTEMPT_KEY = 'financial_quiz_attempted';
const ACHIEVERS_COUNT_KEY = 'financial_quiz_achievers';

export default function FinancialAwarenessQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [agreementLevel, setAgreementLevel] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [totalAchievers, setTotalAchievers] = useState(0);
  const [updatedTiers, setUpdatedTiers] = useState(achievementTiers);

  const currentQuestion = financialQuizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / financialQuizQuestions.length) * 100;

  // Check if user has already attempted
  useEffect(() => {
    const attempted = localStorage.getItem(QUIZ_ATTEMPT_KEY);
    const achieversCount = parseInt(localStorage.getItem(ACHIEVERS_COUNT_KEY) || '0');
    
    setHasAttempted(!!attempted);
    setTotalAchievers(achieversCount);
    
    // Update tiers with current completion data
    const updated = achievementTiers.map(tier => ({
      ...tier,
      completed: Math.min(achieversCount, tier.achievers)
    }));
    setUpdatedTiers(updated);
  }, []);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleAgreementSelect = (questionId: number, level: string) => {
    setAgreementLevel(prev => ({
      ...prev,
      [questionId]: level
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < financialQuizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Mark as attempted and update achievers count
      localStorage.setItem(QUIZ_ATTEMPT_KEY, 'true');
      const newAchieversCount = totalAchievers + 1;
      localStorage.setItem(ACHIEVERS_COUNT_KEY, newAchieversCount.toString());
      
      setHasAttempted(true);
      setTotalAchievers(newAchieversCount);
      
      // Update tiers
      const updated = achievementTiers.map(tier => ({
        ...tier,
        completed: Math.min(newAchieversCount, tier.achievers)
      }));
      setUpdatedTiers(updated);
      
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    financialQuizQuestions.forEach(question => {
      if (question.noPenalty || answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: financialQuizQuestions.length,
      percentage: Math.round((correct / financialQuizQuestions.length) * 100)
    };
  };

  const getPGCReward = (percentage: number) => {
    if (percentage === 100) return 5;
    if (percentage >= 51) return 3;
    if (percentage >= 36) return 2;
    return 1;
  };

  const getAchievementTier = () => {
    const newCount = totalAchievers + 1;
    for (let i = 0; i < achievementTiers.length; i++) {
      if (newCount <= achievementTiers[i].achievers) {
        return achievementTiers[i];
      }
    }
    return achievementTiers[achievementTiers.length - 1];
  };

  const startQuiz = () => {
    setShowRules(false);
    setCurrentQuestionIndex(0);
  };

  // If user has already attempted, show completion message
  if (hasAttempted && !showResults) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl p-8">
          <Lock className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Quiz Already Completed</h1>
          <p className="text-xl opacity-90">
            You have already attempted this quiz. Each person can only participate once.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <UserCheck className="h-5 w-5" />
              Community Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalAchievers.toLocaleString()}
            </div>
            <div className="text-gray-600">Total Participants</div>
            
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold">Achievement Tiers Progress:</h4>
              {updatedTiers.map((tier, index) => (
                <div key={tier.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{tier.rank}</span>
                    <Badge variant="secondary">{tier.pgc} PGC</Badge>
                  </div>
                  <Progress 
                    value={(tier.completed / tier.achievers) * 100} 
                    className="h-2 mb-1"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{tier.completed.toLocaleString()} / {tier.achievers.toLocaleString()}</span>
                    <span>
                      {tier.completed >= tier.achievers ? '✅ Completed' : `${tier.achievers - tier.completed} spots left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Check Again
        </Button>
      </div>
    );
  }

  if (showRules) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="default" className="text-sm">
            Financial Literacy Quiz
          </Badge>
          <h1 className="text-4xl font-bold">Financial Awareness Challenge</h1>
          <p className="text-xl text-gray-600">
            Test your knowledge about India's finances and earn PGC tokens!
          </p>
        </div>

        {/* One-time Attempt Warning */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-orange-800">
              <Lock className="h-5 w-5" />
              <div>
                <div className="font-semibold">One-Time Attempt</div>
                <div className="text-sm">You can only attempt this quiz once. Make it count!</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Tiers Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Limited Achievement Tiers
            </CardTitle>
            <CardDescription>
              {totalAchievers.toLocaleString()} people have already completed this quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {updatedTiers.map((tier, index) => (
              <div key={tier.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{tier.rank}</span>
                    <Badge variant="secondary">{tier.pgc} PGC</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {tier.completed >= tier.achievers ? (
                      <span className="text-green-600">✅ Filled</span>
                    ) : (
                      <span>{tier.achievers - tier.completed} spots left</span>
                    )}
                  </div>
                </div>
                <Progress 
                  value={(tier.completed / tier.achievers) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{tier.completed.toLocaleString()} achieved</span>
                  <span>Limit: {tier.achievers.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* PGC Earning Rules */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Award className="h-6 w-6" />
              PGC Token Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-purple-800 text-center">🎯 Scoring System</h3>
              <ul className="space-y-2 text-sm text-purple-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>100% correct: 5 PGC tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>51-80% correct: 3 PGC tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>36-50% correct: 2 PGC tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Below 35%: 1 PGC tokens</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quiz Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>One question displayed at a time - no scrolling needed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Select your answer and click Next</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>See explanations only after completing the quiz</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Only the last question requires agreement level</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Last question is opinion-based - no wrong answer</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="font-semibold text-red-600">One-time attempt only!</span>
              </div>
            </div>
            
            <Button onClick={startQuiz} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
              🚀 Start Financial Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const pgcReward = getPGCReward(score.percentage);
    const achievementTier = getAchievementTier();
    
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Congratulations Header */}
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl p-8 shadow-lg">
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-yellow-300" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Congratulations! 🎉</h1>
            <p className="text-xl opacity-90">You've completed the Financial Awareness Challenge</p>
            <div className="mt-4 bg-white/20 rounded-lg p-3 inline-block">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                <span>You are achiever #{totalAchievers.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score & Rewards Card */}
        <Card className="border-2 border-green-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              {/* Score */}
              <div className="flex justify-center items-center gap-6">
                <TrendingUp className="h-16 w-16 text-green-600" />
                <div>
                  <div className="text-5xl font-bold text-green-600">
                    {score.percentage}%
                  </div>
                  <div className="text-gray-600 text-lg">
                    Financial Awareness Score
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {score.correct} out of {score.total} questions correct
                  </div>
                </div>
              </div>

              {/* PGC Reward */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Star className="h-8 w-8 text-yellow-300" />
                  <div className="text-2xl font-bold">PGC Tokens Awarded</div>
                </div>
                <div className="text-5xl font-bold mb-2">
                  {pgcReward} PGC
                </div>
                <div className="text-green-100 text-lg">
                  ✅ Based on your performance score
                </div>
              </div>

              {/* Achievement Tier */}
              <div className={`bg-gradient-to-r ${achievementTier.color} text-white rounded-xl p-6`}>
                <div className="text-2xl font-bold mb-2">{achievementTier.rank}</div>
                <div className="text-lg">You secured spot #{totalAchievers.toLocaleString()}</div>
                <div className="text-sm opacity-90 mt-1">
                  Limited to {achievementTier.achievers.toLocaleString()} achievers
                </div>
              </div>

              {/* Updated Community Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community Progress Updated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-4">
                    {totalAchievers.toLocaleString()} Achievers
                  </div>
                  <div className="space-y-3">
                    {updatedTiers.map((tier, index) => (
                      <div key={tier.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{tier.rank}</span>
                          <Badge variant="secondary">{tier.pgc} PGC</Badge>
                        </div>
                        <Progress 
                          value={(tier.completed / tier.achievers) * 100} 
                          className="h-2 mb-1"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{tier.completed.toLocaleString()} / {tier.achievers.toLocaleString()}</span>
                          <span>
                            {tier.completed >= tier.achievers ? '✅ Completed' : `${tier.achievers - tier.completed} spots left`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results Section */}
        <Card>
            <CardHeader>
                <CardTitle>Detailed Answers</CardTitle>
                <CardDescription>Review your answers and the explanations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {financialQuizQuestions.map(question => {
                    const userAnswer = answers[question.id];
                    const isCorrect = question.noPenalty || userAnswer === question.correctAnswer;
                    return (
                        <div key={question.id} className={`p-4 border rounded-lg ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                            <h4 className="font-semibold">{question.question}</h4>
                            <p className="text-sm mt-2">Your answer: <span className="font-medium">{userAnswer}</span></p>
                            {!isCorrect && <p className="text-sm">Correct answer: <span className="font-medium">{question.correctAnswer}</span></p>}
                            <div className={`mt-3 pt-3 border-t ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                                <p className="text-xs text-gray-600">{question.explanation}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>

      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Question {currentQuestionIndex + 1}/{financialQuizQuestions.length}</CardTitle>
              <CardDescription>Select the best answer</CardDescription>
            </div>
            <Badge variant="secondary" className="text-base">{progress.toFixed(0)}%</Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-lg font-semibold min-h-[60px]">{currentQuestion.question}</p>
          
          <RadioGroup 
            value={answers[currentQuestion.id]} 
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200">
                <RadioGroupItem value={option} id={`q${currentQuestion.id}-opt${index}`} />
                <Label htmlFor={`q${currentQuestion.id}-opt${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>

        <CardContent>
          {currentQuestion.requiresAgreement && (
            <div className="mt-4 space-y-2">
              <Label>How much do you agree with this policy?</Label>
              <RadioGroup
                value={agreementLevel[currentQuestion.id]}
                onValueChange={(value) => handleAgreementSelect(currentQuestion.id, value)}
                className="flex flex-wrap gap-2"
              >
                {['0%', '25%', '50%', '75%', '100%'].map(level => (
                  <div key={level}>
                    <RadioGroupItem value={level} id={`agree-${level}`} className="sr-only" />
                    <Label
                      htmlFor={`agree-${level}`}
                      className={`px-3 py-1.5 border rounded-full cursor-pointer ${
                        agreementLevel[currentQuestion.id] === level
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted'
                      }`}
                    >
                      {level}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentQuestionIndex === financialQuizQuestions.length - 1 ? 'Finish & See Results' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
