import { useState, useEffect, useCallback } from 'react';

interface UseIdleDetectionProps {
  idleTime?: number; // Time in milliseconds
  onIdle?: () => void;
}

export const useIdleDetection = ({ 
  idleTime = 60000, // Default 1 minute
  onIdle 
}: UseIdleDetectionProps = {}) => {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    if (isIdle) {
      setIsIdle(false);
    }
  }, [isIdle]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Set up interval to check for idle state
    const interval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      
      if (timeSinceLastActivity >= idleTime && !isIdle) {
        setIsIdle(true);
        onIdle?.();
      }
    }, 1000);

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(interval);
    };
  }, [handleActivity, idleTime, isIdle, lastActivity, onIdle]);

  return {
    isIdle,
    resetTimer,
    lastActivity
  };
};