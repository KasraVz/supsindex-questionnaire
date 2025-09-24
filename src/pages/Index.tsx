import React, { useState } from 'react';
import SystemCheckScreen from '@/components/SystemCheckScreen';
import AssessmentInterface from '@/components/AssessmentInterface';

const Index = () => {
  const [systemCheckComplete, setSystemCheckComplete] = useState(false);

  if (!systemCheckComplete) {
    return (
      <SystemCheckScreen 
        onSystemCheckComplete={() => setSystemCheckComplete(true)}
      />
    );
  }

  return <AssessmentInterface />;
};

export default Index;
