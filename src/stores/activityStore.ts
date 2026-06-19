import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Activity } from '@/types';
import {
  getUserActivities,
  createActivity,
  deleteActivity,
} from '@/services/activityRepository';
import { logger } from '@/lib/logger';

interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;

  fetchActivities: (userId: string) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Promise<void>;
  removeActivity: (activityId: string) => Promise<void>;
  reset: () => void;
}

export const useActivityStore = create<ActivityState>()(
  devtools(
    (set) => ({
      activities: [],
      loading: false,
      error: null,
      hasLoaded: false,

      fetchActivities: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const activities = await getUserActivities(userId);
          set({ activities, loading: false, hasLoaded: true });
        } catch (error: any) {
          logger.error('Failed to fetch activities', error);
          set({ error: error.message, loading: false });
        }
      },

      addActivity: async (activity) => {
        set({ loading: true, error: null });
        try {
          const id = await createActivity(activity);
          const newActivity: Activity = {
            ...activity,
            id,
            createdAt: new Date(),
          };
          set((state) => ({
            activities: [newActivity, ...state.activities],
            loading: false,
          }));

          // Hook into gamification
          const gamification = await import('./gamificationStore').then(m => m.useGamificationStore.getState());
          // Award some base XP for logging, plus some XP if carbon is saved (negative carbonKg)
          const xpGained = 10 + (activity.carbonKg < 0 ? Math.abs(activity.carbonKg) * 5 : 0);
          gamification.addXP(activity.userId, Math.round(xpGained));
          gamification.updateStreak(activity.userId, 'daily_log');

          // Track in BigQuery analytics (fire and forget)
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: activity.userId,
              activityType: activity.type,
              category: activity.category,
              carbonKg: activity.carbonKg,
              timestamp: new Date().toISOString(),
            }),
          }).catch((err: any) => logger.warn('Failed to track analytics', { error: err.message || String(err) }));
        } catch (error: any) {
          logger.error('Failed to add activity', error);
          set({ error: error.message, loading: false });
        }
      },

      removeActivity: async (activityId: string) => {
        set({ loading: true, error: null });
        try {
          await deleteActivity(activityId);
          set((state) => ({
            activities: state.activities.filter((a) => a.id !== activityId),
            loading: false,
          }));
        } catch (error: any) {
          logger.error('Failed to delete activity', error);
          set({ error: error.message, loading: false });
        }
      },

      reset: () =>
        set({
          activities: [],
          loading: false,
          error: null,
          hasLoaded: false,
        }),
    }),
    { name: 'activity-store' }
  )
);
