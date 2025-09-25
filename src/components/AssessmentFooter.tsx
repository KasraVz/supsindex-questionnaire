import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentFooterProps {
  onNext: () => void;
  canProceed: boolean;
  isLastSet: boolean;
  isSubmitting?: boolean;
}

const AssessmentFooter: React.FC<AssessmentFooterProps> = ({
  onNext,
  canProceed,
  isLastSet,
  isSubmitting = false
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-surface-elevated border-t border-card-border shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Progress Indicator */}
          <div className="flex-1 flex justify-center">
            <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {isLastSet ? 'Final Questions' : 'Answer all questions to continue'}
            </div>
          </div>
          
          {/* Next/Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={onNext}
              disabled={!canProceed || isSubmitting}
              className={cn(
                "flex items-center space-x-2 transition-all duration-300 min-w-[120px]",
                canProceed
                  ? "bg-accent hover:bg-accent-light shadow-glow"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
                isLastSet && canProceed && "animate-pulse-glow"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-foreground/20 border-t-accent-foreground rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : isLastSet ? (
                <>
                  <Trophy className="w-4 h-4" />
                  <span>Finish Assessment</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AssessmentFooter;