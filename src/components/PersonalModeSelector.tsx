'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export interface Goal {
  id: string;
  name: string;
  description: string;
  trackCategory: 'focus' | 'relaxation' | 'creativity' | 'sleep';
  gradient: string;
  bgGradient: string;
}

interface PersonalModeSelectorProps {
  onGoalSelect: (goal: Goal) => void;
  currentGoal: Goal | null;
}

const goals: Goal[] = [
  {
    id: 'focus',
    name: 'Deep Focus',
    description: 'Enhanced concentration and productivity',
    trackCategory: 'focus',
    gradient: 'from-[var(--primary)] to-[var(--secondary)]',
    bgGradient: 'from-[var(--primary)]/10 to-[var(--secondary)]/10'
  },
  {
    id: 'meditation',
    name: 'Meditation',
    description: 'Deep relaxation and mindfulness',
    trackCategory: 'relaxation',
    gradient: 'from-[var(--wave)] to-[var(--accent)]',
    bgGradient: 'from-[var(--wave)]/10 to-[var(--accent)]/10'
  },
  {
    id: 'sleep',
    name: 'Deep Sleep',
    description: 'Restful sleep and recovery',
    trackCategory: 'sleep',
    gradient: 'from-[var(--secondary)] to-[var(--primary)]',
    bgGradient: 'from-[var(--secondary)]/10 to-[var(--primary)]/10'
  },
  {
    id: 'creativity',
    name: 'Creative Flow',
    description: 'Innovation and problem solving',
    trackCategory: 'creativity',
    gradient: 'from-[var(--neural)] to-[var(--glow)]',
    bgGradient: 'from-[var(--neural)]/10 to-[var(--glow)]/10'
  }
];

const PersonalModeSelector = ({ onGoalSelect, currentGoal }: PersonalModeSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.section
      id="personal-mode"
      className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              Personal Mode
            </span>
          </h2>
          <p className="text-lg text-[var(--foreground)]/70">
            Choose your goal and let us optimize your session
          </p>
        </motion.div>

        {/* Goal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {goals.map((goal, index) => {
            const isSelected = currentGoal?.id === goal.id;
            
            return (
              <motion.button
                key={goal.id}
                onClick={() => {
                  onGoalSelect(goal);
                  setIsExpanded(true);
                }}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? `border-[var(--primary)] bg-gradient-to-br ${goal.bgGradient} shadow-lg shadow-[var(--primary)]/20`
                    : 'border-[var(--foreground)]/10 bg-[var(--surface)]/40 hover:border-[var(--primary)]/50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow effect for selected */}
                {isSelected && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${goal.gradient} opacity-20 rounded-2xl blur-xl`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 0.5 }}
                  />
                )}

                <div className="relative z-10">
                  {/* Title */}
                  <h3 className={`text-xl font-bold mb-2 ${
                    isSelected
                      ? `bg-gradient-to-r ${goal.gradient} bg-clip-text text-transparent`
                      : 'text-[var(--foreground)]'
                  }`}>
                    {goal.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[var(--foreground)]/60">
                    {goal.description}
                  </p>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      className="mt-4 flex items-center justify-center space-x-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${goal.gradient}`} />
                      <span className="text-xs text-[var(--primary)] font-semibold uppercase tracking-wider">
                        Active
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Benefits panel when goal selected */}
        {currentGoal && isExpanded && (
          <motion.div
            className={`mt-8 p-6 rounded-2xl bg-gradient-to-br ${currentGoal.bgGradient} border border-[var(--primary)]/20`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-3">
                  <h4 className={`text-2xl font-bold bg-gradient-to-r ${currentGoal.gradient} bg-clip-text text-transparent`}>
                    {currentGoal.name} Mode Active
                  </h4>
                </div>
                <p className="text-[var(--foreground)]/70 mb-4">
                  Optimized settings for {currentGoal.description.toLowerCase()}. 
                  Your audio and visual experience has been tailored to enhance this state.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[var(--surface)]/60 rounded-full text-xs text-[var(--foreground)]/80 border border-[var(--primary)]/20">
                    Frequency optimized
                  </span>
                  <span className="px-3 py-1 bg-[var(--surface)]/60 rounded-full text-xs text-[var(--foreground)]/80 border border-[var(--primary)]/20">
                    Visual theme adjusted
                  </span>
                  <span className="px-3 py-1 bg-[var(--surface)]/60 rounded-full text-xs text-[var(--foreground)]/80 border border-[var(--primary)]/20">
                    Recommended duration: 25-45 min
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-[var(--surface)]/40 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default PersonalModeSelector;
export { goals };
