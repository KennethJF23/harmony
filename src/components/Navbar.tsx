'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Headphones, BarChart3, CreditCard, Info, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Science', href: '/#science', icon: Info },
    { name: 'Frequencies', href: '/#frequencies', icon: Info },
    { name: 'Research', href: '/#research', icon: Info },
    { name: 'About', href: '/#about', icon: Info },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1a1f35]/95 backdrop-blur-xl border-b border-[#5b9eff]/30 shadow-lg shadow-[#5b9eff]/10'
          : 'bg-gradient-to-b from-[#0a0e1a]/80 to-transparent backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/braihharmonicslogo.jpg" alt="Brain Harmonics" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover" />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] bg-clip-text text-transparent">
                Harmony
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-[#5b9eff]/20 to-[#7c3aed]/20 text-[#5b9eff]'
                        : 'text-[#a9b1d6] hover:text-[#5b9eff] hover:bg-[#5b9eff]/10'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                    {active && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed]"
                        layoutId="activeTab"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Profile/Login Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/pricing">
              <motion.button
                className="px-5 py-2 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] text-white rounded-lg font-medium shadow-lg shadow-[#5b9eff]/30"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(91, 158, 255, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Start Session
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#a9b1d6] hover:text-[#5b9eff] transition-colors touch-manipulation"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-[#1a1f35]/98 backdrop-blur-xl border-b border-[#5b9eff]/30 max-h-[calc(100vh-3.5rem)] overflow-y-auto"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-3 py-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all touch-manipulation min-h-[48px] ${
                        active
                          ? 'bg-gradient-to-r from-[#5b9eff]/20 to-[#7c3aed]/20 text-[#5b9eff]'
                          : 'text-[#a9b1d6] active:bg-[#5b9eff]/10'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium text-base">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
              
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                <motion.button
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] text-white rounded-lg font-medium shadow-lg text-center touch-manipulation min-h-[48px] text-base"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Session
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
