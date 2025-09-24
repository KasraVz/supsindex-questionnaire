import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
  }>;
}

interface QuestionSet {
  id: string;
  title: string;
  questions: Question[];
}

interface QuestionCardProps {
  questionSet: QuestionSet;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, answerId: string) => void;
  isGeneralQuestions: boolean;
  currentSetNumber: number;
  totalSets: number;
  flaggedQuestions: Set<string>;
  onQuestionFlag: (questionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionSet,
  answers,
  onAnswerChange,
  isGeneralQuestions,
  currentSetNumber,
  totalSets,
  flaggedQuestions,
  onQuestionFlag
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="bg-gradient-card shadow-lg border border-card-border animate-fade-in">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-foreground">
              {questionSet.title}
            </CardTitle>
            <div className="text-sm text-muted-foreground bg-accent-subtle px-3 py-1 rounded-full">
              {isGeneralQuestions 
                ? `Set ${currentSetNumber} of ${totalSets}`
                : 'Industry-Specific'
              }
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {questionSet.questions.map((question, questionIndex) => (
            <div key={question.id} className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  {questionIndex + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-foreground leading-relaxed">
                    {question.text}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQuestionFlag(question.id)}
                  className={cn(
                    "flex-shrink-0 p-1 h-7 w-7 transition-colors duration-200",
                    flaggedQuestions.has(question.id)
                      ? "text-tertiary hover:text-tertiary-light"
                      : "text-muted-foreground hover:text-tertiary"
                  )}
                  title="Flag as incorrect"
                >
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="ml-9">
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => onAnswerChange(question.id, value)}
                  className="space-y-2"
                >
                  {question.options.map((option) => (
                    <div key={option.id} className="group">
                      <Label
                        htmlFor={`${question.id}-${option.id}`}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                          "hover:bg-accent-subtle hover:border-accent",
                          answers[question.id] === option.id
                            ? "bg-accent-subtle border-accent shadow-sm"
                            : "bg-surface border-muted-border"
                        )}
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={`${question.id}-${option.id}`}
                          className="text-accent"
                        />
                        <span className="text-sm text-foreground flex-1">
                          {option.text}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionCard;