import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore';
import { getFirestoreDb, COLLECTIONS, createConverter } from '@/firebase/firestore';
import type { UserProfile, OnboardingData, UserSettings } from '@/types';
import { logger } from '@/lib/logger';

const userConverter = createConverter<UserProfile>();

function getUsersCollection() {
  return collection(getFirestoreDb(), COLLECTIONS.USERS).withConverter(userConverter);
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createUserProfile(
  uid: string,
  data: Pick<UserProfile, 'email' | 'displayName' | 'photoURL'>
): Promise<void> {
  const ref = doc(getUsersCollection(), uid);

  const defaultProfile: Omit<UserProfile, 'uid'> = {
    email:               data.email,
    displayName:         data.displayName,
    photoURL:            data.photoURL,
    createdAt:           new Date(),
    updatedAt:           new Date(),
    onboardingCompleted: false,
    settings: {
      theme:         'dark',
      notifications: true,
      weeklyReport:  true,
      nudges:        true,
      language:      'en',
      units:         'metric',
    },
    stats: {
      totalCarbonSaved: 0,
      currentStreak:    0,
      longestStreak:    0,
      totalActivities:  0,
      badgesEarned:     0,
      level:            1,
      xp:               0,
    },
  };

  await setDoc(ref, { uid, ...defaultProfile } as UserProfile);
  logger.db('User profile created', { uid });
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(getUsersCollection(), uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return snapshot.data();
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<UserProfile, 'displayName' | 'photoURL' | 'settings' | 'fcmToken'>>
): Promise<void> {
  const ref = doc(getFirestoreDb(), COLLECTIONS.USERS, uid);
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
  logger.db('User profile updated', { uid });
}

export async function completeOnboarding(
  uid: string,
  onboardingData: OnboardingData
): Promise<void> {
  const ref = doc(getFirestoreDb(), COLLECTIONS.USERS, uid);
  await updateDoc(ref, {
    onboardingCompleted: true,
    onboardingData:      { ...onboardingData, completedAt: new Date() },
    updatedAt:           serverTimestamp(),
  });
  logger.db('Onboarding completed', { uid });
}

export async function updateUserSettings(
  uid: string,
  settings: Partial<UserSettings>
): Promise<void> {
  const ref = doc(getFirestoreDb(), COLLECTIONS.USERS, uid);
  await updateDoc(ref, {
    settings:  settings,
    updatedAt: serverTimestamp(),
  });
}
