import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface WaveRecommendationProps {
  onRecommendation?: (trackId: number) => void;
}

interface Recommendation {
  trackId: number;
  title: string;
  frequency: string;
  duration: string;
  reason: string;
  tips: string[];
}

const WaveRecommendation = memo(({ onRecommendation }: WaveRecommendationProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hide on sessions/player page
  if (pathname === '/sessions' || pathname === '/player') {
    return null;
  }

  const moods = [
    {
      id: 'focus',
      label: 'Need Focus',
      description: 'Work, study, or deep concentration',
      gradient: 'from-[#5b9eff] to-[#7c3aed]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'stressed',
      label: 'Feeling Stressed',
      description: 'Anxiety, pressure, overwhelm',
      gradient: 'from-[#2dd4bf] to-[#34d399]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )
    },
    {
      id: 'tired',
      label: 'Low Energy',
      description: 'Fatigue, sluggish, unmotivated',
      gradient: 'from-[#f97316] to-[#fb7185]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'creative',
      label: 'Creative Mode',
      description: 'Brainstorming, ideation, art',
      gradient: 'from-[#a78bfa] to-[#bb9af7]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: 'sleep',
      label: 'Ready to Sleep',
      description: 'Wind down, relax, rest',
      gradient: 'from-[#7c3aed] to-[#5b9eff]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    }
  ];

  const recommendations: Record<string, Recommendation> = {
    focus: {
      trackId: 1,
      title: 'Deep Focus Alpha',
      frequency: '8-12 Hz',
      duration: '25:00',
      reason: 'Alpha waves enhance concentration and reduce mental distractions, perfect for sustained work sessions.',
      tips: ['Use during study or work', 'Best with noise-canceling headphones', 'Take breaks every 25-30 minutes']
    },
    stressed: {
      trackId: 2,
      title: 'Theta Meditation',
      frequency: '4-8 Hz',
      duration: '30:00',
      reason: 'Theta waves induce deep relaxation and reduce cortisol levels, helping you decompress and reset.',
      tips: ['Practice deep breathing', 'Find a quiet environment', 'Close your eyes for maximum effect']
    },
    tired: {
      trackId: 3,
      title: 'Creative Flow Beta',
      frequency: '13-30 Hz',
      duration: '45:00',
      reason: 'Beta waves increase alertness and mental energy, helping you power through low-energy periods.',
      tips: ['Stay hydrated', 'Combine with light movement', 'Best used in morning/afternoon']
    },
    creative: {
      trackId: 3,
      title: 'Creative Flow Beta',
      frequency: '13-30 Hz',
      duration: '45:00',
      reason: 'Beta waves stimulate innovative thinking and problem-solving abilities, ideal for creative work.',
      tips: ['Keep a notebook nearby', 'Allow thoughts to flow freely', 'Perfect for brainstorming sessions']
    },
    sleep: {
      trackId: 4,
      title: 'Delta Sleep Wave',
      frequency: '0.5-4 Hz',
      duration: '60:00',
      reason: 'Delta waves promote deep sleep and physical recovery, helping you achieve restorative rest.',
      tips: ['Use in dark, quiet room', 'Start 30 mins before bed', 'Combine with sleep hygiene practices']
    }
  };

  const handleMoodSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setRecommendation(recommendations[moodId]);
    setIsLoading(false);
  };

  const handleStartSession = () => {
    if (recommendation && selectedMood) {
      // Convert duration to seconds
      const [minutes] = recommendation.duration.split(':');
      const durationInSeconds = parseInt(minutes) * 60;
      
      // Navigate to player page with recommendation data
      const params = new URLSearchParams({
        track: recommendation.title,
        frequency: recommendation.frequency,
        duration: durationInSeconds.toString(),
        category: selectedMood,
      });
      
      window.location.href = `/sessions?${params.toString()}`;
    }
  };

  return (
    <>
      {/* Floating Button - LOWEST POSITION (bottom-6) */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-8 w-12 h-12 bg-gradient-to-r from-[#5b9eff] to-[#a78bfa] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-[60] group"
        initial={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Get personalized wave recommendation"
        title="Wave Recommendation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 whitespace-nowrap bg-[#1a1f35] text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Get Wave Recommendation
        </div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="wave-recommendation-title"
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-gradient-to-br from-[#1a1f35]/95 to-[#0a0e1a]/95 backdrop-blur-xl rounded-2xl border border-[#5b9eff]/20 shadow-2xl z-[9999] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Header */}
              <div className="p-6 border-b border-[#5b9eff]/10">
                <div className="flex items-center justify-between">
                  <h2 id="wave-recommendation-title" className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#5b9eff] to-[#a78bfa] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Wave Recommendation
                  </h2>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#2a2f4a]/50 hover:bg-[#2a2f4a] text-gray-400 hover:text-white transition-all flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                <p className="text-gray-400 text-sm mt-2">Tell us what you need, and we&apos;ll recommend the perfect brainwave frequency</p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {!selectedMood ? (
                    <motion.div
                      key="mood-selection"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-3"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">How are you feeling right now?</h3>
                      {moods.map((mood, index) => (
                        <motion.button
                          key={mood.id}
                          onClick={() => handleMoodSelect(mood.id)}
                          className="w-full p-4 rounded-xl bg-[#1a1f35]/50 hover:bg-[#1a1f35] border border-[#5b9eff]/10 hover:border-[#5b9eff]/30 transition-all text-left group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${mood.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              {mood.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-white mb-1">{mood.label}</div>
                              <div className="text-sm text-gray-400">{mood.description}</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-600 group-hover:text-[#5b9eff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  ) : isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <motion.div
                        className="w-16 h-16 border-4 border-[#5b9eff]/20 border-t-[#5b9eff] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <p className="text-gray-400 mt-4">Analyzing your needs...</p>
                    </motion.div>
                  ) : recommendation ? (
                    <motion.div
                      key="recommendation"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Recommendation Card */}
                      <div className="p-5 rounded-xl bg-gradient-to-br from-[#5b9eff]/10 to-[#a78bfa]/10 border border-[#5b9eff]/20">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-white">{recommendation.title}</h3>
                          <div className="px-3 py-1 bg-[#5b9eff]/20 rounded-full text-xs font-medium text-[#5b9eff]">
                            {recommendation.frequency}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{recommendation.reason}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {recommendation.duration}
                          </div>
                        </div>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Recommended Best Practices:</h4>
                        <div className="space-y-2">
                          {recommendation.tips.map((tip: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-2 text-sm text-gray-400"
                            >
                              <svg className="w-4 h-4 text-[#34d399] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {tip}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <motion.button
                          onClick={() => setSelectedMood(null)}
                          className="flex-1 py-3 bg-[#1a1f35]/50 text-gray-300 rounded-lg font-medium hover:bg-[#1a1f35] transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Choose Different
                        </motion.button>
                        <motion.button
                          onClick={() => window.location.href = '/pricing'}
                          className="flex-1 py-3 bg-gradient-to-r from-[#5b9eff] to-[#a78bfa] text-white rounded-lg font-medium shadow-lg shadow-[#5b9eff]/30 hover:shadow-xl transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Start Session
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

WaveRecommendation.displayName = 'WaveRecommendation';

export default WaveRecommendation;