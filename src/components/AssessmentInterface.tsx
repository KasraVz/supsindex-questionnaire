import React, { useState, useEffect } from 'react';
import AssessmentHeader from '@/components/AssessmentHeader';
import ProgressBar from '@/components/ProgressBar';
import StatisticsPanel from '@/components/StatisticsPanel';
import QuestionCard from '@/components/QuestionCard';
import AssessmentFooter from '@/components/AssessmentFooter';
import BreakModal from '@/components/BreakModal';
import EndSessionModal from '@/components/EndSessionModal';
import IdleWarningNotification from '@/components/IdleWarningNotification';
import { useIdleDetection } from '@/hooks/useIdleDetection';
import { useToast } from '@/hooks/use-toast';

interface AssessmentConfig {
  type: 'FPA' | 'GEB' | 'EEA' | 'BUNDLE';
  stage: string;
  industry?: string;
  ecosystem?: string;
}

interface AssessmentInterfaceProps {
  assessmentConfig: AssessmentConfig | null;
}

// Sample question data - in a real app this would come from an API
const generateQuestionSets = () => {
  const generalSets = Array.from({ length: 10 }, (_, setIndex) => ({
    id: `general-set-${setIndex + 1}`,
    title: `General Questions - Set ${setIndex + 1}`,
    questions: Array.from({ length: 5 }, (_, questionIndex) => ({
      id: `general-${setIndex + 1}-${questionIndex + 1}`,
      text: `This is general question ${questionIndex + 1} from set ${setIndex + 1}. How would you approach this scenario in a professional environment?`,
      options: [
        { id: 'a', text: 'Option A: Take immediate action with available resources' },
        { id: 'b', text: 'Option B: Consult with team members before proceeding' },
        { id: 'c', text: 'Option C: Research best practices and industry standards' },
        { id: 'd', text: 'Option D: Escalate to management for guidance' }
      ]
    }))
  }));

  const industrySets = Array.from({ length: 3 }, (_, setIndex) => ({
    id: `industry-set-${setIndex + 1}`,
    title: `Industry-Specific Questions - Set ${setIndex + 1}`,
    questions: Array.from({ length: 4 }, (_, questionIndex) => ({
      id: `industry-${setIndex + 1}-${questionIndex + 1}`,
      text: `This is an industry-specific question ${questionIndex + 1} from set ${setIndex + 1}. How would you handle this specialized situation?`,
      options: [
        { id: 'a', text: 'Option A: Apply industry-standard protocols' },
        { id: 'b', text: 'Option B: Adapt general principles to specific context' },
        { id: 'c', text: 'Option C: Seek specialized expertise or consultation' },
        { id: 'd', text: 'Option D: Document and report for future reference' }
      ]
    }))
  }));

  return { generalSets, industrySets };
};

