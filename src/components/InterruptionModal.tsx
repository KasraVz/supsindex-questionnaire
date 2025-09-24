import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Camera, Mic, Wifi, Loader2 } from 'lucide-react';

interface InterruptionModalProps {
  isOpen: boolean;
  failedSystem: 'camera' | 'microphone' | 'connection';
  onRetry: () => Promise<boolean>;
  onClose: () => void;
}

const InterruptionModal: React.FC<InterruptionModalProps> = ({
  isOpen,
  failedSystem,
  onRetry,
  onClose
}) => {
  const [isRetesting, setIsRetesting] = useState(false);

  const systemDetails = {
    camera: {
      icon: Camera,
      title: 'Camera Issue Detected',
      message: 'Your camera has disconnected or access has been denied.',
      retest: 'Re-verifying camera access...'
    },
    microphone: {
      icon: Mic,
      title: 'Microphone Issue Detected',
      message: 'Your microphone has disconnected or access has been denied.',
      retest: 'Re-verifying microphone access...'
    },
    connection: {
      icon: Wifi,
      title: 'Connection Issue Detected',
      message: 'Your network connection has become unstable or disconnected.',
      retest: 'Re-verifying network connection...'
    }
  };

  const currentSystem = systemDetails[failedSystem];
  const SystemIcon = currentSystem.icon;

  const handleRetry = async () => {
    setIsRetesting(true);
    
    try {
      // Simulate testing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = await onRetry();
      if (success) {
        onClose();
      }
    } finally {
      setIsRetesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-md mx-auto bg-surface-elevated border-destructive shadow-elevated"
      >
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive-subtle flex items-center justify-center">
            {isRetesting ? (
              <Loader2 className="w-8 h-8 text-destructive animate-spin" />
            ) : (
              <div className="relative">
                <SystemIcon className="w-6 h-6 text-muted-foreground" />
                <AlertTriangle className="absolute -top-1 -right-1 w-4 h-4 text-destructive" />
              </div>
            )}
          </div>
          
          <DialogTitle className="text-xl font-semibold text-destructive">
            {isRetesting ? 'Retesting System' : currentSystem.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <p className="text-foreground">
            {isRetesting ? currentSystem.retest : currentSystem.message}
          </p>
          
          <div className="bg-warning-subtle border border-warning/20 rounded-lg p-4">
            <p className="text-sm text-warning-foreground bg-warning px-3 py-1 rounded-full inline-block mb-2 font-medium">
              Assessment Paused
            </p>
            <p className="text-sm text-muted-foreground">
              Your assessment timer has been paused and will resume once the issue is resolved.
            </p>
          </div>
          
          <Button
            onClick={handleRetry}
            disabled={isRetesting}
            className="w-full bg-accent hover:bg-accent-light text-accent-foreground font-medium py-3"
            size="lg"
          >
            {isRetesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Re-test System'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterruptionModal;