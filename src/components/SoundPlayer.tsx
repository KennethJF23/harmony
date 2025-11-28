'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Volume2, Sparkles } from 'lucide-react';
import { useSyncedAudioTimer } from '@/hooks/useSyncedAudioTimer';
import { getAudioEngine, FrequencyPresets } from '@/utils/audioEngine';
import AudioAssets from '@/utils/audioAssets';
import { trackSession } from '@/utils/storage';
import AudioVisualizer from '@/components/AudioVisualizer';

interface SoundPlayerProps {
  trackName: string;
  frequency: string;
  duration: number; // in minutes
  benefits?: string[];
  tips?: string[];
  baseFrequency?: number;
  beatFrequency?: number;
}

const SoundPlayer = ({
  trackName,
  frequency,
  duration,
  benefits = [],
  tips = [],
  baseFrequency = FrequencyPresets.ALPHA.baseFrequency,
  beatFrequency = FrequencyPresets.ALPHA.beatFrequency,
}: SoundPlayerProps) => {
  const [volume, setVolume] = useState(75);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [showTips, setShowTips] = useState(false);
  const audioEngineRef = useRef(getAudioEngine());
  const durationInSeconds = duration * 60;

  const {
    timeLeft,
    isPlaying,
    progress,
    start,
    pause,
    stop: timerStop,
  } = useSyncedAudioTimer({
    duration: durationInSeconds,
    onComplete: handleSessionComplete,
    onTick: (time) => {
      // Optional: Add any per-second updates here
    },
  });

  function handleSessionComplete() {
    // Stop audio
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }

    // Track completed session
    if (sessionStartTime) {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000 / 60);
      trackSession({
        trackId: 0,
        trackName,
        duration: sessionDuration,
        timestamp: Date.now(),
        completed: true,
      });
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 Session Complete!', {
        body: `Great work! You completed ${duration} minutes with ${trackName}`,
      });
    }

    setSessionStartTime(null);
  }

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    };
  }, []);

  // Sync volume with audio engine
  useEffect(() => {
    if (audioEngineRef.current) {
      audioEngineRef.current.setVolume(volume);
    }
  }, [volume]);

  const handlePlayPause = async () => {
    const audioEngine = audioEngineRef.current;
    if (!audioEngine) return;

    if (isPlaying) {
      // Pause
      audioEngine.stop();
      pause();
    } else {
      // Start/Resume
      try {
        const asset = AudioAssets[trackName as keyof typeof AudioAssets];
        if (asset && asset.type === 'ambient') {
          // ambient generator built into the AudioEngine
          await audioEngine.startAmbient(asset.ambientType, volume / 100);
        } else if (asset && asset.type === 'binaural') {
          await audioEngine.start({
            baseFrequency: asset.preset.baseFrequency ?? baseFrequency,
            beatFrequency: asset.preset.beatFrequency ?? beatFrequency,
            volume,
          });
        } else {
          // fallback to binaural
          await audioEngine.start({
            baseFrequency,
            beatFrequency,
            volume,
          });
        }
        start();
        
        if (!sessionStartTime) {
          setSessionStartTime(Date.now());
        }
      } catch (error) {
        console.error('Failed to start audio:', error);
      }
    }
  };

  const handleStop = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
    
    // Track partial session
    if (sessionStartTime) {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000 / 60);
      trackSession({
        trackId: 0,
        trackName,
        duration: sessionDuration,
        timestamp: Date.now(),
        completed: false,
      });
    }

    timerStop();
    setSessionStartTime(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusMessage = (): string => {
    if (timeLeft === 0) return '🎉 Session Complete!';
    if (isPlaying) return 'Session in progress...';
    if (progress > 0) return 'Session paused';
    return 'Ready to start';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main Player Card */}
        <div className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#5b9eff]/20 border border-[#5b9eff]/20 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-4 text-center border-b border-[#5b9eff]/10">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {trackName}
            </motion.h1>
            <motion.p
              className="text-lg text-[#7aa2f7]/80 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {frequency} • {duration} min session
            </motion.p>
            <motion.div
              className="inline-block px-4 py-1.5 bg-[#5b9eff]/10 rounded-full border border-[#5b9eff]/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-sm text-[#7aa2f7]">{getStatusMessage()}</span>
            </motion.div>
          </div>

          {/* Visualizer */}
          <div className="relative h-48 bg-gradient-to-b from-[#1a1f35]/50 to-transparent">
            <AudioVisualizer 
              audioEngine={audioEngineRef.current} 
              isPlaying={isPlaying}
              category="focus"
            />
            
            {/* Progress overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2a3254]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#5b9eff] to-[#7c3aed]"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Timer Display */}
          <div className="p-8 text-center">
            <motion.div
              className="text-7xl md:text-8xl font-bold mb-6 tabular-nums tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #5b9eff 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{
                scale: isPlaying && timeLeft > 0 && timeLeft <= 10 ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: isPlaying && timeLeft > 0 && timeLeft <= 10 ? Infinity : 0,
              }}
            >
              {formatTime(timeLeft)}
            </motion.div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-[#2a3254] rounded-full mb-8 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#5b9eff] via-[#7c3aed] to-[#bb9af7] rounded-full shadow-lg shadow-[#5b9eff]/50"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.button
                onClick={handlePlayPause}
                disabled={timeLeft === 0}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] shadow-lg shadow-[#5b9eff]/40 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </motion.button>

              <motion.button
                onClick={handleStop}
                disabled={!isPlaying && progress === 0}
                className="w-16 h-16 rounded-full bg-[#2a3254] border border-[#5b9eff]/30 flex items-center justify-center text-[#7aa2f7] hover:bg-[#3a4264] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Square size={24} />
              </motion.button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
              <Volume2 size={20} className="text-[#7aa2f7]" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-2 bg-[#2a3254] rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r
                  [&::-webkit-slider-thumb]:from-[#5b9eff] [&::-webkit-slider-thumb]:to-[#7c3aed]
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[#5b9eff]/50"
              />
              <span className="text-sm text-[#7aa2f7] w-10 text-right">{volume}%</span>
            </div>
          </div>

          {/* Benefits Section */}
          {benefits.length > 0 && (
            <div className="px-8 pb-6">
              <h3 className="text-lg font-semibold text-[#7aa2f7] mb-3">Session Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="px-4 py-2 bg-[#5b9eff]/10 rounded-lg border border-[#5b9eff]/20 text-sm text-[#a9b1d6]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    • {benefit}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* AI Tips Section */}
          {tips.length > 0 && (
            <div className="px-8 pb-8">
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-2 text-[#7aa2f7] hover:text-[#5b9eff] transition-colors mb-3"
              >
                <Sparkles size={18} />
                <span className="font-semibold">AI Session Tips</span>
              </button>
              
              <AnimatePresence>
                {showTips && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {tips.map((tip, index) => (
                      <motion.div
                        key={index}
                        className="px-4 py-3 bg-gradient-to-r from-[#7c3aed]/10 to-[#5b9eff]/10 rounded-lg border border-[#7c3aed]/20 text-sm text-[#a9b1d6]"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        💡 {tip}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Back Button */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2a3254]/80 hover:bg-[#3a4264] border border-[#5b9eff]/20 rounded-full text-[#7aa2f7] transition-colors"
          >
            ← Back to Home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SoundPlayer;
