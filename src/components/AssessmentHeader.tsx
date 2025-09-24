import React, { useState, useEffect } from 'react';
import { Camera, Mic, Wifi, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityStatus {
  camera: 'secure' | 'warning' | 'error';
  microphone: 'secure' | 'warning' | 'error';
  connection: 'secure' | 'warning' | 'error';
}

interface AssessmentHeaderProps {
  startTime: Date;
}

const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({ startTime }) => {
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
              <div className="group relative flex items-center space-x-2">
                <Camera className={cn("w-5 h-5", getStatusColor(securityStatus.camera))} />
                {getStatusIcon(securityStatus.camera)}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {getTooltipText('camera', securityStatus.camera)}
                </div>
              </div>

              {/* Microphone Status */}
              <div className="group relative flex items-center space-x-2">
                <Mic className={cn("w-5 h-5", getStatusColor(securityStatus.microphone))} />
                {getStatusIcon(securityStatus.microphone)}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {getTooltipText('microphone', securityStatus.microphone)}
                </div>
              </div>

              {/* Connection Status */}
              <div className="group relative flex items-center space-x-2">
                <Wifi className={cn("w-5 h-5", getStatusColor(securityStatus.connection))} />
                {getStatusIcon(securityStatus.connection)}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {getTooltipText('connection', securityStatus.connection)}
                </div>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-muted-foreground">
              Time Elapsed:
            </span>
            <div className="bg-accent-subtle text-accent px-3 py-1 rounded-md font-mono text-lg font-semibold min-w-[4rem] text-center">
              {formatTime(elapsedTime)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AssessmentHeader;