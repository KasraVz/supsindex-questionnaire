import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Building, MapPin, ChevronRight } from 'lucide-react';

interface AssessmentOverviewProps {
  onBeginAssessment: (config: AssessmentConfig) => void;
}

interface AssessmentConfig {
  type: 'FPA' | 'GEB' | 'EEA' | 'BUNDLE';
  stage: string;
  industry?: string;
  ecosystem?: string;
}

const AssessmentOverview: React.FC<AssessmentOverviewProps> = ({ onBeginAssessment }) => {
  const [selectedType, setSelectedType] = useState<'FPA' | 'GEB' | 'EEA' | 'BUNDLE' | ''>('');
  const [stage, setStage] = useState('');
  const [industry, setIndustry] = useState('');
  const [ecosystem, setEcosystem] = useState('');

  const assessmentTypes = {
    FPA: {
      title: 'Founder Public Awareness',
      description: 'Evaluates your public visibility and market recognition as a founder.',
      duration: '45-60 minutes',
      questions: '80-120 questions',
      fields: ['Stage', 'Industry'],
      color: 'bg-accent',
      badge: 'FPA'
    },
    GEB: {
      title: 'General Entrepreneur Behavior',
      description: 'Assesses your entrepreneurial mindset, decision-making, and leadership capabilities.',
      duration: '30-45 minutes',
      questions: '60-80 questions',
      fields: ['Stage'],
      color: 'bg-primary',
      badge: 'GEB'
    },
    EEA: {
      title: 'Ecosystem Environment Assessment',
      description: 'Analyzes your startup ecosystem engagement and environmental factors.',
      duration: '50-70 minutes',
      questions: '90-130 questions',
      fields: ['Stage', 'Industry', 'Ecosystem'],
      color: 'bg-tertiary',
      badge: 'EEA'
    },
    BUNDLE: {
      title: 'Complete Assessment Bundle',
      description: 'Take all three assessments in sequence for comprehensive evaluation across all dimensions.',
      duration: '2-3 hours',
      questions: '230-330 questions',
      fields: ['Stage', 'Industry', 'Ecosystem'],
      color: 'bg-gradient-to-r from-accent via-primary to-tertiary',
      badge: 'ALL 3'
    }
  };

  const stages = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth', 'IPO/Exit'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'SaaS',
    'Manufacturing', 'Energy', 'Agriculture', 'Transportation', 'Media', 'Other'
  ];

  const ecosystems = [
    'Silicon Valley', 'New York', 'Boston', 'Austin', 'Seattle', 'Denver',
    'London', 'Berlin', 'Tel Aviv', 'Singapore', 'Toronto', 'Other'
  ];

  const canProceed = selectedType && stage && 
    (selectedType === 'GEB' || industry) && 
    (selectedType !== 'EEA' && selectedType !== 'BUNDLE' || ecosystem);

  const handleBegin = () => {
    if (canProceed) {
      onBeginAssessment({
        type: selectedType as 'FPA' | 'GEB' | 'EEA' | 'BUNDLE',
        stage,
        industry: selectedType !== 'GEB' ? industry : undefined,
        ecosystem: (selectedType === 'EEA' || selectedType === 'BUNDLE') ? ecosystem : undefined
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Assessment Overview</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your assessment type and provide the required information to begin your evaluation.
            All data is securely processed and confidential.
          </p>
        </div>

        {/* Assessment Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(assessmentTypes).map(([key, type]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedType === key 
                  ? 'ring-2 ring-accent shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedType(key as 'FPA' | 'GEB' | 'EEA' | 'BUNDLE')}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className={`${type.color} text-white`}>
                    {type.badge}
                  </Badge>
                  {selectedType === key && (
                    <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
                <CardDescription className="text-sm">
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {type.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {type.questions}
                </div>
                <div className="flex flex-wrap gap-1">
                  {type.fields.map(field => (
                    <Badge key={field} variant="secondary" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configuration Form */}
        {selectedType && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Assessment Configuration</span>
                <Badge className="bg-accent text-white">{selectedType}</Badge>
              </CardTitle>
              <CardDescription>
                Please provide the following information for your assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Stage Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Business Stage
                  </label>
                  <Select value={stage} onValueChange={setStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(stg => (
                        <SelectItem key={stg} value={stg}>{stg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry Selection (for FPA & EEA) */}
                {selectedType !== 'GEB' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Industry
                    </label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(ind => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Ecosystem Selection (for EEA and BUNDLE) */}
                {(selectedType === 'EEA' || selectedType === 'BUNDLE') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Ecosystem
                    </label>
                    <Select value={ecosystem} onValueChange={setEcosystem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your ecosystem" />
                      </SelectTrigger>
                      <SelectContent>
                        {ecosystems.map(eco => (
                          <SelectItem key={eco} value={eco}>{eco}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Assessment Info */}
              <div className="bg-accent-subtle p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-foreground">Important Information:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedType === 'BUNDLE' ? (
                    <>
                      <li>• You will complete all three assessments in sequence (FPA → GEB → EEA)</li>
                      <li>• Total estimated time: 2-3 hours for comprehensive evaluation</li>
                      <li>• You can take one 5-minute break during each assessment (3 breaks total)</li>
                      <li>• Ensure stable internet connection throughout all assessments</li>
                      <li>• Camera and microphone monitoring is required for security</li>
                      <li>• All questions must be answered to complete the bundle</li>
                    </>
                  ) : (
                    <>
                      <li>• Ensure stable internet connection throughout the assessment</li>
                      <li>• You can take one 5-minute break during the assessment</li>
                      <li>• Camera and microphone monitoring is required for security</li>
                      <li>• Assessment cannot be paused or resumed once started</li>
                      <li>• All questions must be answered to complete the assessment</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Begin Button */}
              <Button
                onClick={handleBegin}
                disabled={!canProceed}
                className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
                size="lg"
              >
                Begin Assessment
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssessmentOverview;