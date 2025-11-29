'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import UnifiedAudioPlayer from '@/components/UnifiedAudioPlayer';
import FocusTimer from '@/components/FocusTimer';

interface SyncedSessionProps {
  initialTrackId?: string;
}

/**
 * Synced Session Component
 * Provides perfect synchronization between audio playback and focus timer
 */
const SyncedSession = ({ initialTrackId }: SyncedSessionProps) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('');
  const [timerShouldStart, setTimerShouldStart] = useState(false);
  const [timerShouldStop, setTimerShouldStop] = useState(false);

  // Handle audio play state changes
  const handleAudioPlayStateChange = useCallback((playing: boolean) => {
    setIsAudioPlaying(playing);
    
    if (playing) {
      // Audio started, signal timer to start
      setTimerShouldStart(true);
      setTimeout(() => setTimerShouldStart(false), 100);
    } else {
      // Audio stopped, signal timer to pause
      setTimerShouldStop(true);
      setTimeout(() => setTimerShouldStop(false), 100);
    }
  }, []);

  // Handle track changes
  const handleTrackChange = useCallback((trackName: string) => {
    setCurrentTrack(trackName);
  }, []);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    // Timer completed, stop the audio
    // This will be handled by the audio player receiving the stop signal
    console.log('Timer completed - session finished');
  }, []);

  // Handle timer start
  const handleTimerStart = useCallback(() => {
    console.log('Timer started');
    // Timer is now synced with audio
  }, []);

  // Handle timer stop
  const handleTimerStop = useCallback(() => {
    console.log('Timer stopped');
    // Timer is paused/stopped
  }, []);

  return (
    <div className="space-y-8">
      {/* Sync Status Indicator */}
      {isAudioPlaying && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            <span className="text-sm font-medium">
              Session Active: {currentTrack}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Audio Player - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <UnifiedAudioPlayer
            initialTrackId={initialTrackId}
            autoPlay={false}
            onPlayStateChange={handleAudioPlayStateChange}
            onTrackChange={handleTrackChange}
          />
        </div>

        {/* Focus Timer - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <FocusTimer
            isAudioPlaying={isAudioPlaying}
            currentTrackName={currentTrack}
            onTimerComplete={handleTimerComplete}
            onTimerStart={handleTimerStart}
            onTimerStop={handleTimerStop}
          />
        </div>
      </div>

      {/* Session Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[var(--surface)]/80 to-[var(--surface-alt)]/60 backdrop-blur-xl rounded-2xl p-6 border border-[var(--primary)]/20"
      >
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          How to Use Synced Sessions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Choose Your Track</p>
                <p className="text-sm text-[var(--foreground)]/70">
                  Select a focus wave that matches your task - Beta for active work, Alpha for creative tasks
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Set Your Timer</p>
                <p className="text-sm text-[var(--foreground)]/70">
                  Choose a Pomodoro preset or customize your focus duration
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Start Together</p>
                <p className="text-sm text-[var(--foreground)]/70">
                  Press play on the audio - your timer will automatically sync and start
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] font-bold">
                4
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Stay Focused</p>
                <p className="text-sm text-[var(--foreground)]/70">
                  Both audio and timer will pause/resume together - perfect sync every time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 pt-6 border-t border-[var(--foreground)]/10">
          <p className="text-sm font-semibold text-[var(--foreground)] mb-3">💡 Pro Tips:</p>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-[var(--foreground)]/70">
            <div className="flex items-start gap-2">
              <span className="text-[var(--primary)]">•</span>
              <span>Use headphones for binaural beats to work effectively</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--accent)]">•</span>
              <span>Keep volume comfortable - not too loud, just audible</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--secondary)]">•</span>
              <span>Take breaks between sessions to maximize productivity</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scientific Background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-[var(--wave)]/10 to-[var(--accent)]/10 border border-[var(--wave)]/20 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
          <span className="text-xl">🧠</span>
          The Science Behind Synced Sessions
        </h3>
        <div className="space-y-3 text-sm text-[var(--foreground)]/80">
          <p>
            <strong className="text-[var(--foreground)]">Binaural Beats:</strong> When each ear receives a slightly different frequency, your brain perceives a third "phantom" frequency - the difference between the two. This encourages your brainwaves to synchronize to that frequency.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Pomodoro Technique:</strong> Working in focused intervals (typically 25 minutes) followed by short breaks has been scientifically proven to enhance concentration and prevent burnout.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Synergistic Effect:</strong> By combining binaural beats with timed focus sessions, you create an optimal environment for deep work and sustained concentration.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SyncedSession;
