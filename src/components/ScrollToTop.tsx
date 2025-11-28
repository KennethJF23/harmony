'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-36 right-8 w-12 h-12 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-[50] group"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
          title="Back to Top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 whitespace-nowrap bg-[#1a1f35] text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Back to top
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;