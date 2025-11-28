'use client';

import { motion } from 'framer-motion';

const ScienceSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as const
      }
    }
  };

  const brainwaveTypes = [
    {
      name: 'Delta Waves',
      range: '0.5-4 Hz',
      color: 'from-[var(--secondary)] to-[var(--primary)]',
      description: 'Deep sleep, healing, and regeneration',
      benefits: ['Enhances deep sleep', 'Promotes healing', 'Boosts immune system', 'Reduces stress']
    },
    {
      name: 'Theta Waves',
      range: '4-8 Hz',
      color: 'from-[var(--wave)] to-[var(--accent)]',
      description: 'Meditation, intuition, and memory',
      benefits: ['Deep meditation', 'Enhanced creativity', 'Emotional healing', 'Improved memory']
    },
    {
      name: 'Alpha Waves',
      range: '8-12 Hz',
      color: 'from-[var(--primary)] to-[var(--wave)]',
      description: 'Relaxed focus and learning',
      benefits: ['Stress reduction', 'Mental coordination', 'Learning enhancement', 'Positive thinking']
    },
    {
      name: 'Beta Waves',
      range: '13-30 Hz',
      color: 'from-[var(--neural)] to-[var(--glow)]',
      description: 'Active thinking and focus',
      benefits: ['Enhanced focus', 'Problem solving', 'High energy', 'Peak concentration']
    },
    {
      name: 'Gamma Waves',
      range: '30-100 Hz',
      color: 'from-[var(--glow)] to-[var(--accent)]',
      description: 'Peak cognitive performance',
      benefits: ['Heightened perception', 'Information processing', 'Cognitive enhancement', 'Peak performance']
    }
  ];

  const research = [
    {
      title: 'Entrainment Effect',
      description: 'When exposed to rhythmic stimuli, brain waves naturally synchronize to match the external frequency.',
      stat: '70%+',
      label: 'Success Rate'
    },
    {
      title: 'Clinical Studies',
      description: 'Over 100 peer-reviewed studies support the effectiveness of binaural beats for cognitive enhancement.',
      stat: '100+',
      label: 'Research Papers'
    },
    {
      title: 'User Improvement',
      description: 'Users report significant improvements in focus, sleep quality, and stress reduction within 2 weeks.',
      stat: '85%',
      label: 'Report Benefits'
    }
  ];

  return (
    <section id="science" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[var(--background)]">
      {/* Background */}
      <div className="absolute inset-0 neural-bg opacity-30"></div>
      
      <motion.div
        className="relative z-10 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              The Science Behind
            </span>
          </h2>
          <p className="text-xl text-[var(--foreground)]/80 max-w-3xl mx-auto">
            Binaural beats use the brain&apos;s natural frequency-following response to influence mental states through precise audio frequencies.
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          className="mb-20 bg-gradient-to-br from-[var(--surface)]/60 to-[var(--surface-alt)]/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[var(--primary)]/20"
          variants={itemVariants}
        >
          <h3 className="text-3xl font-bold text-[var(--foreground)] mb-6 text-center">How Binaural Beats Work</h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎧</span>
              </div>
              <h4 className="text-xl font-semibold text-[var(--foreground)] mb-2">Step 1: Stereo Tones</h4>
              <p className="text-[var(--foreground)]/70">Two slightly different frequencies are played in each ear through headphones</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">

              </div>
              <h4 className="text-xl font-semibold text-[var(--foreground)] mb-2">Step 2: Brain Processing</h4>
              <p className="text-[var(--foreground)]/70">Your brain perceives the difference as a third &quot;phantom&quot; tone</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--neural)] to-[var(--glow)] rounded-full flex items-center justify-center mx-auto mb-4">

              </div>
              <h4 className="text-xl font-semibold text-[var(--foreground)] mb-2">Step 3: Entrainment</h4>
              <p className="text-[var(--foreground)]/70">Brain waves naturally synchronize to match the perceived frequency</p>
            </div>
          </div>
        </motion.div>

        {/* Brainwave Types */}
        <motion.div id="frequencies" className="mb-20" variants={itemVariants}>
          <h3 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">Brain Wave Frequencies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brainwaveTypes.map((wave) => (
              <motion.div
                key={wave.name}
                className="bg-gradient-to-br from-[var(--surface)]/60 to-[var(--surface-alt)]/40 backdrop-blur-xl rounded-2xl p-6 border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="mb-4">
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${wave.color} rounded-full text-white font-semibold text-sm`}>
                    {wave.range}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-[var(--foreground)] mb-2">{wave.name}</h4>
                <p className="text-[var(--foreground)]/70 mb-4">{wave.description}</p>
                <div className="space-y-2">
                  {wave.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-sm text-[var(--foreground)]/60">
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full mr-2"></span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Research Stats */}
        <motion.div id="research" variants={itemVariants}>
          <h3 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">Research-Backed Results</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {research.map((item) => (
              <motion.div
                key={item.title}
                className="bg-gradient-to-br from-[var(--surface)]/60 to-[var(--surface-alt)]/40 backdrop-blur-xl rounded-2xl p-8 border border-[var(--primary)]/20 text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-2">
                  {item.stat}
                </div>
                <div className="text-sm text-[var(--accent)] uppercase tracking-wider mb-4 font-semibold">
                  {item.label}
                </div>
                <h4 className="text-xl font-bold text-[var(--foreground)] mb-2">{item.title}</h4>
                <p className="text-[var(--foreground)]/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <p className="text-[var(--foreground)]/60 mb-6 max-w-2xl mx-auto">
            Experience the power of scientifically-designed audio frequencies. Start your journey to enhanced focus, creativity, and relaxation today.
          </p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-[var(--primary)]/25 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('music')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Try It Now
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ScienceSection;
