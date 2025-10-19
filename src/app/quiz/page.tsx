
'use client';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { quizQuestions } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

export default function QuizPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleAnswer = (option: string) => {
        setSelectedOption(option);
        const correct = quizQuestions[currentQuestionIndex].correctAnswer === option;
        setIsCorrect(correct);
        if (correct) {
            setScore(score + quizQuestions[currentQuestionIndex].prize);
        }

        setTimeout(() => {
            const nextQuestion = currentQuestionIndex + 1;
            if (nextQuestion < quizQuestions.length) {
                setCurrentQuestionIndex(nextQuestion);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setShowScore(true);
            }
        }, 1000);
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setSelectedOption(null);
        setIsCorrect(null);
    }

    const question = quizQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Quiz Competition</h1>
          <p className="text-muted-foreground">
            Test your knowledge and earn rewards.
          </p>
        </div>
        <Card className="max-w-2xl mx-auto w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                <span>Knowledge Challenge</span>
            </CardTitle>
            <CardDescription>
                {showScore ? 'Quiz Complete!' : `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showScore ? (
              <div className="text-center space-y-4">
                <p className="text-2xl font-bold">You scored {score} points!</p>
                <Button onClick={resetQuiz}>Play Again</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-lg font-semibold">{question.question}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="lg"
                      onClick={() => handleAnswer(option)}
                      disabled={selectedOption !== null}
                      className={`
                        justify-start text-left h-auto whitespace-normal
                        ${selectedOption && option === question.correctAnswer ? 'bg-green-100 border-green-500 text-green-800' : ''}
                        ${selectedOption === option && !isCorrect ? 'bg-red-100 border-red-500 text-red-800' : ''}
                      `}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
