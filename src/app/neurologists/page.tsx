'use client';

import { motion } from 'framer-motion';
import { Brain, Users, BarChart3, FileText, Crown } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WaveRecommendation from '@/components/WaveRecommendation';
import AIAssistant from '@/components/AIAssistant';
import PWAInstaller from '@/components/PWAInstaller';
import { useEffect, useState } from 'react';

export default function NeuroscientistsPage() {
  const [metrics, setMetrics] = useState<{
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    avgSessionDuration: number;
  } | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await fetch('/api/dashboard/neuroscientist?timeRange=7d', {
          headers: { Authorization: 'Bearer demo' },
        });
        const data = await res.json();
        setMetrics({
          totalUsers: data.totalUsers ?? 0,
          activeUsers: data.activeUsers ?? 0,
          totalSessions: data.totalSessions ?? 0,
          avgSessionDuration: data.avgSessionDuration ?? 0,
        });
      } catch (e) {
        console.warn('Failed to load neuroscientist metrics', e);
      }
    };
    loadMetrics();
  }, []);
  const features = [
    {
      icon: Brain,
      title: 'Research-Based Track Catalog',
      description: 'Access our complete library of scientifically-validated binaural beat frequencies, organized by therapeutic application.',
    },
    {
      icon: Users,
      title: 'Patient Monitoring Dashboard',
      description: 'Track multiple patient sessions, adherence rates, and progress over time (mockup for demonstration).',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'View detailed session analytics, frequency patterns, and therapeutic outcomes for evidence-based adjustments.',
    },
    {
      icon: FileText,
      title: 'Exportable Reports',
      description: 'Generate comprehensive treatment reports for patient records and research documentation.',
    },
  ];

  const mockPatients = [
    { id: 'P001', name: 'Patient A', sessions: 24, compliance: 92, lastSession: '2 hours ago' },
    { id: 'P002', name: 'Patient B', sessions: 18, compliance: 85, lastSession: '1 day ago' },
    { id: 'P003', name: 'Patient C', sessions: 31, compliance: 97, lastSession: '3 hours ago' },
    { id: 'P004', name: 'Patient D', sessions: 12, compliance: 78, lastSession: '2 days ago' },
  ];

  const trackCategories = [
    { name: 'Attention Deficit', tracks: 8, frequency: '13-30 Hz (Beta)', usage: 234 },
    { name: 'Anxiety Management', tracks: 12, frequency: '8-12 Hz (Alpha)', usage: 487 },
    { name: 'Sleep Disorders', tracks: 6, frequency: '0.5-4 Hz (Delta)', usage: 356 },
    { name: 'Cognitive Enhancement', tracks: 15, frequency: '4-8 Hz (Theta)', usage: 421 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full mb-6">
            <Crown className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-[#7c3aed] text-sm font-medium">Professional Clinical Tools</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] bg-clip-text text-transparent">
              Harmony Clinical
            </span>
          </h1>
          <p className="text-xl text-[#7aa2f7]/80 max-w-3xl mx-auto mb-4">
            Advanced neurological tools for evidence-based brainwave therapy and patient monitoring
          </p>
          <p className="text-sm text-[#7aa2f7]/60 mb-8">
            Trusted by neuroscientists, therapists, and clinical researchers
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/pricing">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] text-white rounded-xl font-semibold shadow-lg shadow-[#5b9eff]/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upgrade to Clinical
              </motion.button>
            </Link>
            <motion.button
              className="px-8 py-4 bg-[#2a3254] border border-[#5b9eff]/30 text-[#7aa2f7] rounded-xl font-semibold hover:bg-[#3a4264] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-[#1e2642]/50 border border-[#5b9eff]/20 rounded-xl hover:bg-[#1e2642] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-[#5b9eff]/20 to-[#7c3aed]/20 rounded-lg">
                  <feature.icon className="w-6 h-6 text-[#5b9eff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-[#a9b1d6] text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Clinical Dashboard Preview
          </h2>

          {/* Live Metrics from Neuroscience Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-6 bg-[#1e2642]/50 border border-[#5b9eff]/20 rounded-xl">
              <div className="text-sm text-[#7aa2f7] mb-1">Total Users</div>
              <div className="text-3xl font-bold text-white">{metrics ? metrics.totalUsers : '—'}</div>
              <div className="text-xs text-[#7aa2f7]/60">Registered users</div>
            </div>
            <div className="p-6 bg-[#1e2642]/50 border border-[#5b9eff]/20 rounded-xl">
              <div className="text-sm text-[#7aa2f7] mb-1">Active Users</div>
              <div className="text-3xl font-bold text-white">{metrics ? metrics.activeUsers : '—'}</div>
              <div className="text-xs text-[#7aa2f7]/60">Active in selected range</div>
            </div>
            <div className="p-6 bg-[#1e2642]/50 border border-[#5b9eff]/20 rounded-xl">
              <div className="text-sm text-[#7aa2f7] mb-1">Total Sessions</div>
              <div className="text-3xl font-bold text-white">{metrics ? metrics.totalSessions : '—'}</div>
              <div className="text-xs text-[#7aa2f7]/60">All sessions in range</div>
            </div>
            <div className="p-6 bg-[#1e2642]/50 border border-[#5b9eff]/20 rounded-xl">
              <div className="text-sm text-[#7aa2f7] mb-1">Avg Session</div>
              <div className="text-3xl font-bold text-white">{metrics ? `${metrics.avgSessionDuration}m` : '—'}</div>
              <div className="text-xs text-[#7aa2f7]/60">Average duration</div>
            </div>
          </div>

          {/* Patient Monitoring Table */}
          <div className="bg-[#1e2642]/50 border border-[#5b9eff]/20 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#5b9eff]" />
                Patient Overview
              </h3>
              <div className="text-sm text-[#7aa2f7]/60">
                Mockup - Demo Data Only
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5b9eff]/20">
                    <th className="text-left py-3 px-4 text-[#7aa2f7] font-medium text-sm">Patient ID</th>
                    <th className="text-left py-3 px-4 text-[#7aa2f7] font-medium text-sm">Name</th>
                    <th className="text-left py-3 px-4 text-[#7aa2f7] font-medium text-sm">Sessions</th>
                    <th className="text-left py-3 px-4 text-[#7aa2f7] font-medium text-sm">Compliance</th>
                    <th className="text-left py-3 px-4 text-[#7aa2f7] font-medium text-sm">Last Session</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPatients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="border-b border-[#5b9eff]/10 hover:bg-[#2a3254]/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-[#5b9eff] font-mono text-sm">{patient.id}</td>
                      <td className="py-4 px-4 text-white">{patient.name}</td>
                      <td className="py-4 px-4 text-[#a9b1d6]">{patient.sessions}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-[#2a3254] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#5b9eff] to-[#34d399]"
                              style={{ width: `${patient.compliance}%` }}
                            />
                          </div>
                          <span className="text-[#34d399] text-sm font-medium">{patient.compliance}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#a9b1d6] text-sm">{patient.lastSession}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Track Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1e2642]/50 border border-[#5b9eff]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-[#5b9eff]" />
                Therapeutic Categories
              </h3>
              <div className="space-y-4">
                {trackCategories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 bg-[#2a3254]/30 rounded-lg hover:bg-[#2a3254]/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{category.name}</h4>
                      <span className="text-xs text-[#7aa2f7] bg-[#5b9eff]/10 px-2 py-1 rounded">
                        {category.tracks} tracks
                      </span>
                    </div>
                    <p className="text-sm text-[#a9b1d6] mb-2">{category.frequency}</p>
                    <div className="text-xs text-[#7aa2f7]/60">
                      {category.usage} clinical uses
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-[#1e2642]/50 border border-[#5b9eff]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-[#5b9eff]" />
                Usage Analytics
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-[#5b9eff] mb-2">1,498</div>
                  <div className="text-sm text-[#a9b1d6]">Total clinical sessions this month</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#7c3aed] mb-2">89%</div>
                  <div className="text-sm text-[#a9b1d6]">Average patient compliance rate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#34d399] mb-2">4.8/5</div>
                  <div className="text-sm text-[#a9b1d6]">Therapeutic effectiveness rating</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-[#5b9eff]/10 to-[#7c3aed]/10 border border-[#5b9eff]/30 rounded-2xl p-8 md:p-12 text-center"
        >
          <Crown className="w-12 h-12 text-[#7c3aed] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Elevate Your Practice?
          </h2>
          <p className="text-[#a9b1d6] mb-8 max-w-2xl mx-auto">
            Join leading neuroscientists and therapists using Harmony Clinical for evidence-based brainwave therapy.
            Start your 14-day trial with full access to all professional features.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/pricing">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] text-white rounded-xl font-semibold shadow-lg shadow-[#5b9eff]/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Pricing
              </motion.button>
            </Link>
          </div>
          <p className="text-sm text-[#7aa2f7]/60 mt-6">
            ₹399/month • No credit card required for trial • Cancel anytime
          </p>
        </motion.div>
      </div>

      <Footer />
      {/* Only show one floating button on mobile to prevent overlap */}
      {/* On mobile, show AIAssistant; on desktop, show both */}
      <AIAssistant />
      <PWAInstaller />
      <div className="hidden sm:block">
        <WaveRecommendation />
      </div>
    </div>
  );
}
