'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Music, LogOut } from 'lucide-react';
import Footer from '@/components/Footer';
import SoundPlayer from '@/components/player/SoundPlayer';
import AIAssistant from '@/components/AIAssistant';
import PWAInstaller from '@/components/PWAInstaller';
import ScrollToTop from '@/components/ScrollToTop';
import { FrequencyPresets } from '@/utils/audioEngine';

function SessionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  
  const trackTitle = searchParams.get('track') || 'Deep Focus Alpha';
  const frequency = searchParams.get('frequency') || '8-12 Hz';
  const duration = parseInt(searchParams.get('duration') || '1500', 10);
  const category = (searchParams.get('category') || 'focus') as string;

  useEffect(() => {
    // Get user name from localStorage
    const email = localStorage.getItem('userEmail') || 'user@example.com';
    setUserName(email.split('@')[0]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  // Map frequency to audio engine presets
  const getFrequencyPreset = () => {
    const freq = frequency.toLowerCase();
    if (freq.includes('4-8') || freq.includes('theta')) {
      return {
        base: FrequencyPresets.THETA.baseFrequency,
        beat: FrequencyPresets.THETA.beatFrequency,
      };
    } else if (freq.includes('13-30') || freq.includes('beta')) {
      return {
        base: FrequencyPresets.BETA.baseFrequency,
        beat: FrequencyPresets.BETA.beatFrequency,
      };
    } else if (freq.includes('0.5-4') || freq.includes('delta')) {
      return {
        base: FrequencyPresets.DELTA.baseFrequency,
        beat: FrequencyPresets.DELTA.beatFrequency,
      };
    } else {
      return {
        base: FrequencyPresets.ALPHA.baseFrequency,
        beat: FrequencyPresets.ALPHA.beatFrequency,
      };
    }
  };

  const { base, beat } = getFrequencyPreset();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]">
      {/* Dashboard Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1f35]/95 backdrop-blur-xl border-b border-[#5b9eff]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard/user">
              <div className="flex items-center space-x-2.5 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-[#5b9eff] to-[#7c3aed] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white/90 rounded-sm" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] bg-clip-text text-transparent">
                  Harmony
                </span>
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/dashboard/user">
                <motion.div
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-[#a9b1d6] hover:text-[#5b9eff] hover:bg-[#5b9eff]/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                </motion.div>
              </Link>
              
              <Link href="/sessions">
                <motion.div
                  className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-[#5b9eff]/20 to-[#7c3aed]/20 text-[#5b9eff]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Music className="w-4 h-4" />
                  <span className="font-medium">Sessions</span>
                </motion.div>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-[#a9b1d6] text-sm">
                Welcome, <span className="text-[#5b9eff] font-medium">{userName}</span>
              </span>
              <motion.button
                onClick={handleLogout}
                className="p-2 text-[#a9b1d6] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <SoundPlayer
          trackTitle={trackTitle}
          frequency={frequency}
          duration={duration}
          baseFrequency={base}
          beatFrequency={beat}
          category={category}
        />
      </main>
      <Footer />
      <AIAssistant />
      <PWAInstaller />
      <ScrollToTop />
    </div>
  );
}

export default function SessionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5b9eff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#7aa2f7]">Loading session...</p>
        </div>
      </div>
    }>
      <SessionsContent />
    </Suspense>
  );
}
