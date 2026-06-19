import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, X, Loader2, Zap, Droplets, Train } from 'lucide-react';
import { logger } from '@/lib/logger';

interface ActivityDetail {
  description: string;
  carbon_kg: number;
  date: string;
  type: string;
}

interface Props {
  category: string | null;
  onClose: () => void;
}

export default function AnalyticsDetailsModal({ category, onClose }: Props) {
  const [details, setDetails] = useState<ActivityDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) {
      setDetails([]);
      return;
    }

    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/details?category=${encodeURIComponent(category!)}`);
        const json = await res.json();
        if (json.success) {
          setDetails(json.data);
        }
      } catch (err: any) {
        logger.error('Failed to fetch details', { error: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [category]);

  if (!category) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'transportation': return <Train className="w-5 h-5 text-brand-400" />;
      case 'energy': return <Zap className="w-5 h-5 text-purple-400" />;
      case 'food': return <Droplets className="w-5 h-5 text-sky-400" />;
      default: return <Activity className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-2xl p-6 relative border border-surface-border/50 max-h-[90vh] flex flex-col"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-surface-tertiary border border-surface-border flex items-center justify-center flex-shrink-0 shadow-lg">
            {getCategoryIcon(category)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 capitalize">
              {category} Details
            </h2>
            <p className="text-sm text-text-muted mt-0.5">Recent activities and impact in this category</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-brand-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">Loading data...</span>
            </div>
          ) : details.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-text-muted text-sm">
              No recent activities found for this category.
            </div>
          ) : (
            <div className="space-y-3">
              {details.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface-tertiary border border-surface-border/50 flex justify-between items-center group hover:border-surface-border transition-colors">
                  <div className="flex flex-col">
                    <span className="font-medium text-text-primary">{item.description}</span>
                    <span className="text-xs text-text-muted mt-1">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className={`font-semibold tabular-nums ${item.carbon_kg < 0 ? 'text-brand-400' : 'text-red-400'}`}>
                    {item.carbon_kg > 0 ? '+' : ''}{item.carbon_kg} kg
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
