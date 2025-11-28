'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Achievement } from '@/utils/storage';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  animate?: boolean;
}

const AchievementBadge = memo(({
  achievement, 
  size = 'md', 
  showProgress = true,
  animate = true 
}: AchievementBadgeProps) => {
  const isUnlocked = !!achievement.unlockedAt;
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };
  
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = () => {
    switch (achievement.rarity) {
      case 'legendary':
        return 'border-yellow-500/50 shadow-lg shadow-yellow-500/20';
      case 'epic':
        return 'border-purple-500/50 shadow-lg shadow-purple-500/20';
      case 'rare':
        return 'border-blue-500/50 shadow-lg shadow-blue-500/20';
      default:
        return 'border-gray-500/30';
    }
  };

  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[achievement.icon] || LucideIcons.Award;

  // Check if recently unlocked (within last 5 seconds)
  const isRecentlyUnlocked = isUnlocked && achievement.unlockedAt && 
    (Date.now() - new Date(achievement.unlockedAt).getTime() < 5000);

  return (
    <motion.div
      className="group relative"
      initial={animate ? { opacity: 0, scale: 0.8 } : {}}
      animate={animate ? { 
        opacity: 1, 
        scale: isRecentlyUnlocked ? [0.8, 1.2, 1] : 1 
      } : {}}
      whileHover={{ scale: 1.05 }}
      transition={{ 
        duration: 0.3,
        scale: isRecentlyUnlocked ? {
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1]
        } : {}
      }}
    >
      {/* Badge Container */}
      <div
        className={`
          ${sizeClasses[size]}
          relative rounded-xl border-2
          ${isUnlocked ? getRarityBorder() : 'border-[var(--foreground)]/10'}
          ${isUnlocked ? 'bg-gradient-to-br ' + getRarityColor() + '/20' : 'bg-[var(--background)]/50'}
          backdrop-blur-sm
          flex items-center justify-center
          transition-all duration-300
          ${!isUnlocked ? 'grayscale opacity-50' : ''}
        `}
      >
        {/* Icon */}
        {isUnlocked ? (
          <IconComponent className={`${iconSizes[size]} text-white drop-shadow-lg`} />
        ) : (
          <Lock className={`${iconSizes[size]} text-[var(--foreground)]/30`} />
        )}

        {/* Unlocked Checkmark */}
        {isUnlocked && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-3 h-3 text-white" />
          </motion.div>
        )}

        {/* Progress Ring (for locked achievements) */}
        {!isUnlocked && showProgress && achievement.progress > 0 && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[var(--primary)]/20"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-[var(--primary)]"
              strokeDasharray={`${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 45 * (1 - achievement.progress / 100) 
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
        )}

        {/* Glow Effect for Unlocked Legendary */}
        {isUnlocked && achievement.rarity === 'legendary' && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 blur-xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
        <div className="bg-[var(--surface)] border border-[var(--primary)]/30 rounded-lg p-3 shadow-xl backdrop-blur-xl min-w-[200px]">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-bold bg-gradient-to-r ${getRarityColor()} bg-clip-text text-transparent`}>
              {achievement.title}
            </span>
            {isUnlocked && (
              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                Unlocked
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-[var(--foreground)]/70 mb-2">
            {achievement.description}
          </p>

          {/* Progress */}
          {!isUnlocked && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--foreground)]/50">Progress</span>
                <span className="text-[var(--primary)] font-semibold">
                  {Math.floor(achievement.progress)}%
                </span>
              </div>
              <div className="h-1.5 bg-[var(--background)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          {/* Unlocked Date */}
          {isUnlocked && achievement.unlockedAt && (
            <div className="text-xs text-[var(--foreground)]/50 mt-2">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}

          {/* Rarity Badge */}
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize bg-gradient-to-r ${getRarityColor()} text-white font-medium`}>
              {achievement.rarity}
            </span>
            <span className="text-xs text-[var(--foreground)]/50 capitalize">
              {achievement.category}
            </span>
          </div>

          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-2 h-2 bg-[var(--surface)] border-r border-b border-[var(--primary)]/30 rotate-45" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

AchievementBadge.displayName = 'AchievementBadge';

export default AchievementBadge;
