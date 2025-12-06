'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ScienceSection from '@/components/ScienceSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import PWAInstaller from '@/components/PWAInstaller';
import WaveRecommendation from '@/components/WaveRecommendation';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Navbar />
      <main id="main-content" className="gpu-accelerate">
        <HeroSection />
        
        <ScienceSection />
        <AboutSection />
      </main>
      <Footer />
      {/* Only show one floating button on mobile to prevent overlap */}
      <AIAssistant />
      <PWAInstaller />
      <div className="hidden sm:block">
        <WaveRecommendation />
      </div>
    </div>
  );
}
