'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { AudioEngine } from '@/utils/audioEngine';

interface AmbientMixerProps {
  audioEngine: AudioEngine | null;
}

interface AmbientSound {
  id: 'rain' | 'whitenoise' | 'forest' | 'ocean';
  name: string;
  color: string;
  description: string;
}

const ambientSounds: AmbientSound[] = [
  {
    id: 'rain',
    name: 'Rain',
    color: '#73daca',
    description: 'Gentle rainfall ambience'
  },
  {
    id: 'whitenoise',
    name: 'White Noise',
    color: '#c0caf5',
    description: 'Pure static masking'
  },
  {
    id: 'forest',
    name: 'Forest',
    color: '#9ece6a',
    description: 'Natural forest sounds'
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    color: '#7aa2f7',
    description: 'Calming ocean waves'
  }
];

const AmbientMixer = ({ audioEngine }: AmbientMixerProps) => {
  const [volumes, setVolumes] = useState<Record<string, number>>({
    rain: 0,
    whitenoise: 0,
    forest: 0,
    ocean: 0
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleVolumeChange = async (soundId: 'rain' | 'whitenoise' | 'forest' | 'ocean', value: number) => {
    const newVolume = value / 100;
    setVolumes(prev => ({ ...prev, [soundId]: value }));

    if (!audioEngine) return;

    if (newVolume > 0) {
      if (!audioEngine.isAmbientPlaying(soundId)) {
        await audioEngine.startAmbient(soundId, newVolume);
      } else {
        audioEngine.setAmbientVolume(soundId, newVolume);
      }
    } else {
      if (audioEngine.isAmbientPlaying(soundId)) {
        audioEngine.stopAmbient(soundId);
      }
    }
  };

  const resetAll = () => {
    ambientSounds.forEach(sound => {
      if (audioEngine && audioEngine.isAmbientPlaying(sound.id)) {
        audioEngine.stopAmbient(sound.id);
      }
    });
    setVolumes({
      rain: 0,
      whitenoise: 0,
      forest: 0,
      ocean: 0
    });
  };

  const hasActiveAmbient = Object.values(volumes).some(v => v > 0);

  return (
    <motion.div
      className="bg-gradient-to-br from-[var(--surface)]/60 to-[var(--surface-alt)]/40 backdrop-blur-xl rounded-2xl border border-[var(--primary)]/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-[var(--surface)]/20 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] flex items-center justify-center">

          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-[var(--foreground)]">Ambient Sound Mixer</h3>
            <p className="text-sm text-[var(--foreground)]/60">
              {hasActiveAmbient ? 'Active sounds playing' : 'Mix ambient sounds with binaural beats'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveAmbient && (
            <motion.div
              className="flex items-center space-x-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="text-xs text-[var(--accent)] font-semibold">
                {Object.values(volumes).filter(v => v > 0).length} active
              </span>
            </motion.div>
          )}
          <motion.svg
            className="w-5 h-5 text-[var(--foreground)]/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </button>

      {/* Mixer Controls */}
      {isExpanded && (
        <motion.div
          className="px-6 pb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-6">
            {ambientSounds.map((sound, index) => {
              const volume = volumes[sound.id];
              const isActive = volume > 0;

              return (
                <motion.div
                  key={sound.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'border-[var(--primary)]/40 bg-[var(--surface)]/40'
                      : 'border-[var(--foreground)]/10 bg-[var(--background)]/30'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[var(--foreground)]">{sound.name}</h4>
                      <p className="text-xs text-[var(--foreground)]/60">{sound.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-[var(--foreground)]/60 w-10 text-right">
                        {volume}%
                      </span>
                      {isActive && (
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: sound.color }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => handleVolumeChange(sound.id, parseInt(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer transition-all"
                      style={{
                        background: `linear-gradient(to right, ${sound.color} 0%, ${sound.color} ${volume}%, rgba(192, 202, 245, 0.1) ${volume}%, rgba(192, 202, 245, 0.1) 100%)`
                      }}
                    />
                    <style jsx>{`
                      input[type="range"]::-webkit-slider-thumb {
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: ${sound.color};
                        cursor: pointer;
                        box-shadow: 0 0 10px ${sound.color}80;
                      }
                      input[type="range"]::-moz-range-thumb {
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: ${sound.color};
                        cursor: pointer;
                        border: none;
                        box-shadow: 0 0 10px ${sound.color}80;
                      }
                    `}</style>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Reset Button */}
          {hasActiveAmbient && (
            <motion.button
              onClick={resetAll}
              className="w-full mt-4 py-3 bg-[var(--surface)]/60 hover:bg-[var(--surface)] border border-[var(--foreground)]/10 rounded-xl text-sm font-semibold text-[var(--foreground)]/80 transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset All Ambient Sounds
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AmbientMixer;
