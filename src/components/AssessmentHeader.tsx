import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Camera, Mic, Wifi, Coffee, LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface SecurityStatus {
  camera: 'secure' | 'warning' | 'error';
  microphone: 'secure' | 'warning' | 'error';
  connection: 'secure' | 'warning' | 'error';
}

interface AssessmentHeaderProps {
  startTime: Date;
  onTakeBreak: () => void;
  onEndSession: () => void;
  isBreakAvailable: boolean;
}

const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({ 
  startTime, 
  onTakeBreak, 
  onEndSession, 
  isBreakAvailable 
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [securityStatus] = useState<SecurityStatus>({
    camera: 'secure',
    microphone: 'secure',
    connection: 'secure'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: SecurityStatus[keyof SecurityStatus]) => {
    switch (status) {
      case 'secure':
        return 'text-status-secure';
      case 'warning':
        return 'text-status-warning';
      case 'error':
        return 'text-status-error';
    }
  };

  const getStatusIcon = (status: SecurityStatus[keyof SecurityStatus]) => {
    switch (status) {
      case 'secure':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTooltipText = (type: string, status: SecurityStatus[keyof SecurityStatus]) => {
    const statusText = status === 'secure' ? 'Secure' : status === 'warning' ? 'Warning' : 'Error';
    const typeMap = {
      camera: 'Camera Feed',
      microphone: 'Audio Monitoring',
      connection: 'Connection'
    };
    return `${typeMap[type as keyof typeof typeMap]} ${statusText}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface-elevated border-b border-card-border shadow-md z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Security Status */}
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">Assessment</h2>
            <div className="flex items-center space-x-3">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-1">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                    {getStatusIcon(securityStatus.camera)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getTooltipText('camera', securityStatus.camera)}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-1">
                    <Mic className="w-4 h-4 text-muted-foreground" />
                    {getStatusIcon(securityStatus.microphone)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getTooltipText('microphone', securityStatus.microphone)}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-1">
                    <Wifi className="w-4 h-4 text-muted-foreground" />
                    {getStatusIcon(securityStatus.connection)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getTooltipText('connection', securityStatus.connection)}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Center - Actions */}
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTakeBreak}
                  disabled={!isBreakAvailable}
                  className="text-accent border-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Coffee className="w-4 h-4 mr-2" />
                  Take Break
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isBreakAvailable ? "Take a 5-minute break" : "Break not available"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEndSession}
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  End Session
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>End assessment and return to dashboard</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-4">
            <div className="bg-muted px-4 py-2 rounded-lg">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Time Elapsed</div>
              <div className="text-lg font-mono font-semibold text-foreground">
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AssessmentHeader;