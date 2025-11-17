'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AudioEngine } from '@/utils/audioEngine';

interface AudioVisualizerProps {
  audioEngine: AudioEngine | null;
  isPlaying: boolean;
  category: 'focus' | 'relaxation' | 'creativity' | 'sleep';
  mode?: 'bars' | 'waveform' | 'circular';
  onModeChange?: (mode: 'bars' | 'waveform' | 'circular') => void;
}

const AudioVisualizer = ({ audioEngine, isPlaying, category, mode = 'bars', onModeChange }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const categoryColors = {
    focus: { primary: '#7aa2f7', secondary: '#bb9af7', glow: 'rgba(122, 162, 247, 0.5)' },
    relaxation: { primary: '#73daca', secondary: '#9ece6a', glow: 'rgba(115, 218, 202, 0.5)' },
    creativity: { primary: '#f7768e', secondary: '#e0af68', glow: 'rgba(247, 118, 142, 0.5)' },
    sleep: { primary: '#bb9af7', secondary: '#7aa2f7', glow: 'rgba(187, 154, 247, 0.5)' }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 11, 20, 0.1)';
      ctx.fillRect(0, 0, width, height);

      if (isPlaying && audioEngine) {
        const colors = categoryColors[category];
        
        if (mode === 'bars') {
          // Frequency bars visualization
          const frequencyData = audioEngine.getFrequencyData();
          const bufferLength = frequencyData.length;
          
          if (bufferLength > 0) {
            const barWidth = width / bufferLength * 2.5;
            
            for (let i = 0; i < bufferLength; i++) {
              const barHeight = (frequencyData[i] / 255) * height * 0.8;
              const x = i * barWidth;
              const y = height - barHeight;

              // Create gradient for each bar
              const gradient = ctx.createLinearGradient(x, y, x, height);
              gradient.addColorStop(0, colors.primary);
              gradient.addColorStop(1, colors.secondary);

              ctx.fillStyle = gradient;
              ctx.fillRect(x, y, barWidth - 2, barHeight);

              // Add glow effect on higher frequencies
              if (frequencyData[i] > 150) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = colors.glow;
                ctx.fillRect(x, y, barWidth - 2, barHeight);
                ctx.shadowBlur = 0;
              }
            }
          }
        } else if (mode === 'waveform') {
          // Smooth waveform visualization
          const timeDomain = audioEngine.getTimeDomainData();
          ctx.beginPath();
          ctx.lineWidth = 4;
          
          const gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, colors.primary);
          gradient.addColorStop(0.5, colors.glow);
          gradient.addColorStop(1, colors.secondary);
          ctx.strokeStyle = gradient;
          
          const sliceWidth = width / timeDomain.length;
          let x = 0;

          for (let i = 0; i < timeDomain.length; i++) {
            const v = timeDomain[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            x += sliceWidth;
          }
          
          ctx.stroke();
          
          // Add glow
          ctx.shadowBlur = 20;
          ctx.shadowColor = colors.glow;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else if (mode === 'circular') {
          // Circular radial visualization
          const frequencyData = audioEngine.getFrequencyData();
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(width, height) * 0.3;
          const bars = 64;
          
          for (let i = 0; i < bars; i++) {
            const angle = (i / bars) * Math.PI * 2;
            const amplitude = frequencyData[Math.floor(i * frequencyData.length / bars)] / 255;
            const barHeight = amplitude * radius * 0.8;
            
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + barHeight);
            const y2 = centerY + Math.sin(angle) * (radius + barHeight);
            
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, colors.primary);
            gradient.addColorStop(1, colors.secondary);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            if (amplitude > 0.6) {
              ctx.shadowBlur = 15;
              ctx.shadowColor = colors.glow;
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          }

          ctx.stroke();
        }
      } else {
        // Idle animation when not playing
        const time = Date.now() * 0.001;
        const colors = categoryColors[category];
        
        ctx.beginPath();
        ctx.lineWidth = 2;
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, colors.primary);
        gradient.addColorStop(1, colors.secondary);
        ctx.strokeStyle = gradient;

        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin((x * 0.02) + time) * 20 + Math.sin((x * 0.01) + time * 1.5) * 15;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioEngine, isPlaying, category, mode]);

  return (
    <motion.div
      className="relative w-full h-32 bg-[var(--background)]/50 rounded-2xl overflow-hidden border border-[var(--primary)]/10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {!isPlaying && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-[var(--foreground)]/30 text-sm flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span>Press play to see live audio visualization</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AudioVisualizer;
