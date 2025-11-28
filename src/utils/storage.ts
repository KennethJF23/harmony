/**
 * Local storage utilities for user preferences and session data
 */

export interface UserPreferences {
  lastVolume: number;
  lastTrackId: number;
  totalListeningTime: number;
  favoriteCategory: string;
  sessionHistory: SessionData[];
}

export interface SessionData {
  trackId: number;
  trackName: string;
  duration: number;
  timestamp: number;
  completed: boolean;
  mood?: number; // 1-5 rating
  effectiveness?: number; // 1-5 rating
  goal?: 'focus' | 'sleep' | 'relaxation' | 'creativity';
  frequency?: string;
}

export interface MoodEntry {
  id: string;
  timestamp: number;
  sessionId?: string;
  mood: number; // 1-5: very negative to very positive
  productivity?: number; // 1-5: very unproductive to very productive
  energy?: number; // 1-5: exhausted to energized
  notes?: string;
  trackId?: number;
  trackName?: string;
  goal?: 'focus' | 'sleep' | 'relaxation' | 'creativity';
}

export interface TrainingDataPoint {
  id: string;
  timestamp: number;
  trackId: number;
  trackFrequency: string;
  goal: 'focus' | 'sleep' | 'relaxation' | 'creativity';
  duration: number;
  moodBefore?: number;
  moodAfter: number;
  effectiveness: number;
  productivity?: number;
  timeOfDay: number; // hour 0-23
  dayOfWeek: number; // 0-6
  features: number[]; // normalized feature vector for ML
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'sessions' | 'streaks' | 'ai' | 'moods' | 'focus' | 'special';
  icon: string; // Lucide icon name
  unlockedAt?: number; // timestamp
  progress: number; // 0-100
  target: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserStats {
  totalSessions: number;
  completedSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  achievementsUnlocked: number;
  aiRecommendationsUsed: number;
  moodEntriesLogged: number;
  averageMoodScore: number;
  favoriteGoal: string;
  joinedDate: number;
  lastActiveDate: number;
}

const STORAGE_KEYS = {
  PREFERENCES: 'harmony_user_preferences',
  CURRENT_SESSION: 'harmony_current_session',
  MOOD_HISTORY: 'harmony_mood_history',
  TRAINING_DATA: 'harmony_training_data',
  ACHIEVEMENTS: 'harmony_achievements',
  USER_STATS: 'harmony_user_stats',
};

/**
 * Get user preferences from local storage
 */
export const getUserPreferences = (): UserPreferences | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading preferences:', error);
    return null;
  }
};

/**
 * Save user preferences to local storage
 */
export const saveUserPreferences = (preferences: Partial<UserPreferences>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const current = getUserPreferences() || {
      lastVolume: 75,
      lastTrackId: 0,
      totalListeningTime: 0,
      favoriteCategory: 'focus',
      sessionHistory: [],
    };
    
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

/**
 * Track a listening session
 */
export const trackSession = (sessionData: SessionData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const preferences = getUserPreferences() || {
      lastVolume: 75,
      lastTrackId: 0,
      totalListeningTime: 0,
      favoriteCategory: 'focus',
      sessionHistory: [],
    };
    
    // Add new session to history
    preferences.sessionHistory.push(sessionData);
    
    // Update total listening time
    preferences.totalListeningTime += sessionData.duration;
    
    // Keep only last 50 sessions
    if (preferences.sessionHistory.length > 50) {
      preferences.sessionHistory = preferences.sessionHistory.slice(-50);
    }
    
    saveUserPreferences(preferences);
  } catch (error) {
    console.error('Error tracking session:', error);
  }
};

/**
 * Get session statistics
 */
