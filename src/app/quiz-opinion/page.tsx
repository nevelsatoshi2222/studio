// src/app/quiz-opinion/page.tsx - COMPREHENSIVE QUIZ SYSTEM
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  BookOpen,
  Target,
  Award,
  Trophy,
  Star,
  Users,
  Calculator,
  TrendingUp,
  Shield,
  Heart,
  Globe,
  IndianRupee,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lock,
  Home
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  explanation: string;
  options: string[];
  correctAnswer: string;
  category: string;
  requiresAgreement?: boolean;
  noPenalty?: boolean;
}

// 30 Comprehensive Questions
const comprehensiveQuizQuestions: Question[] = [
  // Budget & Economy (6 questions)
  {
    id: 1,
    question: "What is India's approximate Union budget for the fiscal year 2024-2025?",
    explanation: "India's interim budget for 2024-25 estimates total expenditure at ₹47.66 lakh crore, making ₹50 Lakh Crore the closest approximation.",
    options: ["₹5 Lakh Crore", "₹50 Lakh Crore", "₹20 Lakh Crore", "₹50 Crore"],
    correctAnswer: "₹50 Lakh Crore",
    category: "Budget & Economy"
  },
  {
    id: 2,
    question: "How does India's GDP compare with other major economies?",
    explanation: "India is the 5th largest economy globally with GDP of $4.1 trillion, showing rapid growth from being the 10th largest a decade ago.",
    options: ["10th largest economy", "5th largest economy", "3rd largest economy", "7th largest economy"],
    correctAnswer: "5th largest economy",
    category: "Budget & Economy"
  },
  {
    id: 3,
    question: "What percentage of GDP is India's tax collection?",
    explanation: "India's tax-to-GDP ratio is around 11.7%, which is lower than many developing economies and indicates potential for increased revenue mobilization.",
    options: ["8% of GDP", "11.7% of GDP", "15% of GDP", "20% of GDP"],
    correctAnswer: "11.7% of GDP",
    category: "Budget & Economy"
  },
  {
    id: 4,
    question: "What is India's fiscal deficit target for 2024-25?",
    explanation: "The government aims to reduce fiscal deficit to 5.1% of GDP in 2024-25, down from 5.8% in previous year, showing fiscal consolidation.",
    options: ["4.5% of GDP", "5.1% of GDP", "6.2% of GDP", "7.0% of GDP"],
    correctAnswer: "5.1% of GDP",
    category: "Budget & Economy"
  },
  {
    id: 5,
    question: "How much is allocated for education in Union Budget 2024-25?",
    explanation: "Education sector received ₹1.25 lakh crore, focusing on digital education, research, and infrastructure development.",
    options: ["₹85,000 crore", "₹1.25 lakh crore", "₹1.75 lakh crore", "₹2.25 lakh crore"],
    correctAnswer: "₹1.25 lakh crore",
    category: "Budget & Economy"
  },
  {
    id: 6,
    question: "What is the healthcare budget allocation for 2024-25?",
    explanation: "Health Ministry received ₹90,659 crore, with focus on Ayushman Bharat and healthcare infrastructure development.",
    options: ["₹50,000 crore", "₹90,659 crore", "₹1.2 lakh crore", "₹1.5 lakh crore"],
    correctAnswer: "₹90,659 crore",
    category: "Budget & Economy"
  },

  // Defense & Security (4 questions)
  {
    id: 7,
    question: "What percentage of India's Union Budget is allocated to Defense?",
    explanation: "Defense allocation is approximately 13% of the total Union Budget, highlighting national security priorities.",
    options: ["8% of total budget", "13% of total budget", "18% of total budget", "23% of total budget"],
    correctAnswer: "13% of total budget",
    category: "Defense & Security"
  },
  {
    id: 8,
    question: "India's defense budget ranks in the world as:",
    explanation: "India has the 3rd largest defense budget globally after USA and China, reflecting its strategic position.",
    options: ["1st largest", "3rd largest", "5th largest", "7th largest"],
    correctAnswer: "3rd largest",
    category: "Defense & Security"
  },
  {
    id: 9,
    question: "What is the approximate allocation for Defense Pensions?",
    explanation: "Defense pensions account for about ₹1.41 lakh crore, showing significant commitment to armed forces welfare.",
    options: ["₹50,000 crore", "₹1.41 lakh crore", "₹2.5 lakh crore", "₹3.2 lakh crore"],
    correctAnswer: "₹1.41 lakh crore",
    category: "Defense & Security"
  },
  {
    id: 10,
    question: "What is India's defense budget as percentage of GDP?",
    explanation: "India spends about 2.0-2.1% of its GDP on defense, which is moderate compared to global standards.",
    options: ["1.5% of GDP", "2.1% of GDP", "3.5% of GDP", "4.2% of GDP"],
    correctAnswer: "2.1% of GDP",
    category: "Defense & Security"
  },

  // Infrastructure (4 questions)
  {
    id: 11,
    question: "What is the total budget allocation for Indian Railways in 2024-25?",
    explanation: "Indian Railways received ₹2.55 lakh crore, the highest ever allocation for infrastructure development.",
    options: ["₹1.25 lakh crore", "₹2.55 lakh crore", "₹3.45 lakh crore", "₹4.15 lakh crore"],
    correctAnswer: "₹2.55 lakh crore",
    category: "Infrastructure"
  },
  {
    id: 12,
    question: "How many new trains were announced in Railway Budget 2024-25?",
    explanation: "The budget announced 3,000 new trains under PM Gati Shakti program for modernizing rail infrastructure.",
    options: ["1,000 new trains", "3,000 new trains", "5,000 new trains", "10,000 new trains"],
    correctAnswer: "3,000 new trains",
    category: "Infrastructure"
  },
  {
    id: 13,
    question: "What is the allocation for Road Transport and Highways?",
    explanation: "Road Transport and Highways ministry received ₹2.78 lakh crore for national highway development and infrastructure.",
    options: ["₹1.89 lakh crore", "₹2.78 lakh crore", "₹3.45 lakh crore", "₹4.12 lakh crore"],
    correctAnswer: "₹2.78 lakh crore",
    category: "Infrastructure"
  },
  {
    id: 14,
    question: "How many kilometers of national highways were constructed in 2023-24?",
    explanation: "India constructed approximately 12,349 km of national highways in 2023-24, setting a record for infrastructure development.",
    options: ["8,500 km", "12,349 km", "15,200 km", "18,000 km"],
    correctAnswer: "12,349 km",
    category: "Infrastructure"
  },

  // Agriculture & Environment (4 questions)
  {
    id: 15,
    question: "What is India's target for renewable energy capacity by 2030?",
    explanation: "India aims to achieve 500 GW of renewable energy capacity by 2030 as part of its climate commitments.",
    options: ["250 GW by 2030", "350 GW by 2030", "500 GW by 2030", "650 GW by 2030"],
    correctAnswer: "500 GW by 2030",
    category: "Environment"
  },
  {
    id: 16,
    question: "How much carbon dioxide can one acre of bamboo absorb annually?",
    explanation: "One acre of bamboo plantation can absorb approximately 12 tons of CO2 annually, making it excellent for carbon sequestration.",
    options: ["5 tons CO2 per year", "12 tons CO2 per year", "20 tons CO2 per year", "25 tons CO2 per year"],
    correctAnswer: "12 tons CO2 per year",
    category: "Environment"
  },
  {
    id: 17,
    question: "What is the annual growth rate of global bamboo market?",
    explanation: "The global bamboo market is growing at 7.5% annually, driven by demand for sustainable materials.",
    options: ["3% annually", "5% annually", "7.5% annually", "10% annually"],
    correctAnswer: "7.5% annually",
    category: "Economy & Resources"
  },
  {
    id: 18,
    question: "What percentage of global fish trade does India currently capture?",
    explanation: "Despite being 3rd in production, India captures only about 6% of global fish trade by value, showing huge growth potential.",
    options: ["3% of global trade", "6% of global trade", "12% of global trade", "18% of global trade"],
    correctAnswer: "6% of global trade",
    category: "Economy & Resources"
  },

  // Science & Technology (3 questions)
  {
    id: 19,
    question: "What is ISRO's budget allocation for 2024-25?",
    explanation: "ISRO received ₹13,042 crore for space research, Gaganyaan mission, and satellite development programs.",
    options: ["₹8,500 crore", "₹13,042 crore", "₹18,000 crore", "₹22,500 crore"],
    correctAnswer: "₹13,042 crore",
    category: "Science & Technology"
  },
  {
    id: 20,
    question: "According to physics laws, can permanent magnets create infinite energy for vehicles?",
    explanation: "No, permanent magnets alone cannot create energy. They can only help in energy efficiency through levitation.",
    options: ["Yes, magnets create infinite energy", "No, it violates physics laws", "Only for small distances", "Only if magnets are very strong"],
    correctAnswer: "No, it violates physics laws",
    category: "Science & Technology"
  },
  {
    id: 21,
    question: "What percentage of global trade is transported by sea?",
    explanation: "Approximately 90% of world trade by volume is transported by ships, making oceans the backbone of global commerce.",
    options: ["50% of global trade", "70% of global trade", "90% of global trade", "95% of global trade"],
    correctAnswer: "90% of global trade",
    category: "Economy & Resources"
  },

  // Global Affairs (3 questions)
  {
    id: 22,
    question: "What is the economic cost of global conflicts annually?",
    explanation: "Global conflicts cost approximately $14 trillion annually in direct and indirect economic impacts.",
    options: ["$5 trillion", "$14 trillion", "$25 trillion", "$40 trillion"],
    correctAnswer: "$14 trillion",
    category: "Global Affairs"
  },
  {
    id: 23,
    question: "Which country successfully monetizes its digital governance model?",
    explanation: "Estonia sells its e-governance technology and consultancy to other countries, creating revenue from digital expertise.",
    options: ["Japan", "Estonia", "Germany", "Australia"],
    correctAnswer: "Estonia",
    category: "Global Affairs"
  },
  {
    id: 24,
    question: "What is the United Nations peacekeeping budget approximately?",
    explanation: "UN peacekeeping budget is around $6.5 billion annually, funded by member states based on assessment.",
    options: ["$2 billion", "$6.5 billion", "$15 billion", "$25 billion"],
    correctAnswer: "$6.5 billion",
    category: "Global Affairs"
  },

  // Governance & Policy (6 questions)
  {
    id: 25,
    question: "Which state asset has the highest untapped revenue potential according to experts?",
    explanation: "Government buildings and vacant lands offer the highest immediate revenue potential through commercial development.",
    options: ["Government office buildings", "Forest land", "Public schools", "Roadside spaces"],
    correctAnswer: "Government office buildings",
    category: "Governance & Policy"
  },
  {
    id: 26,
    question: "What is the estimated potential of India's minor forest produce if properly commercialized?",
    explanation: "Minor forest produce like tendu leaves and medicinal herbs have potential to generate over ₹40,000 crore annually.",
    options: ["₹10,000 crore", "₹25,000 crore", "₹40,000 crore", "₹60,000 crore"],
    correctAnswer: "₹40,000 crore",
    category: "Governance & Policy"
  },
  {
    id: 27,
    question: "What percentage of government building rooftops are currently generating revenue?",
    explanation: "Less than 1% of government building rooftops are utilized for revenue generation through solar power or advertising.",
    options: ["Less than 1%", "About 10%", "Around 25%", "Over 50%"],
    correctAnswer: "Less than 1%",
    category: "Governance & Policy"
  },
  {
    id: 28,
    question: "Approximately how many people are employed in India's fishing sector?",
    explanation: "The fishing and aquaculture sector provides livelihood to about 2.8 crore people directly and many more indirectly.",
    options: ["50 lakh people", "1.5 crore people", "2.8 crore people", "5 crore people"],
    correctAnswer: "2.8 crore people",
    category: "Employment"
  },
  {
    id: 29,
    question: "What percentage of GDP does India spend on education?",
    explanation: "India spends about 2.9% of its GDP on education, lower than the recommended 6% by education policy.",
    options: ["2.1% of GDP", "2.9% of GDP", "3.8% of GDP", "4.5% of GDP"],
    correctAnswer: "2.9% of GDP",
    category: "Education"
  },
  {
    id: 30,
    question: "Considering these figures, if 35% of Centre's and State's budget were given directly to families, each family could get over ₹1,20,000 per year. Would you support such a policy?",
    explanation: "This is a core question of public governance. It asks whether you believe in direct benefit transfers as a primary model for wealth distribution.",
    options: ["Yes, of course.", "No, we don't need free money.", "Yes, but it should be less than 25%", "Yes, it should be more than 35%"],
    correctAnswer: "Yes, of course.",
    category: "Governance & Policy",
    requiresAgreement: true,
    noPenalty: true
  }
];

