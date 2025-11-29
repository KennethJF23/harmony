'use client';

import { motion } from 'framer-motion';
import { Brain, Moon, Zap, Heart, Focus } from 'lucide-react';
import { audioTracks } from '@/lib/audioLoader';

interface WavePresetsProps {
  onSelectTrack: (trackId: string) => void;
  currentTrackId?: string;
}

const categoryIcons = {
  focus: Focus,
  relaxation: Heart,
  deep: Brain,
  binaural: Zap,
  ambient: Moon,
};

const categoryColors = {
  focus: { from: '#5b9eff', to: '#7aa2f7', bg: 'from-[#5b9eff]/20 to-[#7aa2f7]/20' },
  relaxation: { from: '#73daca', to: '#7dcfff', bg: 'from-[#73daca]/20 to-[#7dcfff]/20' },
  deep: { from: '#bb9af7', to: '#9d7cd8', bg: 'from-[#bb9af7]/20 to-[#9d7cd8]/20' },
  binaural: { from: '#ff9e64', to: '#e0af68', bg: 'from-[#ff9e64]/20 to-[#e0af68]/20' },
  ambient: { from: '#9ece6a', to: '#73daca', bg: 'from-[#9ece6a]/20 to-[#73daca]/20' },
};

const categoryDescriptions = {
  focus: 'Enhance concentration and productivity',
  relaxation: 'Reduce stress and promote calmness',
  deep: 'Extended sessions for deep work',
  binaural: 'Pure binaural beat frequencies',
  ambient: 'Nature and ambient sounds',
};

const WavePresets = ({ onSelectTrack, currentTrackId }: WavePresetsProps) => {
  // Group tracks by category
  const tracksByCategory = audioTracks.reduce((acc, track) => {
    if (!acc[track.category]) {
      acc[track.category] = [];
    }
    acc[track.category].push(track);
    return acc;
  }, {} as Record<string, typeof audioTracks>);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-3">
          Choose Your Wave
        </h2>
        <p className="text-lg text-[var(--foreground)]/70">
          Select from our scientifically-crafted audio tracks
        </p>
      </motion.div>

      {/* Categories */}
      {Object.entries(tracksByCategory).map(([category, tracks], categoryIndex) => {
        const Icon = categoryIcons[category as keyof typeof categoryIcons];
        const colors = categoryColors[category as keyof typeof categoryColors];
        
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="space-y-4"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${colors.bg}`}
                style={{
                  boxShadow: `0 0 20px ${colors.from}30`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: colors.from }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)] capitalize">
                  {category}
                </h3>
                <p className="text-sm text-[var(--foreground)]/60">
                  {categoryDescriptions[category as keyof typeof categoryDescriptions]}
                </p>
              </div>
            </div>

            {/* Track Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map((track, trackIndex) => {
                const isSelected = track.id === currentTrackId;
                
                return (
                  <motion.button
                    key={track.id}
                    onClick={() => onSelectTrack(track.id)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * 0.1) + (trackIndex * 0.05) }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-5 rounded-xl text-left transition-all duration-300 ${
                      isSelected
                        ? `bg-gradient-to-br ${colors.bg} border-2 shadow-lg`
                        : 'bg-[var(--surface)]/60 border border-[var(--primary)]/10 hover:border-[var(--primary)]/30'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: colors.from,
                            boxShadow: `0 0 30px ${colors.from}30`,
                          }
                        : undefined
                    }
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-r flex items-center justify-center"
                        style={{
                          background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
                        }}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    )}

                    {/* Track Info */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-lg text-[var(--foreground)] mb-1">
                        {track.name}
                      </h4>
                      {track.frequency && (
                        <p className="text-sm text-[var(--foreground)]/60 mb-2">
                          {track.frequency}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-[var(--foreground)]/50">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{Math.floor(track.duration / 60)} min</span>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-1">
                      {track.benefits.slice(0, 2).map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-start gap-2 text-xs text-[var(--foreground)]/70"
                        >
                          <svg
                            className="w-3 h-3 mt-0.5 flex-shrink-0"
                            style={{ color: colors.from }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Play Button Overlay (on hover) */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(to bottom right, ${colors.from}15, ${colors.to}15)`,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg"
                        style={{
                          background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-white ml-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Pro Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 p-6 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--primary)]/20 rounded-2xl"
      >
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Pro Tips for Best Results
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-[var(--foreground)]/80">
          <div className="flex items-start gap-3">
            <div className="text-xl">🎧</div>
            <div>
              <strong>Use Headphones:</strong> Binaural beats require stereo headphones to create the frequency-following effect in your brain.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-xl">🔊</div>
            <div>
              <strong>Comfortable Volume:</strong> Keep volume at a comfortable level - you should hear it clearly but not too loud.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-xl">⏱️</div>
            <div>
              <strong>Consistent Practice:</strong> Use daily for 15-30 minutes to experience the full benefits over time.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-xl">🧘</div>
            <div>
              <strong>Relaxed State:</strong> Start in a comfortable position and allow your mind to follow the audio naturally.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WavePresets;
