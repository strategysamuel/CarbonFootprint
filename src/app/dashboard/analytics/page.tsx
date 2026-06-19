'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { logger } from '@/lib/logger';
import { Activity, Droplets, Zap, Train } from 'lucide-react';
import AnalyticsDetailsModal from '@/components/dashboard/AnalyticsDetailsModal';

interface TrendData {
  category: string;
  total_carbon: number;
  activity_count: number;
}

export default function AnalyticsPage() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMocked, setIsMocked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrends() {
      try {
        const res = await fetch('/api/analytics/trends');
        const json = await res.json();
        if (json.success) {
          setTrends(json.data);
          setIsMocked(json.mocked || false);
        }
      } catch (err: any) {
        logger.error('Failed to fetch trends', { error: err.message });
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, []);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'transportation': return <Train className="w-5 h-5 text-brand-400" />;
      case 'energy': return <Zap className="w-5 h-5 text-purple-400" />;
      case 'food': return <Droplets className="w-5 h-5 text-sky-400" />;
      default: return <Activity className="w-5 h-5 text-amber-400" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading analytics...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Global Analytics</h1>
        <p className="text-slate-400 mt-2">
          Discover how the community is making an impact together.
          {isMocked && <span className="ml-2 text-amber-500 text-sm">(Showing Demo Data)</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl p-6 border border-slate-800 bg-slate-900/50 backdrop-blur">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-100">
            <Activity className="w-5 h-5 text-brand-500" />
            Impact by Category
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="category" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Bar 
                  dataKey="total_carbon" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  name="CO2 Saved (kg)" 
                  onClick={(data) => {
                    if (data && data.category) {
                      setSelectedCategory(data.category);
                    }
                  }}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-6 text-slate-100">Category Breakdown</h2>
          {trends.map(t => (
            <div 
              key={t.category} 
              className="rounded-xl p-4 border border-slate-800 bg-slate-900/50 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
              onClick={() => setSelectedCategory(t.category)}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-slate-800">
                  {getCategoryIcon(t.category)}
                </div>
                <div>
                  <p className="font-medium capitalize text-slate-200">{t.category}</p>
                  <p className="text-sm text-slate-400">{t.activity_count} activities logged</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand-400">{Math.abs(t.total_carbon).toFixed(1)} kg</p>
                <p className="text-xs text-slate-500">CO2 Saved</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnalyticsDetailsModal category={selectedCategory} onClose={() => setSelectedCategory(null)} />
    </div>
  );
}
