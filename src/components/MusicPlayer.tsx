'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Share2 } from 'lucide-react';
import { getAudioEngine, FrequencyPresets } from '@/utils/audioEngine';
import { 
  getUserPreferences, 
  saveUserPreferences, 
  trackSession, 
  parseTimeString,
  formatTime 
} from '@/utils/storage';
import AudioVisualizer from '@/components/AudioVisualizer';
import AmbientMixer from '@/components/AmbientMixer';
import RecommendationEngine from '@/components/RecommendationEngine';
import ShareCard from '@/components/ShareCard';

interface Track {
  id: number;
  title: string;
  frequency: string;
  duration: string;
  benefits: string[];
  category: 'focus' | 'relaxation' | 'creativity' | 'sleep';
  baseFrequency: number;
  beatFrequency: number;
}

interface MusicPlayerProps {
  onPlayStateChange?: (isPlaying: boolean) => void;
  onTrackChange?: (trackName: string) => void;
}

export interface MusicPlayerRef {
  stopPlayback: () => void;
}

const MusicPlayer = forwardRef<MusicPlayerRef, MusicPlayerProps>(({ 
  onPlayStateChange, 
  onTrackChange 
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioEngineRef = useRef(getAudioEngine());

  // Expose stop method to parent via ref
  useImperativeHandle(ref, () => ({
    stopPlayback: () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
      setIsPlaying(false);
      setSessionStartTime(null);
    }
  }));

  const tracks: Track[] = useMemo(() => [
    {
      id: 1,
      title: "Deep Focus Alpha",
      frequency: "8-12 Hz",
      duration: "25:00",
      benefits: ["Enhanced concentration", "Mental clarity", "Reduced distractions"],
      category: "focus",
      baseFrequency: FrequencyPresets.ALPHA.baseFrequency,
      beatFrequency: FrequencyPresets.ALPHA.beatFrequency
    },
    {
      id: 2,
      title: "Theta Meditation",
      frequency: "4-8 Hz",
      duration: "30:00",
      benefits: ["Deep relaxation", "Stress relief", "Mindfulness"],
      category: "relaxation",
      baseFrequency: FrequencyPresets.THETA.baseFrequency,
      beatFrequency: FrequencyPresets.THETA.beatFrequency
    },
    {
      id: 3,
      title: "Creative Flow Beta",
      frequency: "13-30 Hz",
      duration: "45:00",
      benefits: ["Creative thinking", "Problem solving", "Innovation"],
      category: "creativity",
      baseFrequency: FrequencyPresets.BETA.baseFrequency,
      beatFrequency: FrequencyPresets.BETA.beatFrequency
    },
    {
      id: 4,
      title: "Delta Sleep Wave",
      frequency: "0.5-4 Hz",
      duration: "60:00",
      benefits: ["Deep sleep", "Recovery", "Healing"],
      category: "sleep",
      baseFrequency: FrequencyPresets.DELTA.baseFrequency,
      beatFrequency: FrequencyPresets.DELTA.beatFrequency
    }
  ], []);

  // Load preferences on mount
  useEffect(() => {
    const prefs = getUserPreferences();
    if (prefs) {
      setVolume(prefs.lastVolume);
      setCurrentTrack(prefs.lastTrackId);
    }
  }, []);

  // Save volume preference
  useEffect(() => {
    saveUserPreferences({ lastVolume: volume });
    if (audioEngineRef.current) {
      audioEngineRef.current.setVolume(volume);
    }
  }, [volume]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowright':
          e.preventDefault();
          nextTrack();
          break;
        case 'arrowleft':
          e.preventDefault();
          previousTrack();
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(prev => Math.min(100, prev + 5));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 5));
          break;
        case 'l':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setLoopEnabled(prev => !prev);
          }
          break;
        case 'p':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setShowPlaylist(prev => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    const audioEngine = audioEngineRef.current;
    return () => {
      if (audioEngine) {
        audioEngine.stop();
      }
    };
  }, []);

  const categoryColors = {
    focus: 'from-[var(--primary)] to-[var(--secondary)]',
    relaxation: 'from-[var(--wave)] to-[var(--accent)]',
    creativity: 'from-[var(--neural)] to-[var(--glow)]',
    sleep: 'from-[var(--secondary)] to-[var(--primary)]'
  };

  const handleTrackComplete = useCallback(async () => {
    // Track the completed session
    if (sessionStartTime) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      trackSession({
        trackId: tracks[currentTrack].id,
        trackName: tracks[currentTrack].title,
        duration,
        timestamp: Date.now(),
        completed: true,
      });
    }
    
    // If loop is enabled, restart the track
    if (loopEnabled) {
      setProgress(0);
      setSessionStartTime(Date.now());
      // Audio continues playing, no need to stop/restart
    } else {
      // Stop audio
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
      
      setIsPlaying(false);
      setSessionStartTime(null);
    }
  }, [sessionStartTime, tracks, currentTrack, loopEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const trackDuration = parseTimeString(tracks[currentTrack].duration);
      const incrementPerSecond = 100 / trackDuration;
      
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + incrementPerSecond;
          if (newProgress >= 100) {
            handleTrackComplete();
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, tracks, handleTrackComplete]);

  const togglePlay = async () => {
    const audioEngine = audioEngineRef.current;
    if (!audioEngine) return;

    if (isPlaying) {
      // Stop playing
      audioEngine.stop();
      
      // Track partial session
      if (sessionStartTime) {
        const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
        trackSession({
          trackId: tracks[currentTrack].id,
          trackName: tracks[currentTrack].title,
          duration,
          timestamp: Date.now(),
          completed: false,
        });
      }
      
      setIsPlaying(false);
      setSessionStartTime(null);
      onPlayStateChange?.(false);
    } else {
      // Start playing
      try {
        const track = tracks[currentTrack];
        await audioEngine.start({
          baseFrequency: track.baseFrequency,
          beatFrequency: track.beatFrequency,
          volume: volume,
        });
        
        setIsPlaying(true);
        setSessionStartTime(Date.now());
        onPlayStateChange?.(true);
        onTrackChange?.(track.title);
      } catch (error) {
        console.error('Error starting audio:', error);
        setAudioError('Unable to start audio. Please check that your browser allows audio playback and try again.');
      }
    }
  };

  const nextTrack = async () => {
    const newTrack = (currentTrack + 1) % tracks.length;
    await changeTrack(newTrack);
  };

  const previousTrack = async () => {
    const newTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    await changeTrack(newTrack);
  };

  const selectTrack = async (index: number) => {
    await changeTrack(index);
    setShowPlaylist(false);
  };

  const changeTrack = async (newTrackIndex: number) => {
    const audioEngine = audioEngineRef.current;
    if (!audioEngine) return;

    const wasPlaying = isPlaying;
    
    // Track previous session if playing
    if (wasPlaying && sessionStartTime) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      trackSession({
        trackId: tracks[currentTrack].id,
        trackName: tracks[currentTrack].title,
        duration,
        timestamp: Date.now(),
        completed: false,
      });
    }

    setCurrentTrack(newTrackIndex);
    setProgress(0);
    saveUserPreferences({ lastTrackId: newTrackIndex });

    if (wasPlaying) {
      // Smooth transition to new frequency
      const newTrack = tracks[newTrackIndex];
      audioEngine.transitionTo({
        baseFrequency: newTrack.baseFrequency,
        beatFrequency: newTrack.beatFrequency,
        volume: volume,
      }, 2);
      
      setSessionStartTime(Date.now());
    }
  };

  const handlePlayRecommendation = async (trackId: number) => {
    const trackIndex = tracks.findIndex(t => t.id === trackId);
    if (trackIndex !== -1) {
      await changeTrack(trackIndex);
      // Auto-start playing the recommended track
      if (!isPlaying) {
        togglePlay();
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      setProgress(Math.max(0, Math.min(100, newProgress)));
    }
  };

  const currentTrackData = tracks[currentTrack];

  return (
    <>
      {/* Audio Error Alert */}
      {audioError && (
        <motion.div
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-red-400 font-semibold mb-1">Audio Error</h4>
              <p className="text-sm text-red-300/80">{audioError}</p>
              <p className="text-xs text-red-300/60 mt-2">
                Tip: Some browsers require user interaction before playing audio. Try clicking the play button again.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  setAudioError(null);
                  await togglePlay();
                }}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => setAudioError(null)}
                className="px-4 py-2 bg-[var(--surface-alt)] hover:bg-[var(--primary)]/20 text-[var(--foreground)]/60 rounded-lg text-sm font-medium transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Player Card */}
        <motion.div
          className="bg-gradient-to-br from-[var(--surface)]/80 to-[var(--surface-alt)]/60 backdrop-blur-xl rounded-3xl p-8 border border-[var(--primary)]/20 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Track Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <motion.h3 
                className="text-2xl font-bold text-[var(--foreground)] mb-2"
                key={currentTrack}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {currentTrackData.title}
              </motion.h3>
              <div className="flex items-center space-x-4 text-sm text-[var(--foreground)]/60">
                <span className="px-3 py-1 bg-gradient-to-r from-[var(--wave)]/20 to-[var(--accent)]/20 rounded-full border border-[var(--wave)]/30">
                  {currentTrackData.frequency}
                </span>
                <span>{currentTrackData.duration}</span>
                <span className={`px-3 py-1 bg-gradient-to-r ${categoryColors[currentTrackData.category]}/20 rounded-full capitalize`}>
                  {currentTrackData.category}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                className="p-3 bg-[var(--surface-alt)] rounded-full hover:bg-[var(--primary)]/20 transition-colors"
                onClick={() => setShowShareCard(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Share progress"
                title="Share your progress"
              >
                <Share2 className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                className="p-3 bg-[var(--surface-alt)] rounded-full hover:bg-[var(--primary)]/20 transition-colors"
                onClick={() => setShowPlaylist(!showPlaylist)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle playlist"
                title="View playlist"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Audio Visualizer */}
          <div className="mb-8">
            <AudioVisualizer 
              audioEngine={audioEngineRef.current} 
              isPlaying={isPlaying} 
              category={currentTrackData.category}
            />
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div 
              ref={progressRef}
              className="h-2 bg-[var(--background)]/50 rounded-full cursor-pointer relative overflow-hidden"
              onClick={handleProgressClick}
            >
              <motion.div
                className={`h-full bg-gradient-to-r ${categoryColors[currentTrackData.category]} rounded-full`}
                style={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              <motion.div
                className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2"
                style={{ left: `calc(${progress}% - 8px)` }}
                whileHover={{ scale: 1.2 }}
              />
            </div>
            <div className="flex justify-between text-sm text-[var(--foreground)]/60 mt-2">
              <span>{formatTime((progress / 100) * parseTimeString(currentTrackData.duration))}</span>
              <span>{currentTrackData.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <motion.button
              className="p-3 text-[var(--foreground)]/60 hover:text-[var(--primary)] transition-colors"
              onClick={previousTrack}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous track (Left arrow key)"
              title="Previous track"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </motion.button>

            <motion.button
              className="p-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              onClick={togglePlay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`${isPlaying ? 'Pause' : 'Play'} (Spacebar)`}
              aria-pressed={isPlaying}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M5 3v18l15-9L5 3z" />
                </svg>
              )}
            </motion.button>

            <motion.button
              className="p-3 text-[var(--foreground)]/60 hover:text-[var(--primary)] transition-colors"
              onClick={nextTrack}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next track (Right arrow key)"
              title="Next track"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </motion.button>
          </div>

          {/* Loop Toggle & Session Info */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <motion.button
              onClick={() => setLoopEnabled(!loopEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                loopEnabled 
                  ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30' 
                  : 'bg-[var(--surface-alt)]/50 text-[var(--foreground)]/60 hover:text-[var(--foreground)]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`${loopEnabled ? 'Disable' : 'Enable'} loop mode (Press L)`}
              aria-pressed={loopEnabled}
              title="Toggle loop mode"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">
                {loopEnabled ? 'Loop: ON' : 'Loop: OFF'}
              </span>
            </motion.button>
            
            {loopEnabled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-xs text-[var(--accent)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Continuous playback - Take breaks every 45-60 min</span>
              </motion.div>
            )}
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-4" role="group" aria-label="Volume control">
            <svg className="w-5 h-5 text-[var(--foreground)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 16.414V7.586L7.707 4.293A1 1 0 006 5v14a1 1 0 001.707.707L11 16.414z" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="flex-1 h-2 bg-[var(--background)]/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[var(--wave)] [&::-webkit-slider-thumb]:to-[var(--accent)] [&::-webkit-slider-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--wave) 0%, var(--accent) ${volume}%, var(--background) ${volume}%, var(--background) 100%)`
              }}
              aria-label="Volume slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={volume}
              aria-valuetext={`Volume ${volume}%`}
              title="Volume (Up/Down arrow keys)"
            />
            <span className="text-sm text-[var(--foreground)]/60 w-8" aria-live="polite">{volume}</span>
          </div>
        </motion.div>

        {/* AI Recommendation Engine */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <RecommendationEngine 
            onPlayRecommendation={handlePlayRecommendation}
            currentGoal={currentTrackData.category}
            currentTrackId={currentTrackData.id}
          />
        </motion.div>

        {/* Playlist */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              className="mt-6 bg-gradient-to-br from-[var(--surface)]/80 to-[var(--surface-alt)]/60 backdrop-blur-xl rounded-2xl border border-[var(--primary)]/20 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <h4 className="text-xl font-bold text-[var(--foreground)] mb-4">Playlist</h4>
                <div className="space-y-3">
                  {tracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        index === currentTrack 
                          ? `bg-gradient-to-r ${categoryColors[track.category]}/20 border border-${track.category === 'focus' ? '[var(--primary)]' : track.category === 'relaxation' ? '[var(--wave)]' : track.category === 'creativity' ? '[var(--neural)]' : '[var(--secondary)]'}/30`
                          : 'bg-[var(--background)]/30 hover:bg-[var(--background)]/50'
                      }`}
                      onClick={() => selectTrack(index)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-[var(--foreground)]">{track.title}</div>
                          <div className="text-sm text-[var(--foreground)]/60">{track.frequency} • {track.duration}</div>
                        </div>
                        <div className={`px-3 py-1 bg-gradient-to-r ${categoryColors[track.category]}/30 rounded-full text-xs capitalize`}>
                          {track.category}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Mixer */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AmbientMixer audioEngine={audioEngineRef.current} />
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h4 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Current Track Benefits
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {currentTrackData.benefits.map((benefit, index) => (
              <motion.span
                key={benefit}
                className="px-4 py-2 bg-gradient-to-r from-[var(--surface)]/80 to-[var(--surface-alt)]/60 border border-[var(--primary)]/20 rounded-full text-sm text-[var(--foreground)]/80"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {benefit}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Share Card Modal */}
        <ShareCard isOpen={showShareCard} onClose={() => setShowShareCard(false)} />
    </>
  );
});

MusicPlayer.displayName = 'MusicPlayer';

export default MusicPlayer;
