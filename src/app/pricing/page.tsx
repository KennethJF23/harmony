'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WaveRecommendation from '@/components/WaveRecommendation';
import AIAssistant from '@/components/AIAssistant';
import PWAInstaller from '@/components/PWAInstaller';
import ScrollToTop from '@/components/ScrollToTop';

export default function PricingPage() {
  const plans = [
    {
      name: 'Harmony Pro',
      price: '₹199',
      period: '/month',
      description: 'For individuals seeking peak performance',
      features: [
        'All binaural tracks unlocked',
        'Unlimited session duration',
        'AI personalized recommendations',
        'Session analytics & insights',
        'Mood tracking dashboard',
        'Session streaks & achievements',
        'Progress visualization',
        'Priority support',
        'Ad-free experience',
        'Offline PWA mode',
      ],
      cta: 'Start Pro',
      ctaLink: '/sessions',
      icon: Zap,
      gradient: 'from-[#5b9eff] to-[#7c3aed]',
      borderGradient: 'from-[#5b9eff] to-[#7c3aed]',
      popular: true,
      badge: 'Most Popular',
    },
    {
      name: 'Harmony Clinical',
      price: '₹399',
      period: '/month',
      description: 'Professional-grade for neurologists & clinicians',
      features: [
        'All Harmony Pro features',
        'Advanced EEG-pattern recommendations',
        'Clinical-grade tracking dashboard',
        'Patient session monitoring (mockup)',
        'Exportable treatment reports',
        'Research-based track catalog',
        'Early access to brainwave models',
        'Secure multi-profile management',
        'White-label customization options',
        'Dedicated clinical support',
      ],
      cta: 'Get Clinical',
      ctaLink: '/sessions',
      icon: Crown,
      gradient: 'from-[#7c3aed]/20 to-[#5b9eff]/20',
      borderGradient: 'from-[#a78bfa]/50 to-[#bb9af7]/50',
      popular: false,
      badge: 'For Professionals',
    },
  ];

  const trustBadges = [
    { icon: '🧠', text: 'Backed by Neuroscience' },
    { icon: '🎓', text: 'Student-Friendly Pricing' },
    { icon: '🔒', text: 'Secure & Private' },
    { icon: '⚡', text: 'Cancel Anytime' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] bg-clip-text text-transparent">
              Professional Plans
            </span>
          </h1>
          <p className="text-xl text-[#7aa2f7]/80 max-w-2xl mx-auto mb-4">
            Unlock your full potential with science-backed brainwave technology
          </p>
          <p className="text-sm text-[#7aa2f7]/60">
            14-day money-back guarantee • Cancel anytime
          </p>
        </motion.div>
      </div>

      {/* Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-6 bg-[#1e2642]/30 border border-[#5b9eff]/20 rounded-xl"
          >
            <h3 className="text-2xl font-bold text-[#5b9eff] mb-2">For Users</h3>
            <p className="text-[#a9b1d6]">Individual focus & productivity</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-6 bg-[#1e2642]/30 border border-[#7c3aed]/20 rounded-xl"
          >
            <h3 className="text-2xl font-bold text-[#7c3aed] mb-2">For Professionals</h3>
            <p className="text-[#a9b1d6]">Clinical & research applications</p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden ${
                plan.popular
                  ? 'ring-2 ring-[#5b9eff] shadow-2xl shadow-[#5b9eff]/30'
                  : 'border border-[#5b9eff]/20'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] text-white text-xs font-semibold px-4 py-1.5 rounded-bl-xl">
                  {plan.badge}
                </div>
              )}

              {/* Card Content */}
              <div className={`p-8 bg-gradient-to-br ${plan.gradient} backdrop-blur-xl h-full flex flex-col`}>
                {/* Icon */}
                <div className="mb-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.borderGradient} shadow-lg`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-[#a9b1d6] text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-[#7aa2f7] text-lg">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#34d399] flex-shrink-0 mt-0.5" />
                      <span className="text-[#a9b1d6] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={plan.ctaLink}>
                  <motion.button
                    className={`w-full py-4 rounded-xl font-semibold text-white ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] shadow-lg shadow-[#5b9eff]/40'
                        : 'bg-[#2a3254] border border-[#5b9eff]/30 hover:bg-[#3a4264]'
                    } transition-all`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-[#1e2642]/50 border border-[#5b9eff]/10"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-3xl mb-2">{badge.icon}</span>
              <span className="text-sm text-[#7aa2f7]">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Why Upgrade Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-8 md:p-12 border border-[#5b9eff]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Why Upgrade to Pro or Premium?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-[#5b9eff] mb-2">10x</div>
              <div className="text-sm text-[#a9b1d6]">More productive with unlimited sessions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#7c3aed] mb-2">24/7</div>
              <div className="text-sm text-[#a9b1d6]">Access anytime, anywhere, offline</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#34d399] mb-2">100%</div>
              <div className="text-sm text-[#a9b1d6]">Money-back guarantee if not satisfied</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ Teaser */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Have Questions?</h3>
          <p className="text-[#7aa2f7] mb-6">
            Check our FAQ or reach out to our support team
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/#about">
              <motion.button
                className="px-6 py-3 bg-[#2a3254] border border-[#5b9eff]/30 rounded-full text-[#7aa2f7] hover:bg-[#3a4264] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </Link>
            <Link href="mailto:support@harmony.app">
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] rounded-full text-white shadow-lg shadow-[#5b9eff]/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
      <AIAssistant />
      <PWAInstaller />
      <WaveRecommendation />
      <ScrollToTop />
    </div>
  );
}
