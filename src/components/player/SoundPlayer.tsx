'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { getAudioEngine } from '@/utils/audioEngine';
import { trackSession, formatTime } from '@/utils/storage';
import { useSyncedAudioTimer } from '@/hooks/useSyncedAudioTimer';

interface SoundPlayerProps {
  trackTitle: string;
  frequency: string;
  duration: number; // in seconds
  baseFrequency: number;
  beatFrequency: number;
  category: string;
}

const SoundPlayer = ({
  trackTitle,
  frequency,
  duration,
  baseFrequency,
  beatFrequency,
  category
}: SoundPlayerProps) => {
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [aiTip, setAiTip] = useState('');
  
  const audioEngineRef = useRef(getAudioEngine());
  const sessionStartTimeRef = useRef<number | null>(null);

  // Synchronized audio-timer hook
  const {
    timeLeft,
    isPlaying,
    progress,
    start,
    pause,
    stop,
    reset
  } = useSyncedAudioTimer({
    duration,
    onComplete: handleSessionComplete
  });

  // Handle session completion
  function handleSessionComplete() {
    setSessionComplete(true);
    
    // Stop audio engine
    audioEngineRef.current?.stop();
    
    // Track session
    if (sessionStartTimeRef.current) {
      trackSession({
        trackId: 0,
        trackName: trackTitle,
        duration: Math.floor((Date.now() - sessionStartTimeRef.current) / 1000),
        timestamp: sessionStartTimeRef.current,
        completed: true,
        goal: category as 'focus' | 'sleep' | 'relaxation' | 'creativity'
      });
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 Session Complete!', {
        body: `Great work! You completed your ${trackTitle} session.`,
        icon: '/icon-192x192.png'
      });
    }
  }

  // Generate AI tip based on category
  useEffect(() => {
    const tips: Record<string, string[]> = {
      focus: [
        'Minimize distractions by closing unnecessary tabs and silencing notifications.',
        'Take a 5-minute break every 25 minutes to maintain peak concentration.',
        'Stay hydrated - drink water throughout your session for optimal brain function.',
      ],
      relaxation: [
        'Close your eyes and focus on your breathing for deeper relaxation.',
        'Find a comfortable position and let your body completely relax.',
        'Visualize a peaceful scene to enhance the calming effect.',
      ],
      creativity: [
        'Keep a notebook nearby to capture ideas as they flow.',
        'Let your mind wander freely without judgment.',
        'Doodle or sketch while listening to boost creative thinking.',
      ],
      sleep: [
        'Dim the lights and make your environment as dark as possible.',
        'Put your phone on silent and out of reach.',
        'Focus on your breath and let go of the day\'s thoughts.',
      ]
    };

    const categoryTips = tips[category] || tips.focus;
    const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
    setAiTip(randomTip);
  }, [category]);

  // Handle play/pause toggle
  const handlePlayPause = useCallback(() => {
    if (sessionComplete) {
      // Reset session
      setSessionComplete(false);
      reset();
      return;
    }

    if (isPlaying) {
      pause();
      audioEngineRef.current?.stop();
    } else {
      start();
      
      // Start audio engine
      if (!sessionStartTimeRef.current) {
        sessionStartTimeRef.current = Date.now();
      }
      
      audioEngineRef.current?.start({ 
        baseFrequency, 
        beatFrequency,
        volume: isMuted ? 0 : volume / 100
      });
    }
  }, [isPlaying, sessionComplete, start, pause, reset, baseFrequency, beatFrequency, volume, isMuted]);

  // Handle stop
  const handleStop = useCallback(() => {
    stop();
    audioEngineRef.current?.stop();
    setSessionComplete(false);
    sessionStartTimeRef.current = null;
  }, [stop]);

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (!isMuted) {
      audioEngineRef.current?.setVolume(newVolume / 100);
    }
  }, [isMuted]);

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioEngineRef.current?.setVolume(newMuted ? 0 : volume / 100);
  }, [isMuted, volume]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioEngineRef.current?.stop();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
          {trackTitle}
        </h1>
        <p className="text-xl text-[var(--foreground)]/70">
          {frequency} • {Math.floor(duration / 60)} minutes
        </p>
      </motion.div>

      {/* Main Player Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl backdrop-blur-sm"
      >
        {/* Waveform Visualization */}
        <div className="mb-8 h-40 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-xl flex items-center justify-center relative overflow-hidden">
          <motion.div
            animate={{
              scale: isPlaying ? [1, 1.2, 1] : 1,
              opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.3
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] opacity-20 blur-3xl"
          />
          <div className="relative z-10 text-6xl font-mono font-bold text-[var(--primary)]">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-[var(--foreground)]/60">
            <span>{formatTime(duration - timeLeft)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStop}
            disabled={!isPlaying && timeLeft === duration}
            className="p-4 rounded-full bg-[var(--muted)] hover:bg-[var(--muted-foreground)]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Stop"
          >
            <Square className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className="p-6 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg hover:shadow-xl transition-shadow"
            aria-label={isPlaying ? 'Pause' : sessionComplete ? 'Restart' : 'Play'}
          >
            {sessionComplete ? (
              <Play className="w-8 h-8" fill="currentColor" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8" fill="currentColor" />
            )}
          </motion.button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="flex-1 accent-[var(--primary)]"
            aria-label="Volume"
          />
          <span className="text-sm text-[var(--foreground)]/60 w-12 text-right">
            {volume}%
          </span>
        </div>

        {/* Session Complete Message */}
        <AnimatePresence>
          {sessionComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl"
            >
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-2xl font-bold text-green-500 mb-2">
                Session Complete!
              </h3>
              <p className="text-[var(--foreground)]/70">
                Great work! You completed your {trackTitle} session.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* AI Session Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5 border border-[var(--border)] rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-semibold text-lg mb-2">AI Session Tip</h3>
            <p className="text-[var(--foreground)]/70">{aiTip}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SoundPlayer;
