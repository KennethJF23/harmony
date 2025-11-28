'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const InstructionsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show instructions on first visit
    const hasSeenInstructions = localStorage.getItem('harmony_seen_instructions');
    if (!hasSeenInstructions) {
      setTimeout(() => setIsOpen(true), 2000);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('harmony_seen_instructions', 'true');
    setIsOpen(false);
  };

  const instructions = [
    {
      icon: 'headphones',
      title: 'Use Headphones',
      description: 'Binaural beats require headphones to work properly. Each ear receives a different frequency.'
    },
    {
      icon: 'volume',
      title: 'Adjust Volume',
      description: 'Start with a comfortable volume. The audio should be audible but not loud.'
    },
    {
      icon: 'clock',
      title: 'Give It Time',
      description: 'Brain wave entrainment takes 5-10 minutes. Be patient and relaxed.'
    },
    {
      icon: 'target',
      title: 'Choose Your Goal',
      description: 'Select tracks based on what you want: focus, relaxation, creativity, or sleep.'
    }
  ];

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div 
              className="bg-gradient-to-br from-[var(--surface)]/98 to-[var(--surface-alt)]/98 backdrop-blur-xl rounded-3xl p-8 border border-[var(--primary)]/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  👋
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-3">
                  Welcome to Harmonics!
                </h2>
                <p className="text-lg text-[var(--foreground)]/80">
                  Get started with these quick tips for the best experience
                </p>
              </div>

              {/* Instructions */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {instructions.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 mb-3 text-[var(--primary)]">
                      {item.icon === 'headphones' && (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      )}
                      {item.icon === 'volume' && (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      )}
                      {item.icon === 'clock' && (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {item.icon === 'target' && (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[var(--foreground)]/70 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Important Notes */}
              <motion.div
                className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-2xl p-6 border border-[var(--primary)]/20 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-bold text-[var(--foreground)] mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Important Safety Information
                </h4>
                <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Do not use while driving or operating machinery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Not recommended for people with epilepsy or seizure disorders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Consult a doctor if you have any medical concerns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Effects vary by individual - results may differ</span>
                  </li>
                </ul>
              </motion.div>

              {/* CTA Button */}
              <div className="text-center">
                <motion.button
                  onClick={handleClose}
                  className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-lg font-semibold text-base hover:shadow-xl transition-all duration-300 w-full md:w-auto"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
                <p className="text-sm text-[var(--foreground)]/60 mt-4">
                  You can always access instructions from the menu
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InstructionsModal;
