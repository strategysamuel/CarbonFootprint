import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Achievement, Badge, Streak } from '@/types';
import * as repo from '@/services/gamificationRepository';

interface GamificationState {
  badges: Badge[];
  achievements: Achievement[];
  streaks: Streak[];
  loading: boolean;
  error: string | null;
  fetchData: (userId: string) => Promise<void>;
  addXP: (userId: string, amount: number) => Promise<void>;
  updateStreak: (userId: string, type: Streak['type']) => Promise<void>;
}

export const useGamificationStore = create<GamificationState>()(
  devtools(
    (set) => ({
      badges: [],
      achievements: [],
      streaks: [],
      loading: false,
      error: null,

      fetchData: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const [badges, achievements, streaks] = await Promise.all([
            repo.getAvailableBadges(),
            repo.getUserAchievements(userId),
            repo.getUserStreaks(userId),
          ]);
          set({ badges, achievements, streaks, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      addXP: async (userId: string, amount: number) => {
        try {
          await repo.addXP(userId, amount);
        } catch (error: any) {
          console.error('Failed to add XP:', error);
        }
      },

      updateStreak: async (userId: string, type: Streak['type']) => {
        try {
          await repo.updateStreak(userId, type);
          // Refetch streaks to update UI
          const streaks = await repo.getUserStreaks(userId);
          set({ streaks });
        } catch (error: any) {
          console.error('Failed to update streak:', error);
        }
      },
    }),
    { name: 'gamification-store' }
  )
);
