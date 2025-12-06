'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, VolumeX, List, Share2, Repeat } from 'lucide-react';
import { getAudioEngine, FrequencyPresets } from '@/utils/audioEngine';
import { getAudioLoader, audioTracks, type AudioTrack } from '@/lib/audioLoader';
import { trackSession, formatTime, getUserPreferences, saveUserPreferences } from '@/utils/storage';
import AudioVisualizer from '@/components/AudioVisualizer';
import AmbientMixer from '@/components/AmbientMixer';

interface UnifiedAudioPlayerProps {
  onPlayStateChange?: (isPlaying: boolean) => void;
  onTrackChange?: (trackName: string) => void;
  autoPlay?: boolean;
  initialTrackId?: string;
}

const UnifiedAudioPlayer = ({ 
  onPlayStateChange, 
  onTrackChange,
  autoPlay = false,
  initialTrackId
}: UnifiedAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const audioEngineRef = useRef(getAudioEngine());
  const audioLoaderRef = useRef(getAudioLoader());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentBufferRef = useRef<AudioBuffer | null>(null);

  // Get current track
  const currentTrack = useMemo(() => audioTracks[currentTrackIndex], [currentTrackIndex]);
  const isBinauralTrack = currentTrack.category === 'binaural';

  // Load user preferences
  useEffect(() => {
    const prefs = getUserPreferences();
    if (prefs) {
      setVolume(prefs.lastVolume || 75);
      if (initialTrackId) {
        const trackIndex = audioTracks.findIndex(t => t.id === initialTrackId);
        if (trackIndex !== -1) {
          setCurrentTrackIndex(trackIndex);
        }
      } else if (prefs.lastTrackId !== undefined) {
        const trackIndex = audioTracks.findIndex(t => t.id === String(prefs.lastTrackId));
        if (trackIndex !== -1) {
          setCurrentTrackIndex(trackIndex);
        }
      }
    }
  }, [initialTrackId]);

  // Save volume preference
  useEffect(() => {
    saveUserPreferences({ lastVolume: volume });
  }, [volume]);

  // Update progress for file playback
  useEffect(() => {
    if (isPlaying && !isBinauralTrack) {
      progressIntervalRef.current = setInterval(() => {
        const engine = audioEngineRef.current;
        if (engine) {
          const time = engine.getCurrentTime();
          setCurrentTime(time);
          const progressPercent = (time / currentTrack.duration) * 100;
          setProgress(Math.min(100, progressPercent));

          // Check if track completed
          if (time >= currentTrack.duration) {
            handleTrackComplete();
          }
        }
      }, 100);
    } else if (isPlaying && isBinauralTrack) {
      // For binaural tracks, just track time
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setCurrentTime(elapsed);
        const progressPercent = (elapsed / currentTrack.duration) * 100;
        setProgress(Math.min(100, progressPercent));

        if (elapsed >= currentTrack.duration) {
          handleTrackComplete();
        }
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, isBinauralTrack, currentTrack.duration]);

  // Handle track completion
  const handleTrackComplete = useCallback(() => {
    if (sessionStartTime) {
      trackSession({
        trackId: currentTrackIndex,
        trackName: currentTrack.name,
        duration: Math.floor((Date.now() - sessionStartTime) / 1000),
        timestamp: sessionStartTime,
        completed: true,
      });
    }

    if (loopEnabled) {
      // Restart track
      setProgress(0);
      setCurrentTime(0);
      setSessionStartTime(Date.now());
      // Audio continues or restarts
      if (!isBinauralTrack && currentBufferRef.current) {
        audioEngineRef.current?.startFile({
          buffer: currentBufferRef.current,
          volume: isMuted ? 0 : volume,
          loop: false
        });
      }
    } else {
      // Move to next track or stop
      const nextIndex = (currentTrackIndex + 1) % audioTracks.length;
      if (nextIndex !== 0) {
        changeTrack(nextIndex);
      } else {
        stopPlayback();
      }
    }
  }, [sessionStartTime, loopEnabled, currentTrack, currentTrackIndex, isBinauralTrack, volume, isMuted]);

  // Play/Pause toggle
  const togglePlay = useCallback(async () => {
    const engine = audioEngineRef.current;
    if (!engine) return;

    setError(null);

    if (isPlaying) {
      // Pause
      engine.stop();
      setIsPlaying(false);
      onPlayStateChange?.(false);
      
      // Track partial session
      if (sessionStartTime) {
        trackSession({
          trackId: currentTrackIndex,
          trackName: currentTrack.name,
          duration: Math.floor((Date.now() - sessionStartTime) / 1000),
          timestamp: sessionStartTime,
          completed: false,
        });
        setSessionStartTime(null);
      }
    } else {
      // Play
      setIsLoading(true);
      try {
        if (isBinauralTrack) {
          // Play binaural beat
          const preset = getFrequencyPreset(currentTrack.frequency || '');
          await engine.start({
            baseFrequency: preset.base,
            beatFrequency: preset.beat,
            volume: isMuted ? 0 : volume,
          });
        } else {
          // Load and play audio file
          const loader = audioLoaderRef.current;
          const buffer = await loader.loadAudio(currentTrack.path);
          currentBufferRef.current = buffer;
          
          await engine.startFile({
            buffer,
            volume: isMuted ? 0 : volume,
            loop: false,
          });
        }

        setIsPlaying(true);
        setSessionStartTime(Date.now());
        onPlayStateChange?.(true);
        onTrackChange?.(currentTrack.name);
      } catch (err) {
        console.error('Playback error:', err);
        setError('Failed to play audio. The audio file may be missing or your browser may not support audio playback.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [isPlaying, isBinauralTrack, currentTrack, volume, isMuted, sessionStartTime, currentTrackIndex, onPlayStateChange, onTrackChange]);

  // Stop playback
  const stopPlayback = useCallback(() => {
    audioEngineRef.current?.stop();
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setSessionStartTime(null);
    onPlayStateChange?.(false);
  }, [onPlayStateChange]);

  // Change track
  const changeTrack = useCallback(async (newIndex: number) => {
    const wasPlaying = isPlaying;
    
    // Track previous session
    if (wasPlaying && sessionStartTime) {
      trackSession({
        trackId: currentTrackIndex,
        trackName: currentTrack.name,
        duration: Math.floor((Date.now() - sessionStartTime) / 1000),
        timestamp: sessionStartTime,
        completed: false,
      });
    }

    // Stop current playback
    audioEngineRef.current?.stop();
    
    // Update track
    setCurrentTrackIndex(newIndex);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setSessionStartTime(null);
    currentBufferRef.current = null;
    
    // Save preference
    saveUserPreferences({ lastTrackId: newIndex });
    
    // Auto-play if was playing
    if (wasPlaying) {
      // Small delay for state update
      setTimeout(() => {
        togglePlay();
      }, 100);
    }
  }, [isPlaying, sessionStartTime, currentTrackIndex, currentTrack, togglePlay]);

  // Next track
  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % audioTracks.length;
    changeTrack(nextIndex);
  }, [currentTrackIndex, changeTrack]);

  // Previous track
  const previousTrack = useCallback(() => {
    const prevIndex = (currentTrackIndex - 1 + audioTracks.length) % audioTracks.length;
    changeTrack(prevIndex);
  }, [currentTrackIndex, changeTrack]);

  // Volume control
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (!isMuted) {
      audioEngineRef.current?.setVolume(newVolume);
    }
  }, [isMuted]);

  // Mute toggle
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioEngineRef.current?.setVolume(newMuted ? 0 : volume);
  }, [isMuted, volume]);

  // Seek (for file playback only)
  const handleSeek = useCallback((percent: number) => {
    if (!isBinauralTrack && currentBufferRef.current) {
      const newTime = (percent / 100) * currentTrack.duration;
      setProgress(percent);
      setCurrentTime(newTime);
      // Note: Web Audio API doesn't support seeking on running sources
      // We'd need to stop and restart from position
    }
  }, [isBinauralTrack, currentTrack.duration]);

  // Get frequency preset for binaural tracks
  const getFrequencyPreset = (frequency: string) => {
    if (frequency.includes('0.5-4') || frequency.toLowerCase().includes('delta')) {
      return { base: FrequencyPresets.DELTA.baseFrequency, beat: FrequencyPresets.DELTA.beatFrequency };
    } else if (frequency.includes('4-8') || frequency.toLowerCase().includes('theta')) {
      return { base: FrequencyPresets.THETA.baseFrequency, beat: FrequencyPresets.THETA.beatFrequency };
    } else if (frequency.includes('8-12') || frequency.toLowerCase().includes('alpha')) {
      return { base: FrequencyPresets.ALPHA.baseFrequency, beat: FrequencyPresets.ALPHA.beatFrequency };
    } else if (frequency.includes('13-30') || frequency.toLowerCase().includes('beta')) {
      return { base: FrequencyPresets.BETA.baseFrequency, beat: FrequencyPresets.BETA.beatFrequency };
    } else if (frequency.includes('30-100') || frequency.toLowerCase().includes('gamma')) {
      return { base: FrequencyPresets.GAMMA.baseFrequency, beat: FrequencyPresets.GAMMA.beatFrequency };
    }
    return { base: 200, beat: 10 }; // Default
  };

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
          handleVolumeChange(Math.min(100, volume + 5));
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 5));
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'l':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setLoopEnabled(prev => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextTrack, previousTrack, handleVolumeChange, toggleMute, volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioEngineRef.current?.stop();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const categoryColors = {
    focus: 'from-[#5b9eff] to-[#7aa2f7]',
    relaxation: 'from-[#73daca] to-[#7dcfff]',
    deep: 'from-[#bb9af7] to-[#9d7cd8]',
    ambient: 'from-[#9ece6a] to-[#73daca]',
    binaural: 'from-[#ff9e64] to-[#e0af68]',
  };

  return (
    <div className="space-y-8">
      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400"
          >
            <p className="font-semibold mb-1">Playback Error</p>
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Player Card */}
      <motion.div
        className="bg-gradient-to-br from-[var(--surface)]/80 to-[var(--surface-alt)]/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-[var(--primary)]/20 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Track Info Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex-1">
            <motion.h2
              key={currentTrack.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-2"
            >
              {currentTrack.name}
            </motion.h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--foreground)]/70">
              {currentTrack.frequency && (
                <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-[var(--wave)]/20 to-[var(--accent)]/20 rounded-full border border-[var(--wave)]/30 whitespace-nowrap">
                  {currentTrack.frequency}
                </span>
              )}
              <span className="whitespace-nowrap">{formatTime(currentTrack.duration)}</span>
              <span className={`px-2 sm:px-3 py-1 bg-gradient-to-r ${categoryColors[currentTrack.category]}/20 rounded-full capitalize whitespace-nowrap`}>
                {currentTrack.category}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="p-2 sm:p-3 bg-[var(--surface-alt)] rounded-full hover:bg-[var(--primary)]/20 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Toggle playlist"
              aria-label="Toggle playlist"
            >
              <List className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Visualizer */}
        <div className="mb-4 sm:mb-6">
          <AudioVisualizer
            audioEngine={audioEngineRef.current}
            isPlaying={isPlaying}
            category={currentTrack.category === 'deep' ? 'focus' : currentTrack.category === 'binaural' ? 'focus' : currentTrack.category === 'ambient' ? 'relaxation' : currentTrack.category}
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="h-2 sm:h-2.5 bg-[var(--background)]/50 rounded-full cursor-pointer relative overflow-hidden touch-manipulation">
            <motion.div
              className={`h-full bg-gradient-to-r ${categoryColors[currentTrack.category]} rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-[var(--foreground)]/60 mt-2">
            <span>{formatTime(Math.floor(currentTime))}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 flex-wrap">
          <motion.button
            onClick={previousTrack}
            className="p-2 sm:p-3 text-[var(--foreground)]/60 hover:text-[var(--primary)] transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Previous track"
            aria-label="Previous track"
          >
            <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>

          <motion.button
            onClick={stopPlayback}
            disabled={!isPlaying}
            className="p-2 sm:p-3 text-[var(--foreground)]/60 hover:text-[var(--primary)] transition-colors disabled:opacity-30 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Stop"
            aria-label="Stop playback"
          >
            <Square className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>

          <motion.button
            onClick={togglePlay}
            disabled={isLoading}
            className="p-4 sm:p-5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full shadow-lg disabled:opacity-50 touch-manipulation min-w-[60px] min-h-[60px] sm:min-w-[68px] sm:min-h-[68px] flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" />
            )}
          </motion.button>

          <motion.button
            onClick={nextTrack}
            className="p-2 sm:p-3 text-[var(--foreground)]/60 hover:text-[var(--primary)] transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Next track"
            aria-label="Next track"
          >
            <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>

          <motion.button
            onClick={() => setLoopEnabled(!loopEnabled)}
            className={`p-2 sm:p-3 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center ${
              loopEnabled ? 'text-[var(--primary)]' : 'text-[var(--foreground)]/60 hover:text-[var(--primary)]'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Toggle loop"
            aria-label="Toggle loop"
          >
            <Repeat className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={toggleMute} 
            className="text-[var(--foreground)]/60 hover:text-[var(--primary)] touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center p-2"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            className="flex-1 accent-[var(--primary)] h-8 touch-manipulation"
            aria-label="Volume control"
          />
          <span className="text-xs sm:text-sm text-[var(--foreground)]/60 w-10 sm:w-12 text-right">{volume}%</span>
        </div>

        {/* Track Benefits */}
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
          {currentTrack.benefits.map((benefit) => (
            <span
              key={benefit}
              className="px-2 sm:px-3 py-1 bg-[var(--surface-alt)]/50 border border-[var(--primary)]/20 rounded-full text-xs text-[var(--foreground)]/70"
            >
              {benefit}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Playlist */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-[var(--surface)]/80 to-[var(--surface-alt)]/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-[var(--primary)]/20 overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)] mb-3 sm:mb-4">Full Playlist</h3>
              <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
                {audioTracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    onClick={() => changeTrack(index)}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all touch-manipulation ${
                      index === currentTrackIndex
                        ? `bg-gradient-to-r ${categoryColors[track.category]}/20 border border-[var(--primary)]/30`
                        : 'bg-[var(--background)]/30 active:bg-[var(--background)]/50'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[var(--foreground)] text-sm sm:text-base truncate">{track.name}</div>
                        <div className="text-xs sm:text-sm text-[var(--foreground)]/60">
                          {track.frequency} • {formatTime(track.duration)}
                        </div>
                      </div>
                      <span className={`px-2 sm:px-3 py-1 bg-gradient-to-r ${categoryColors[track.category]}/30 rounded-full text-xs capitalize whitespace-nowrap shrink-0`}>
                        {track.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Mixer */}
      <AmbientMixer audioEngine={audioEngineRef.current} />
    </div>
  );
};

export default UnifiedAudioPlayer;
