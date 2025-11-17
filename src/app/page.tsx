'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MusicPlayer from '@/components/MusicPlayer';
import ScienceSection from '@/components/ScienceSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import InstructionsModal from '@/components/InstructionsModal';
import AIAssistant from '@/components/AIAssistant';
import PersonalModeSelector from '@/components/PersonalModeSelector';
import FocusTimer from '@/components/FocusTimer';
import PWAInstaller from '@/components/PWAInstaller';
import AnalyticsDashboard from '@/components/stats/AnalyticsDashboard';
import WaveRecommendation from '@/components/WaveRecommendation';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        
        {/* Personal Mode Section */}
        <PersonalModeSelector 
          currentGoal={null}
          onGoalSelect={(goal) => {
            document.getElementById('music-player')?.scrollIntoView({ behavior: 'smooth' });
          }} 
        />

        {/* Music Player & Timer Section */}
        <section id="music-player" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 neural-bg opacity-50"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                  Brain Wave Player
                </span>
              </h2>
              <p className="text-xl text-[var(--foreground)]/80 max-w-2xl mx-auto">
                Experience scientifically-designed frequencies tailored for different mental states
              </p>
            </div>

            {/* Player and Timer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
              <div className="w-full">
                <MusicPlayer />
              </div>
              <div className="w-full">
                <FocusTimer 
                  onTimerStart={() => {}}
                  onTimerComplete={() => {}}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Analytics Dashboard */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <AnalyticsDashboard />
        </section>

        <ScienceSection />
        <AboutSection />
      </main>
      <Footer />
      <InstructionsModal />
      <AIAssistant />
      <PWAInstaller />
      <WaveRecommendation />
      <ScrollToTop />
    </div>
  );
}
