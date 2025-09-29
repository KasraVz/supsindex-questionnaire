import React from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { AlertTriangle, DollarSign, Home } from 'lucide-react';

interface EndSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const EndSessionModal: React.FC<EndSessionModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-destructive-subtle rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            End Assessment Session?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <p>
              You are about to end your assessment session permanently. 
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-4">
          {/* Warning Box */}
          <div className="bg-destructive-subtle p-4 rounded-lg border border-destructive/20">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive mb-2">
                  Financial Impact:
                </p>
                <ul className="text-destructive/80 space-y-1 text-sm">
                  <li>• You will lose the assessment fee you have paid</li>
                  <li>• No refund will be issued for incomplete assessments</li>
                  <li>• You must purchase a new assessment to retake</li>
                  <li>• Progress and answers will not be saved</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="bg-accent-subtle p-4 rounded-lg">
            <div className="text-sm">
              <p className="font-medium text-accent mb-2">
                Alternative Options:
              </p>
              <ul className="text-accent/80 space-y-1 text-sm">
                <li>• Take a 5-minute break if you need rest</li>
                <li>• Continue with the assessment to avoid losing fees</li>
                <li>• Contact support if you're experiencing technical issues</li>
              </ul>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel 
            onClick={onClose}
            className="flex-1"
          >
            Continue Assessment
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 bg-destructive hover:bg-destructive-light text-destructive-foreground"
          >
            <Home className="w-4 h-4 mr-2" />
            End & Go to Dashboard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EndSessionModal;