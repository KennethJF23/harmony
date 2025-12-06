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
import AIAssistant from '@/components/AIAssistant';

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
  surveyAnalytics?: {
    totalResponses: number;
    avgResponseRate: number;
    categoryBreakdown: {
      category: string;
      responseCount: number;
      positiveRate: number;
    }[];
    topInsights: {
      question: string;
      mostCommonAnswer: string;
      percentage: number;
    }[];
    neuralEffectiveness: {
      metric: string;
      avgScore: number;
      trend: string;
    }[];
  };
  surveyQuestionsSummary?: {
    questionId: number;
    question: string;
    totalResponses: number;
    topAnswer: {
      answer: string;
      count: number;
    };
  }[];
}

export default function NeuroscientistDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scientistName, setScientistName] = useState('Neuroscientist');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [report, setReport] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'neuroscientist') {
      router.push('/login');
      return;
    }

    // Prefer logged-in identity from localStorage to label Dr. name
    const storedName = localStorage.getItem('userName') || localStorage.getItem('userEmail');
    if (storedName) {
      setScientistName(storedName);
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

      // Use backend data only for totals; no local storage fallback

      setDashboardData(data);
      // If API provides a scientistName, use it; else keep local user identity
      if (data.scientistName) {
        setScientistName(data.scientistName);
      }

      // Fetch neuroscience ML report
      const reportRes = await fetch(`/api/reports/neuroscience?timeRange=${selectedTimeRange}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (reportRes.ok) {
        const rpt = await reportRes.json();
        setReport(rpt);
      }
      
      console.log('Dashboard data loaded:', { totalUsers: data.totalUsers, totalSessions: data.totalSessions });
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

  const handleGenerateNeuroscienceReport = async () => {
    setIsGenerating(true);
    setGenerateError('');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setGenerateError('Not authenticated');
        return;
      }

      // Fetch comprehensive neuroscience analysis with AI
      const res = await fetch('/api/reports/neuroscience/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          timeRange: selectedTimeRange,
          includeDashboardData: true 
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        setGenerateError(`Failed to generate report: ${error}`);
        return;
      }

      // Get the HTML content
      const htmlContent = await res.text();
      
      // Create a new window with the report for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load, then trigger print dialog
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 250);
        };
      } else {
        // Fallback: download as HTML file
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `neuroscience-report-${new Date().toISOString().split('T')[0]}.html`;
        link.click();
        URL.revokeObjectURL(url);
      }
      
      setGenerateError('✓ Report generated - Save as PDF via Print dialog');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setGenerateError(`Error: ${msg}`);
      console.error('Generate PDF report error:', err);
    } finally {
      setIsGenerating(false);
    }
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
              onClick={handleGenerateNeuroscienceReport}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-[#7c3aed]/20 to-[#5b9eff]/20 hover:from-[#7c3aed]/30 hover:to-[#5b9eff]/30 text-[#7c3aed] rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#7c3aed]/30"
              whileHover={{ scale: isGenerating ? 1 : 1.02 }}
              whileTap={{ scale: isGenerating ? 1 : 0.98 }}
            >
              <FileText className="w-4 h-4" />
              {isGenerating ? 'Generating PDF...' : 'Generate AI Report'}
            </motion.button>
            
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
        
        {generateError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-lg text-sm ${
              generateError.startsWith('✓') 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {generateError}
          </motion.div>
        )}

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

        {/* Neuroscience Report */}
        <motion.div
          className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#5b9eff]" />
            General Neuroscience Report (XGBoost)
          </h2>
          <div className="flex justify-end mb-4 items-center gap-2">
            <motion.button
              onClick={(e) => {
                console.log('=== GENERATE REPORT BUTTON CLICKED ===');
                console.log('Event:', e);
                console.log('Current report state:', report);
                console.log('Selected time range:', selectedTimeRange);
                
                (async () => {
                  setGenerateError('');
                  setIsGenerating(true);
                  try {
                    const token = localStorage.getItem('authToken');
                    console.log('Token:', token ? `exists (${token.substring(0, 20)}...)` : 'MISSING');
                    
                    const url = '/api/reports/neuroscience';
                    const body = JSON.stringify({ timeRange: selectedTimeRange });
                    console.log('Fetching:', url, 'with body:', body);
                    
                    const res = await fetch(url, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      },
                      body,
                    });
                    console.log('Response status:', res.status, res.statusText);
                    const text = await res.text();
                    console.log('Response text:', text);
                    
                    if (!res.ok) {
                      setGenerateError(`Failed: ${res.status}`);
                      console.error('Request failed');
                    } else {
                      const analysis = JSON.parse(text);
                      console.log('Parsed analysis:', analysis);
                      setReport({
                        period: analysis.period,
                        totals: analysis.totals,
                        feedback: analysis.feedback,
                        ml: analysis.ai,
                      });
                      setGenerateError('✓ Report generated');
                      console.log('Report state updated');
                    }
                  } catch (err) {
                    const msg = err instanceof Error ? err.message : 'Unknown error';
                    setGenerateError(`Error: ${msg}`);
                    console.error('Generate report exception:', err);
                  } finally {
                    setIsGenerating(false);
                    console.log('=== GENERATE REPORT FINISHED ===');
                  }
                })();
              }}
              disabled={isGenerating}
              className="px-4 py-2 bg-[#5b9eff]/20 hover:bg-[#5b9eff]/30 text-[#5b9eff] rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? 'Generating…' : 'Generate Report'}
            </motion.button>
            {generateError && <span className={`text-xs ${generateError.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{generateError}</span>}
          </div>
          
          {report ? (
            <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#5b9eff]/20">
                <div className="text-xs text-[#a9b1d6]">Total Listening</div>
                <div className="text-2xl font-bold text-white">{report.totals.totalListeningMinutes} min</div>
                <div className="text-xs text-[#7aa2f7]/60">Users: {report.totals.users}</div>
              </div>
              <div className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#10b981]/20">
                <div className="text-xs text-[#a9b1d6]">Avg per User</div>
                <div className="text-2xl font-bold text-white">{report.totals.avgListeningPerUser} min</div>
                <div className="text-xs text-[#7aa2f7]/60">Sessions: {report.totals.sessions}</div>
              </div>
              <div className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#f59e0b]/20">
                <div className="text-xs text-[#a9b1d6]">Positive Rate</div>
                <div className="text-2xl font-bold text-white">{report.totals.positiveRate}%</div>
                <div className="text-xs text-[#7aa2f7]/60">Survey: {report.totals.surveyResponses}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Top Questions</h3>
                <div className="space-y-3">
                  {report.feedback.topQuestions.map((q: any) => (
                    <div key={q.question} className="p-4 bg-[#1a1f35]/50 rounded-lg border border-[#5b9eff]/10">
                      <div className="text-sm text-white mb-1">{q.question}</div>
                      <div className="text-xs text-[#a9b1d6] flex justify-between">
                        <span>Responses: {q.totalResponses}</span>
                        <span>Top: {q.topAnswer.answer} ({q.topAnswer.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
                <div className="space-y-3">
                  {report.feedback.categories.map((c: any) => (
                    <div key={c.category} className="p-4 bg-[#1a1f35]/50 rounded-lg border border-[#5b9eff]/10 flex items-center justify-between">
                      <span className="text-sm text-white capitalize">{c.category.replace('_', ' ')}</span>
                      <span className="text-sm text-[#5b9eff] font-semibold">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#0a0e1a]/50 rounded-lg border border-[#7c3aed]/20">
              <div className="text-xs text-[#a9b1d6] mb-1">Model</div>
              <div className="text-sm text-white">{report.ml.model} ({report.ml.status})</div>
              <div className="text-sm text-[#7c3aed] font-bold mt-1">Engagement Score: {report.ml.engagementScore}</div>
              <div className="text-xs text-[#a9b1d6] mt-1">{report.ml.notes}</div>
            </div>
            </div>
          ) : (
            <div className="text-center text-[#a9b1d6] py-4">
              Click "Generate Report" to analyze neuroscience data with AI
            </div>
          )}
        </motion.div>

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
        </div>

        {/* Survey Analytics Section */}
        {dashboardData?.surveyAnalytics && (
          <motion.div
            className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 rounded-2xl p-6 border border-[#5b9eff]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#5b9eff]" />
              Neural Feedback Survey Analytics
            </h2>

            {/* Survey Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#5b9eff]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#a9b1d6]">Total Responses</span>
                  <FileText className="w-4 h-4 text-[#5b9eff]" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {dashboardData.surveyAnalytics.totalResponses.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#10b981]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#a9b1d6]">Avg Response Rate</span>
                  <Activity className="w-4 h-4 text-[#10b981]" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {dashboardData.surveyAnalytics.avgResponseRate}%
                </div>
              </div>

              <div className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#f59e0b]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#a9b1d6]">Categories Tracked</span>
                  <PieChart className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {dashboardData.surveyAnalytics.categoryBreakdown.length}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Response by Category</h3>
              <div className="space-y-3">
                {dashboardData.surveyAnalytics.categoryBreakdown.map((cat, index) => (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#5b9eff]/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white capitalize">
                        {cat.category.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#a9b1d6]">
                          {cat.responseCount} responses
                        </span>
                        <span className="text-sm font-semibold text-[#10b981]">
                          {cat.positiveRate}% positive
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-[#1a1f35] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#5b9eff] to-[#10b981]"
                        style={{ width: `${cat.positiveRate}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top Insights */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Key User Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.surveyAnalytics.topInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#7c3aed]/20"
                  >
                    <div className="text-xs text-[#a9b1d6] mb-2">{insight.question}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">
                        {insight.mostCommonAnswer}
                      </div>
                      <div className="text-lg font-bold text-[#7c3aed]">
                        {insight.percentage}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Neural Effectiveness Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Neural Effectiveness Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardData.surveyAnalytics.neuralEffectiveness.map((metric, index) => (
                  <motion.div
                    key={metric.metric}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#5b9eff]/20"
                  >
                    <div className="text-xs text-[#a9b1d6] mb-1">{metric.metric}</div>
                    <div className="flex items-end gap-2 mb-2">
                      <div className="text-2xl font-bold text-white">
                        {metric.avgScore.toFixed(1)}
                      </div>
                      <div className={`text-sm font-medium mb-1 ${
                        metric.trend === 'up' ? 'text-[#10b981]' : 
                        metric.trend === 'down' ? 'text-[#ef4444]' : 
                        'text-[#a9b1d6]'
                      }`}>
                        {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-[#1a1f35] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#5b9eff] to-[#7c3aed]"
                        style={{ width: `${(metric.avgScore / 10) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Per-Question Response Summary */}
            {dashboardData.surveyQuestionsSummary && dashboardData.surveyQuestionsSummary.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Question Response Counts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.surveyQuestionsSummary.slice(0, 10).map((q) => (
                    <div key={q.questionId} className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#5b9eff]/10">
                      <div className="text-xs text-[#7aa2f7]/60 mb-1">Q{q.questionId}</div>
                      <div className="text-sm font-medium text-white mb-2">{q.question}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#a9b1d6]">Responses</span>
                        <span className="text-sm font-bold text-[#5b9eff]">{q.totalResponses}</span>
                      </div>
                      <div className="mt-2 text-xs text-[#a9b1d6]">Top answer: <span className="text-white font-medium">{q.topAnswer.answer}</span> ({q.topAnswer.count})</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Button */}
            <div className="mt-6 flex justify-end">
              <motion.button
                className="py-3 px-6 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span>Export Survey Data</span>
              </motion.button>
            </div>
          </motion.div>
        )}

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
      <AIAssistant />
    </div>
  );
}
