'use client';

import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0f1729]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Pulsing circles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-radial from-[#5b9eff]/20 to-transparent"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-radial from-[#a78bfa]/20 to-transparent"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-r from-[#5b9eff] to-[#a78bfa] rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-14 h-14 bg-[#0a0e1a] rounded-full flex items-center justify-center">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-[#2dd4bf] to-[#34d399] rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl font-semibold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Harmony
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base text-gray-500 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Loading...
        </motion.p>

        {/* Loading Bar */}
        <motion.div
          className="w-64 h-2 bg-[#1a1f35] rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#5b9eff] via-[#a78bfa] to-[#2dd4bf]"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>

        {/* Wave Animation */}
        <div className="mt-12 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-[#5b9eff] to-[#a78bfa] rounded-full"
              animate={{
                height: [20, 40, 20]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
