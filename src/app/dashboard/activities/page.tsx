'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Filter,
  Car,
  Utensils,
  Zap,
  Trash2,
  TrendingDown,
  TrendingUp,
  Minus,
  X,
} from 'lucide-react';
import { formatCarbon, formatDate, cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import type { Activity, CarbonCategory, ActivityType } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useActivityStore } from '@/stores/activityStore';

// ─── Activity type config ─────────────────────────────────────────────────────

type ActivityOption = { type: ActivityType; label: string; category: CarbonCategory; defaultKg: number };

const ACTIVITY_OPTIONS: ActivityOption[] = [
  { type: 'car_trip',          label: 'Car trip',              category: 'transportation', defaultKg:  0.21 },
  { type: 'flight',            label: 'Flight',                category: 'transportation', defaultKg: 90.0  },
  { type: 'public_transport',  label: 'Public transport',      category: 'transportation', defaultKg:  0.05 },
  { type: 'cycling',           label: 'Cycling',               category: 'transportation', defaultKg: -0.01 },
  { type: 'walking',           label: 'Walking',               category: 'transportation', defaultKg: -0.00 },
  { type: 'meal',              label: 'Meal',                  category: 'food',           defaultKg:  1.50 },
  { type: 'electricity_usage', label: 'Electricity usage',     category: 'energy',         defaultKg:  0.23 },
  { type: 'heating',           label: 'Heating',               category: 'energy',         defaultKg:  0.18 },
  { type: 'waste_recycled',    label: 'Waste recycled',        category: 'waste',          defaultKg: -0.80 },
  { type: 'waste_landfill',    label: 'Waste to landfill',     category: 'waste',          defaultKg:  0.50 },
  { type: 'online_purchase',   label: 'Online purchase',       category: 'waste',          defaultKg:  0.60 },
  { type: 'streaming',         label: 'Video streaming (hr)',  category: 'energy',         defaultKg:  0.036 },
];

const CATEGORY_ICONS: Record<CarbonCategory, React.ElementType> = {
  transportation: Car,
  food:           Utensils,
  energy:         Zap,
  waste:          Trash2,
};

// Removed CATEGORY_COLORS

// ─── Schema ───────────────────────────────────────────────────────────────────

const activitySchema = z.object({
  activityType: z.string().min(1, 'Select an activity type'),
  quantity:     z.coerce.number().positive('Must be a positive number'),
  description:  z.string().min(2, 'Brief description required'),
  notes:        z.string().optional(),
});

type ActivityForm = z.infer<typeof activitySchema>;

// ─── Category filter tabs ─────────────────────────────────────────────────────

const FILTER_TABS = [
  { value: 'all',            label: 'All' },
  { value: 'transportation', label: 'Transport' },
  { value: 'food',           label: 'Food' },
  { value: 'energy',         label: 'Energy' },
  { value: 'waste',          label: 'Waste' },
] as const;

type FilterValue = 'all' | CarbonCategory;

// ─── Helper: group by date ────────────────────────────────────────────────────

function groupByDay(activities: Activity[]): Map<string, Activity[]> {
  const map = new Map<string, Activity[]>();
  for (const a of activities) {
    const key = formatDate(a.date);
    const arr = map.get(key) ?? [];
    arr.push(a);
    map.set(key, arr);
  }
  return map;
}

// ─── Log Activity Modal ───────────────────────────────────────────────────────