const AssessmentInterface: React.FC<AssessmentInterfaceProps> = ({ assessmentConfig }) => {
  const { toast } = useToast();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [isIndustryPhase, setIsIndustryPhase] = useState(false);
  const [startTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [breakTaken, setBreakTaken] = useState(false);
  const [breakRequested, setBreakRequested] = useState(false);
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  
  // Bundle-specific state
  const [currentBundleAssessment, setCurrentBundleAssessment] = useState<'FPA' | 'GEB' | 'EEA'>('FPA');
  const [bundleBreaksUsed, setBundleBreaksUsed] = useState<Record<string, boolean>>({
    FPA: false,
    GEB: false,
    EEA: false
  });

  const { generalSets, industrySets } = generateQuestionSets();
  const totalGeneralSets = generalSets.length;
  const totalIndustrySets = industrySets.length;

  const currentQuestionSet = isIndustryPhase 
    ? industrySets[currentSetIndex - totalGeneralSets]
    : generalSets[currentSetIndex];

  const currentSetNumber = currentSetIndex + 1;
  const industryProgress = isIndustryPhase 
    ? ((currentSetIndex - totalGeneralSets + 1) / totalIndustrySets) * 100 
    : 0;

  // Check if all questions in current set are answered
  const currentSetAnswered = currentQuestionSet?.questions.every(
    question => answers[question.id]
  ) || false;

  const isLastSet = isIndustryPhase && (currentSetIndex >= totalGeneralSets + totalIndustrySets - 1);

  // Idle detection
  useIdleDetection({
    idleTime: 60000, // 1 minute
    onIdle: () => {
      if (!showBreakModal && !showEndSessionModal && !showIdleWarning) {
        setShowIdleWarning(true);
      }
    }
  });

  useEffect(() => {
    // Transition to industry phase when general questions are complete
    if (currentSetIndex >= totalGeneralSets && !isIndustryPhase) {
      setIsIndustryPhase(true);
      
      // For bundle, check if we need to transition to next assessment
      if (assessmentConfig?.type === 'BUNDLE') {
        handleBundleAssessmentTransition();
      } else {
        toast({
          title: "Phase Complete!",
          description: "Moving to industry-specific questions.",
          variant: "default",
        });
      }
    }
  }, [currentSetIndex, totalGeneralSets, isIndustryPhase, toast]);

  const handleBundleAssessmentTransition = () => {
    if (assessmentConfig?.type !== 'BUNDLE') return;
    
    if (currentBundleAssessment === 'FPA') {
      setCurrentBundleAssessment('GEB');
      setCurrentSetIndex(0);
      setIsIndustryPhase(false);
      setBreakTaken(false);
      toast({
        title: "FPA Complete! 🎉",
        description: "Moving to General Entrepreneur Behavior assessment.",
        variant: "default",
      });
    } else if (currentBundleAssessment === 'GEB') {
      setCurrentBundleAssessment('EEA');
      setCurrentSetIndex(0);
      setIsIndustryPhase(false);
      setBreakTaken(false);
      toast({
        title: "GEB Complete! 🎉",
        description: "Moving to Ecosystem Environment Assessment.",
        variant: "default",
      });
    }
  };

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleQuestionFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleTakeBreak = () => {
    const isBundle = assessmentConfig?.type === 'BUNDLE';
    const bundleBreakUsed = isBundle && bundleBreaksUsed[currentBundleAssessment];
    
    if ((!breakTaken || (isBundle && !bundleBreakUsed)) && !breakRequested) {
      setBreakRequested(true);
      toast({
        title: "Break Requested",
        description: "Your break will start after you complete this question set.",
        variant: "default"
      });
    } else if (breakRequested) {
      toast({
        title: "Break Already Requested",
        description: "Your break will start after completing this set.",
        variant: "default"
      });
    } else {
      toast({
        title: "Break Already Taken",
        description: isBundle 
          ? `You've already used your break for the ${currentBundleAssessment} assessment.`
          : "You can only take one break during the assessment.",
        variant: "destructive"
      });
    }
  };

  const handleBreakComplete = () => {
    setShowBreakModal(false);
    setBreakTaken(true);
    setBreakRequested(false);
    
    // For bundle, track breaks per assessment
    if (assessmentConfig?.type === 'BUNDLE') {
      setBundleBreaksUsed(prev => ({
        ...prev,
        [currentBundleAssessment]: true
      }));
    }
    
    toast({
      title: "Break Complete",
      description: "Welcome back! You can now continue with your assessment.",
    });
    
    // Continue to next set after break
    setCurrentSetIndex(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEndSession = () => {
    setShowEndSessionModal(true);
  };

  const handleConfirmEndSession = () => {
    // Redirect to dashboard - in a real app this would be handled by router
    window.location.href = '/dashboard';
  };

  const handleIdleStayActive = () => {
    setShowIdleWarning(false);
    toast({
      title: "Activity Confirmed",
      description: "Thank you for staying active during your assessment.",
    });
  };

  // Calculate statistics
  const completedSets = Math.min(currentSetIndex, isIndustryPhase ? totalGeneralSets : totalGeneralSets);
  const currentPhaseQuestions = isIndustryPhase ? totalIndustrySets * 4 : totalGeneralSets * 5;
  const answeredInCurrentPhase = Object.keys(answers).filter(questionId => {
    if (isIndustryPhase) {
      return questionId.startsWith('industry-');
    } else {
      return questionId.startsWith('general-');
    }
  }).length;

  const handleNext = async () => {
    // For bundle, check if this assessment is complete and transition to next
    if (assessmentConfig?.type === 'BUNDLE' && isLastSet) {
      if (currentBundleAssessment === 'EEA') {
        // All bundle assessments complete
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast({
          title: "All Assessments Complete! 🎉",
          description: "Your comprehensive bundle assessment has been submitted successfully.",
          variant: "default",
        });
        setIsSubmitting(false);
        return;
      } else {
        // Transition to next assessment in bundle
        handleBundleAssessmentTransition();
        return;
      }
    }
    
    if (isLastSet) {
      // Handle assessment completion
      setIsSubmitting(true);
      
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Assessment Complete!",
        description: "Your responses have been submitted successfully.",
        variant: "default",
      });
      
      setIsSubmitting(false);
      return;
    }

    // Check if break was requested
    if (breakRequested) {
      setShowBreakModal(true);
      return;
    }

    // Move to next set
    setCurrentSetIndex(prev => prev + 1);
    
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!currentQuestionSet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Loading Assessment...</h1>
          <p className="text-muted-foreground">Please wait while we prepare your questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <AssessmentHeader 
        startTime={startTime} 
        onTakeBreak={handleTakeBreak}
        onEndSession={handleEndSession}
        isBreakAvailable={
          assessmentConfig?.type === 'BUNDLE' 
            ? !bundleBreaksUsed[currentBundleAssessment] && !breakRequested
            : !breakTaken && !breakRequested
        }
      />
      
      {/* Progress Bar */}
      <div className="pt-16">
        <ProgressBar
          currentSet={currentSetNumber}
          totalGeneralSets={totalGeneralSets}
          isIndustrySpecific={isIndustryPhase}
          industryProgress={industryProgress}
        />
      </div>
      
      {/* Statistics Panel */}
      <StatisticsPanel
        setsCompleted={completedSets}
        totalSets={isIndustryPhase ? totalIndustrySets : totalGeneralSets}
        questionsAnswered={answeredInCurrentPhase}
        totalQuestions={currentPhaseQuestions}
        questionsFlagged={flaggedQuestions.size}
        isIndustryPhase={isIndustryPhase}
      />
      
      {/* Main Content Area */}
      <main className="pb-24">
        <QuestionCard
          questionSet={currentQuestionSet}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          isGeneralQuestions={!isIndustryPhase}
          currentSetNumber={isIndustryPhase ? currentSetIndex - totalGeneralSets + 1 : currentSetNumber}
          totalSets={isIndustryPhase ? totalIndustrySets : totalGeneralSets}
          flaggedQuestions={flaggedQuestions}
          onQuestionFlag={handleQuestionFlag}
        />
      </main>
      
      {/* Fixed Footer */}
      <AssessmentFooter
        onNext={handleNext}
        canProceed={currentSetAnswered}
        isLastSet={isLastSet}
        isSubmitting={isSubmitting}
      />

      {/* Modals and Notifications */}
      <BreakModal
        isOpen={showBreakModal}
        onBreakComplete={handleBreakComplete}
      />
      
      <EndSessionModal
        isOpen={showEndSessionModal}
        onClose={() => setShowEndSessionModal(false)}
        onConfirm={handleConfirmEndSession}
      />
      
      <IdleWarningNotification
        isVisible={showIdleWarning}
        onDismiss={() => setShowIdleWarning(false)}
        onStayActive={handleIdleStayActive}
      />
    </div>
  );
};

export default AssessmentInterface;