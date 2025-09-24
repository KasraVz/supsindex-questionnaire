import React from 'react';
import { Trophy, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentSet: number; // 1-10 for general questions, 11+ for industry-specific
  totalGeneralSets: number; // 10
  isIndustrySpecific: boolean;
  industryProgress: number; // 0-100 percentage
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentSet,
  totalGeneralSets,
  isIndustrySpecific,
  industryProgress
}) => {
  const renderGeneralQuestions = () => {
    return (
      <div className="flex-1 relative">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-foreground">General Questions</h3>
          <span className="text-xs text-muted-foreground">
            {Math.min(currentSet, totalGeneralSets)} of {totalGeneralSets} sets
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalGeneralSets }, (_, index) => {
            const setNumber = index + 1;
            const isCompleted = currentSet > setNumber;
            const isCurrent = currentSet === setNumber && !isIndustrySpecific;
            
            return (
              <div key={setNumber} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted && "bg-accent border-accent shadow-md animate-scale-in",
                    isCurrent && "bg-accent-subtle border-accent scale-110 animate-pulse-glow",
                    !isCompleted && !isCurrent && "bg-surface border-muted-border"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-accent-foreground" />
                  ) : (
                    <span className={cn(
                      "text-xs font-semibold",
                      isCurrent ? "text-accent" : "text-muted-foreground"
                    )}>
                      {setNumber}
                    </span>
                  )}
                </div>
                
                {index < totalGeneralSets - 1 && (
                  <div
                    className={cn(
                      "w-6 h-0.5 transition-all duration-500",
                      isCompleted ? "bg-accent animate-progress-fill" : "bg-muted-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderIndustrySpecific = () => {
    const isActive = isIndustrySpecific;
    const isCompleted = industryProgress === 100;
    
    return (
      <div className="flex-1 relative ml-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-foreground">Industry-Specific Questions</h3>
          <span className="text-xs text-muted-foreground">
            {Math.round(industryProgress)}% Complete
          </span>
        </div>
        
        <div className="flex items-center">
          {/* Connecting line from general questions */}
          <div
            className={cn(
              "w-6 h-0.5 transition-all duration-500",
              currentSet > totalGeneralSets ? "bg-accent" : "bg-muted-border"
            )}
          />
          
          {/* Progress bar */}
          <div className="flex-1 h-6 bg-progress-bg rounded-lg overflow-hidden mx-2 border border-muted-border">
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out",
                isActive || isCompleted ? "bg-gradient-accent" : "bg-muted-border"
              )}
              style={{
                width: `${industryProgress}%`,
                boxShadow: isActive ? '0 0 10px var(--accent-glow)' : 'none'
              }}
            />
          </div>
          
          {/* Finish icon */}
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
              isCompleted && "bg-success border-success shadow-md animate-scale-in",
              isActive && !isCompleted && "bg-accent-subtle border-accent animate-pulse-glow",
              !isActive && !isCompleted && "bg-surface border-muted-border"
            )}
          >
            <Trophy className={cn(
              "w-5 h-5 transition-colors duration-300",
              isCompleted ? "text-success-foreground" : 
              isActive ? "text-accent" : "text-muted-foreground"
            )} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-surface-elevated border-b border-card-border py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          {renderGeneralQuestions()}
          {renderIndustrySpecific()}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;