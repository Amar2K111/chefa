import { useState, useEffect, useCallback } from 'react';
import { showNotification } from '@/utils/notifications';

export function useTimer() {
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            if (soundEnabled) {
              showNotification('⏰ Timer terminé !', {
                body: 'Votre temps de cuisson est écoulé.'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds, soundEnabled]);

  const startTimer = useCallback((minutes: number) => {
    setTimerSeconds(minutes * 60);
    setTimerActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerActive(false);
  }, []);

  const resumeTimer = useCallback(() => {
    if (timerSeconds > 0) {
      setTimerActive(true);
    }
  }, [timerSeconds]);

  const resetTimer = useCallback(() => {
    setTimerActive(false);
    setTimerSeconds(0);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timerActive,
    timerSeconds,
    soundEnabled,
    setSoundEnabled,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formatTime
  };
}

