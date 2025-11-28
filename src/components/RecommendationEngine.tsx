'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, memo } from 'react';
import { Sparkles, Play, TrendingUp, Clock, Zap } from 'lucide-react';
import { predictForUI, type UIRecommendation } from '@/utils/mlEngine';
import { getRecommendationContext, getTrainingData } from '@/utils/storage';

interface RecommendationEngineProps {
  onPlayRecommendation?: (trackId: number) => void;
  currentGoal?: 'focus' | 'sleep' | 'relaxation' | 'creativity';
  currentTrackId?: number;
}

const RecommendationEngine = memo(({ 
  onPlayRecommendation, 
  currentGoal,
  currentTrackId 
}: RecommendationEngineProps) => {
  const [recommendation, setRecommendation] = useState<UIRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEnoughData, setHasEnoughData] = useState(false);
  const [trainingCount, setTrainingCount] = useState(0);

  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Check training data availability
      const trainingData = getTrainingData();
      setTrainingCount(trainingData.length);
      setHasEnoughData(trainingData.length >= 5);

      if (trainingData.length >= 3) {
        // Get context and prediction
        const context = getRecommendationContext(currentGoal);
        const prediction = predictForUI({
          goal: context.goal,
          timeOfDay: context.timeOfDay,
          currentMood: context.currentMood,
          recentProductivity: context.recentProductivity,
        });

        setRecommendation(prediction);
      } else {
        setRecommendation(null);
      }
    } catch (error) {
      console.warn('RecommendationEngine: Failed to generate prediction', error);
      setRecommendation(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentGoal]);

  const handlePlayRecommendation = () => {
    if (recommendation && onPlayRecommendation) {
      onPlayRecommendation(recommendation.trackId);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <motion.div
        className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 backdrop-blur-xl rounded-2xl border border-[var(--primary)]/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-[var(--primary)]/20 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-[var(--primary)]/10 rounded w-1/2 mt-2 animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Show insufficient data CTA
  if (!hasEnoughData) {
    return (
      <motion.div
        className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 backdrop-blur-xl rounded-2xl border border-[var(--primary)]/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-[var(--primary)]/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-[var(--primary)]" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Build Your AI Profile
            </h3>
            <p className="text-sm text-[var(--foreground)]/70 mb-4">
              Complete {5 - trainingCount} more session{5 - trainingCount !== 1 ? 's' : ''} to unlock 
              personalized AI recommendations tailored to your unique brain patterns.
            </p>
            <div className="space-y-3">
              <div className="w-full bg-[var(--background)] rounded-full h-3 overflow-hidden mb-2 border border-[var(--primary)]/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] shadow-lg relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${(trainingCount / 5) * 100}%` }}
                  transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  />
                </motion.div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-[var(--foreground)]/50">
                  {trainingCount} / 5 sessions completed
                </p>
                <motion.p 
                  className="text-xs text-[var(--primary)] font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {Math.round((trainingCount / 5) * 100)}%
                </motion.p>
              </div>
              <div className="flex items-start space-x-2 p-3 bg-[var(--background)]/50 rounded-lg border border-[var(--primary)]/10">
                <Sparkles className="w-4 h-4 text-[var(--primary)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-xs text-[var(--foreground)]/60 leading-relaxed">
                  Each session helps our AI learn your preferences, optimal times, and effective frequencies 
                  to provide scientifically-backed recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show recommendation
  if (!recommendation) {
    return null;
  }

  const isCurrentlyPlaying = currentTrackId === recommendation.trackId;

  return (
    <motion.div
      className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 backdrop-blur-xl rounded-2xl border border-[var(--primary)]/30 p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-label="AI Recommended Track"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--secondary)]/5 opacity-50" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[var(--primary)]/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center space-x-2">
                <span>Recommended for You</span>
                {recommendation.isReady && (
                  <span className="px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] text-xs rounded-full">
                    AI-Powered
                  </span>
                )}
              </h3>
            </div>
          </div>
          
          {/* Confidence Badge with Animation */}
          <motion.div 
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${
              recommendation.confidence >= 85 ? 'bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20' :
              recommendation.confidence >= 70 ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20' :
              'bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20'
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-bold">
              {recommendation.confidence}%
            </span>
          </motion.div>
        </div>

        {/* Track Info */}
        <div className="mb-4">
          <h4 className="text-xl font-bold text-[var(--foreground)] mb-1">
            {recommendation.trackName}
          </h4>
          <div className="flex items-center space-x-4 text-sm text-[var(--foreground)]/70">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4" aria-hidden="true" />
              <span>{recommendation.frequency}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>{recommendation.duration}</span>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4 p-3 bg-[var(--background)]/50 rounded-xl border border-[var(--primary)]/10">
          <p className="text-sm text-[var(--foreground)]/80 leading-relaxed">
            {recommendation.reason}
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handlePlayRecommendation}
          disabled={isCurrentlyPlaying}
          className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
            isCurrentlyPlaying
              ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30 cursor-not-allowed'
              : 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:shadow-lg hover:shadow-[var(--primary)]/30'
          }`}
          whileHover={!isCurrentlyPlaying ? { scale: 1.02, y: -2 } : {}}
          whileTap={!isCurrentlyPlaying ? { scale: 0.98 } : {}}
          aria-label={isCurrentlyPlaying ? 'Currently playing' : 'Play recommended track'}
        >
          {isCurrentlyPlaying ? (
            <>
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
              <span>Currently Playing</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" fill="currentColor" aria-hidden="true" />
              <span>Play This Session</span>
            </>
          )}
        </motion.button>

        {/* Helper Text */}
        <p className="text-xs text-[var(--foreground)]/50 text-center mt-3">
          Based on {trainingCount} sessions • Updates with each session
        </p>
      </div>
    </motion.div>
  );
});

RecommendationEngine.displayName = 'RecommendationEngine';

export default RecommendationEngine;
