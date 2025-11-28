'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SoundPlayer from '@/components/player/SoundPlayer';
import { FrequencyPresets } from '@/utils/audioEngine';

function PlayerContent() {
  const searchParams = useSearchParams();
  
  const trackTitle = searchParams.get('track') || 'Deep Focus Alpha';
  const frequency = searchParams.get('frequency') || '8-12 Hz';
  const duration = parseInt(searchParams.get('duration') || '1500', 10); // default 25 minutes in seconds
  const category = (searchParams.get('category') || 'focus') as string;

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
      // Default to Alpha
      return {
        base: FrequencyPresets.ALPHA.baseFrequency,
        beat: FrequencyPresets.ALPHA.beatFrequency,
      };
    }
  };

  const { base, beat } = getFrequencyPreset();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]">
      <Header />
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