export const getSessionStats = () => {
  const preferences = getUserPreferences();
  if (!preferences) {
    return {
      totalSessions: 0,
      totalTime: 0,
      averageSessionLength: 0,
      mostUsedTrack: null,
      sessionsThisWeek: 0,
    };
  }
  
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const recentSessions = preferences.sessionHistory.filter(
    (session) => now - session.timestamp < oneWeek
  );
  
  // Count track usage
  const trackCounts: Record<string, number> = {};
  preferences.sessionHistory.forEach((session) => {
    trackCounts[session.trackName] = (trackCounts[session.trackName] || 0) + 1;
  });
  
  const mostUsedTrack = Object.keys(trackCounts).length > 0
    ? Object.entries(trackCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
    : null;
  
  return {
    totalSessions: preferences.sessionHistory.length,
    totalTime: preferences.totalListeningTime,
    averageSessionLength:
      preferences.sessionHistory.length > 0
        ? preferences.totalListeningTime / preferences.sessionHistory.length
        : 0,
    mostUsedTrack,
    sessionsThisWeek: recentSessions.length,
  };
};

/**
 * Format time in seconds to MM:SS
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Convert time string (MM:SS) to seconds
 */
export const parseTimeString = (timeString: string): number => {
  const parts = timeString.split(':');
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  return minutes * 60 + seconds;
};

/**
 * Save a mood entry
 */
export const saveMoodEntry = (entry: Omit<MoodEntry, 'id' | 'timestamp'>): MoodEntry => {
  if (typeof window === 'undefined') return { ...entry, id: '', timestamp: Date.now() };
  
  try {
    const moodEntry: MoodEntry = {
      ...entry,
      id: `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    const history = getMoodHistory();
    history.push(moodEntry);
    
    // Keep last 100 entries
    const trimmed = history.slice(-100);
    localStorage.setItem(STORAGE_KEYS.MOOD_HISTORY, JSON.stringify(trimmed));
    
    return moodEntry;
  } catch (error) {
    console.error('Error saving mood entry:', error);
    return { ...entry, id: '', timestamp: Date.now() };
  }
};

/**
 * Get mood history
 */
export const getMoodHistory = (): MoodEntry[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MOOD_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading mood history:', error);
    return [];
  }
};

/**
 * Save training data point for ML
 */
export const saveTrainingData = (dataPoint: Omit<TrainingDataPoint, 'id' | 'timestamp'>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const trainingPoint: TrainingDataPoint = {
      ...dataPoint,
      id: `train_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    const trainingData = getTrainingData();
    trainingData.push(trainingPoint);
    
    // Keep last 200 training points
    const trimmed = trainingData.slice(-200);
    localStorage.setItem(STORAGE_KEYS.TRAINING_DATA, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving training data:', error);
  }
};

/**
 * Get training data for ML
 */
export const getTrainingData = (): TrainingDataPoint[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRAINING_DATA);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading training data:', error);
    return [];
  }
};

/**
 * Get effectiveness statistics by frequency
 */
export const getEffectivenessByFrequency = (): Record<string, { avg: number; count: number }> => {
  const trainingData = getTrainingData();
  const stats: Record<string, { total: number; count: number }> = {};
  
  trainingData.forEach((point) => {
    if (!stats[point.trackFrequency]) {
      stats[point.trackFrequency] = { total: 0, count: 0 };
    }
    stats[point.trackFrequency].total += point.effectiveness;
    stats[point.trackFrequency].count += 1;
  });
  
  const result: Record<string, { avg: number; count: number }> = {};
  Object.keys(stats).forEach((freq) => {
    result[freq] = {
      avg: stats[freq].total / stats[freq].count,
      count: stats[freq].count,
    };
  });
  
  return result;
};

/**
 * Get mood trends over time
 */
export const getMoodTrends = (days: number = 7): { date: string; mood: number; productivity: number }[] => {
  const history = getMoodHistory();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recent = history.filter((entry) => entry.timestamp >= cutoff);
  
  // Group by day
  const grouped: Record<string, { moods: number[]; productivities: number[] }> = {};
  
  recent.forEach((entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = { moods: [], productivities: [] };
    }
    grouped[date].moods.push(entry.mood);
    if (entry.productivity) {
      grouped[date].productivities.push(entry.productivity);
    }
  });
  
  return Object.entries(grouped).map(([date, data]) => ({
    date,
    mood: data.moods.reduce((a, b) => a + b, 0) / data.moods.length,
    productivity: data.productivities.length > 0
      ? data.productivities.reduce((a, b) => a + b, 0) / data.productivities.length
      : 0,
  }));
};

/**
 * Get recommendation context for ML predictions
 */
export interface RecommendationContext {
  goal: 'focus' | 'sleep' | 'relaxation' | 'creativity';
  timeOfDay: number;
  currentMood?: number;
  recentProductivity?: number;
  averageFocusTime?: number;
}

