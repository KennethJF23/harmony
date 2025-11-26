'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Contrast } from 'lucide-react';

const HighContrastToggle = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Load preference from localStorage
    const saved = localStorage.getItem('harmony_high_contrast');
    if (saved !== null) {
      const enabled = saved === 'true';
      setIsHighContrast(enabled);
      applyHighContrast(enabled);
    } else {
      // Check system preference
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      if (prefersHighContrast) {
        setIsHighContrast(true);
        applyHighContrast(true);
      }
    }
  }, []);

  const applyHighContrast = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    applyHighContrast(newValue);
    localStorage.setItem('harmony_high_contrast', newValue.toString());
    
    // Announce to screen readers
    const message = newValue ? 'High contrast mode enabled' : 'High contrast mode disabled';
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  useEffect(() => {
    // Listen for 'H' key
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'h' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          toggleHighContrast();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isHighContrast]);

  return (
    <motion.button
      onClick={toggleHighContrast}
      className={`fixed bottom-24 right-6 p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 ${
        isHighContrast
          ? 'bg-white text-black border-2 border-black'
          : 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
      aria-pressed={isHighContrast}
      title={`High Contrast Mode (Press H)\n${isHighContrast ? 'Enabled' : 'Disabled'}`}
    >
      <Contrast className="w-6 h-6" />
    </motion.button>
  );
};

export default HighContrastToggle;
