import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/types';

// ─── State Shape ──────────────────────────────────────────────────────────────

interface AuthState {
  // State
  user:        User | null;
  profile:     UserProfile | null;
  loading:     boolean;
  initialized: boolean;
  error:       string | null;

  // Actions
  setUser:        (user: User | null) => void;
  setProfile:     (profile: UserProfile | null) => void;
  setLoading:     (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError:       (error: string | null) => void;
  reset:          () => void;
}

const initialState = {
  user:        null,
  profile:     null,
  loading:     true,
  initialized: false,
  error:       null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      ...initialState,

      setUser:        (user)        => set({ user }),
      setProfile:     (profile)     => set({ profile }),
      setLoading:     (loading)     => set({ loading }),
      setInitialized: (initialized) => set({ initialized }),
      setError:       (error)       => set({ error }),
      reset:          ()            => set(initialState),
    }),
    { name: 'auth-store' }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectIsAuthenticated   = (s: AuthState) => !!s.user;
export const selectIsOnboarded       = (s: AuthState) => !!s.profile?.onboardingCompleted;
export const selectAuthLoading       = (s: AuthState) => s.loading;
export const selectUser              = (s: AuthState) => s.user;
export const selectProfile           = (s: AuthState) => s.profile;
