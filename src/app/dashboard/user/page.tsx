'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Clock, 
  Activity, 
  TrendingUp, 
  Calendar,
  Settings,
  LogOut,
  Music,
  Zap,
  Home,
  Brain
} from 'lucide-react';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';

interface DashboardData {
  totalMinutes: number;
  sessionsCompleted: number;
  currentStreak: number;
  favoriteWave: string;
  surveyResponses?: number;
  mostEffectiveFrequency?: string;
  avgFocusQuality?: number;
  recentSessions: {
    id: string;
    track: string;
    duration: number;
    category: string;
    timestamp: string;
    completed: boolean;
  }[];
  waveFrequency: {
    name: string;
    count: number;
    percentage: number;
  }[];
  weeklyProgress: {
    day: string;
    hours: number;
  }[];
  moodRatings: {
    date: string;
    rating: number;
    category: string;
  }[];
}

const getFrequencyRange = (waveName: string): string => {
  const ranges: Record<string, string> = {
    Alpha: '8-12 Hz',
    Theta: '4-8 Hz',
    Beta: '13-30 Hz',
    Delta: '0.5-4 Hz',
  };
  return ranges[waveName] || '';
};

export default function UserDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  // Refresh data when window regains focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'user') {
      router.push('/login');
      return;
    }

    fetchDashboardData();
    
    // Auto-refresh dashboard every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }

      // Fetch data from MongoDB API
      const response = await fetch('/api/dashboard/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch dashboard data:', response.statusText);
        return;
      }

      const data = await response.json();
      
      console.log('=== Dashboard Data from MongoDB ===');
      console.log('Total hours:', data.totalHours);
      console.log('Sessions completed:', data.sessionsCompleted);
      console.log('Current streak:', data.currentStreak);
      console.log('Favorite wave:', data.favoriteWave);
      console.log('Recent sessions:', data.recentSessions);
      console.log('===================================');

      // Set user name
      if (data.userName) {
        setUserName(data.userName);
      }

      // Transform API data to match dashboard format
      setDashboardData({
        totalMinutes: data.totalHours * 60,
        sessionsCompleted: data.sessionsCompleted,
        currentStreak: data.currentStreak,
        favoriteWave: data.favoriteWave,
        surveyResponses: data.surveyResponses || 0,
        mostEffectiveFrequency: data.mostEffectiveFrequency,
        avgFocusQuality: data.avgFocusQuality,
        recentSessions: data.recentSessions || [],
        waveFrequency: data.waveFrequency || [],
        weeklyProgress: data.weeklyProgress || [],
        moodRatings: data.moodRatings || [],
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  const getMockData = (): DashboardData => ({
    totalMinutes: 1470,
    sessionsCompleted: 42,
    currentStreak: 7,
    favoriteWave: 'Alpha (8-12 Hz)',
    recentSessions: [
      {
        id: '1',
        track: 'Deep Focus Alpha',
        duration: 25,
        category: 'focus',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
      {
        id: '2',
        track: 'Theta Meditation',
        duration: 30,
        category: 'relaxation',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
      {
        id: '3',
        track: 'Creative Flow Beta',
        duration: 45,
        category: 'creativity',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        completed: false,
      },
    ],
    waveFrequency: [
      { name: 'Alpha', count: 18, percentage: 43 },
      { name: 'Theta', count: 12, percentage: 29 },
      { name: 'Beta', count: 8, percentage: 19 },
      { name: 'Delta', count: 4, percentage: 9 },
    ],
    weeklyProgress: [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 3.2 },
      { day: 'Wed', hours: 4.1 },
      { day: 'Thu', hours: 2.8 },
      { day: 'Fri', hours: 3.5 },
      { day: 'Sat', hours: 4.8 },
      { day: 'Sun', hours: 3.6 },
    ],
    moodRatings: [
      { date: '2024-01-01', rating: 4, category: 'focus' },
      { date: '2024-01-02', rating: 5, category: 'relaxation' },
      { date: '2024-01-03', rating: 3, category: 'creativity' },
    ],
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const categoryColors: Record<string, string> = {
    focus: 'from-[#5b9eff] to-[#7c3aed]',
    relaxation: 'from-[#2dd4bf] to-[#34d399]',
    creativity: 'from-[#a78bfa] to-[#bb9af7]',
    sleep: 'from-[#7c3aed] to-[#5b9eff]',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5b9eff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#7aa2f7]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]">
      {/* Dashboard Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1f35]/95 backdrop-blur-xl border-b border-[#5b9eff]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard/user">
              <div className="flex items-center space-x-2.5 cursor-pointer">
                <img src="/braihharmonicslogo.jpg" alt="Brain Harmonics" className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-xl font-bold bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] bg-clip-text text-transparent">
                  Harmony
                </span>
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/dashboard/user">
                <motion.div
                  className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-[#5b9eff]/20 to-[#7c3aed]/20 text-[#5b9eff]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                </motion.div>
              </Link>
              
              <Link href="/sessions">
                <motion.div
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-[#a9b1d6] hover:text-[#5b9eff] hover:bg-[#5b9eff]/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Music className="w-4 h-4" />
                  <span className="font-medium">Sessions</span>
                </motion.div>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-[#a9b1d6] text-sm">
                Welcome, <span className="text-[#5b9eff] font-medium">{userName}</span>
              </span>
              <motion.button
                onClick={handleLogout}
                className="p-2 text-[#a9b1d6] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Hours */}
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-10 h-10 text-[#5b9eff]" />
              <span className="text-xs text-[#7aa2f7]/60">Total Time</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {Math.round(dashboardData?.totalMinutes || 0)} min
            </div>
            <p className="text-sm text-[#7aa2f7]/60">Minutes listened</p>
          </motion.div>

          {/* Sessions Completed */}
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#34d399]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-10 h-10 text-[#34d399]" />
              <span className="text-xs text-[#7aa2f7]/60">Completed</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {dashboardData?.sessionsCompleted}
            </div>
            <p className="text-sm text-[#7aa2f7]/60">Sessions done</p>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#f97316]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-10 h-10 text-[#f97316]" />
              <span className="text-xs text-[#7aa2f7]/60">Streak</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {dashboardData?.currentStreak} 🔥
            </div>
            <p className="text-sm text-[#7aa2f7]/60">Days in a row</p>
          </motion.div>

          {/* Favorite Wave */}
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#a78bfa]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-[#a78bfa]" />
              <span className="text-xs text-[#7aa2f7]/60">Favorite</span>
            </div>
            <div className="text-xl font-bold text-white mb-1">
              {dashboardData?.favoriteWave}
            </div>
            <p className="text-sm text-[#7aa2f7]/60">Most used wave</p>
          </motion.div>
        </div>

        {/* Survey Insights Section */}
        <motion.div
          className="mb-6 bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#5b9eff]" />
            Your Neural Feedback Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0a0e1a]/50 rounded-lg p-4 border border-[#5b9eff]/10">
              <div className="text-xs text-[#7aa2f7]/60 mb-1">Survey Responses</div>
              <div className="text-2xl font-bold text-white">
                {dashboardData?.surveyResponses || 0}
              </div>
            </div>
            <div className="bg-[#0a0e1a]/50 rounded-lg p-4 border border-[#34d399]/10">
              <div className="text-xs text-[#7aa2f7]/60 mb-1">Most Effective</div>
              <div className="text-lg font-bold text-[#34d399]">
                {dashboardData?.mostEffectiveFrequency || 'Alpha'}
              </div>
            </div>
            <div className="bg-[#0a0e1a]/50 rounded-lg p-4 border border-[#a78bfa]/10">
              <div className="text-xs text-[#7aa2f7]/60 mb-1">Focus Quality</div>
              <div className="text-2xl font-bold text-white">
                {dashboardData?.avgFocusQuality || 8.2}/10
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Your Response Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#0a0e1a]/50 rounded-lg p-3 border border-[#5b9eff]/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#7aa2f7]/60">Mental Synchronization</span>
                    <span className="text-sm font-bold text-[#5b9eff]">85%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1f35] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#5b9eff] to-[#7c3aed]" style={{ width: '85%' }} />
                  </div>
                </div>
                
                <div className="bg-[#0a0e1a]/50 rounded-lg p-3 border border-[#34d399]/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#7aa2f7]/60">Audio Harmony</span>
                    <span className="text-sm font-bold text-[#34d399]">92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1f35] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#34d399] to-[#10b981]" style={{ width: '92%' }} />
                  </div>
                </div>

                <div className="bg-[#0a0e1a]/50 rounded-lg p-3 border border-[#f97316]/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#7aa2f7]/60">Focus Retention</span>
                    <span className="text-sm font-bold text-[#f97316]">78%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1f35] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#f97316] to-[#fb923c]" style={{ width: '78%' }} />
                  </div>
                </div>

                <div className="bg-[#0a0e1a]/50 rounded-lg p-3 border border-[#a78bfa]/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#7aa2f7]/60">Stress Reduction</span>
                    <span className="text-sm font-bold text-[#a78bfa]">88%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1f35] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd]" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0e1a]/30 rounded-lg p-4 border border-[#5b9eff]/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#5b9eff]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  💡
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Personalized Insight</h4>
                  <p className="text-xs text-[#7aa2f7]/80">
                    Your responses show strong affinity for Alpha waves (8-12 Hz) during afternoon sessions. 
                    Consider scheduling focus work between 2-5 PM for optimal results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Progress Chart */}
            <motion.div
              className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#5b9eff]" />
                Weekly Progress
              </h2>
              <div className="flex items-end justify-between gap-2 h-48">
                {dashboardData?.weeklyProgress.map((day, index) => {
                  const maxHours = Math.max(...dashboardData.weeklyProgress.map(d => d.hours));
                  const heightPercent = (day.hours / maxHours) * 100;
                  
                  return (
                    <motion.div
                      key={day.day}
                      className="flex-1 flex flex-col items-center gap-2"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <div className="w-full relative group">
                        <div
                          className="w-full bg-gradient-to-t from-[#5b9eff] to-[#7c3aed] rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1a1f35] px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.hours}h
                        </div>
                      </div>
                      <span className="text-xs text-[#7aa2f7]/60 font-medium">{day.day}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Brain Wave Frequency Usage */}
            <motion.div
              className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#5b9eff]" />
                Brain Waves Frequently Used
              </h2>
              <div className="space-y-4">
                {dashboardData?.waveFrequency.map((wave, index) => (
                  <motion.div
                    key={wave.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{wave.name} Waves</span>
                      <span className="text-sm text-[#7aa2f7]">{wave.count} sessions ({wave.percentage}%)</span>
                    </div>
                    <div className="h-3 bg-[#0a0e1a]/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${wave.percentage}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent History */}
            <motion.div
              className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#5b9eff]" />
                Recent History
              </h2>
              <div className="space-y-3">
                {dashboardData?.recentSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    className="p-4 bg-[#0a0e1a]/50 rounded-xl border border-[#5b9eff]/10 hover:border-[#5b9eff]/30 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">{session.track}</h3>
                      {session.completed ? (
                        <span className="text-xs text-[#34d399]">✓</span>
                      ) : (
                        <span className="text-xs text-[#f97316]">○</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 bg-gradient-to-r ${categoryColors[session.category]}/20 rounded-full text-[#7aa2f7] capitalize`}>
                        {session.category}
                      </span>
                      <span className="text-[#7aa2f7]/60">{formatTimeAgo(session.timestamp)}</span>
                    </div>
                    <div className="mt-2 text-xs text-[#7aa2f7]/60">
                      {session.duration} minutes
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link href="/sessions">
                <motion.button
                  className="w-full mt-4 py-2 bg-[#5b9eff]/20 hover:bg-[#5b9eff]/30 text-[#5b9eff] rounded-lg text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View All Sessions
                </motion.button>
              </Link>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/sessions">
                  <motion.button
                    className="w-full py-3 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] text-white rounded-lg font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start New Session
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    
    {/* Floating components rendered outside main container */}
    <AIAssistant />
    </>
  );
}
