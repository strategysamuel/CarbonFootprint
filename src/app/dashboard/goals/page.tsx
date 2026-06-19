'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Target,
  CheckCircle2,
  PauseCircle,
  XCircle,
  MoreHorizontal,
  Calendar,
  Pencil,
} from 'lucide-react';
import { differenceInDays, addMonths } from 'date-fns';
import { formatDate, formatCarbon, cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Goal, CarbonCategory, GoalStatus } from '@/types';

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_GOALS: Goal[] = [
  {
    id: '1', userId: 'demo', category: 'transportation',
    title: 'Reduce commute emissions',
    description: 'Switch to public transport twice a week.',
    targetReduction: 20, currentProgress: 13,
    status: 'active',
    startDate: new Date(Date.now() - 15 * 86400000),
    endDate:   addMonths(new Date(), 1),
    createdAt: new Date(Date.now() - 15 * 86400000),
    updatedAt: new Date(),
  },
  {
    id: '2', userId: 'demo', category: 'food',
    title: 'Plant-based meals ×3/week',
    description: 'Eat plant-based at least three times a week.',
    targetReduction: 8, currentProgress: 3.2,
    status: 'active',
    startDate: new Date(Date.now() - 30 * 86400000),
    endDate:   addMonths(new Date(), 2),
    createdAt: new Date(Date.now() - 30 * 86400000),
    updatedAt: new Date(),
  },
  {
    id: '3', userId: 'demo', category: 'energy',
    title: 'Cut home electricity 15%',
    description: 'Use smart plugs and switch to LED throughout.',
    targetReduction: 15, currentProgress: 12.3,
    status: 'active',
    startDate: new Date(Date.now() - 45 * 86400000),
    endDate:   addMonths(new Date(), 0),
    createdAt: new Date(Date.now() - 45 * 86400000),
    updatedAt: new Date(),
  },
  {
    id: '4', userId: 'demo', category: 'waste',
    title: 'Zero-waste grocery month',
    description: 'Only buy unpackaged or recyclable-packaged groceries.',
    targetReduction: 5, currentProgress: 5,
    status: 'completed',
    startDate: new Date(Date.now() - 60 * 86400000),
    endDate:   new Date(Date.now() - 30 * 86400000),
    createdAt: new Date(Date.now() - 60 * 86400000),
    updatedAt: new Date(),
  },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const goalSchema = z.object({
  title:           z.string().min(3, 'Title must be at least 3 characters'),
  description:     z.string().min(5, 'Add a short description'),
  category:        z.enum(['transportation', 'food', 'energy', 'waste'] as const),
  targetReduction: z.coerce.number().positive('Must be a positive number'),
  months:          z.coerce.number().int().min(1).max(24),
});

type GoalForm = z.infer<typeof goalSchema>;

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  GoalStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  active:    { label: 'Active',    icon: Target,       color: 'text-brand-400'  },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-green-400'  },
  paused:    { label: 'Paused',    icon: PauseCircle,  color: 'text-amber-400'  },
  failed:    { label: 'Failed',    icon: XCircle,      color: 'text-red-400'    },
};

// ─── Create Goal Modal ────────────────────────────────────────────────────────

