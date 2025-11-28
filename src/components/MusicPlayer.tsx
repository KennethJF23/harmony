'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface Track {
  id: number;
  title: string;
  frequency: string;
  duration: string;
  benefits: string[];
  category: 'focus' | 'relaxation' | 'creativity' | 'sleep';
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const tracks: Track[] = [
    {
      id: 1,
      title: "Deep Focus Alpha",
      frequency: "8-12 Hz",
      duration: "3:45",
      benefits: ["Enhanced concentration", "Mental clarity", "Reduced distractions"],
      category: "focus"
    },
    {
      id: 2,
      title: "Theta Meditation",
      frequency: "4-8 Hz",
      duration: "5:20",
      benefits: ["Deep relaxation", "Stress relief", "Mindfulness"],
      category: "relaxation"
    },
    {
      id: 3,
      title: "Creative Flow Beta",
      frequency: "13-30 Hz",
      duration: "4:15",
      benefits: ["Creative thinking", "Problem solving", "Innovation"],
      category: "creativity"
    },
    {
      id: 4,
      title: "Delta Sleep Wave",
      frequency: "0.5-4 Hz",
      duration: "8:00",
      benefits: ["Deep sleep", "Recovery", "Healing"],
      category: "sleep"
    }
  ];

  const categoryColors = {
    focus: 'from-[var(--primary)] to-[var(--secondary)]',
    relaxation: 'from-[var(--wave)] to-[var(--accent)]',
    creativity: 'from-[var(--neural)] to-[var(--glow)]',
    sleep: 'from-[var(--secondary)] to-[var(--primary)]'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const previousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setProgress(0);
    setShowPlaylist(false);
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
    <section id="music" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-bg opacity-50"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              Brain Wave Player
            </span>
          </h2>
          <p className="text-xl text-[var(--foreground)]/80 max-w-2xl mx-auto">
            Experience scientifically-designed frequencies tailored for different mental states
          </p>
        </motion.div>

        {/* Main Player */}
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
            
            <motion.button
              className="p-3 bg-[var(--surface-alt)] rounded-full hover:bg-[var(--primary)]/20 transition-colors"
              onClick={() => setShowPlaylist(!showPlaylist)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </motion.button>
          </div>

          {/* Visualizer */}
          <div className="mb-8 h-32 bg-[var(--background)]/50 rounded-2xl flex items-center justify-center overflow-hidden relative">
            {/* Neural Wave Visualizer */}
            <svg className="w-full h-full" viewBox="0 0 400 120">
              {/* Brain wave frequency lines */}
              {[...Array(5)].map((_, i) => (
                <motion.path
                  key={`freq-${i}`}
                  d={`M0,${20 + i * 20} Q100,${10 + i * 20} 200,${20 + i * 20} T400,${20 + i * 20}`}
                  stroke={`url(#visualizer-gradient-${i})`}
                  strokeWidth="2"
                  fill="none"
                  animate={isPlaying ? {
                    d: [
                      `M0,${20 + i * 20} Q100,${10 + i * 20} 200,${20 + i * 20} T400,${20 + i * 20}`,
                      `M0,${20 + i * 20} Q100,${30 + i * 20} 200,${20 + i * 20} T400,${20 + i * 20}`,
                      `M0,${20 + i * 20} Q100,${5 + i * 20} 200,${20 + i * 20} T400,${20 + i * 20}`
                    ],
                    opacity: [0.3, 0.8, 0.3]
                  } : { opacity: 0.2 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: [0.42, 0, 0.58, 1] as const
                  }}
                />
              ))}

              {/* Frequency nodes */}
              {isPlaying && [...Array(8)].map((_, i) => (
                <motion.circle
                  key={`node-${i}`}
                  cx={50 + i * 40}
                  cy={60}
                  r="3"
                  fill={`url(#node-gradient)`}
                  animate={{
                    r: [2, 5, 2],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: [0.42, 0, 0.58, 1] as const
                  }}
                />
              ))}

              <defs>
                {[...Array(5)].map((_, i) => (
                  <linearGradient key={`visualizer-gradient-${i}`} id={`visualizer-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="var(--wave)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.6" />
                  </linearGradient>
                ))}
                <radialGradient id="node-gradient">
                  <stop offset="0%" stopColor="var(--neural)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--glow)" stopOpacity="0.6" />
                </radialGradient>
              </defs>
            </svg>

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[var(--foreground)]/40 text-lg flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span>Neural Wave Visualizer</span>
                </div>
              </div>
            )}
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
              <span>{Math.floor((progress / 100) * 225)}:{Math.floor(((progress / 100) * 225) % 60).toString().padStart(2, '0')}</span>
              <span>{currentTrackData.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <motion.button
              className="p-3 text-[var(--foreground)]/60 hover:text-[var(--primary)] transition-colors"
              onClick={previousTrack}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </motion.button>

            <motion.button
              className="p-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              onClick={togglePlay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </motion.button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-4">
            <svg className="w-5 h-5 text-[var(--foreground)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 16.414V7.586L7.707 4.293A1 1 0 006 5v14a1 1 0 001.707.707L11 16.414z" />
            </svg>
            <div className="flex-1 h-2 bg-[var(--background)]/50 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] rounded-full"
                style={{ width: `${volume}%` }}
              />
            </div>
            <span className="text-sm text-[var(--foreground)]/60 w-8">{volume}</span>
          </div>
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

        {/* Benefits Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
      </div>
    </section>
  );
};

export default MusicPlayer;
