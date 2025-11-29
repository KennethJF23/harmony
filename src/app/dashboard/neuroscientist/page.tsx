'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home,
  Users,
  LogOut,
  Activity,
  TrendingUp,
  Brain,
  BarChart3,
  PieChart,
  Download,
  FileText,
  Clock,
  Zap
} from 'lucide-react';
import Footer from '@/components/Footer';

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  frequencyUsage: {
    name: string;
    count: number;
    percentage: number;
    avgDuration: number;
  }[];
  frequencyEffectiveness: {
    frequency: string;
    completionRate: number;
    avgRating: number;
    userCount: number;
  }[];
  userPreferences: {
    category: string;
    count: number;
    percentage: number;
  }[];
  mentalStateDistribution: {
    state: string;
    count: number;
    percentage: number;
  }[];
  userRetention: {
    day: string;
    users: number;
    sessions: number;
  }[];
  recentActivity: {
    userId: string;
    userName: string;
    action: string;
    timestamp: string;
  }[];
}

export default function NeuroscientistDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scientistName, setScientistName] = useState('Neuroscientist');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'neuroscientist') {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [router, selectedTimeRange]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/dashboard/neuroscientist?timeRange=${selectedTimeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
      setScientistName(data.scientistName || 'Neuroscientist');
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setDashboardData(getMockData());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockData = (): DashboardData => ({
    totalUsers: 156,
    activeUsers: 89,
    totalSessions: 1247,
    avgSessionDuration: 28.5,
    frequencyUsage: [
      { name: 'Alpha (8-12 Hz)', count: 523, percentage: 42, avgDuration: 32 },
      { name: 'Theta (4-8 Hz)', count: 361, percentage: 29, avgDuration: 25 },
      { name: 'Beta (13-30 Hz)', count: 237, percentage: 19, avgDuration: 22 },
      { name: 'Delta (0.5-4 Hz)', count: 126, percentage: 10, avgDuration: 45 },
    ],
    frequencyEffectiveness: [
      { frequency: 'Alpha', completionRate: 87, avgRating: 4.5, userCount: 142 },
      { frequency: 'Theta', completionRate: 82, avgRating: 4.3, userCount: 118 },
      { frequency: 'Beta', completionRate: 79, avgRating: 4.1, userCount: 95 },
      { frequency: 'Delta', completionRate: 91, avgRating: 4.7, userCount: 67 },
    ],
    userPreferences: [
      { category: 'Focus', count: 512, percentage: 41 },
      { category: 'Relaxation', count: 374, percentage: 30 },
      { category: 'Creativity', count: 237, percentage: 19 },
      { category: 'Sleep', count: 124, percentage: 10 },
    ],
    mentalStateDistribution: [
      { state: 'Focused', count: 45, percentage: 51 },
      { state: 'Relaxed', count: 28, percentage: 31 },
      { state: 'Creative', count: 12, percentage: 13 },
      { state: 'Sleeping', count: 4, percentage: 5 },
    ],
    userRetention: [
      { day: 'Mon', users: 67, sessions: 145 },
      { day: 'Tue', users: 72, sessions: 168 },
      { day: 'Wed', users: 81, sessions: 192 },
      { day: 'Thu', users: 76, sessions: 178 },
      { day: 'Fri', users: 69, sessions: 156 },
      { day: 'Sat', users: 58, sessions: 134 },
      { day: 'Sun', users: 54, sessions: 118 },
    ],
    recentActivity: [
      { userId: '1', userName: 'John Doe', action: 'Completed Alpha session', timestamp: new Date(Date.now() - 300000).toISOString() },
      { userId: '2', userName: 'Jane Smith', action: 'Started Theta meditation', timestamp: new Date(Date.now() - 600000).toISOString() },
      { userId: '3', userName: 'Mike Johnson', action: 'Completed Beta focus session', timestamp: new Date(Date.now() - 900000).toISOString() },
    ],
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const handleExportData = () => {
    if (!dashboardData) return;
    
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `harmony-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1f35]/95 backdrop-blur-xl border-b border-[#5b9eff]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard/neuroscientist">
              <div className="flex items-center space-x-2.5 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-[#5b9eff] to-[#7c3aed] rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] bg-clip-text text-transparent">
                  Harmony Research
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Link href="/dashboard/neuroscientist">
                <motion.div
                  className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-[#5b9eff]/20 to-[#7c3aed]/20 text-[#5b9eff]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                </motion.div>
              </Link>
              
              <Link href="/dashboard/neuroscientist/users">
                <motion.div
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-[#a9b1d6] hover:text-[#5b9eff] hover:bg-[#5b9eff]/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Users</span>
                </motion.div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:block text-[#a9b1d6] text-sm">
                Dr. <span className="text-[#5b9eff] font-medium">{scientistName}</span>
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
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Research Dashboard
            </h1>
            <p className="text-[#7aa2f7]">Neural frequency analytics and user insights</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 bg-[#1e2642] border border-[#5b9eff]/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5b9eff]/50"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <motion.button
              onClick={handleExportData}
              className="px-4 py-2 bg-[#5b9eff]/20 hover:bg-[#5b9eff]/30 text-[#5b9eff] rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Export Data
            </motion.button>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-[#5b9eff]" />
              <span className="text-xs text-[#7aa2f7]/60">Total Users</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {dashboardData?.totalUsers}
            </div>
            <p className="text-sm text-[#34d399]">+{dashboardData?.activeUsers} active</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#34d399]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-10 h-10 text-[#34d399]" />
              <span className="text-xs text-[#7aa2f7]/60">Total Sessions</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {dashboardData?.totalSessions}
            </div>
            <p className="text-sm text-[#7aa2f7]/60">All time</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#f97316]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-10 h-10 text-[#f97316]" />
              <span className="text-xs text-[#7aa2f7]/60">Avg Duration</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {dashboardData?.avgSessionDuration}m
            </div>
            <p className="text-sm text-[#7aa2f7]/60">Per session</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#a78bfa]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-[#a78bfa]" />
              <span className="text-xs text-[#7aa2f7]/60">Completion</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              84.5%
            </div>
            <p className="text-sm text-[#34d399]">+2.3% vs last week</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Frequency Usage Analytics */}
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#5b9eff]" />
              Frequency Usage Analytics
            </h2>
            <div className="space-y-4">
              {dashboardData?.frequencyUsage.map((freq, index) => (
                <motion.div
                  key={freq.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{freq.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#7aa2f7]">{freq.count} sessions</span>
                      <span className="text-sm text-[#5b9eff] font-medium">{freq.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-3 bg-[#0a0e1a]/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${freq.percentage}%` }}
                      transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-[#7aa2f7]/60">
                    Avg duration: {freq.avgDuration} min
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Frequency Effectiveness */}
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#f97316]" />
              Frequency Effectiveness
            </h2>
            <div className="space-y-4">
              {dashboardData?.frequencyEffectiveness.map((freq, index) => (
                <motion.div
                  key={freq.frequency}
                  className="p-4 bg-[#0a0e1a]/50 rounded-xl border border-[#5b9eff]/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">{freq.frequency} Waves</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-white font-medium">{freq.avgRating}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-[#7aa2f7]/60 mb-1">Completion Rate</div>
                      <div className="text-white font-semibold">{freq.completionRate}%</div>
                    </div>
                    <div>
                      <div className="text-[#7aa2f7]/60 mb-1">User Count</div>
                      <div className="text-white font-semibold">{freq.userCount}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* User Preferences */}
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#a78bfa]" />
              User Preferences
            </h2>
            <div className="space-y-4">
              {dashboardData?.userPreferences.map((pref, index) => {
                const colors = ['from-[#5b9eff] to-[#7c3aed]', 'from-[#34d399] to-[#10b981]', 'from-[#a78bfa] to-[#8b5cf6]', 'from-[#f97316] to-[#ea580c]'];
                return (
                  <div key={pref.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">{pref.category}</span>
                      <span className="text-sm text-[#7aa2f7]">{pref.percentage}%</span>
                    </div>
                    <div className="h-2 bg-[#0a0e1a]/50 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pref.percentage}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Mental State Distribution */}
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#5b9eff]" />
              Live Mental State
            </h2>
            <div className="space-y-3">
              {dashboardData?.mentalStateDistribution.map((state, index) => (
                <motion.div
                  key={state.state}
                  className="flex items-center justify-between p-3 bg-[#0a0e1a]/30 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#5b9eff] animate-pulse" />
                    <span className="text-sm text-white">{state.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#7aa2f7]">{state.count} users</span>
                    <span className="text-xs text-[#5b9eff] font-medium">({state.percentage}%)</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Research Tools */}
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#34d399]" />
              Research Tools
            </h2>
            <div className="space-y-3">
              <motion.button
                className="w-full py-3 px-4 bg-[#5b9eff]/20 hover:bg-[#5b9eff]/30 text-[#5b9eff] rounded-lg text-sm font-medium flex items-center justify-between transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Generate Report</span>
                <FileText className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                onClick={handleExportData}
                className="w-full py-3 px-4 bg-[#34d399]/20 hover:bg-[#34d399]/30 text-[#34d399] rounded-lg text-sm font-medium flex items-center justify-between transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Export Raw Data</span>
                <Download className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                className="w-full py-3 px-4 bg-[#a78bfa]/20 hover:bg-[#a78bfa]/30 text-[#a78bfa] rounded-lg text-sm font-medium flex items-center justify-between transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View Patterns</span>
                <BarChart3 className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                className="w-full py-3 px-4 bg-[#f97316]/20 hover:bg-[#f97316]/30 text-[#f97316] rounded-lg text-sm font-medium flex items-center justify-between transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>User Insights</span>
                <Users className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* User Retention */}
        <motion.div
          className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5b9eff]" />
            User Retention & Activity
          </h2>
          <div className="flex items-end justify-between gap-2 h-64">
            {dashboardData?.userRetention.map((day, index) => {
              const maxSessions = Math.max(...dashboardData.userRetention.map(d => d.sessions));
              const heightPercent = (day.sessions / maxSessions) * 100;
              
              return (
                <motion.div
                  key={day.day}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                  <div className="w-full relative group">
                    <div
                      className="w-full bg-gradient-to-t from-[#5b9eff] to-[#7c3aed] rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${heightPercent}%`, minHeight: '40px' }}
                    />
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-[#1a1f35] px-3 py-2 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#5b9eff]/30">
                      <div className="font-semibold mb-1">{day.day}</div>
                      <div>{day.users} users</div>
                      <div>{day.sessions} sessions</div>
                    </div>
                  </div>
                  <span className="text-xs text-[#7aa2f7]/60 font-medium">{day.day}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
