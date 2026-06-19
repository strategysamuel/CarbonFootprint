'use client';

import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import {
  TrendingDown,
  TrendingUp,
  Flame,
  Target,
  Activity,
  Bot,
  Leaf,
  Car,
  Zap,
  Utensils,
  Trash2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatCarbon } from '@/lib/utils';

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const weeklyData = [
  { day: 'Mon', emissions: 4.2, saved: 1.1 },
  { day: 'Tue', emissions: 3.8, saved: 1.4 },
  { day: 'Wed', emissions: 5.1, saved: 0.9 },
  { day: 'Thu', emissions: 2.9, saved: 2.2 },
  { day: 'Fri', emissions: 6.3, saved: 0.5 },
  { day: 'Sat', emissions: 3.5, saved: 1.8 },
  { day: 'Sun', emissions: 2.1, saved: 2.5 },
];

const categoryData = [
  { name: 'Transport', value: 38, color: '#14b47c' },
  { name: 'Food',      value: 28, color: '#0ea5e9' },
  { name: 'Energy',    value: 22, color: '#a855f7' },
  { name: 'Waste',     value: 12, color: '#f59e0b' },
];

const recentActivities = [
  { icon: Car,      label: 'Car trip — 45km',        carbon: 8.2,  type: 'emit',  time: '2h ago'   },
  { icon: Utensils, label: 'Plant-based meal',        carbon: -1.8, type: 'save',  time: '5h ago'   },
  { icon: Zap,      label: 'Home electricity',        carbon: 3.1,  type: 'emit',  time: 'Yesterday' },
  { icon: Trash2,   label: 'Recycled household waste', carbon: -0.9, type: 'save', time: 'Yesterday' },
];

const goals = [
  { label: 'Transport reduction',  progress: 65, target: '↓20% by Aug' },
  { label: 'Plant-based meals',    progress: 40, target: '3x/week'     },
  { label: 'Energy saving',        progress: 82, target: '↓15% by Jul' },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  gradient,
}: {
  title:     string;
  value:     string;
  subtitle:  string;
  trend?:    { value: number; label: string };
  icon:      React.ElementType;
  gradient:  string;
}) {
  const isPositiveTrend = (trend?.value ?? 0) < 0;

  return (
    <motion.div
      className="glass-card p-6 space-y-4"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient}`}>
          <Icon className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositiveTrend ? 'text-brand-400' : 'text-red-400'}`}>
            {isPositiveTrend ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-bold font-display text-text-primary">{value}</div>
        <div className="text-sm text-text-muted mt-0.5">{title}</div>
      </div>

      <div className="text-xs text-text-muted">{subtitle}</div>
    </motion.div>
  );
}

// ─── Dashboard Overview Page ──────────────────────────────────────────────────

export default function DashboardPage() {
  const user    = useAuthStore((s) => s.user);

  const displayName = user?.displayName?.split(' ')[0] ?? 'there';
  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const stats = [
    {
      title:    'Carbon Score',
      value:    '72',
      subtitle: 'Global average: 44 — You\'re above!',
      trend:    { value: -8, label: 'vs last week' },
      icon:     Leaf,
      gradient: 'from-brand-500/80 to-brand-700/50',
    },
    {
      title:    'CO₂ This Week',
      value:    '28.0kg',
      subtitle: 'Target: 25kg/week',
      trend:    { value: 12, label: 'vs last week' },
      icon:     Activity,
      gradient: 'from-accent-500/80 to-accent-700/50',
    },
    {
      title:    'Active Streak',
      value:    '7 days',
      subtitle: 'Personal best: 14 days',
      icon:     Flame,
      gradient: 'from-amber-500/80 to-orange-700/50',
    },
    {
      title:    'Goals Active',
      value:    '3',
      subtitle: '1 near completion',
      trend:    { value: -5, label: 'progress' },
      icon:     Target,
      gradient: 'from-purple-500/80 to-purple-700/50',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        className="space-y-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold font-display text-text-primary">
          {greeting}, {displayName}! 🌿
        </h1>
        <p className="text-text-muted text-sm">
          Here&apos;s your carbon footprint overview. You&apos;re making a difference.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Trend — spans 2 cols */}
        <motion.div
          className="glass-card p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-text-primary">Weekly Carbon Trend</h2>
              <p className="text-xs text-text-muted mt-0.5">Emissions vs savings this week</p>
            </div>
            <div className="flex gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Emitted</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-400 inline-block" />Saved</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="emissionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="savedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#14b47c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b47c" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#5a8a72" tick={{ fontSize: 12 }} />
              <YAxis stroke="#5a8a72" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}kg`} />
              <Tooltip
                contentStyle={{
                  background:   '#0d1f16',
                  border:       '1px solid rgba(20,180,124,0.3)',
                  borderRadius: '12px',
                  color:        '#e2f5ed',
                  fontSize:     '12px',
                }}
                formatter={(v: number) => [`${v}kg CO₂e`]}
              />
              <Area type="monotone" dataKey="emissions" stroke="#ef4444" fill="url(#emissionsGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="saved"     stroke="#14b47c" fill="url(#savedGrad)"     strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="font-semibold text-text-primary mb-6">Emissions by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                formatter={(value) => <span style={{ color: '#a7c9b8', fontSize: '12px' }}>{value}</span>}
              />
              <Tooltip
                contentStyle={{ background: '#0d1f16', border: '1px solid rgba(20,180,124,0.3)', borderRadius: '12px', color: '#e2f5ed', fontSize: '12px' }}
                formatter={(v: number) => [`${v}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          className="glass-card p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Recent Activities</h2>
            <a href="/dashboard/activities" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all →</a>
          </div>
          <ul className="space-y-3" aria-label="Recent carbon activities">
            {recentActivities.map(({ icon: Icon, label, carbon, type, time }) => (
              <li key={label} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-tertiary transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'save' ? 'bg-brand-950' : 'bg-red-950'}`}>
                  <Icon className={`w-5 h-5 ${type === 'save' ? 'text-brand-400' : 'text-red-400'}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{label}</div>
                  <div className="text-xs text-text-muted">{time}</div>
                </div>
                <div className={`text-sm font-semibold tabular-nums ${carbon < 0 ? 'text-brand-400' : 'text-red-400'}`}>
                  {carbon < 0 ? '' : '+'}{formatCarbon(carbon)}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Goals + AI Insight */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          {/* Goals Progress */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-text-primary">Goal Progress</h2>
              <a href="/dashboard/goals" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">All goals →</a>
            </div>
            <ul className="space-y-4">
              {goals.map(({ label, progress, target }) => (
                <li key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-text-secondary font-medium truncate">{label}</span>
                    <span className="text-brand-400 font-semibold ml-2 flex-shrink-0">{progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-brand-gradient"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      role="progressbar"
                      aria-label={label}
                    />
                  </div>
                  <div className="text-xs text-text-muted mt-1">{target}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Insight */}
          <div className="glass-card p-5 border border-brand-500/20" style={{ background: 'linear-gradient(135deg, rgba(20,180,124,0.08) 0%, rgba(14,165,233,0.04) 100%)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-brand-400" aria-hidden="true" />
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-wide">AI Insight</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              🌱 Your Friday car emissions spike 45% above your weekly average. Trying public transport or carpooling on Fridays could save up to <strong className="text-brand-400">2.8kg CO₂e</strong>/week.
            </p>
            <a 
              href={`/dashboard/ai-coach?prompt=${encodeURIComponent('How can I save 2.8kg CO2e/week by trying public transport or carpooling on Fridays?')}`}
              className="mt-3 inline-block text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              Show me how →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