function LogActivityModal({
  open,
  onClose,
  onLog,
}: {
  open:    boolean;
  onClose: () => void;
  onLog:   (activity: Omit<Activity, 'id' | 'userId' | 'createdAt'>) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: { quantity: 1 },
  });

  const selectedType = watch('activityType');
  const selectedOption = ACTIVITY_OPTIONS.find((o) => o.type === selectedType);

  function onSubmit(data: ActivityForm) {
    const option = ACTIVITY_OPTIONS.find((o) => o.type === data.activityType);
    if (!option) return;

    const carbonKg = option.defaultKg * data.quantity;

    const activity: Omit<Activity, 'id' | 'userId' | 'createdAt'> = {
      type:        option.type,
      category:    option.category,
      description: data.description,
      carbonKg,
      metadata:    { quantity: data.quantity, notes: data.notes },
      date:        new Date(),
    };
    onLog(activity);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log Activity"
      description="Record a carbon-producing or carbon-saving activity."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Activity type */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Activity type <span className="text-red-400">*</span>
          </label>
          <select
            {...register('activityType')}
            className="w-full rounded-xl border border-surface-border bg-surface-secondary text-text-primary
                       px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Select an activity…</option>
            {(['transportation', 'food', 'energy', 'waste'] as CarbonCategory[]).map((cat) => (
              <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                {ACTIVITY_OPTIONS.filter((o) => o.category === cat).map((o) => (
                  <option key={o.type} value={o.type}>{o.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.activityType && (
            <p className="text-xs text-red-400 mt-1">{errors.activityType.message}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Quantity
            <span className="text-text-muted ml-1 font-normal text-xs">
              {selectedType === 'car_trip' || selectedType === 'flight' ? '(km)' :
               selectedType === 'electricity_usage' || selectedType === 'heating' ? '(kWh)' :
               selectedType === 'streaming' ? '(hours)' : '(units)'}
            </span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            {...register('quantity')}
            className="w-full rounded-xl border border-surface-border bg-surface-secondary text-text-primary
                       px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {errors.quantity && (
            <p className="text-xs text-red-400 mt-1">{errors.quantity.message}</p>
          )}
          {selectedOption && (
            <p className="text-xs text-text-muted mt-1">
              ≈ estimated carbon: <span className="text-brand-400 font-semibold">
                {formatCarbon(selectedOption.defaultKg * (parseFloat(String(watch('quantity'))) || 1))}
              </span>
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Commute to office"
            {...register('description')}
            className="w-full rounded-xl border border-surface-border bg-surface-secondary text-text-primary
                       px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-text-muted"
          />
          {errors.description && (
            <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Notes <span className="text-text-muted font-normal text-xs">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Any additional context…"
            {...register('notes')}
            className="w-full rounded-xl border border-surface-border bg-surface-secondary text-text-primary
                       px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500
                       placeholder:text-text-muted resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 text-sm py-2.5">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-brand flex-1 text-sm py-2.5"
          >
            {isSubmitting ? 'Logging…' : 'Log Activity'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Activity Item ────────────────────────────────────────────────────────────

function ActivityItem({
  activity,
  onDelete,
}: {
  activity: Activity;
  onDelete: (id: string) => void;
}) {
  const Icon        = CATEGORY_ICONS[activity.category];
  const isSaving    = activity.carbonKg < 0;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0  }}
      exit={{    opacity: 0, x:  10 }}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-tertiary transition-colors group"
    >
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
          isSaving ? 'bg-brand-950' : 'bg-red-950/60'
        )}
      >
        <Icon
          className={cn('w-5 h-5', isSaving ? 'text-brand-400' : 'text-red-400')}
          aria-hidden="true"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary truncate">{activity.description}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <CategoryBadge category={activity.category} size="sm" showLabel={false} />
          <span className="text-xs text-text-muted capitalize">{activity.type.replace(/_/g, ' ')}</span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div
          className={cn(
            'text-sm font-semibold tabular-nums',
            isSaving ? 'text-brand-400' : 'text-red-400'
          )}
        >
          {isSaving ? '' : '+'}{formatCarbon(activity.carbonKg)}
        </div>
      </div>

      <button
        onClick={() => onDelete(activity.id)}
        className="opacity-0 group-hover:opacity-100 ml-2 p-1.5 rounded-lg text-text-muted
                   hover:text-red-400 hover:bg-red-950/40 transition-all flex-shrink-0"
        aria-label={`Delete ${activity.description}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.li>
  );
}

// ─── Summary Bar ──────────────────────────────────────────────────────────────

function SummaryBar({ activities }: { activities: Activity[] }) {
  const emitted = activities.filter(a => a.carbonKg > 0).reduce((s, a) => s + a.carbonKg, 0);
  const saved   = Math.abs(activities.filter(a => a.carbonKg < 0).reduce((s, a) => s + a.carbonKg, 0));
  const net     = emitted - saved;

  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Emitted', value: emitted, icon: TrendingUp,   color: 'text-red-400',   bg: 'bg-red-950/40'     },
        { label: 'Saved',   value: saved,   icon: TrendingDown, color: 'text-brand-400', bg: 'bg-brand-950'      },
        { label: 'Net',     value: net,     icon: Minus,        color: net < 0 ? 'text-brand-400' : 'text-red-400',
          bg: net < 0 ? 'bg-brand-950' : 'bg-red-950/40' },
      ].map(({ label, value, icon: Icon, color, bg }) => (
        <motion.div
          key={label}
          className="glass-card p-4 flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
        >
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
            <Icon className={cn('w-4 h-4', color)} aria-hidden="true" />
          </div>
          <div>
            <div className={cn('text-lg font-bold font-display tabular-nums', color)}>
              <AnimatedCounter value={value} decimals={1} suffix=" kg" />
            </div>
            <div className="text-xs text-text-muted">{label} CO₂e</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ActivitiesPage() {
  const { user } = useAuthStore();
  const { activities, fetchActivities, addActivity, removeActivity, hasLoaded } = useActivityStore();
  const [filter, setFilter] = useState<FilterValue>('all');
  const [logOpen, setLogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid && !hasLoaded) {
      fetchActivities(user.uid);
    }
  }, [user?.uid, fetchActivities, hasLoaded]);

  const handleLog = useCallback(
    async (a: Omit<Activity, 'id' | 'userId' | 'createdAt'>) => {
      if (!user?.uid) return;
      await addActivity({ ...a, userId: user.uid });
    },
    [addActivity, user?.uid]
  );

  const handleDelete = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deleteId) {
      await removeActivity(deleteId);
      setDeleteId(null);
    }
  }, [deleteId, removeActivity]);

  const filtered = filter === 'all'
    ? activities
    : activities.filter((a) => a.category === filter);

  const grouped = groupByDay(filtered);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex items-start justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Activities</h1>
          <p className="text-text-muted text-sm mt-1">
            Track and log your carbon-producing and carbon-saving activities.
          </p>
        </div>
        <button
          onClick={() => setLogOpen(true)}
          className="btn-brand text-sm gap-1.5"
          id="log-activity-btn"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Log Activity
        </button>
      </motion.div>

      {/* Summary bar */}
      <SummaryBar activities={activities} />

      {/* Filter bar */}
      <motion.div
        className="flex items-center gap-2 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Filter className="w-4 h-4 text-text-muted flex-shrink-0" aria-hidden="true" />
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as FilterValue)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
              filter === tab.value
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-tertiary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Activity feed */}
      {filtered.length === 0 ? (
        <motion.div
          className="glass-card p-12 text-center space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-4xl">📋</div>
          <p className="text-text-muted text-sm">No activities found. Log your first one!</p>
          <button onClick={() => setLogOpen(true)} className="btn-brand text-sm mt-2">
            <Plus className="w-4 h-4" /> Log Activity
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([day, dayActivities]) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{day}</span>
                <span className="text-xs text-text-muted">
                  {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}
                </span>
              </div>
              <ul>
                <AnimatePresence mode="popLayout">
                  {dayActivities.map((a) => (
                    <ActivityItem key={a.id} activity={a} onDelete={handleDelete} />
                  ))}
                </AnimatePresence>
              </ul>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <LogActivityModal open={logOpen} onClose={() => setLogOpen(false)} onLog={handleLog} />
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Activity"
        description="This will permanently remove the activity from your log. This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
