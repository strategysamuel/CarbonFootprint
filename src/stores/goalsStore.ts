import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Goal, GoalStatus } from '@/types';

interface GoalsState {
  goals:    Goal[];
  loading:  boolean;
  error:    string | null;

  setGoals:     (goals: Goal[]) => void;
  addGoal:      (goal: Goal) => void;
  updateGoal:   (id: string, updates: Partial<Goal>) => void;
  removeGoal:   (id: string) => void;
  setLoading:   (loading: boolean) => void;
  setError:     (error: string | null) => void;
  reset:        () => void;
}

export const useGoalsStore = create<GoalsState>()(
  devtools(
    (set) => ({
      goals:   [],
      loading: false,
      error:   null,

      setGoals:   (goals) => set({ goals }),
      addGoal:    (goal)  => set((state) => ({ goals: [goal, ...state.goals] })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),
      removeGoal: (id) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
      setLoading: (loading) => set({ loading }),
      setError:   (error)   => set({ error }),
      reset:      ()        => set({ goals: [], loading: false, error: null }),
    }),
    { name: 'goals-store' }
  )
);

export const selectActiveGoals = (s: GoalsState) =>
  s.goals.filter((g) => g.status === 'active');
export const selectGoalsByStatus = (status: GoalStatus) => (s: GoalsState) =>
  s.goals.filter((g) => g.status === status);
