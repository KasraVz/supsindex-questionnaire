import React, { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MousePointer } from 'lucide-react';

interface IdleWarningNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
  onStayActive: () => void;
}

const IdleWarningNotification: React.FC<IdleWarningNotificationProps> = ({
  isVisible,
  onDismiss,
  onStayActive
}) => {
  useEffect(() => {
    if (isVisible) {
      // Auto-dismiss after 30 seconds if no action taken
      const timer = setTimeout(() => {
        onDismiss();
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <Alert className="max-w-sm bg-warning-subtle border-warning shadow-lg">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertDescription className="space-y-3">
          <div>
            <p className="font-medium text-warning mb-1">
              Idle Activity Detected
            </p>
            <p className="text-sm text-warning/80">
              You haven't interacted with the assessment for over 1 minute. 
              Please stay active to maintain session integrity.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onStayActive}
              className="bg-warning hover:bg-warning/90 text-warning-foreground"
            >
              <MousePointer className="w-3 h-3 mr-1" />
              I'm Active
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="text-warning hover:bg-warning/10"
            >
              Dismiss
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default IdleWarningNotification;