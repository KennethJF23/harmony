'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Music', href: '#music' },
    { name: 'Science', href: '#science' },
    { name: 'About', href: '#about' }
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--primary)]/20' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ 
              scale: 1.05,
              transition: { type: 'spring', stiffness: 400, damping: 10 }
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div 
              className="w-8 h-8 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="w-4 h-4 bg-[var(--background)] rounded-full flex items-center justify-center">
                <motion.div 
                  className="w-2 h-2 bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
            <motion.span 
              className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent"
              whileHover={{ 
                textShadow: '0 0 8px rgba(122, 162, 247, 0.5)',
                transition: { duration: 0.3 }
              }}
            >
              Harmonics
            </motion.span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-200 relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -3,
                  scale: 1.05,
                  transition: { type: 'spring', stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] group-hover:w-full transition-all duration-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                />
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(122, 162, 247, 0.1) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                    zIndex: -1
                  }}
                />
              </motion.a>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.button
            onClick={() => router.push('/login')}
            className="hidden md:block px-6 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full font-medium relative overflow-hidden group cursor-pointer"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 25px rgba(122, 162, 247, 0.4)',
              transition: { type: 'spring', stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="relative z-10">Start Session</span>
            {/* Animated background overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ borderRadius: 'inherit' }}
            />
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 border-2 border-[var(--primary)] rounded-full opacity-0"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1] as const
              }}
            />
          </motion.button>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors relative group"
            whileHover={{ 
              scale: 1.1,
              transition: { type: 'spring', stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {/* Hover background */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-[var(--primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
