/**
 * Custom hook for syncing audio playback with a countdown timer
 * Ensures perfect synchronization between audio and timer state
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSyncedAudioTimerOptions {
  duration: number; // Duration in seconds
  onComplete?: () => void;
  onTick?: (timeLeft: number) => void;
}

interface UseSyncedAudioTimerReturn {
  timeLeft: number;
  isPlaying: boolean;
  progress: number; // 0-100
  start: () => void;
  pause: () => void;
  stop: () => void;
  reset: () => void;
  seek: (seconds: number) => void;
}

export const useSyncedAudioTimer = (
  options: UseSyncedAudioTimerOptions
): UseSyncedAudioTimerReturn => {
  const { duration, onComplete, onTick } = options;
  
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(duration);

  // Calculate progress percentage
  useEffect(() => {
    const progressPercent = ((duration - timeLeft) / duration) * 100;
    setProgress(Math.min(100, Math.max(0, progressPercent)));
  }, [timeLeft, duration]);

  // Main timer logic
  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now();
      const initialTimeLeft = pausedTimeRef.current;

      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const newTimeLeft = Math.max(0, initialTimeLeft - elapsed);
        
        setTimeLeft(newTimeLeft);
        onTick?.(newTimeLeft);

        if (newTimeLeft <= 0) {
          setIsPlaying(false);
          pausedTimeRef.current = 0;
          onComplete?.();
          
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      pausedTimeRef.current = timeLeft;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, onComplete, onTick]);

  const start = useCallback(() => {
    if (timeLeft > 0) {
      setIsPlaying(true);
    }
  }, [timeLeft]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setTimeLeft(duration);
    pausedTimeRef.current = duration;
    setProgress(0);
  }, [duration]);

  const reset = useCallback(() => {
    stop();
  }, [stop]);

  const seek = useCallback((seconds: number) => {
    const newTimeLeft = Math.max(0, Math.min(duration, duration - seconds));
    setTimeLeft(newTimeLeft);
    pausedTimeRef.current = newTimeLeft;
    
    if (isPlaying) {
      startTimeRef.current = Date.now();
    }
  }, [duration, isPlaying]);

  return {
    timeLeft,
    isPlaying,
    progress,
    start,
    pause,
    stop,
    reset,
    seek,
  };
};
