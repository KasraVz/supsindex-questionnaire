import React, { useState, useEffect } from 'react';
import AssessmentHeader from './AssessmentHeader';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import AssessmentFooter from './AssessmentFooter';
import { useToast } from '@/hooks/use-toast';

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

const AssessmentInterface: React.FC = () => {
  const { toast } = useToast();
  const [startTime] = useState(new Date());
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isIndustryPhase, setIsIndustryPhase] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const canGoBack = currentSetIndex > 0;
  const isLastSet = isIndustryPhase && (currentSetIndex >= totalGeneralSets + totalIndustrySets - 1);

  useEffect(() => {
    // Transition to industry phase when general questions are complete
    if (currentSetIndex >= totalGeneralSets && !isIndustryPhase) {
      setIsIndustryPhase(true);
      toast({
        title: "Phase Complete!",
        description: "Moving to industry-specific questions.",
        variant: "default",
      });
    }
  }, [currentSetIndex, totalGeneralSets, isIndustryPhase, toast]);

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = async () => {
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

    // Move to next set
    setCurrentSetIndex(prev => prev + 1);
    
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (canGoBack) {
      const newIndex = currentSetIndex - 1;
      setCurrentSetIndex(newIndex);
      
      // Check if we're going back from industry to general phase
      if (isIndustryPhase && newIndex < totalGeneralSets) {
        setIsIndustryPhase(false);
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      <AssessmentHeader startTime={startTime} />
      
      {/* Progress Bar */}
      <div className="pt-16">
        <ProgressBar
          currentSet={currentSetNumber}
          totalGeneralSets={totalGeneralSets}
          isIndustrySpecific={isIndustryPhase}
          industryProgress={industryProgress}
        />
      </div>
      
      {/* Main Content Area */}
      <main className="pb-24">
        <QuestionCard
          questionSet={currentQuestionSet}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          isGeneralQuestions={!isIndustryPhase}
          currentSetNumber={isIndustryPhase ? currentSetIndex - totalGeneralSets + 1 : currentSetNumber}
          totalSets={isIndustryPhase ? totalIndustrySets : totalGeneralSets}
        />
      </main>
      
      {/* Fixed Footer */}
      <AssessmentFooter
        onPrevious={canGoBack ? handlePrevious : undefined}
        onNext={handleNext}
        canGoBack={canGoBack}
        canProceed={currentSetAnswered}
        isLastSet={isLastSet}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AssessmentInterface;