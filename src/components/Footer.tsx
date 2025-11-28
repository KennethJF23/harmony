'use client';

import { motion } from 'framer-motion';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as const
      }
    }
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
    { name: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01' },
    { name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
    { name: 'YouTube', icon: 'M23 6.987c-.264-1.969-1.025-3.57-2.994-3.834C18.271 3 12 3 12 3s-6.271 0-8.006.153C2.025 3.417 1.264 5.018 1 6.987 .847 8.722.847 12.278 1 14.013c.264 1.969 1.025 3.57 2.994 3.834C5.729 18 12 18 12 18s6.271 0 8.006-.153c1.969-.264 2.73-1.865 2.994-3.834.153-1.735.153-5.291 0-7.026z' }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Music Library', href: '#music' },
    { name: 'Science', href: '#science' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Support', href: '#support' }
  ];

  const resources = [
    { name: 'Research Papers', href: '#research' },
    { name: 'User Guide', href: '#guide' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Blog', href: '#blog' },
    { name: 'Community', href: '#community' },
    { name: 'API Docs', href: '#api' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[var(--background)] to-[var(--surface)] border-t border-[var(--primary)]/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 neural-bg opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[var(--primary)]/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: [0.42, 0, 0.58, 1] as const
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-[var(--background)] rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] rounded-full animate-pulse"></div>
                </div>
              </div>
              <span className="text-2xl font-semibold text-white">
                Harmony
              </span>
            </motion.div>
            
            <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-md">
              Free and open-source binaural beat generator. Built with Web Audio API for real-time frequency generation.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="text-[var(--foreground)] font-semibold mb-3">Stay Updated</h4>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-[var(--surface-alt)]/50 border border-[var(--primary)]/20 rounded-l-full text-[var(--foreground)] placeholder-[var(--foreground)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-r-full font-medium hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href="#"
                  className="w-10 h-10 bg-[var(--surface-alt)]/50 rounded-full flex items-center justify-center text-[var(--foreground)]/60 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[var(--foreground)] font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors duration-200 flex items-center group"
                    whileHover={{ x: 4 }}
                  >
                    <span className="w-0 h-0.5 bg-[var(--primary)] group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[var(--foreground)] font-semibold text-lg mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <motion.li
                  key={resource.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <motion.a
                    href={resource.href}
                    className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors duration-200 flex items-center group"
                    whileHover={{ x: 4 }}
                  >
                    <span className="w-0 h-0.5 bg-[var(--primary)] group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {resource.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="border-t border-[var(--primary)]/20 pt-8"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.div
              className="text-[var(--foreground)]/60 text-sm"
              variants={itemVariants}
            >
              © 2025 Harmonics. All rights reserved. Designed for cognitive enhancement.
            </motion.div>

            {/* Legal Links */}
            <motion.div
              className="flex space-x-6 text-sm"
              variants={itemVariants}
            >
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-[var(--foreground)]/60 hover:text-[var(--primary)] transition-colors duration-200"
                  whileHover={{ y: -1 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
