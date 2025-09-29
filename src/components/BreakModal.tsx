import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Coffee, Clock } from 'lucide-react';

interface BreakModalProps {
  isOpen: boolean;
  onBreakComplete: () => void;
}

const BreakModal: React.FC<BreakModalProps> = ({ isOpen, onBreakComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [isBreakActive, setIsBreakActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBreakActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBreakActive(false);
            onBreakComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreakActive, timeRemaining, onBreakComplete]);

  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(300);
      setIsBreakActive(false);
    }
  }, [isOpen]);

  const startBreak = () => {
    setIsBreakActive(true);
  };

  const endBreakEarly = () => {
    setIsBreakActive(false);
    setTimeRemaining(0);
    onBreakComplete();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((300 - timeRemaining) / 300) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-accent-subtle rounded-full flex items-center justify-center">
            <Coffee className="w-8 h-8 text-accent" />
          </div>
          <DialogTitle className="text-xl">
            {!isBreakActive ? 'Assessment Break' : 'Break in Progress'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isBreakActive ? (
            <>
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  You can take a 5-minute break before continuing with the next section.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please ensure you return within the time limit to avoid session timeout.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onBreakComplete}
                  className="flex-1"
                >
                  Skip Break
                </Button>
                <Button
                  onClick={startBreak}
                  className="flex-1 bg-accent hover:bg-accent-light"
                >
                  Start Break
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="text-3xl font-mono font-bold text-accent">
                  {formatTime(timeRemaining)}
                </div>
                <Progress value={progressPercentage} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Break time remaining
                </p>
              </div>

              <div className="bg-warning-subtle p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning mb-1">Important Reminders:</p>
                    <ul className="text-warning/80 space-y-1">
                      <li>• Stay within camera view during the break</li>
                      <li>• Do not close the browser or refresh the page</li>
                      <li>• Return before the timer expires</li>
                      <li>• No external assistance or materials allowed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={endBreakEarly}
                className="w-full"
              >
                End Break Early
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BreakModal;