export const getRecommendationContext = (
  preferredGoal?: 'focus' | 'sleep' | 'relaxation' | 'creativity'
): RecommendationContext => {
  const now = new Date();
  const timeOfDay = now.getHours();
  
  // Get recent mood data
  const moodHistory = getMoodHistory();
  const recentMoods = moodHistory.slice(-5); // Last 5 entries
  
  const avgMood = recentMoods.length > 0
    ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length
    : undefined;
    
  const avgProductivity = recentMoods.length > 0
    ? recentMoods
        .filter((e) => e.productivity !== undefined)
        .reduce((sum, entry) => sum + (entry.productivity || 0), 0) /
      Math.max(1, recentMoods.filter((e) => e.productivity !== undefined).length)
    : undefined;
  
  // Calculate average focus time from completed sessions
  const preferences = getUserPreferences();
  const completedSessions = preferences?.sessionHistory.filter(s => s.completed) || [];
  const avgFocusTime = completedSessions.length > 0
    ? completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length
    : undefined;

  // Determine goal based on time of day if not provided
  let goal: 'focus' | 'sleep' | 'relaxation' | 'creativity' = preferredGoal || 'focus';  if (!preferredGoal) {
    if (timeOfDay >= 22 || timeOfDay < 6) {
      goal = 'sleep';
    } else if (timeOfDay >= 9 && timeOfDay < 12) {
      goal = 'focus';
    } else if (timeOfDay >= 14 && timeOfDay < 17) {
      goal = 'creativity';
    } else if (timeOfDay >= 18 && timeOfDay < 22) {
      goal = 'relaxation';
    }
  }
  
  return {
    goal,
    timeOfDay,
    currentMood: avgMood,
    recentProductivity: avgProductivity,
    averageFocusTime: avgFocusTime,
  };
};

/**
 * Achievement System
 */

// Define all available achievements
export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'progress' | 'unlockedAt'>[] = [
  // Session achievements
  { id: 'first_session', title: 'First Steps', description: 'Complete your first session', category: 'sessions', icon: 'Play', target: 1, rarity: 'common' },
  { id: 'sessions_10', title: 'Getting Started', description: 'Complete 10 sessions', category: 'sessions', icon: 'Target', target: 10, rarity: 'common' },
  { id: 'sessions_50', title: 'Dedicated Mind', description: 'Complete 50 sessions', category: 'sessions', icon: 'Award', target: 50, rarity: 'rare' },
  { id: 'sessions_100', title: 'Harmony Master', description: 'Complete 100 sessions', category: 'sessions', icon: 'Trophy', target: 100, rarity: 'epic' },
  { id: 'sessions_500', title: 'Neural Legend', description: 'Complete 500 sessions', category: 'sessions', icon: 'Crown', target: 500, rarity: 'legendary' },
  
  // Streak achievements
  { id: 'streak_3', title: 'Building Habits', description: 'Maintain a 3-day streak', category: 'streaks', icon: 'Flame', target: 3, rarity: 'common' },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', category: 'streaks', icon: 'Zap', target: 7, rarity: 'rare' },
  { id: 'streak_30', title: 'Monthly Champion', description: 'Maintain a 30-day streak', category: 'streaks', icon: 'Star', target: 30, rarity: 'epic' },
  { id: 'streak_100', title: 'Unstoppable Force', description: 'Maintain a 100-day streak', category: 'streaks', icon: 'Sparkles', target: 100, rarity: 'legendary' },
  
  // AI achievements
  { id: 'ai_unlock', title: 'AI Awakening', description: 'Unlock AI recommendations', category: 'ai', icon: 'Brain', target: 5, rarity: 'common' },
  { id: 'ai_follow_10', title: 'AI Believer', description: 'Follow 10 AI recommendations', category: 'ai', icon: 'Lightbulb', target: 10, rarity: 'rare' },
  { id: 'ai_follow_50', title: 'AI Synergy', description: 'Follow 50 AI recommendations', category: 'ai', icon: 'Cpu', target: 50, rarity: 'epic' },
  
  // Mood tracking achievements
  { id: 'mood_first', title: 'Self Aware', description: 'Log your first mood', category: 'moods', icon: 'Heart', target: 1, rarity: 'common' },
  { id: 'mood_30', title: 'Mood Tracker', description: 'Log 30 mood entries', category: 'moods', icon: 'Activity', target: 30, rarity: 'rare' },
  { id: 'mood_improvement', title: 'Mood Booster', description: 'Achieve 20% mood improvement', category: 'moods', icon: 'TrendingUp', target: 20, rarity: 'epic' },
  
  // Focus achievements
  { id: 'focus_60', title: 'Deep Focus', description: 'Complete a 60-minute session', category: 'focus', icon: 'Clock', target: 3600, rarity: 'rare' },
  { id: 'focus_total_1000', title: 'Focus Marathon', description: 'Accumulate 1000 minutes', category: 'focus', icon: 'Timer', target: 60000, rarity: 'epic' },
  
  // Special achievements
  { id: 'explorer', title: 'Wave Explorer', description: 'Try all 4 frequency types', category: 'special', icon: 'Waves', target: 4, rarity: 'rare' },
  { id: 'night_owl', title: 'Night Owl', description: 'Complete 10 late-night sessions', category: 'special', icon: 'Moon', target: 10, rarity: 'rare' },
  { id: 'early_bird', title: 'Early Bird', description: 'Complete 10 morning sessions', category: 'special', icon: 'Sun', target: 10, rarity: 'rare' },
];

