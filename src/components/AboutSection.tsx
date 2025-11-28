'use client';

import { motion } from 'framer-motion';

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const features = [
    {
      title: 'Precision Frequencies',
      description: 'Scientifically calibrated binaural beats generated in real-time using advanced Web Audio API technology.'
    },
    {
      title: 'Privacy First',
      description: 'All audio processing happens in your browser. No data collection, no tracking, complete privacy.'
    },
    {
      title: 'Instant Access',
      description: 'No downloads, no installations. Start improving your mental state immediately from any modern browser.'
    },
    {
      title: 'Custom Sessions',
      description: 'Personalized listening experiences with tracks designed for focus, relaxation, creativity, and sleep.'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your listening sessions and see how your mental wellness improves over time.'
    },
    {
      title: 'Free & Accessible',
      description: 'Mental wellness tools should be available to everyone. Harmonics is completely free to use.'
    }
  ];

  const team = [
    {
      name: 'Audio Engineering',
      description: 'Advanced binaural beat generation with real-time frequency synthesis'
    },
    {
      name: 'Neuroscience',
      description: 'Research-backed frequency selections for optimal brain wave entrainment'
    },
    {
      name: 'User Experience',
      description: 'Beautiful, intuitive interface with smooth animations and interactions'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-bg opacity-40"></div>
      
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
              About Harmonics
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Harmony is an open-source web app that uses binaural beats to help you focus better, 
            relax more effectively, and improve your productivity.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          className="mb-20 bg-gradient-to-br from-[var(--surface)]/80 to-[var(--surface-alt)]/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[var(--primary)]/20"
          variants={itemVariants}
        >
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-6">

            </div>
            <h3 className="text-3xl font-bold text-[var(--foreground)] mb-4">Our Mission</h3>
            <p className="text-lg text-[var(--foreground)]/80 leading-relaxed">
              To make scientifically-proven brain wave entrainment technology accessible to everyone, 
              empowering individuals to take control of their mental wellness through the therapeutic 
              power of sound and frequency. We believe that mental clarity, deep relaxation, and peak 
              performance should be available to all, not just a privileged few.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div className="mb-20" variants={itemVariants}>
          <h3 className="text-3xl font-bold text-[var(--foreground)] mb-10 text-center">What Makes Us Different</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="bg-gradient-to-br from-[var(--surface)]/60 to-[var(--surface-alt)]/40 backdrop-blur-xl rounded-2xl p-6 border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h4 className="text-xl font-bold text-[var(--foreground)] mb-3">{feature.title}</h4>
                <p className="text-[var(--foreground)]/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div className="mb-20" variants={itemVariants}>
          <h3 className="text-3xl font-bold text-[var(--foreground)] mb-10 text-center">Built With Excellence</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((area) => (
              <motion.div
                key={area.name}
                className="bg-gradient-to-br from-[var(--surface)]/60 to-[var(--surface-alt)]/40 backdrop-blur-xl rounded-2xl p-8 border border-[var(--primary)]/20 text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full mx-auto mb-6"></div>
                <h4 className="text-2xl font-bold text-[var(--foreground)] mb-3">{area.name}</h4>
                <p className="text-[var(--foreground)]/70 leading-relaxed">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Details */}
        <motion.div 
          className="bg-gradient-to-br from-[var(--surface)]/60 to-[var(--surface-alt)]/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[var(--primary)]/20"
          variants={itemVariants}
        >
          <h3 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">Technology Stack</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-[var(--primary)] mb-4">Frontend</h4>
              <ul className="space-y-3 text-[var(--foreground)]/70">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full mr-3"></span>
                  Next.js 15 with App Router & Turbopack
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full mr-3"></span>
                  React 19 with TypeScript
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full mr-3"></span>
                  Framer Motion for smooth animations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full mr-3"></span>
                  Tailwind CSS 4 for styling
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-[var(--primary)] mb-4">Audio Engine</h4>
              <ul className="space-y-3 text-[var(--foreground)]/70">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] rounded-full mr-3"></span>
                  Web Audio API for real-time synthesis
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] rounded-full mr-3"></span>
                  Custom oscillators for binaural beats
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] rounded-full mr-3"></span>
                  Stereo channel processing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] rounded-full mr-3"></span>
                  Local storage for user preferences
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <p className="text-[var(--foreground)]/60 mb-6 max-w-2xl mx-auto text-lg">
            Join thousands of users who have discovered the power of brain wave entrainment. 
            Start your journey to enhanced mental performance today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-[var(--primary)]/25 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('music')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Listening
            </motion.button>
            <motion.button
              className="px-8 py-4 border-2 border-[var(--primary)] text-[var(--primary)] rounded-full font-semibold text-lg hover:bg-[var(--primary)] hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
