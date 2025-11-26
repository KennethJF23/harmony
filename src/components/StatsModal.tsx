'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  getSessionStats, 
  formatTime, 
  getMoodTrends,
  getTrainingData,
  getEffectivenessByFrequency,
  getAchievements,
  updateAchievements
} from '@/utils/storage';
import { getMLEngine } from '@/utils/mlEngine';
import AchievementBadge from '@/components/AchievementBadge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatsModal = ({ isOpen, onClose }: StatsModalProps) => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTime: 0,
    averageSessionLength: 0,
    mostUsedTrack: null as string | null,
    sessionsThisWeek: 0,
  });

  const [moodData, setMoodData] = useState<Array<{ date: string; mood: number; productivity: number }>>([]);
  const [effectivenessData, setEffectivenessData] = useState<Array<{ frequency: string; effectiveness: number; sessions: number }>>([]);
  const [goalData, setGoalData] = useState<Array<{ goal: string; count: number; avgEffectiveness: number }>>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'mood' | 'effectiveness' | 'ml'>('overview');
  const [mlStats, setMlStats] = useState({ trainingDataCount: 0, ready: false, averageEffectiveness: 0 });
  const [achievements, setAchievements] = useState(getAchievements());

  useEffect(() => {
    if (isOpen) {
      // Load basic stats
      setStats(getSessionStats());
      
      // Load mood trends
      const trends = getMoodTrends(14); // Last 14 days
      setMoodData(trends);

      // Load effectiveness by frequency
      const effByFreq = getEffectivenessByFrequency();
      const effData = Object.entries(effByFreq).map(([freq, data]) => ({
        frequency: freq,
        effectiveness: Math.round(data.avg * 20), // Convert to 0-100 scale
        sessions: data.count,
      }));
      setEffectivenessData(effData);

      // Load goal distribution from training data
      const trainingData = getTrainingData();
      const goalCounts: Record<string, { count: number; totalEff: number }> = {};
      
      trainingData.forEach((point) => {
        if (!goalCounts[point.goal]) {
          goalCounts[point.goal] = { count: 0, totalEff: 0 };
        }
        goalCounts[point.goal].count += 1;
        goalCounts[point.goal].totalEff += point.effectiveness;
      });

      const goalChartData = Object.entries(goalCounts).map(([goal, data]) => ({
        goal: goal.charAt(0).toUpperCase() + goal.slice(1),
        count: data.count,
        avgEffectiveness: Math.round((data.totalEff / data.count) * 20), // 0-100 scale
      }));
      setGoalData(goalChartData);

      // Load ML engine stats
      const mlEngine = getMLEngine();
      const modelStats = mlEngine.getModelStats();
      setMlStats({
        trainingDataCount: modelStats.trainingDataCount,
        ready: modelStats.ready,
        averageEffectiveness: Math.round(modelStats.averageEffectiveness * 20),
      });

      // Update and load achievements
      const updatedAchievements = updateAchievements();
      setAchievements(updatedAchievements);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-20 overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div 
              className="bg-gradient-to-br from-[var(--surface)]/98 to-[var(--surface-alt)]/98 backdrop-blur-xl rounded-3xl border border-[var(--primary)]/30 max-w-4xl w-full my-8 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[80vh] overflow-y-auto custom-scrollbar p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                      Analytics Dashboard
                    </h2>
                    <p className="text-sm text-[var(--foreground)]/60 mt-1">Track your progress and optimize your experience</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-[var(--primary)]/20 rounded-full transition-colors"
                    aria-label="Close analytics"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 md:gap-2 mb-6 border-b border-[var(--primary)]/20 pb-2 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'mood', label: 'Mood & Focus' },
                    { id: 'effectiveness', label: 'Effectiveness' },
                    { id: 'ml', label: 'AI Insights' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`px-3 md:px-4 py-2 rounded-lg transition-all text-xs md:text-sm font-medium whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30'
                          : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--primary)]/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                        <div className="text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-2">
                          {stats.totalSessions}
                        </div>
                        <div className="text-xs text-[var(--foreground)]/70 uppercase tracking-wider">Total Sessions</div>
                      </div>

                      <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                        <div className="text-4xl font-bold bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] bg-clip-text text-transparent mb-2">
                          {formatTime(stats.totalTime)}
                        </div>
                        <div className="text-xs text-[var(--foreground)]/70 uppercase tracking-wider">Total Time</div>
                      </div>

                      <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                        <div className="text-4xl font-bold bg-gradient-to-r from-[var(--neural)] to-[var(--glow)] bg-clip-text text-transparent mb-2">
                          {formatTime(stats.averageSessionLength)}
                        </div>
                        <div className="text-xs text-[var(--foreground)]/70 uppercase tracking-wider">Avg Session</div>
                      </div>

                      <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                        <div className="text-4xl font-bold bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent mb-2">
                          {stats.sessionsThisWeek}
                        </div>
                        <div className="text-xs text-[var(--foreground)]/70 uppercase tracking-wider">This Week</div>
                      </div>
                    </div>

                    {/* Favorite Track */}
                    {stats.mostUsedTrack && (
                      <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                        <div className="text-sm text-[var(--foreground)]/70 uppercase tracking-wider mb-1">Most Played Track</div>
                        <div className="text-2xl font-bold text-[var(--foreground)]">{stats.mostUsedTrack}</div>
                      </div>
                    )}

                    {/* Achievements */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[var(--foreground)]">Achievements</h3>
                        <span className="text-sm text-[var(--foreground)]/60">
                          {achievements.filter(a => a.unlockedAt).length} / {achievements.length} Unlocked
                        </span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <AchievementBadge achievement={achievement} size="md" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'mood' && (
                  <div className="space-y-6">
                    {moodData.length > 0 ? (
                      <>
                        <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                          <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Mood & Productivity Trends (14 Days)</h3>
                          <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={moodData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 202, 245, 0.1)" />
                              <XAxis 
                                dataKey="date" 
                                stroke="rgba(192, 202, 245, 0.5)" 
                                tick={{ fontSize: 12 }}
                              />
                              <YAxis 
                                stroke="rgba(192, 202, 245, 0.5)" 
                                domain={[0, 5]}
                                tick={{ fontSize: 12 }}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'var(--surface)', 
                                  border: '1px solid rgba(122, 162, 247, 0.3)',
                                  borderRadius: '12px',
                                  color: 'var(--foreground)'
                                }}
                              />
                              <Legend />
                              <Area 
                                type="monotone" 
                                dataKey="mood" 
                                stroke="#7aa2f7" 
                                fill="#7aa2f7"
                                fillOpacity={0.3}
                                strokeWidth={2}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="productivity" 
                                stroke="#9ece6a" 
                                fill="#9ece6a"
                                fillOpacity={0.3}
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                            <div className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-2">
                              {moodData.length > 0 ? (moodData[moodData.length - 1].mood).toFixed(1) : 'N/A'}
                            </div>
                            <div className="text-sm text-[var(--foreground)]/70">Latest Mood Score</div>
                          </div>
                          <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                            <div className="text-3xl font-bold bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] bg-clip-text text-transparent mb-2">
                              {moodData.length > 0 ? (moodData[moodData.length - 1].productivity).toFixed(1) : 'N/A'}
                            </div>
                            <div className="text-sm text-[var(--foreground)]/70">Latest Productivity</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-[var(--background)]/50 rounded-2xl p-12 border border-[var(--primary)]/20 text-center">
                        <p className="text-[var(--foreground)]/60">No mood data yet. Complete sessions and log your mood to see trends!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'effectiveness' && (
                  <div className="space-y-6">
                    {effectivenessData.length > 0 ? (
                      <>
                        <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                          <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Effectiveness by Frequency</h3>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={effectivenessData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 202, 245, 0.1)" />
                              <XAxis 
                                dataKey="frequency" 
                                stroke="rgba(192, 202, 245, 0.5)"
                                tick={{ fontSize: 12 }}
                              />
                              <YAxis 
                                stroke="rgba(192, 202, 245, 0.5)"
                                domain={[0, 100]}
                                tick={{ fontSize: 12 }}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'var(--surface)', 
                                  border: '1px solid rgba(122, 162, 247, 0.3)',
                                  borderRadius: '12px',
                                  color: 'var(--foreground)'
                                }}
                              />
                              <Bar 
                                dataKey="effectiveness" 
                                fill="url(#effectivenessGradient)" 
                                radius={[8, 8, 0, 0]}
                              />
                              <defs>
                                <linearGradient id="effectivenessGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#7aa2f7" />
                                  <stop offset="100%" stopColor="#bb9af7" />
                                </linearGradient>
                              </defs>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {goalData.length > 0 && (
                          <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                            <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Goal Performance</h3>
                            <ResponsiveContainer width="100%" height={250}>
                              <BarChart data={goalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 202, 245, 0.1)" />
                                <XAxis dataKey="goal" stroke="rgba(192, 202, 245, 0.5)" />
                                <YAxis stroke="rgba(192, 202, 245, 0.5)" />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'var(--surface)', 
                                    border: '1px solid rgba(122, 162, 247, 0.3)',
                                    borderRadius: '12px',
                                    color: 'var(--foreground)'
                                  }}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#7aa2f7" name="Sessions" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="avgEffectiveness" fill="#9ece6a" name="Avg Effectiveness" radius={[8, 8, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-[var(--background)]/50 rounded-2xl p-12 border border-[var(--primary)]/20 text-center">
                        <p className="text-[var(--foreground)]/60">No effectiveness data yet. Rate your sessions to build insights!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'ml' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/20 rounded-2xl p-6 border border-[var(--primary)]/30">
                      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">AI Recommendation System</h3>
                      <p className="text-sm text-[var(--foreground)]/70 mb-4">
                        Our machine learning engine learns from your sessions to provide personalized recommendations.
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-[var(--primary)] mb-1">{mlStats.trainingDataCount}</div>
                          <div className="text-xs text-[var(--foreground)]/70">Training Points</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-[var(--accent)] mb-1">{mlStats.averageEffectiveness}%</div>
                          <div className="text-xs text-[var(--foreground)]/70">Avg Effectiveness</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-[var(--wave)] mb-1">
                            {mlStats.ready ? 'Ready' : 'Learning'}
                          </div>
                          <div className="text-xs text-[var(--foreground)]/70">Model Status</div>
                        </div>
                      </div>
                    </div>

                    {!mlStats.ready && (
                      <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                        <h4 className="font-semibold text-[var(--foreground)] mb-2">Building Your Profile</h4>
                        <p className="text-sm text-[var(--foreground)]/70 mb-4">
                          Complete more sessions and rate their effectiveness to unlock AI-powered recommendations.
                        </p>
                        <div className="w-full bg-[var(--background)] rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all"
                            style={{ width: `${Math.min(100, (mlStats.trainingDataCount / 5) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-[var(--foreground)]/50 mt-2">
                          {mlStats.trainingDataCount} / 5 sessions needed
                        </p>
                      </div>
                    )}

                    <div className="bg-[var(--background)]/50 rounded-2xl p-6 border border-[var(--primary)]/20">
                      <h4 className="font-semibold text-[var(--foreground)] mb-3">How It Works</h4>
                      <div className="space-y-3 text-sm text-[var(--foreground)]/70">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-[var(--primary)]">1</span>
                          </div>
                          <p>We track your session effectiveness, mood changes, and preferences</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-[var(--primary)]">2</span>
                          </div>
                          <p>Our k-Nearest Neighbors algorithm finds patterns in your data</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-[var(--primary)]">3</span>
                          </div>
                          <p>We recommend tracks based on what worked best for you in similar situations</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-[var(--primary)]">4</span>
                          </div>
                          <p>Everything runs locally in your browser - your data never leaves your device</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Motivational Message */}
                <motion.div
                  className="mt-6 p-6 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-2xl border border-[var(--primary)]/20 text-center"
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.3}}
                >
                  <p className="text-[var(--foreground)]/80">
                    {stats.totalSessions === 0 
                      ? "Start your first session to begin tracking your progress!" 
                      : stats.totalSessions < 5 
                      ? "Great start! Keep going to unlock AI recommendations!" 
                      : stats.totalSessions < 20 
                      ? "You're building great habits! The AI is learning your patterns." 
                      : "Amazing dedication! Your personalized AI recommendations are highly accurate!"}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatsModal;

