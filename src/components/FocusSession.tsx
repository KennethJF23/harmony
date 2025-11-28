'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';
import UnifiedAudioPlayer from './UnifiedAudioPlayer';
import { formatTime } from '@/utils/storage';

interface FocusSessionProps {
  initialDuration?: number; // in seconds
  trackId?: string;
}

const FocusSession = ({ initialDuration = 1500, trackId }: FocusSessionProps) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(initialDuration);

  // Sync session timer
  useEffect(() => {
    if (sessionActive && !isPaused) {
      startTimeRef.current = Date.now();
      const initialTime = pausedTimeRef.current;

      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = Math.max(0, initialTime - elapsed);
        
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          handleSessionComplete();
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      pausedTimeRef.current = timeRemaining;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionActive, isPaused, timeRemaining]);

  const handleSessionComplete = () => {
    setSessionActive(false);
    setSessionComplete(true);
    setTimeRemaining(0);
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 Focus Session Complete!', {
        body: 'Great work! Time for a well-deserved break.',
        icon: '/icon-192x192.png',
      });
    }

    // Play completion sound (optional)
    if (typeof window !== 'undefined') {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {/* ignore */});
    }
  };

  const startSession = () => {
    setSessionActive(true);
    setIsPaused(false);
    setSessionComplete(false);
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const stopSession = () => {
    setSessionActive(false);
    setIsPaused(false);
    setTimeRemaining(initialDuration);
    pausedTimeRef.current = initialDuration;
  };

  const resetSession = () => {
    setSessionComplete(false);
    setTimeRemaining(initialDuration);
    pausedTimeRef.current = initialDuration;
  };

  const progress = ((initialDuration - timeRemaining) / initialDuration) * 100;

  return (
    <div className="space-y-6">
      {/* Session Timer Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[var(--surface)]/80 to-[var(--surface-alt)]/60 backdrop-blur-xl rounded-3xl p-8 border border-[var(--primary)]/20 shadow-2xl"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Focus Session Timer
          </h2>
          <p className="text-sm text-[var(--foreground)]/60">
            {sessionActive 
              ? isPaused 
                ? 'Paused - Resume when ready' 
                : 'Session in progress'
              : sessionComplete 
                ? 'Session complete!' 
                : 'Start your focused session'}
          </p>
        </div>

        {/* Large Timer Display */}
        <div className="relative mb-6">
          <div className="text-center py-12 relative">
            <motion.div
              className="text-7xl md:text-8xl font-mono font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent"
              animate={sessionActive && !isPaused ? {
                scale: [1, 1.02, 1],
              } : {}}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {formatTime(timeRemaining)}
            </motion.div>
            
            {/* Animated Ring */}
            <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-[var(--primary)]/10"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                className="text-[var(--primary)]"
                style={{
                  pathLength: progress / 100,
                  rotate: -90,
                  transformOrigin: '50% 50%',
                }}
                strokeDasharray="1 1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-[var(--background)]/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Session Controls */}
        <div className="flex items-center justify-center gap-4">
          {!sessionActive ? (
            <motion.button
              onClick={sessionComplete ? resetSession : startSession}
              className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6" fill="currentColor" />
              {sessionComplete ? 'Start New Session' : 'Start Session'}
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={pauseSession}
                className="px-6 py-3 bg-[var(--surface-alt)] hover:bg-[var(--primary)]/20 text-[var(--foreground)] rounded-full font-semibold transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Pause className="w-5 h-5" />
                {isPaused ? 'Resume' : 'Pause'}
              </motion.button>
              
              <motion.button
                onClick={stopSession}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full font-semibold transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Square className="w-5 h-5" />
                Stop
              </motion.button>
            </>
          )}
        </div>

        {/* Session Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-[var(--foreground)]/60 mb-1">Total</div>
            <div className="font-semibold text-[var(--foreground)]">
              {formatTime(initialDuration)}
            </div>
          </div>
          <div>
            <div className="text-[var(--foreground)]/60 mb-1">Elapsed</div>
            <div className="font-semibold text-[var(--foreground)]">
              {formatTime(initialDuration - timeRemaining)}
            </div>
          </div>
          <div>
            <div className="text-[var(--foreground)]/60 mb-1">Remaining</div>
            <div className="font-semibold text-[var(--foreground)]">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Completion Message */}
      <AnimatePresence>
        {sessionComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 text-center"
          >
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">
              Session Complete!
            </h3>
            <p className="text-[var(--foreground)]/70 mb-4">
              Great work! You completed your focus session. Take a short break before starting the next one.
            </p>
            <button
              onClick={resetSession}
              className="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-colors"
            >
              Start New Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Player */}
      <UnifiedAudioPlayer 
        initialTrackId={trackId}
        onPlayStateChange={(playing) => {
          // Auto-sync: when audio starts, start session
          if (playing && !sessionActive) {
            startSession();
          }
        }}
      />
    </div>
  );
};

export default FocusSession;
