import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { UserProfile, UserSettings } from '@/types';

interface UserState {
  profile:  UserProfile | null;
  loading:  boolean;
  error:    string | null;

  setProfile:     (profile: UserProfile | null) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setLoading:     (loading: boolean) => void;
  setError:       (error: string | null) => void;
  reset:          () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        profile:  null,
        loading:  false,
        error:    null,

        setProfile:     (profile) => set({ profile }),
        updateSettings: (settings) =>
          set((state) => ({
            profile: state.profile
              ? { ...state.profile, settings: { ...state.profile.settings, ...settings } }
              : null,
          })),
        setLoading: (loading) => set({ loading }),
        setError:   (error)   => set({ error }),
        reset:      ()        => set({ profile: null, loading: false, error: null }),
      }),
      {
        name:    'user-store',
        partialize: (state) => ({ profile: state.profile }),
      }
    ),
    { name: 'user-store' }
  )
);

export const selectUserProfile  = (s: UserState) => s.profile;
export const selectUserSettings = (s: UserState) => s.profile?.settings;
export const selectUserStats    = (s: UserState) => s.profile?.stats;
