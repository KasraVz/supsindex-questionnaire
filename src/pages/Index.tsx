import React, { useState } from 'react';
import SystemCheckScreen from '@/components/SystemCheckScreen';
import AssessmentInterface from '@/components/AssessmentInterface';
import AssessmentOverview from '@/components/AssessmentOverview';

interface AssessmentConfig {
  type: 'FPA' | 'GEB' | 'EEA';
  stage: string;
  industry?: string;
  ecosystem?: string;
}

const Index = () => {
  const [systemCheckComplete, setSystemCheckComplete] = useState(false);
  const [overviewComplete, setOverviewComplete] = useState(false);
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig | null>(null);

  const handleSystemCheckComplete = () => {
    setSystemCheckComplete(true);
  };

  const handleBeginAssessment = (config: AssessmentConfig) => {
    setAssessmentConfig(config);
    setOverviewComplete(true);
  };

  if (!systemCheckComplete) {
    return (
      <SystemCheckScreen 
        onSystemCheckComplete={handleSystemCheckComplete}
      />
    );
  }

  if (!overviewComplete) {
    return (
      <AssessmentOverview 
        onBeginAssessment={handleBeginAssessment}
      />
    );
  }

  return <AssessmentInterface assessmentConfig={assessmentConfig} />;
};

export default Index;
