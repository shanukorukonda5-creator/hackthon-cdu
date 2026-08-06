import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import Badge from '../components/ui/Badge';
import { useNotifications } from '../context/NotificationContext';
import {
  FiCheckCircle,
  FiFileText,
  FiCpu,
  FiEye,
  FiUploadCloud,
  FiGlobe,
  FiVolume2,
  FiMessageSquare,
  FiArrowRight,
  FiZap,
} from 'react-icons/fi';

const quickActions = [
  { label: 'Upload Document', path: '/upload', icon: FiUploadCloud, color: 'text-indigo-400' },
  { label: 'Scan Website', path: '/accessibility', icon: FiEye, color: 'text-emerald-400' },
  { label: 'Translate Text', path: '/translation', icon: FiGlobe, color: 'text-purple-400' },
  { label: 'Voice Reader', path: '/voice', icon: FiVolume2, color: 'text-amber-400' },
  { label: 'Start AI Chat', path: '/ai', icon: FiMessageSquare, color: 'text-rose-400' },
  { label: 'Accessibility Audit', path: '/accessibility', icon: FiCheckCircle, color: 'text-teal-400' },
];

const dummyRecentDocs = [
  { title: 'Annual_Accessibility_Report_2026.pdf', size: '2.4 MB', date: '10 mins ago', score: 96 },
  { title: 'Product_Design_Guidelines_v3.png', size: '1.1 MB', date: '1 hour ago', score: 88 },
  { title: 'Customer_Onboarding_Manual.txt', size: '450 KB', date: '3 hours ago', score: 92 },
];

const dummyRecentAi = [
  { prompt: 'Summarize WCAG 2.1 AA Contrast Ratios', model: 'Gemini-1.5-Flash', time: '15 mins ago' },
  { prompt: 'Generate Alt Text for Hero Banner Image', model: 'Gemini-1.5-Flash', time: '2 hours ago' },
  { prompt: 'Check ARIA Landmark structure for Navigation', model: 'Gemini-1.5-Pro', time: '5 hours ago' },
];

const DashboardPage = () => {
  const { addToast } = useNotifications();

  return (
    <div className="space-y-8">
      {/* Welcome Banner Card */}
      <GlassCard className="relative overflow-hidden p-8 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <FiZap />
            <span>Universal AI & Accessibility Hub</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Welcome to <span className="text-indigo-400">ascess-1-ai</span>
          </h1>

          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Your centralized intelligence suite for automated WCAG auditing, OCR document processing, voice synthesis, multi-language translation, and Google Gemini AI insights.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/upload">
              <GlassButton variant="primary" size="md">
                Upload New File <FiArrowRight className="ml-2" />
              </GlassButton>
            </Link>
            <Link to="/accessibility">
              <GlassButton variant="secondary" size="md">
                Run Website Audit
              </GlassButton>
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Accessibility Score"
          value="94 / 100"
          trend="+5% improvement"
          icon={FiCheckCircle}
          color="emerald"
        />
        <StatCard
          title="Total Documents"
          value="18 Files"
          trend="3 added today"
          icon={FiFileText}
          color="indigo"
        />
        <StatCard
          title="AI Prompts Run"
          value="142 Queries"
          trend="Active"
          icon={FiCpu}
          color="amber"
        />
        <StatCard
          title="Languages Used"
          value="6 Languages"
          trend="Multilingual"
          icon={FiGlobe}
          color="rose"
        />
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-200 mb-4">Quick Action Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link key={idx} to={action.path}>
                <GlassCard className="flex flex-col items-center text-center p-4 hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
                  <div className={`p-3 rounded-xl bg-slate-900/80 border border-white/10 ${action.color} text-xl mb-2`}>
                    <Icon />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{action.label}</span>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Activity & Recent Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Dummy Chart Visualization */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-200">Weekly Scan & Process Activity</h3>
            <Badge variant="info">Live Metrics</Badge>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-4 border-b border-white/10 pb-4">
            {[
              { day: 'Mon', count: 40 },
              { day: 'Tue', count: 65 },
              { day: 'Wed', count: 85 },
              { day: 'Thu', count: 50 },
              { day: 'Fri', count: 95 },
              { day: 'Sat', count: 30 },
              { day: 'Sun', count: 70 },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  style={{ height: `${bar.count}%` }}
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg group-hover:from-indigo-500 group-hover:to-purple-400 transition-all duration-300 relative shadow-lg shadow-indigo-500/20"
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white bg-slate-900 px-1.5 py-0.5 rounded border border-white/10 transition-opacity">
                    {bar.count}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{bar.day}</span>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start space-x-3 text-xs text-indigo-300">
            <FiZap className="text-lg flex-shrink-0 mt-0.5" />
            <p>
              <strong>Accessibility Tip:</strong> Ensure all interactive buttons have explicit <code>aria-label</code> text for screen readers.
            </p>
          </div>
        </GlassCard>

        {/* Recent AI Prompts List */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-200">Recent AI Activity</h3>
            <Link to="/ai" className="text-xs text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {dummyRecentAi.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
                <p className="text-xs font-semibold text-slate-200 line-clamp-1">{item.prompt}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{item.model}</span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Feature Overview Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-3">
            <FiCheckCircle />
          </div>
          <h4 className="text-sm font-bold text-slate-100 mb-1">Automated WCAG Auditing</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time contrast calculations, ARIA landmark checks, and automated compliance reporting.
          </p>
        </GlassCard>

        <GlassCard>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl mb-3">
            <FiCpu />
          </div>
          <h4 className="text-sm font-bold text-slate-100 mb-1">Google Gemini Intelligence</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multimodal reasoning, text summarization, and accessibility improvement suggestions.
          </p>
        </GlassCard>

        <GlassCard>
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl mb-3">
            <FiVolume2 />
          </div>
          <h4 className="text-sm font-bold text-slate-100 mb-1">Voice & Text-To-Speech</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            High quality Web Speech API voice reader controls with custom playback speeds.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardPage;
