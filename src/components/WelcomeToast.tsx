/**
 * Welcome Toast Component for Demo Mode
 * Shows animated welcome message when demo mode is activated
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { isDemoMode, getDemoPersonaName } from '@/utils/demoData';

interface WelcomeToastProps {
  autoShow?: boolean;
  duration?: number; // milliseconds
}

const WelcomeToast = ({ autoShow = true, duration = 5000 }: WelcomeToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (autoShow && isDemoMode()) {
      // Delay to allow page to settle
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 800);

      // Auto-hide after duration
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, duration + 800);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [autoShow, duration]);

  const personaName = getDemoPersonaName();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-md w-full mx-4"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
        >
          <div className="bg-gradient-to-br from-[#7aa2f7]/95 to-[#bb9af7]/95 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl shadow-[#7aa2f7]/40 p-5 relative overflow-hidden">
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#7aa2f7]/30 via-[#bb9af7]/30 to-[#7aa2f7]/30"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'linear',
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex items-start space-x-4">
              {/* Icon */}
              <motion.div
                className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: {
                    repeat: Infinity,
                    duration: 20,
                    ease: 'linear',
                  },
                  scale: {
                    repeat: Infinity,
                    duration: 2,
                    ease: 'easeInOut',
                  },
                }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg mb-1">
                  Welcome back, {personaName}! 🎵
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Your AI Assistant is ready with personalized recommendations based on your listening history.
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close welcome message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white/40"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeToast;