// Get all achievements with current progress
export const getAchievements = (): Achievement[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialize achievements on first load
    const initialAchievements = ACHIEVEMENT_DEFINITIONS.map(def => ({
      ...def,
      progress: 0,
      unlockedAt: undefined,
    }));
    
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(initialAchievements));
    return initialAchievements;
  } catch (error) {
    console.error('Failed to load achievements:', error);
    return [];
  }
};

// Update achievement progress
export const updateAchievements = (): Achievement[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const achievements = getAchievements();
    const stats = getUserStats();
    const preferences = getUserPreferences();
    const moodHistory = getMoodHistory();
    const trainingData = getTrainingData();
    
    // Update each achievement based on current stats
    const updatedAchievements = achievements.map(achievement => {
      let currentProgress = 0;
      
      switch (achievement.id) {
        // Session achievements
        case 'first_session':
        case 'sessions_10':
        case 'sessions_50':
        case 'sessions_100':
        case 'sessions_500':
          currentProgress = stats.completedSessions;
          break;
          
        // Streak achievements
        case 'streak_3':
        case 'streak_7':
        case 'streak_30':
        case 'streak_100':
          currentProgress = stats.currentStreak;
          break;
          
        // AI achievements
        case 'ai_unlock':
          currentProgress = trainingData.length;
          break;
        case 'ai_follow_10':
        case 'ai_follow_50':
          currentProgress = stats.aiRecommendationsUsed;
          break;
          
        // Mood achievements
        case 'mood_first':
        case 'mood_30':
          currentProgress = moodHistory.length;
          break;
        case 'mood_improvement':
          // Calculate mood improvement percentage
          if (moodHistory.length >= 10) {
            const firstMoods = moodHistory.slice(0, 5);
            const recentMoods = moodHistory.slice(-5);
            const firstAvg = firstMoods.reduce((sum, e) => sum + e.mood, 0) / firstMoods.length;
            const recentAvg = recentMoods.reduce((sum, e) => sum + e.mood, 0) / recentMoods.length;
            const improvement = ((recentAvg - firstAvg) / firstAvg) * 100;
            currentProgress = Math.max(0, improvement);
          }
          break;
          
        // Focus achievements
        case 'focus_60':
          // Check for any single session >= 60 minutes
          const longestSession = preferences?.sessionHistory.reduce((max, s) => 
            s.completed && s.duration > max ? s.duration : max, 0) || 0;
          currentProgress = longestSession;
          break;
        case 'focus_total_1000':
          currentProgress = stats.totalMinutes * 60; // Convert to seconds
          break;
          
        // Special achievements
        case 'explorer':
          const uniqueGoals = new Set(preferences?.sessionHistory.map(s => s.goal).filter(Boolean));
          currentProgress = uniqueGoals.size;
          break;
        case 'night_owl':
          const nightSessions = preferences?.sessionHistory.filter(s => {
            const hour = new Date(s.timestamp).getHours();
            return hour >= 22 || hour < 6;
          }).length || 0;
          currentProgress = nightSessions;
          break;
        case 'early_bird':
          const morningSessions = preferences?.sessionHistory.filter(s => {
            const hour = new Date(s.timestamp).getHours();
            return hour >= 5 && hour < 9;
          }).length || 0;
          currentProgress = morningSessions;
          break;
      }
      
      // Calculate progress percentage
      const progressPercent = Math.min(100, (currentProgress / achievement.target) * 100);
      
      // Check if achievement should be unlocked
      const shouldUnlock = progressPercent >= 100 && !achievement.unlockedAt;
      
      return {
        ...achievement,
        progress: progressPercent,
        unlockedAt: shouldUnlock ? Date.now() : achievement.unlockedAt,
      };
    });
    
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updatedAchievements));
    return updatedAchievements;
  } catch (error) {
    console.error('Failed to update achievements:', error);
    return getAchievements();
  }
};

