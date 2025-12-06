'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnalyticsDashboard from '@/components/stats/AnalyticsDashboard';
import AIAssistant from '@/components/AIAssistant';
import PWAInstaller from '@/components/PWAInstaller';
import WaveRecommendation from '@/components/WaveRecommendation';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] bg-clip-text text-transparent">
                Focus Analytics Dashboard
              </span>
            </h1>
            <p className="text-xl text-[#a9b1d6]/80 max-w-2xl mx-auto">
              Track your productivity, monitor your progress, and optimize your focus sessions
            </p>
          </motion.div>

          {/* Analytics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnalyticsDashboard />
          </motion.div>
        </div>
      </main>

      <Footer />
      <AIAssistant />
      <PWAInstaller />
      <WaveRecommendation />
    </div>
  );
}
