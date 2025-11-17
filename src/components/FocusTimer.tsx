'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface FocusTimerProps {
  onTimerComplete?: () => void;
  onTimerStart?: () => void;
  onTimerStop?: () => void;
}

interface TimerPreset {
  name: string;
  focus: number;
  break: number;
  description: string;
}

const presets: TimerPreset[] = [
  { name: 'Pomodoro', focus: 25, break: 5, description: 'Classic 25/5' },
  { name: 'Deep Work', focus: 50, break: 10, description: 'Extended 50/10' },
  { name: 'Quick Sprint', focus: 15, break: 3, description: 'Short 15/3' },
];

const FocusTimer = ({ onTimerComplete, onTimerStart, onTimerStop }: FocusTimerProps) => {
  const [selectedPreset, setSelectedPreset] = useState<TimerPreset>(presets[0]);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer complete
            if (!isBreak) {
              setCompletedSessions(c => c + 1);
              onTimerComplete?.();
            }
            // Switch to break or focus
            const nextDuration = isBreak ? selectedPreset.focus * 60 : selectedPreset.break * 60;
            setIsBreak(!isBreak);
            return nextDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isBreak, selectedPreset, onTimerComplete]);

  const startTimer = () => {
    setIsRunning(true);
    onTimerStart?.();
  };

  const pauseTimer = () => {
    setIsRunning(false);
    onTimerStop?.();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(selectedPreset.focus * 60);
    onTimerStop?.();
  };

  const selectPreset = (preset: TimerPreset) => {
    setSelectedPreset(preset);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(preset.focus * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak
    ? ((selectedPreset.break * 60 - timeLeft) / (selectedPreset.break * 60)) * 100
    : ((selectedPreset.focus * 60 - timeLeft) / (selectedPreset.focus * 60)) * 100;

  return (
    <motion.div
      className="bg-gradient-to-br from-[var(--surface)]/80 to-[var(--surface-alt)]/60 backdrop-blur-xl rounded-3xl p-8 border border-[var(--primary)]/20 shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-1">
          <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
            Focus Timer
          </span>
        </h3>
        <p className="text-xs text-[var(--foreground)]/60">
          Pomodoro technique
        </p>
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="relative w-48 h-48 mx-auto">
          {/* Progress Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="84"
              fill="none"
              stroke="rgba(192, 202, 245, 0.1)"
              strokeWidth="12"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="84"
              fill="none"
              stroke={isBreak ? '#9ece6a' : '#7aa2f7'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="527.52"
              strokeDashoffset={527.52 - (527.52 * progress) / 100}
              style={{
                filter: `drop-shadow(0 0 10px ${isBreak ? '#9ece6a' : '#7aa2f7'})`
              }}
              transition={{ duration: 0.3 }}
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-1"
              key={timeLeft}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatTime(timeLeft)}
            </motion.div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isBreak
                ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                : 'bg-[var(--primary)]/20 text-[var(--primary)]'
            }`}>
              {isBreak ? 'Break' : 'Focus'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3 mb-6">
        {!isRunning ? (
          <motion.button
            onClick={startTimer}
            className="px-6 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start</span>
            </span>
          </motion.button>
        ) : (
          <motion.button
            onClick={pauseTimer}
            className="px-6 py-2.5 bg-[var(--surface)] text-[var(--foreground)] border border-[var(--primary)]/30 rounded-full font-semibold hover:bg-[var(--surface-alt)] transition-all text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Pause</span>
            </span>
          </motion.button>
        )}
        
        <motion.button
          onClick={resetTimer}
          className="px-5 py-2.5 bg-[var(--background)]/60 text-[var(--foreground)]/70 border border-[var(--foreground)]/10 rounded-full font-semibold hover:border-[var(--primary)]/30 transition-all text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </div>

      {/* Stats */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[var(--background)]/40 rounded-full">
          <span className="text-xs text-[var(--foreground)]/70">
            Today: <span className="font-bold text-[var(--primary)]">{completedSessions}</span> sessions
          </span>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {presets.map((preset) => (
          <motion.button
            key={preset.name}
            onClick={() => selectPreset(preset)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedPreset.name === preset.name
                ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                : 'border-[var(--foreground)]/10 bg-[var(--background)]/30 hover:border-[var(--primary)]/30'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isRunning}
          >
            <div className="text-xs font-semibold text-[var(--foreground)]">{preset.name}</div>
            <div className="text-[10px] text-[var(--foreground)]/60">{preset.description}</div>
          </motion.button>
        ))}
      </div>

      {/* Pro Tips */}
      <div className="mt-auto pt-4 border-t border-[var(--foreground)]/10">
        <div className="text-xs text-[var(--foreground)]/50 space-y-2">
          <p className="flex items-start space-x-2">
            <span className="text-[var(--primary)] mt-0.5">•</span>
            <span>Take short walks during breaks to boost creativity</span>
          </p>
          <p className="flex items-start space-x-2">
            <span className="text-[var(--accent)] mt-0.5">•</span>
            <span>Stay hydrated for better focus and concentration</span>
          </p>
          <p className="flex items-start space-x-2">
            <span className="text-[var(--secondary)] mt-0.5">•</span>
            <span>Combine with binaural beats for enhanced results</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FocusTimer;
