import React, { useState, useEffect } from 'react';
import { Camera, Mic, Wifi, Check, X, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SystemCheck {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'checking' | 'success' | 'error';
  errorMessage?: string;
}

interface SystemCheckScreenProps {
  onSystemCheckComplete: () => void;
}

const SystemCheckScreen: React.FC<SystemCheckScreenProps> = ({ onSystemCheckComplete }) => {
  const [checks, setChecks] = useState<SystemCheck[]>([
    {
      id: 'camera',
      label: 'Verifying Camera Access',
      icon: Camera,
      status: 'pending'
    },
    {
      id: 'microphone', 
      label: 'Securing Microphone Connection',
      icon: Mic,
      status: 'pending'
    },
    {
      id: 'network',
      label: 'Analyzing Network Stability',
      icon: Wifi,
      status: 'pending'
    }
  ]);

  const [allChecksPassed, setAllChecksPassed] = useState(false);

  useEffect(() => {
    // Simulate system checks with realistic delays
    const runChecks = async () => {
      const checkOrder = ['camera', 'microphone', 'network'];
      
      for (const checkId of checkOrder) {
        // Set to checking state
        setChecks(prev => prev.map(check => 
          check.id === checkId ? { ...check, status: 'checking' } : check
        ));
        
        // Simulate check duration
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        // Simulate success (95% success rate for demo)
        const success = Math.random() > 0.05;
        
        setChecks(prev => prev.map(check => 
          check.id === checkId 
            ? { 
                ...check, 
                status: success ? 'success' : 'error',
                errorMessage: !success ? getErrorMessage(checkId) : undefined
              } 
            : check
        ));
      }
    };

    runChecks();
  }, []);

  useEffect(() => {
    const allPassed = checks.every(check => check.status === 'success');
    setAllChecksPassed(allPassed);
  }, [checks]);

  const getErrorMessage = (checkId: string): string => {
    const messages = {
      camera: 'Please allow camera access in your browser settings.',
      microphone: 'Please enable microphone permissions and try again.',
      network: 'Please check your internet connection and refresh the page.'
    };
    return messages[checkId as keyof typeof messages] || 'An error occurred. Please try again.';
  };

  const renderStatusIcon = (check: SystemCheck) => {
    switch (check.status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full border-2 border-muted-border bg-muted" />;
      case 'checking':
        return <Loader2 className="w-5 h-5 text-accent animate-spin" />;
      case 'success':
        return (
          <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
            <Check className="w-3 h-3 text-success-foreground animate-check-mark" />
          </div>
        );
      case 'error':
        return (
          <div className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
            <X className="w-3 h-3 text-destructive-foreground" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card shadow-elevated animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-glow">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-xl font-semibold text-foreground">
            Pre-Assessment System Check
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Getting your secure environment ready
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {checks.map((check) => {
            const IconComponent = check.icon;
            return (
              <div key={check.id} className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-md border border-card-border bg-surface">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      check.status === 'success' && "text-success",
                      check.status === 'checking' && "text-accent",
                      check.status === 'error' && "text-destructive",
                      check.status === 'pending' && "text-muted-foreground"
                    )} />
                    <span className="text-sm font-medium text-foreground">
                      {check.label}
                    </span>
                  </div>
                  {renderStatusIcon(check)}
                </div>
                
                {check.status === 'error' && check.errorMessage && (
                  <div className="ml-8 p-2 bg-destructive-subtle rounded-md border border-destructive/20 animate-fade-in">
                    <p className="text-xs text-destructive">{check.errorMessage}</p>
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="pt-6">
            <Button 
              onClick={onSystemCheckComplete}
              disabled={!allChecksPassed}
              className={cn(
                "w-full transition-all duration-300",
                allChecksPassed 
                  ? "bg-accent hover:bg-accent-light shadow-glow animate-pulse-glow" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {allChecksPassed ? 'Start Assessment' : 'Checking Systems...'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemCheckScreen;