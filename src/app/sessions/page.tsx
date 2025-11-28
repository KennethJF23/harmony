'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SyncedSession from '@/components/SyncedSession';
import AIAssistant from '@/components/AIAssistant';
import PWAInstaller from '@/components/PWAInstaller';
import ScrollToTop from '@/components/ScrollToTop';
import { motion } from 'framer-motion';

function SessionsContent() {
  const searchParams = useSearchParams();
  const trackId = searchParams.get('track');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#5b9eff] to-[#7aa2f7] bg-clip-text text-transparent mb-4">
              Your Focus Session
            </h1>
            <p className="text-lg text-[var(--foreground)]/70">
              Audio and timer perfectly synced for optimal productivity
            </p>
          </motion.div>

          <SyncedSession 
            initialTrackId={trackId || undefined}
          />
        </div>
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
