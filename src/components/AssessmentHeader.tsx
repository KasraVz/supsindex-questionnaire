import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentHeaderProps {
  startTime: Date;
  isPaused?: boolean;
  onSystemFailure?: (system: 'camera' | 'microphone' | 'connection') => void;
}

const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({ 
  startTime, 
  isPaused = false,
  onSystemFailure 
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [systemStatus, setSystemStatus] = useState({
    camera: true,
    microphone: true,
    connection: true
  });

  useEffect(() => {
    if (isPaused) {
      setPausedTime(Date.now());
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const start = startTime.getTime();
      const pauseDuration = pausedTime > 0 ? pausedTime - start : 0;
      const actualElapsed = now - start - pauseDuration;
      setElapsedTime(Math.max(0, actualElapsed));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused, pausedTime]);

  // Simulate periodic system checks (for demo purposes)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      // Simulate random system failures for demo (remove in production)
      if (Math.random() < 0.001) { // Very low chance for demo
        const systems: ('camera' | 'microphone' | 'connection')[] = ['camera', 'microphone', 'connection'];
        const failedSystem = systems[Math.floor(Math.random() * systems.length)];
        
        setSystemStatus(prev => ({
          ...prev,
          [failedSystem]: false
        }));
        
        onSystemFailure?.(failedSystem);
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [onSystemFailure]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-elevated border-b border-card-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Security Status */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-muted-foreground mr-3">
                Procurement Status:
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Camera Status */}
              <div className="group relative">
                <div className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                  systemStatus.camera 
                    ? "bg-success-subtle text-success" 
                    : "bg-destructive-subtle text-destructive"
                )}>
                  <Camera className="w-4 h-4" />
                  <span className="text-sm font-medium">Camera</span>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-foreground text-background rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {systemStatus.camera ? 'Camera Feed Secure' : 'Camera Issue Detected'}
                </div>
              </div>

              {/* Microphone Status */}
              <div className="group relative">
                <div className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                  systemStatus.microphone 
                    ? "bg-success-subtle text-success" 
                    : "bg-destructive-subtle text-destructive"
                )}>
                  <Mic className="w-4 h-4" />
                  <span className="text-sm font-medium">Microphone</span>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-foreground text-background rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {systemStatus.microphone ? 'Audio Monitoring Active' : 'Microphone Issue Detected'}
                </div>
              </div>

              {/* Connection Status */}
              <div className="group relative">
                <div className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                  systemStatus.connection 
                    ? "bg-success-subtle text-success" 
                    : "bg-destructive-subtle text-destructive"
                )}>
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm font-medium">Connection</span>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-foreground text-background rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {systemStatus.connection ? 'Connection Stable' : 'Connection Issue Detected'}
                </div>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-3">
            <Badge 
              variant="outline" 
              className={cn(
                "text-sm font-medium border-2 transition-colors duration-200",
                isPaused 
                  ? "border-warning text-warning bg-warning-subtle" 
                  : "border-accent text-accent bg-accent-subtle"
              )}
            >
              {isPaused ? 'PAUSED' : 'Time Elapsed'}
            </Badge>
            <div className={cn(
              "text-lg font-mono font-semibold transition-colors duration-200",
              isPaused ? "text-warning" : "text-foreground"
            )}>
              {formatTime(elapsedTime)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AssessmentHeader;