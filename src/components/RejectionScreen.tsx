import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Phone, Mail, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RejectionScreenProps {
  referenceId: string;
  onRestart?: () => void;
}

const RejectionScreen: React.FC<RejectionScreenProps> = ({ 
  referenceId, 
  onRestart 
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyReferenceId = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Reference ID Copied",
      description: "The reference ID has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto">
        <Card className="bg-surface-elevated shadow-elevated border border-destructive/20">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-destructive-subtle flex items-center justify-center">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            
            <CardTitle className="text-2xl font-semibold text-destructive mb-2">
              Assessment Terminated
            </CardTitle>
            
            <p className="text-muted-foreground">
              Your assessment has been ended due to persistent technical or security issues.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Reference ID */}
            <div className="bg-muted rounded-lg p-4 border border-muted-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Reference ID</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyReferenceId}
                  className="h-auto p-1 text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <code className="text-sm font-mono text-primary bg-primary-foreground px-2 py-1 rounded border">
                {referenceId}
              </code>
            </div>
            
            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Next Steps</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-accent-subtle rounded-lg border border-accent/20">
                  <Phone className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Call Support</p>
                    <p className="text-sm text-muted-foreground">
                      Contact our support team to reschedule your assessment.
                    </p>
                    <p className="text-sm font-mono text-accent mt-1">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-success-subtle rounded-lg border border-success/20">
                  <Mail className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Email Support</p>
                    <p className="text-sm text-muted-foreground">
                      Send us an email with your reference ID for assistance.
                    </p>
                    <p className="text-sm font-mono text-success mt-1">support@assessment.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-warning-subtle border border-warning/20 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  <strong>Important:</strong> Please reference your ID <code className="bg-warning/20 px-1 rounded">{referenceId}</code> when contacting support to help us locate your assessment session.
                </p>
              </div>
            </div>
            
            {/* Optional Restart Button */}
            {onRestart && (
              <div className="pt-4 border-t border-muted-border">
                <Button
                  variant="outline"
                  onClick={onRestart}
                  className="w-full text-muted-foreground border-muted-border hover:bg-secondary"
                >
                  Return to System Check
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RejectionScreen;