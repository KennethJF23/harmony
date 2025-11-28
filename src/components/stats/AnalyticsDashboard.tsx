'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Session {
  id: string;
  duration: number;
  preset: string;
  timestamp: string;
  type: string;
}

const AnalyticsDashboard = memo(() => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const stored = localStorage.getItem('neurofocus_sessions');
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const rangeMs = timeRange === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    const cutoff = new Date(now.getTime() - rangeMs);

    const recentSessions = sessions.filter(s => new Date(s.timestamp) > cutoff);

    const totalMinutes = recentSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalSessions = recentSessions.length;
    
    // Calculate streak
    const sortedSessions = [...recentSessions].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    let currentStreak = 0;
    let lastDate: Date | null = null;
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.timestamp);
      sessionDate.setHours(0, 0, 0, 0);
      
      if (!lastDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (sessionDate.getTime() === today.getTime()) {
          currentStreak = 1;
          lastDate = sessionDate;
        } else {
          break;
        }
      } else {
        const diff = (lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
          lastDate = sessionDate;
        } else if (diff > 1) {
          break;
        }
      }
    }

    // Daily breakdown
    const dailyData: Record<string, number> = {};
    recentSessions.forEach(s => {
      const date = new Date(s.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      dailyData[date] = (dailyData[date] || 0) + s.duration;
    });

    const chartData = Object.entries(dailyData)
      .map(([date, minutes]) => ({ date, minutes }))
      .slice(-7); // Last 7 days

    return {
      totalMinutes,
      totalSessions,
      currentStreak,
      avgSessionLength: totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0,
      chartData
    };
  }, [sessions, timeRange]);

  interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
  }

  const StatCard = ({ title, value, subtitle, icon, color }: StatCardProps) => (
    <motion.div
      className="relative bg-gradient-to-br from-[#1a1f35]/80 to-[#0a0e1a]/80 backdrop-blur-xl rounded-xl p-6 border border-[#5b9eff]/20 overflow-hidden group hover:border-[#5b9eff]/40 transition-all"
      whileHover={{ scale: 1.02, y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="text-gray-400 text-sm font-medium">{title}</div>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-20`}>
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <svg className="w-7 h-7 text-[#5b9eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Focus Analytics
        </h2>
        
        {/* Time Range Toggle */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === 'week'
                ? 'bg-[#5b9eff] text-white shadow-lg shadow-[#5b9eff]/30'
                : 'bg-[#1a1f35]/50 text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Week
          </motion.button>
          <motion.button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === 'month'
                ? 'bg-[#5b9eff] text-white shadow-lg shadow-[#5b9eff]/30'
                : 'bg-[#1a1f35]/50 text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Month
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Focus Time"
          value={`${stats.totalMinutes}m`}
          subtitle={`${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`}
          color="from-[#5b9eff] to-[#7c3aed]"
          icon={
            <svg className="w-5 h-5 text-[#5b9eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="Sessions"
          value={stats.totalSessions}
          subtitle={`~${stats.avgSessionLength}m average`}
          color="from-[#2dd4bf] to-[#34d399]"
          icon={
            <svg className="w-5 h-5 text-[#2dd4bf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          subtitle={stats.currentStreak > 0 ? "Keep it up!" : "Start today!"}
          color="from-[#f97316] to-[#fb7185]"
          icon={
            <svg className="w-5 h-5 text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          }
        />
        
        <StatCard
          title="Productivity Score"
          value={Math.min(100, Math.round((stats.totalMinutes / (timeRange === 'week' ? 7 : 30)) * 2))}
          subtitle="Based on daily avg"
          color="from-[#a78bfa] to-[#bb9af7]"
          icon={
            <svg className="w-5 h-5 text-[#a78bfa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          className="bg-gradient-to-br from-[#1a1f35]/80 to-[#0a0e1a]/80 backdrop-blur-xl rounded-xl p-6 border border-[#5b9eff]/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Daily Focus Time</h3>
          {stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1f35" />
                <XAxis dataKey="date" stroke="#6a7282" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6a7282" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f35',
                    border: '1px solid #5b9eff40',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#5b9eff' : '#7c3aed'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              No data yet. Start a focus session!
            </div>
          )}
        </motion.div>

        {/* Line Chart */}
        <motion.div
          className="bg-gradient-to-br from-[#1a1f35]/80 to-[#0a0e1a]/80 backdrop-blur-xl rounded-xl p-6 border border-[#5b9eff]/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Progress Trend</h3>
          {stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1f35" />
                <XAxis dataKey="date" stroke="#6a7282" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6a7282" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f35',
                    border: '1px solid #5b9eff40',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#2dd4bf" 
                  strokeWidth={3}
                  dot={{ fill: '#2dd4bf', r: 4 }}
                  activeDot={{ r: 6, fill: '#34d399' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              No data yet. Start a focus session!
            </div>
          )}
        </motion.div>
      </div>

      {/* Export Button */}
      <motion.button
        onClick={() => {
          const dataStr = JSON.stringify(sessions, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `neurofocus-sessions-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
        }}
        className="w-full py-3 bg-[#1a1f35]/50 text-gray-300 rounded-lg font-medium hover:bg-[#1a1f35] hover:text-white transition-all flex items-center justify-center gap-2 border border-[#5b9eff]/20"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export Session History
      </motion.button>
    </motion.div>
  );
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';

export default AnalyticsDashboard;
