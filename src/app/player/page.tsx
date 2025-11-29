'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UnifiedAudioPlayer from '@/components/UnifiedAudioPlayer';

function PlayerContent() {
  const searchParams = useSearchParams();
  const trackId = searchParams.get('track');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <UnifiedAudioPlayer 
            initialTrackId={trackId || undefined}
            autoPlay={false}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5b9eff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#7aa2f7]">Loading player...</p>
        </div>
      </div>
    }>
      <PlayerContent />
    </Suspense>
  );
}