// Storage keys
const QUIZ_ATTEMPT_KEY = 'comprehensive_quiz_attempted';
const ACHIEVERS_COUNT_KEY = 'comprehensive_quiz_achievers';

export default function ComprehensiveQuizSystem() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [totalAchievers, setTotalAchievers] = useState(0);

  const currentQuestion = comprehensiveQuizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / comprehensiveQuizQuestions.length) * 100;

  // Check if user has already attempted
  useEffect(() => {
    const attempted = localStorage.getItem(QUIZ_ATTEMPT_KEY);
    const achieversCount = parseInt(localStorage.getItem(ACHIEVERS_COUNT_KEY) || '0');
    
    setHasAttempted(!!attempted);
    setTotalAchievers(achieversCount);
  }, []);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < comprehensiveQuizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Mark as attempted and update achievers count
      localStorage.setItem(QUIZ_ATTEMPT_KEY, 'true');
      const newAchieversCount = totalAchievers + 1;
      localStorage.setItem(ACHIEVERS_COUNT_KEY, newAchieversCount.toString());
      
      setHasAttempted(true);
      setTotalAchievers(newAchieversCount);
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
    comprehensiveQuizQuestions.forEach(question => {
      if (question.noPenalty || answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: comprehensiveQuizQuestions.length,
      percentage: Math.round((correct / comprehensiveQuizQuestions.length) * 100)
    };
  };

  const getPGCReward = (percentage: number) => {
    if (percentage === 100) return 5;
    if (percentage >= 80) return 4;
    if (percentage >= 60) return 3;
    if (percentage >= 40) return 2;
    return 1;
  };

  const startQuiz = () => {
    setShowRules(false);
    setCurrentQuestionIndex(0);
  };

  // If user has already attempted, show completion message
  if (hasAttempted && !showResults) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-8 py-12">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl p-8">
          <Lock className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Quiz Already Completed</h1>
          <p className="text-xl opacity-90">
            You have already attempted this comprehensive quiz. Each person can only participate once.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              Community Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalAchievers.toLocaleString()}
            </div>
            <div className="text-gray-600">Total Participants</div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Check Again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (showRules) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="default" className="text-sm">
            Comprehensive Financial & Governance Quiz
          </Badge>
          <h1 className="text-4xl font-bold">Public Governance Awareness Challenge</h1>
          <p className="text-xl text-gray-600">
            Test your knowledge about India's finances, governance, and global perspective!
          </p>
        </div>

        {/* Quiz Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{comprehensiveQuizQuestions.length}</div>
              <div className="text-gray-600">Total Questions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">7</div>
              <div className="text-gray-600">Categories Covered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{totalAchievers.toLocaleString()}</div>
              <div className="text-gray-600">Previous Participants</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Covered */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Quiz Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "Budget & Economy",
                "Defense & Security", 
                "Infrastructure",
                "Healthcare & Education",
                "Environment",
                "Science & Technology",
                "Global Affairs",
                "Governance & Policy"
              ].map((category, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button onClick={startQuiz} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
          🚀 Start Comprehensive Quiz
        </Button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const pgcReward = getPGCReward(score.percentage);
    
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        {/* Congratulations Header */}
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl p-8 shadow-lg">
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-yellow-300" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Congratulations! 🎉</h1>
            <p className="text-xl opacity-90">You've completed the Comprehensive Governance Awareness Challenge</p>
            <div className="mt-4 bg-white/20 rounded-lg p-3 inline-block">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
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
                    Comprehensive Governance Score
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
                  ✅ Based on your comprehensive knowledge score
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Question Review */}
              <div>
                <h4 className="font-semibold mb-4">Question Review:</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {comprehensiveQuizQuestions.map((question, index) => {
                    const isCorrect = answers[question.id] === question.correctAnswer;
                    return (
                      <div key={question.id} className={`p-4 rounded border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium mb-2">
                              Q{index + 1}: {question.question}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              Your answer: <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {answers[question.id] || "Not answered"}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div className="text-sm text-green-600">
                                Correct answer: {question.correctAnswer}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              Explanation: {question.explanation}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex-1"
          >
            Take Again (Practice Mode)
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Main Quiz Interface
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {comprehensiveQuizQuestions.length}</div>
              <div className="font-medium">{currentQuestion.category}</div>
            </div>
            <Badge variant="secondary">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">{currentQuestionIndex + 1}</span>
            </div>
            <span>{currentQuestion.question}</span>
          </CardTitle>
          {currentQuestion.requiresAgreement && (
            <CardDescription className="text-orange-600">
              💡 This is an opinion-based question - no wrong answer
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          onClick={handlePrevious}
          variant="outline"
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className="bg-green-600 hover:bg-green-700"
        >
          {currentQuestionIndex === comprehensiveQuizQuestions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}