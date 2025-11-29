'use client';

import { motion } from 'framer-motion';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as const
      }
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden neural-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Neural Network Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 600">
          {/* Main Brain Wave Lines - Reduced from 6 to 3 for performance */}
          {[...Array(3)].map((_, i) => (
            <motion.path
              key={`wave-${i}`}
              d={`M0,${150 + i * 100} Q250,${130 + i * 100} 500,${150 + i * 100} T1000,${150 + i * 100}`}
              stroke="url(#gradient1)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                pathLength: { duration: 4, delay: i * 0.8 },
                opacity: { duration: 6, repeat: Infinity, delay: i * 0.5 }
              }}
            />
          ))}
          
          {/* Neural Connection Nodes - Reduced from 8 to 5 */}
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={150 + (i * 175)}
              cy={250 + Math.sin(i) * 80}
              r="5"
              fill="url(#gradient2)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.6,
                ease: [0.42, 0, 0.58, 1] as const
              }}
            />
          ))}

          {/* Connecting Lines between Nodes - Reduced from 7 to 4 */}
          {[...Array(4)].map((_, i) => (
            <motion.line
              key={`connection-${i}`}
              x1={150 + (i * 175)}
              y1={250 + Math.sin(i) * 80}
              x2={150 + ((i + 1) * 175)}
              y2={250 + Math.sin(i + 1) * 80}
              stroke="url(#gradient3)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1,
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                pathLength: { duration: 3, delay: i * 0.5 },
                opacity: { duration: 5, repeat: Infinity, delay: i * 0.8 }
              }}
            />
          ))}

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
              <stop offset="50%" stopColor="var(--wave)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--neural)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--glow)" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Frequency Waves */}
        <motion.div
          className="absolute top-1/4 left-10 w-64 h-2 bg-gradient-to-r from-transparent via-[var(--wave)]/40 to-transparent rounded-full"
          animate={{
            scaleX: [0.5, 2, 0.5],
            opacity: [0.3, 0.8, 0.3],
            x: [-50, 50, -50]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1] as const
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 right-10 w-48 h-1 bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent rounded-full"
          animate={{
            scaleX: [1, 1.5, 1],
            opacity: [0.4, 0.9, 0.4],
            x: [50, -50, 50]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 1,
            ease: [0.42, 0, 0.58, 1] as const
          }}
        />

        {/* Pulsing Energy Centers */}
        <motion.div
          className="absolute top-20 right-1/4 w-32 h-32 rounded-full bg-gradient-radial from-[var(--neural)]/20 via-[var(--glow)]/10 to-transparent"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1] as const
          }}
        />

        <motion.div
          className="absolute bottom-20 left-1/3 w-24 h-24 rounded-full bg-gradient-radial from-[var(--secondary)]/20 via-[var(--primary)]/10 to-transparent"
          animate={{
            scale: [1.2, 0.8, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: 2,
            ease: [0.42, 0, 0.58, 1] as const
          }}
        />

        {/* Additional Floating Harmonics */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/60 to-transparent rounded-full"
          animate={{
            scaleX: [0.8, 1.8, 0.8],
            opacity: [0.4, 0.9, 0.4],
            rotate: [0, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            delay: 3,
            ease: [0.42, 0, 0.58, 1] as const
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/3 w-20 h-1 bg-gradient-to-r from-transparent via-[var(--wave)]/50 to-transparent rounded-full"
          animate={{
            scaleX: [1.2, 0.6, 1.2],
            opacity: [0.3, 0.8, 0.3],
            rotate: [180, -180]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            delay: 5,
            ease: [0.42, 0, 0.58, 1] as const
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Subtitle */}
        <motion.div
          className="mb-6"
          variants={itemVariants}
        >
          <span className="inline-block px-4 py-1.5 rounded-md text-sm bg-[#1a1f35]/80 border border-[#5b9eff]/20 text-gray-400">
            Web Audio API • Real-time Generation
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          variants={itemVariants}
        >
          <span className="block bg-gradient-to-r from-[#5b9eff] to-[#a78bfa] bg-clip-text text-transparent">
            Harmony
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl mt-3 text-gray-300 font-normal">
            Binaural Beats for Focus & Relaxation
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Scientifically-designed audio frequencies that help you focus better, think clearly, and relax deeply. No ads, no tracking, just pure sound.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          variants={itemVariants}
        >
          <motion.a
            href="/pricing"
            className="px-8 py-4 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] text-white rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 min-w-[180px] text-center"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Session
          </motion.a>
          <motion.a
            href="/pricing"
            className="px-8 py-4 border border-[#5b9eff]/50 text-white rounded-lg font-semibold text-base hover:bg-[#5b9eff]/10 transition-all duration-200 min-w-[180px] text-center"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            View Pricing
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
