import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Activity, DashboardSummary } from '@/types';

interface DashboardState {
  summary:          DashboardSummary | null;
  recentActivities: Activity[];
  loading:          boolean;
  error:            string | null;
  lastRefreshed:    Date | null;

  setSummary:           (summary: DashboardSummary | null) => void;
  setRecentActivities:  (activities: Activity[]) => void;
  setLoading:           (loading: boolean) => void;
  setError:             (error: string | null) => void;
  setLastRefreshed:     (date: Date) => void;
  reset:                () => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      summary:          null,
      recentActivities: [],
      loading:          false,
      error:            null,
      lastRefreshed:    null,

      setSummary:          (summary)    => set({ summary }),
      setRecentActivities: (activities) => set({ recentActivities: activities }),
      setLoading:          (loading)    => set({ loading }),
      setError:            (error)      => set({ error }),
      setLastRefreshed:    (date)       => set({ lastRefreshed: date }),
      reset: () =>
        set({ summary: null, recentActivities: [], loading: false, error: null }),
    }),
    { name: 'dashboard-store' }
  )
);

export const selectDashboardSummary   = (s: DashboardState) => s.summary;
export const selectDashboardLoading   = (s: DashboardState) => s.loading;
