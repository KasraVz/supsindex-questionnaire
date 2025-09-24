import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Users } from 'lucide-react';

interface StatisticsPanelProps {
  setsCompleted: number;
  totalSets: number;
  questionsAnswered: number;
  totalQuestions: number;
  questionsFlagged: number;
  isIndustryPhase: boolean;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  setsCompleted,
  totalSets,
  questionsAnswered,
  totalQuestions,
  questionsFlagged,
  isIndustryPhase
}) => {
  return (
    <div className="fixed left-4 top-24 z-10 hidden lg:block">
      <Card className="w-56 bg-surface-elevated shadow-lg border border-card-border animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span>Progress Stats</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Sets Completed */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm text-foreground">Sets Completed</span>
            </div>
            <span className="text-sm font-semibold text-accent">
              {setsCompleted} / {totalSets}
            </span>
          </div>
          
          {/* Questions Answered */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">Q</span>
              </div>
              <span className="text-sm text-foreground">Questions</span>
            </div>
            <span className="text-sm font-semibold text-primary">
              {questionsAnswered} / {totalQuestions}
            </span>
          </div>
          
          {/* Questions Flagged */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-tertiary" />
              <span className="text-sm text-foreground">Flagged</span>
            </div>
            <span className="text-sm font-semibold text-tertiary">
              {questionsFlagged}
            </span>
          </div>
          
          {/* Current Phase */}
          <div className="pt-2 border-t border-muted-border">
            <div className="text-xs text-muted-foreground text-center">
              Current Phase
            </div>
            <div className="text-sm font-medium text-center text-foreground mt-1">
              {isIndustryPhase ? 'Industry-Specific' : 'General Questions'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPanel;