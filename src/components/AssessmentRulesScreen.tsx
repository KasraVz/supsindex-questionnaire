import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  Camera, 
  Coffee, 
  AlertTriangle, 
  Wifi,
  BookOpen,
  LockKeyhole
} from 'lucide-react';

interface AssessmentConfig {
  type: 'FPA' | 'GEB' | 'EEA' | 'BUNDLE';
  stage: string;
  industry?: string;
  ecosystem?: string;
}

interface AssessmentRulesScreenProps {
  assessmentConfig: AssessmentConfig | null;
  onStartAssessment: () => void;
}

const assessmentDetails = {
  FPA: {
    name: 'Fundamental Personality Assessment',
    duration: '45-60 minutes',
    questions: '50-70 questions',
    color: 'bg-accent',
    textColor: 'text-accent-foreground'
  },
  GEB: {
    name: 'General Entrepreneur Behavior',
    duration: '45-60 minutes',
    questions: '60-80 questions',
    color: 'bg-primary',
    textColor: 'text-primary-foreground'
  },
  EEA: {
    name: 'Ecosystem Environment Assessment',
    duration: '30-45 minutes',
    questions: '40-60 questions',
    color: 'bg-tertiary',
    textColor: 'text-tertiary-foreground'
  },
  BUNDLE: {
    name: 'Complete Assessment Bundle',
    duration: '2-3 hours',
    questions: '230-330 questions',
    color: 'bg-gradient-to-r from-accent via-primary to-tertiary',
    textColor: 'text-white'
  }
};

const AssessmentRulesScreen: React.FC<AssessmentRulesScreenProps> = ({
  assessmentConfig,
  onStartAssessment
}) => {
  if (!assessmentConfig) return null;

  const details = assessmentDetails[assessmentConfig.type];
  const isBundle = assessmentConfig.type === 'BUNDLE';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Ready to Begin</h1>
          <p className="text-lg text-muted-foreground">
            Please review the assessment details and rules before starting
          </p>
        </div>

        {/* Assessment Details Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <Badge className={`${details.color} ${details.textColor} text-sm px-3 py-1`}>
                    {assessmentConfig.type}
                  </Badge>
                  {isBundle && (
                    <Badge variant="outline" className="text-sm">
                      ALL 3 ASSESSMENTS
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">{details.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Time & Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold text-foreground">{details.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <BookOpen className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-semibold text-foreground">{details.questions}</p>
                </div>
              </div>
            </div>

            {/* Configuration Details */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Your Configuration:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-3 bg-secondary rounded-md">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Stage</p>
                    <p className="text-sm font-medium text-foreground">{assessmentConfig.stage}</p>
                  </div>
                </div>
                {assessmentConfig.industry && (
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-md">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-xs text-muted-foreground">Industry</p>
                      <p className="text-sm font-medium text-foreground">{assessmentConfig.industry}</p>
                    </div>
                  </div>
                )}
                {assessmentConfig.ecosystem && (
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-md">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-xs text-muted-foreground">Ecosystem</p>
                      <p className="text-sm font-medium text-foreground">{assessmentConfig.ecosystem}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bundle Info */}
            {isBundle && (
              <div className="p-4 bg-accent-subtle rounded-lg border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Bundle Assessment Path
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You will complete three assessments in sequence:
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">1. FPA</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium text-foreground">2. GEB</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium text-foreground">3. EEA</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rules & Guidelines Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Important Rules & Guidelines
            </CardTitle>
            <CardDescription>
              Please read carefully before starting your assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3 p-4 bg-muted rounded-lg">
                <Camera className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Monitoring Active</h4>
                  <p className="text-sm text-muted-foreground">
                    Camera and microphone will be monitored throughout the assessment
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-muted rounded-lg">
                <LockKeyhole className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">No Pausing</h4>
                  <p className="text-sm text-muted-foreground">
                    Assessment cannot be paused once started
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-muted rounded-lg">
                <Coffee className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Break Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    {isBundle 
                      ? 'One 5-minute break available per assessment (3 total)'
                      : 'One 5-minute break allowed during assessment'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-muted rounded-lg">
                <BookOpen className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Complete All Questions</h4>
                  <p className="text-sm text-muted-foreground">
                    All questions must be answered to proceed
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-muted rounded-lg">
                <AlertTriangle className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">No External Resources</h4>
                  <p className="text-sm text-muted-foreground">
                    Use of external resources is not permitted
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-muted rounded-lg">
                <Wifi className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Stable Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure you have a stable internet connection
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button 
            size="lg"
            onClick={onStartAssessment}
            className="bg-accent hover:bg-accent-light text-accent-foreground px-12 py-6 text-lg font-semibold shadow-lg"
          >
            Start Assessment
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          By clicking "Start Assessment", you confirm that you have read and understood all rules and guidelines
        </p>
      </div>
    </div>
  );
};

export default AssessmentRulesScreen;
