'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusTimerProps {
  onTimerStart?: (duration: number) => void;
  onTimerComplete?: () => void;
  onTimerStop?: () => void;
}

interface TimerPreset {
  name: string;
  work: number; // in minutes
  break: number; // in minutes
}

const PRESETS: TimerPreset[] = [
  { name: 'Classic', work: 25, break: 5 },
  { name: 'Extended', work: 50, break: 10 },
  { name: 'Short', work: 15, break: 3 },
  { name: 'Long', work: 90, break: 15 },
];

const FocusTimer = memo(({ onTimerStart, onTimerComplete, onTimerStop }: FocusTimerProps) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [timeLeft, setTimeLeft] = useState(selectedPreset.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveSession = useCallback((duration: number, preset: string) => {
    const sessions = JSON.parse(localStorage.getItem('neurofocus_sessions') || '[]');
    const newSession = {
      id: Date.now().toString(),
      duration,
      preset,
      timestamp: new Date().toISOString(),
      type: 'focus'
    };
    sessions.push(newSession);
    localStorage.setItem('neurofocus_sessions', JSON.stringify(sessions));
  }, []);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setIsBreak(false);
    setTimeLeft(selectedPreset.work * 60);
    onTimerStart?.(selectedPreset.work);
  }, [selectedPreset, onTimerStart]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(selectedPreset.work * 60);
    onTimerStop?.();
  }, [selectedPreset, onTimerStop]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          
          if (!isBreak) {
            // Focus session completed
            saveSession(selectedPreset.work, selectedPreset.name);
            setSessionsCompleted((prev) => prev + 1);
            setIsBreak(true);
            setTimeLeft(selectedPreset.break * 60);
            onTimerComplete?.();
            
            // Play completion sound (optional)
            if (typeof Audio !== 'undefined') {
              const audio = new Audio('/sounds/complete.mp3');
              audio.volume = 0.3;
              audio.play().catch(() => {});
            }
          } else {
            // Break completed
            setIsBreak(false);
            setTimeLeft(selectedPreset.work * 60);
            setIsRunning(false);
          }
          
          return prev - 1;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isBreak, selectedPreset, saveSession, onTimerComplete]);

  const progress = isBreak
    ? ((selectedPreset.break * 60 - timeLeft) / (selectedPreset.break * 60)) * 100
    : ((selectedPreset.work * 60 - timeLeft) / (selectedPreset.work * 60)) * 100;

  return (
    <motion.div
      className="relative bg-gradient-to-br from-[#1a1f35]/80 to-[#0a0e1a]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#5b9eff]/20 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow Effect */}
      {isRunning && (
        <div className="absolute inset-0 bg-[#5b9eff]/10 rounded-2xl blur-xl animate-pulse" />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-[#5b9eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Focus Timer
          </h3>
          <div className="px-3 py-1 bg-[#5b9eff]/20 rounded-full text-xs text-[#5b9eff] font-medium">
            {sessionsCompleted} sessions today
          </div>
        </div>

        {/* Preset Selection */}
        {!isRunning && (
          <div className="grid grid-cols-4 gap-2 mb-6">
            {PRESETS.map((preset) => (
              <motion.button
                key={preset.name}
                onClick={() => {
                  setSelectedPreset(preset);
                  setTimeLeft(preset.work * 60);
                }}
                className={`p-3 rounded-lg text-center transition-all ${
                  selectedPreset.name === preset.name
                    ? 'bg-[#5b9eff] text-white shadow-lg shadow-[#5b9eff]/30'
                    : 'bg-[#1a1f35]/50 text-gray-400 hover:text-white hover:bg-[#1a1f35]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-sm font-medium mb-1">{preset.name}</div>
                <div className="text-xs opacity-70">{preset.work}/{preset.break}m</div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Timer Display */}
        <div className="relative mb-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isBreak ? 'break' : 'focus'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-white mb-2 font-mono">
                  {formatTime(timeLeft)}
                </div>
                <div className={`text-sm font-medium ${isBreak ? 'text-[#34d399]' : 'text-[#5b9eff]'}`}>
                  {isBreak ? 'Break Time' : 'Focus Time'}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1a1f35"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isBreak ? '#34d399' : '#5b9eff'}
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
              style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
            />
          </svg>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning ? (
            <motion.button
              onClick={startTimer}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Focus
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={pauseTimer}
                className="flex-1 py-3 px-4 bg-[#1a1f35] text-white rounded-lg font-semibold hover:bg-[#2a2f4a] transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                Pause
              </motion.button>
              <motion.button
                onClick={stopTimer}
                className="flex-1 py-3 px-4 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z" />
                </svg>
                Stop
              </motion.button>
            </>
          )}
        </div>

        {/* Tips */}
        {!isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-[#5b9eff]/10 rounded-lg border border-[#5b9eff]/20"
          >
            <p className="text-xs text-gray-400">
              <span className="font-medium text-white">Pro tip:</span> The timer will auto-start your selected audio track when you begin.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

FocusTimer.displayName = 'FocusTimer';

export default FocusTimer;
