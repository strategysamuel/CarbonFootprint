'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { subscribeToAuthState, type User } from '@/firebase/auth';
import { getUserProfile, createUserProfile, updateUserProfile } from '@/services/userRepository';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { logger } from '@/lib/logger';

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user:        User | null;
  loading:     boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user:        null,
  loading:     true,
  initialized: false,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading, setInitialized, user, loading, initialized } =
    useAuthStore();
  const { setProfile: setUserStoreProfile } = useUserStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      setLoading(true);

      try {
        if (firebaseUser) {
          setUser(firebaseUser);

          // Set session cookie immediately so middleware knows we are authenticated
          document.cookie = 'cm_session=1; path=/; max-age=2592000; SameSite=Lax';

          // Fetch or create Firestore profile
          let profile = null;
          try {
            profile = await getUserProfile(firebaseUser.uid);
          } catch (e) {
            logger.error('Failed to fetch user profile', { error: e });
          }

          if (!profile) {
            try {
              await createUserProfile(firebaseUser.uid, {
              email:       firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL:    firebaseUser.photoURL,
            });
            profile = await getUserProfile(firebaseUser.uid);
            } catch (e) {
              logger.error('Failed to create user profile', { error: e });
            }
          }

          // Request FCM token and update profile if it changed
          try {
            const { getFCMToken } = await import('@/firebase/messaging');
            const token = await getFCMToken();
            if (token && profile && token !== profile.fcmToken) {
              await updateUserProfile(firebaseUser.uid, { fcmToken: token });
              profile.fcmToken = token;
            }
          } catch (e) {
            logger.warn('FCM token fetch failed', { error: e });
          }

          // Set cookies for middleware routing
          document.cookie = `cm_onboarded=${profile?.onboardingCompleted ? 'true' : 'false'}; path=/; max-age=2592000; SameSite=Lax`;

          setProfile(profile);
          setUserStoreProfile(profile);
        } else {
          // Clear cookies on logout
          document.cookie = 'cm_session=; path=/; max-age=0; SameSite=Lax';
          document.cookie = 'cm_onboarded=; path=/; max-age=0; SameSite=Lax';

          setUser(null);
          setProfile(null);
          setUserStoreProfile(null);
        }
      } catch (error: any) {
        console.error('Auth state sync failed full error:', error);
        logger.error('Auth state sync failed', { message: error?.message, code: error?.code });
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    });

    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, loading, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