// Get user statistics
export const getUserStats = (): UserStats => {
  if (typeof window === 'undefined') {
    return {
      totalSessions: 0,
      completedSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      achievementsUnlocked: 0,
      aiRecommendationsUsed: 0,
      moodEntriesLogged: 0,
      averageMoodScore: 0,
      favoriteGoal: 'focus',
      joinedDate: Date.now(),
      lastActiveDate: Date.now(),
    };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Calculate stats from existing data
    const stats = calculateUserStats();
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error('Failed to load user stats:', error);
    return calculateUserStats();
  }
};

// Calculate stats from session history
const calculateUserStats = (): UserStats => {
  const preferences = getUserPreferences();
  const moodHistory = getMoodHistory();
  const achievements = getAchievements();
  
  const sessions = preferences?.sessionHistory || [];
  const completedSessions = sessions.filter(s => s.completed);
  
  // Calculate streak
  const { current, longest } = calculateStreaks(sessions);
  
  // Calculate favorite goal
  const goalCounts = new Map<string, number>();
  sessions.forEach(s => {
    if (s.goal) {
      goalCounts.set(s.goal, (goalCounts.get(s.goal) || 0) + 1);
    }
  });
  const favoriteGoal = Array.from(goalCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'focus';
  
  // Calculate average mood
  const avgMood = moodHistory.length > 0
    ? moodHistory.reduce((sum, e) => sum + e.mood, 0) / moodHistory.length
    : 0;
  
  // Find joined date (earliest session)
  const joinedDate = sessions.length > 0
    ? Math.min(...sessions.map(s => s.timestamp))
    : Date.now();
  
  // Find last active date (most recent session)
  const lastActiveDate = sessions.length > 0
    ? Math.max(...sessions.map(s => s.timestamp))
    : Date.now();
  
  return {
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    totalMinutes: Math.floor(completedSessions.reduce((sum, s) => sum + s.duration, 0) / 60),
    currentStreak: current,
    longestStreak: longest,
    achievementsUnlocked: achievements.filter(a => a.unlockedAt).length,
    aiRecommendationsUsed: 0, // This will be incremented when recommendations are used
    moodEntriesLogged: moodHistory.length,
    averageMoodScore: Math.round(avgMood * 10) / 10,
    favoriteGoal,
    joinedDate,
    lastActiveDate,
  };
};

// Calculate current and longest streaks
const calculateStreaks = (sessions: SessionData[]): { current: number; longest: number } => {
  if (sessions.length === 0) return { current: 0, longest: 0 };
  
  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => a.timestamp - b.timestamp);
  
  // Get unique days with sessions
  const uniqueDays = new Set(
    sortedSessions.map(s => new Date(s.timestamp).toDateString())
  );
  
  const daysArray = Array.from(uniqueDays).sort();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  // Calculate longest streak
  for (let i = 1; i < daysArray.length; i++) {
    const prevDate = new Date(daysArray[i - 1]);
    const currDate = new Date(daysArray[i]);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / 86400000);
    
    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  // Calculate current streak (only if active today or yesterday)
  const lastDay = daysArray[daysArray.length - 1];
  if (lastDay === today || lastDay === yesterday) {
    currentStreak = 1;
    for (let i = daysArray.length - 2; i >= 0; i--) {
      const prevDate = new Date(daysArray[i]);
      const currDate = new Date(daysArray[i + 1]);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / 86400000);
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  return { current: currentStreak, longest: longestStreak };
};

// Update stats after session completion
export const updateUserStats = (updatedFields: Partial<UserStats>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const currentStats = getUserStats();
    const newStats = { ...currentStats, ...updatedFields, lastActiveDate: Date.now() };
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(newStats));
  } catch (error) {
    console.error('Failed to update user stats:', error);
  }
};

// Increment AI recommendation usage
export const trackAIRecommendationUsed = (): void => {
  const stats = getUserStats();
  updateUserStats({ aiRecommendationsUsed: stats.aiRecommendationsUsed + 1 });
  updateAchievements(); // Check for new achievements
};
