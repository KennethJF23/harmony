/**
 * Demo Mode Indicator
 * Shows a subtle badge when demo mode is active
 * Helps judges understand they're viewing prepopulated data
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { isDemoMode, getDemoPersonaName } from '@/utils/demoData';

const DemoModeIndicator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [personaName, setPersonaName] = useState('');

  useEffect(() => {
    if (isDemoMode()) {
      setPersonaName(getDemoPersonaName());
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-[90] max-w-xs"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ delay: 6, duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-[#7aa2f7]/90 to-[#bb9af7]/90 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl p-3 pr-10 relative">
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close demo indicator"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-white flex-shrink-0" />
            <div>
              <p className="text-white text-xs font-bold">Demo Mode Active</p>
              <p className="text-white/80 text-xs">{personaName}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoModeIndicator;