function CreateGoalModal({
  open,
  onClose,
  onCreate,
}: {
  open:     boolean;
  onClose:  () => void;
  onCreate: (goal: Goal) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: { months: 1, targetReduction: 10 },
  });

  function onSubmit(data: GoalForm) {
    const now = new Date();
    const goal: Goal = {
      id:              Date.now().toString(),
      userId:          'demo',
      category:        data.category,
      title:           data.title,
      description:     data.description,
      targetReduction: data.targetReduction,
      currentProgress: 0,
      status:          'active',
      startDate:       now,
      endDate:         addMonths(now, data.months),
      createdAt:       now,
      updatedAt:       now,
    };
    onCreate(goal);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Goal"
      description="Set a new carbon reduction target with a science-backed milestone."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Category <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['transportation', 'food', 'energy', 'waste'] as CarbonCategory[]).map((cat) => (
              <label key={cat} className="cursor-pointer">
                <input type="radio" value={cat} {...register('category')} className="sr-only peer" />
                <div className="peer-checked:ring-2 peer-checked:ring-brand-500 rounded-xl border border-surface-border
                                p-3 flex items-center gap-2 hover:bg-surface-tertiary transition-colors">
                  <CategoryBadge category={cat} showLabel={true} size="sm" />
                </div>
              </label>
            ))}
          </div>
          {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Goal title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Reduce commute emissions"
            {...register('title')}
            className="w-full rounded-xl border border-surface-border bg-surface-secondary text-text-primary
                       px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-text-muted"
          />
          {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="How will you achieve this?"
            {...register('description')}
            className="w-full rounded-xl border border-surface-border bg-surface-secondary text-text-primary
                       px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500
                       placeholder:text-text-muted resize-none"
          />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
        </div>

        {/* Target + months */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Target reduction (kg/month)
            </label>
            <input
              type="number"
              step="0.5"
              {...register('targetReduction')}
              className="w-full rounded-xl border border-surface-border bg-surface-secondary text-text-primary
                         px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.targetReduction && <p className="text-xs text-red-400 mt-1">{errors.targetReduction.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Timeframe (months)
            </label>
            <input
              type="number"
              min="1"
              max="24"
              {...register('months')}
              className="w-full rounded-xl border border-surface-border bg-surface-secondary text-text-primary
                         px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.months && <p className="text-xs text-red-400 mt-1">{errors.months.message}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 text-sm py-2.5">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-brand flex-1 text-sm py-2.5">
            {isSubmitting ? 'Creating…' : 'Create Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({
  goal,
  onStatusChange,
  onDelete,
}: {
  goal:           Goal;
  onStatusChange: (id: string, status: GoalStatus) => void;
  onDelete:       (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const progress  = Math.min(100, Math.round((goal.currentProgress / goal.targetReduction) * 100));
  const daysLeft  = differenceInDays(goal.endDate, new Date());
  const statusCfg = STATUS_CONFIG[goal.status];
  const StatusIcon = statusCfg.icon;

  const ringColor =
    goal.status === 'completed' ? '#22c55e' :
    goal.status === 'failed'    ? '#ef4444' :
    goal.status === 'paused'    ? '#f59e0b' :
    '#14b47c';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, scale: 0.95 }}
      className="glass-card p-6"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <CategoryBadge category={goal.category} size="sm" />
            <span className={cn('flex items-center gap-1 text-xs font-medium', statusCfg.color)}>
              <StatusIcon className="w-3 h-3" aria-hidden="true" />
              {statusCfg.label}
            </span>
          </div>
          <h2 className="font-semibold text-text-primary truncate">{goal.title}</h2>
          <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{goal.description}</p>
        </div>

        {/* Progress ring */}
        <ProgressRing value={progress} size={72} strokeWidth={5} color={ringColor} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="glass-card p-2.5 text-center" style={{ background: 'rgba(20,180,124,0.04)' }}>
          <div className="text-sm font-bold text-brand-400 tabular-nums">
            {formatCarbon(goal.currentProgress)}
          </div>
          <div className="text-[10px] text-text-muted">Saved</div>
        </div>
        <div className="glass-card p-2.5 text-center" style={{ background: 'rgba(20,180,124,0.04)' }}>
          <div className="text-sm font-bold text-text-primary tabular-nums">
            {formatCarbon(goal.targetReduction)}
          </div>
          <div className="text-[10px] text-text-muted">Target</div>
        </div>
        <div className="glass-card p-2.5 text-center" style={{ background: 'rgba(20,180,124,0.04)' }}>
          <div className={cn('text-sm font-bold tabular-nums', daysLeft < 7 ? 'text-red-400' : 'text-text-primary')}>
            {daysLeft > 0 ? `${daysLeft}d` : 'Ended'}
          </div>
          <div className="text-[10px] text-text-muted">Remaining</div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
        <Calendar className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        {formatDate(goal.startDate)} → {formatDate(goal.endDate)}
      </div>

      {/* Actions */}
      {goal.status === 'active' && (
        <div className="flex gap-2 relative">
          <button
            onClick={() => onStatusChange(goal.id, 'paused')}
            className="btn-ghost flex-1 text-xs py-2"
          >
            <PauseCircle className="w-3.5 h-3.5" /> Pause
          </button>
          <button
            onClick={() => onStatusChange(goal.id, 'completed')}
            className="btn-brand flex-1 text-xs py-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Complete
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl border border-surface-border text-text-muted
                       hover:text-text-primary hover:bg-surface-tertiary transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 bottom-full mb-2 w-40 glass-card py-1 z-10 shadow-xl"
              style={{ borderColor: 'rgba(20,180,124,0.2)' }}
            >
              <button
                onClick={() => { onDelete(goal.id); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/30 transition-colors"
              >
                Delete goal
              </button>
            </div>
          )}
        </div>
      )}

      {goal.status === 'paused' && (
        <button
          onClick={() => onStatusChange(goal.id, 'active')}
          className="btn-ghost w-full text-xs py-2"
        >
          <Pencil className="w-3.5 h-3.5" /> Resume Goal
        </button>
      )}
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      className="glass-card p-16 text-center space-y-4 col-span-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-5xl">🎯</div>
      <h2 className="font-semibold text-text-primary">No goals yet</h2>
      <p className="text-text-muted text-sm max-w-xs mx-auto">
        Create your first carbon reduction goal with science-backed milestones and track your progress over time.
      </p>
      <button onClick={onCreate} className="btn-brand text-sm">
        <Plus className="w-4 h-4" /> Create First Goal
      </button>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_FILTERS: { value: 'all' | GoalStatus; label: string }[] = [
  { value: 'all',       label: 'All'       },
  { value: 'active',    label: 'Active'    },
  { value: 'completed', label: 'Completed' },
  { value: 'paused',    label: 'Paused'    },
];

export default function GoalsPage() {
  const [goals,     setGoals]     = useState<Goal[]>(SEED_GOALS);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [filter,     setFilter]     = useState<'all' | GoalStatus>('all');

  const handleCreate = useCallback((goal: Goal) => {
    setGoals((prev) => [goal, ...prev]);
  }, []);

  const handleStatusChange = useCallback((id: string, status: GoalStatus) => {
    setGoals((prev) =>
      prev.map((g) => g.id === id ? { ...g, status, updatedAt: new Date() } : g)
    );
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteId) {
      setGoals((prev) => prev.filter((g) => g.id !== deleteId));
      setDeleteId(null);
    }
  }, [deleteId]);

  const activeCount    = goals.filter((g) => g.status === 'active').length;
  const completedCount = goals.filter((g) => g.status === 'completed').length;

  const filtered = filter === 'all' ? goals : goals.filter((g) => g.status === filter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex items-start justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Goals</h1>
          <p className="text-text-muted text-sm mt-1">
            {activeCount} active · {completedCount} completed
          </p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-brand text-sm gap-1.5" id="create-goal-btn">
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Goal
        </button>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              filter === f.value
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-tertiary'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Goal grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0
            ? <EmptyState onCreate={() => setCreateOpen(true)} />
            : filtered.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onStatusChange={handleStatusChange}
                  onDelete={setDeleteId}
                />
              ))}
        </AnimatePresence>
      </div>

      <CreateGoalModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Goal"
        description="This will permanently remove the goal and all progress data."
        confirmLabel="Delete"
      />
    </div>
  );
}
