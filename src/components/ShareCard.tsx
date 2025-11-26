'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Download, Share2, X, CheckCircle } from 'lucide-react';
import { getUserStats, getAchievements } from '@/utils/storage';
import * as LucideIcons from 'lucide-react';

interface ShareCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareCard = ({ isOpen, onClose }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState(getUserStats());
  const [topAchievements, setTopAchievements] = useState<ReturnType<typeof getAchievements>>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentStats = getUserStats();
      const achievements = getAchievements();
      const unlockedAchievements = achievements
        .filter(a => a.unlockedAt)
        .sort((a, b) => {
          const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        })
        .slice(0, 3);
      
      setStats(currentStats);
      setTopAchievements(unlockedAchievements);
    }
  }, [isOpen]);

  const downloadAsImage = async () => {
    if (!cardRef.current) return;

    try {
      // Dynamic import with proper typing
      const html2canvas = await import('html2canvas').then(m => m.default);
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `harmony-stats-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.warn('html2canvas not available, using fallback', error);
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const text = `🧠 Brain Harmonics Stats\n\n` +
      `✅ ${stats.completedSessions} sessions completed\n` +
      `⏱️ ${stats.totalMinutes} minutes of focus\n` +
      `🔥 ${stats.currentStreak} day streak\n` +
      `🏆 ${stats.achievementsUnlocked} achievements unlocked\n\n` +
      `Join me in harmonizing your mind! 🎵`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = () => {
    const text = `I've completed ${stats.completedSessions} focus sessions on Brain Harmonics! 🧠✨`;
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    
    if (navigator.share) {
      navigator.share({
        title: 'Brain Harmonics Progress',
        text,
        url,
      }).catch(() => copyToClipboard());
    } else {
      copyToClipboard();
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-lg w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Close share card"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Share Card Content */}
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-alt)] rounded-3xl p-8 border border-[var(--primary)]/30 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              My Brain Harmonics Journey
            </h2>
            <p className="text-sm text-[var(--foreground)]/60">
              Harmonizing minds, one session at a time
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[var(--background)]/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-[var(--primary)] mb-1">
                {stats.completedSessions}
              </div>
              <div className="text-xs text-[var(--foreground)]/60">Sessions</div>
            </div>
            <div className="bg-[var(--background)]/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-[var(--secondary)] mb-1">
                {stats.totalMinutes}
              </div>
              <div className="text-xs text-[var(--foreground)]/60">Minutes</div>
            </div>
            <div className="bg-[var(--background)]/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-[var(--accent)] mb-1">
                {stats.currentStreak}
              </div>
              <div className="text-xs text-[var(--foreground)]/60">Day Streak</div>
            </div>
            <div className="bg-[var(--background)]/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-[var(--wave)] mb-1">
                {stats.achievementsUnlocked}
              </div>
              <div className="text-xs text-[var(--foreground)]/60">Achievements</div>
            </div>
          </div>

          {/* Top Achievements */}
          {topAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3 text-center">
                Top Achievements
              </h3>
              <div className="flex justify-center gap-3">
                {topAchievements.map((achievement) => {
                  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[achievement.icon];
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`relative p-3 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)}/20 border border-current/30`}
                      title={achievement.title}
                    >
                      {IconComponent && <IconComponent className="w-6 h-6" />}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mood Score */}
          {stats.averageMoodScore > 0 && (
            <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-xl p-4 mb-6 text-center">
              <div className="text-sm text-[var(--foreground)]/70 mb-1">Average Mood</div>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= stats.averageMoodScore
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-600'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-[var(--foreground)]/50 mb-4">
              Join the Brain Harmonics community
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <motion.button
            onClick={downloadAsImage}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </motion.button>
          <motion.button
            onClick={shareToSocial}
            className="flex-1 py-3 px-4 bg-[var(--surface)] text-[var(--foreground)] rounded-xl font-semibold flex items-center justify-center gap-2 border border-[var(--primary)]/30 hover:bg-[var(--surface-alt)] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareCard;
