'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  category: 'playback' | 'navigation' | 'general';
}

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts: Shortcut[] = [
    // Playback
    { keys: ['Space'], description: 'Play/Pause', category: 'playback' },
    { keys: ['→'], description: 'Next track', category: 'playback' },
    { keys: ['←'], description: 'Previous track', category: 'playback' },
    { keys: ['↑'], description: 'Volume up', category: 'playback' },
    { keys: ['↓'], description: 'Volume down', category: 'playback' },
    { keys: ['L'], description: 'Toggle loop', category: 'playback' },
    
    // Navigation
    { keys: ['S'], description: 'Open stats', category: 'navigation' },
    { keys: ['P'], description: 'Toggle playlist', category: 'navigation' },
    { keys: ['A'], description: 'Open AI assistant', category: 'navigation' },
    { keys: ['H'], description: 'Toggle high contrast', category: 'navigation' },
    
    // General
    { keys: ['?'], description: 'Show shortcuts', category: 'general' },
    { keys: ['Esc'], description: 'Close modals', category: 'general' },
  ];

  const categories = {
    playback: 'Playback Controls',
    navigation: 'Navigation',
    general: 'General',
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  return (
    <>
      {/* Floating Button - Keyboard Shortcuts */}
      <motion.button
        className="fixed bottom-52 right-8 w-12 h-12 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full shadow-lg hover:shadow-xl transition-all z-[70] flex items-center justify-center group"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Show keyboard shortcuts"
        title="Keyboard Shortcuts (Press ?)"
      >
        <Keyboard className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Content */}
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div
                className="bg-gradient-to-br from-[var(--surface)]/98 to-[var(--surface-alt)]/98 backdrop-blur-xl rounded-3xl border border-[var(--primary)]/30 max-w-2xl w-full overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="shortcuts-title"
                aria-describedby="shortcuts-description"
              >
                {/* Header */}
                <div className="p-6 border-b border-[var(--primary)]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2
                        id="shortcuts-title"
                        className="text-2xl font-bold text-[var(--foreground)] mb-1"
                      >
                        Keyboard Shortcuts
                      </h2>
                      <p
                        id="shortcuts-description"
                        className="text-sm text-[var(--foreground)]/60"
                      >
                        Navigate Brain Harmonics with your keyboard
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--background)]/50 rounded-lg transition-colors"
                      aria-label="Close keyboard shortcuts"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Shortcuts List */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {(Object.keys(categories) as Array<keyof typeof categories>).map(
                    (category) => (
                      <div key={category} className="mb-6 last:mb-0">
                        <h3 className="text-sm font-semibold text-[var(--foreground)]/70 uppercase tracking-wider mb-3">
                          {categories[category]}
                        </h3>
                        <div className="space-y-2">
                          {shortcuts
                            .filter((s) => s.category === category)
                            .map((shortcut, index) => (
                              <motion.div
                                key={`${category}-${index}`}
                                className="flex items-center justify-between p-3 bg-[var(--background)]/30 rounded-xl hover:bg-[var(--background)]/50 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <span className="text-[var(--foreground)]">
                                  {shortcut.description}
                                </span>
                                <div className="flex items-center gap-2">
                                  {shortcut.keys.map((key, keyIndex) => (
                                    <kbd
                                      key={keyIndex}
                                      className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--primary)]/30 rounded-lg text-sm font-mono text-[var(--foreground)] shadow-sm min-w-[2.5rem] text-center"
                                    >
                                      {key}
                                    </kbd>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--primary)]/20 bg-[var(--background)]/30">
                  <p className="text-xs text-center text-[var(--foreground)]/50">
                    Press <kbd className="px-2 py-1 bg-[var(--surface)] border border-[var(--primary)]/30 rounded text-[var(--foreground)] font-mono">?</kbd> anytime to show this help
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;
