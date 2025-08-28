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
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/20 border border-[var(--primary)]/30 text-[var(--primary)]">
            <div className="w-2 h-2 bg-[var(--wave)] rounded-full mr-2 animate-pulse"></div>
            Advanced Brain Wave Technology
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          variants={itemVariants}
        >
          <span className="block bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--wave)] bg-clip-text text-transparent">
            Harmonics
          </span>
          <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 text-[var(--foreground)]">
            Brain Wave Music
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-xl md:text-2xl text-[var(--foreground)]/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Experience scientifically-designed frequencies that synchronize with your brain waves to enhance focus, creativity, and deep relaxation.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          variants={itemVariants}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-[var(--primary)]/25 transition-all duration-300 min-w-[200px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.button>
          <motion.button
            className="px-8 py-4 border-2 border-[var(--primary)] text-[var(--primary)] rounded-full font-semibold text-lg hover:bg-[var(--primary)] hover:text-white transition-all duration-300 min-w-[200px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          {[
            { number: '50K+', label: 'Active Users' },
            { number: '98%', label: 'Success Rate' },
            { number: '24/7', label: 'Available' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-[var(--foreground)]/60 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator  */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-[var(--primary)] rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-[var(--primary)] rounded-full mt-2"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
