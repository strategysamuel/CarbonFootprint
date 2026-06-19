import { motion } from 'framer-motion';
import { Info, Zap, Activity, Target, Users } from 'lucide-react';

export default function EcoScoreModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-lg p-6 relative border border-surface-border/50 max-h-[90vh] overflow-y-auto hide-scrollbar"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">✕</button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-brand-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
            <span className="text-2xl text-white font-bold">60</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              Eco Score Breakdown
            </h2>
            <p className="text-sm text-text-muted mt-0.5">How your score of 60/100 is calculated</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-surface-tertiary/50 border border-brand-500/20">
            <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-400" />
              Calculation Matrix
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Your Eco Score is dynamically calculated based on four key pillars of sustainable living. You need 100 points to reach the perfect score.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2 text-text-primary">
                  <Activity className="w-4 h-4 text-emerald-400" /> Tracked Activities (40%)
                </span>
                <span className="text-sm font-semibold text-emerald-400">25 / 40 pts</span>
              </div>
              <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                <div className="h-full w-[62%] rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              </div>
              <p className="text-xs text-text-muted">Based on your daily low-carbon choices and logged savings.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2 text-text-primary">
                  <Target className="w-4 h-4 text-blue-400" /> Goal Completion (30%)
                </span>
                <span className="text-sm font-semibold text-blue-400">20 / 30 pts</span>
              </div>
              <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                <div className="h-full w-[66%] rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
              </div>
              <p className="text-xs text-text-muted">Your progress towards active reduction goals.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2 text-text-primary">
                  <Zap className="w-4 h-4 text-amber-400" /> Consistency Streak (20%)
                </span>
                <span className="text-sm font-semibold text-amber-400">10 / 20 pts</span>
              </div>
              <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                <div className="h-full w-[50%] rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
              </div>
              <p className="text-xs text-text-muted">Maintained by logging activities for consecutive days.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2 text-text-primary">
                  <Users className="w-4 h-4 text-purple-400" /> Community Impact (10%)
                </span>
                <span className="text-sm font-semibold text-purple-400">5 / 10 pts</span>
              </div>
              <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                <div className="h-full w-[50%] rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
              </div>
              <p className="text-xs text-text-muted">Earned through team participation and challenges.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
