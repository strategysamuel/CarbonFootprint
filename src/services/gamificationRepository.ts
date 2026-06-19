import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  setDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/firebase/firestore';
import type { Achievement, Badge, Streak } from '@/types';

// Badges are global read-only data, achievements are user-specific
export async function getAvailableBadges(): Promise<Badge[]> {
  const q = query(collection(getFirestoreDb(), 'badges'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Badge));
}

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const q = query(collection(getFirestoreDb(), 'achievements'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Achievement));
}

export async function getUserStreaks(userId: string): Promise<Streak[]> {
  const q = query(collection(getFirestoreDb(), 'streaks'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Streak));
}

export async function awardBadge(userId: string, badge: Badge): Promise<void> {
  const achievementRef = doc(collection(getFirestoreDb(), 'achievements'));
  await setDoc(achievementRef, {
    userId,
    badgeId: badge.id,
    earnedAt: serverTimestamp(),
  });
}

export async function addXP(userId: string, amount: number): Promise<void> {
  const userRef = doc(getFirestoreDb(), 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) return;
  
  const currentXP = userDoc.data().stats?.xp || 0;
  const currentLevel = userDoc.data().stats?.level || 1;
  const newXP = currentXP + amount;
  
  // Simple leveling formula: Level 1 -> 0 XP, Level 2 -> 1000 XP, Level 3 -> 2500 XP etc.
  // For simplicity, 1 level per 1000 XP.
  const newLevel = Math.floor(newXP / 1000) + 1;
  
  await updateDoc(userRef, {
    'stats.xp': increment(amount),
    'stats.level': Math.max(currentLevel, newLevel),
  });
}

export async function updateStreak(userId: string, type: 'daily_log' | 'goal_progress' | 'challenge'): Promise<void> {
  // Try to find the streak
  const q = query(collection(getFirestoreDb(), 'streaks'), where('userId', '==', userId), where('type', '==', type));
  const snap = await getDocs(q);
  
  const now = new Date();
  
  if (snap.empty) {
    const streakRef = doc(collection(getFirestoreDb(), 'streaks'));
    await setDoc(streakRef, {
      userId,
      type,
      currentCount: 1,
      longestCount: 1,
      lastActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    const streakDoc = snap.docs[0];
    const data = streakDoc.data() as Streak;
    const lastActivity = data.lastActivityAt ? (data.lastActivityAt as any).toDate() : new Date();
    
    // Check if the difference is exactly 1 day
    const timeDiff = now.getTime() - lastActivity.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    
    let newCurrent = data.currentCount;
    if (daysDiff > 0.5 && daysDiff <= 2) {
      // Continue streak
      newCurrent += 1;
    } else if (daysDiff > 2) {
      // Break streak
      newCurrent = 1;
    }
    
    await updateDoc(streakDoc.ref, {
      currentCount: newCurrent,
      longestCount: Math.max(data.longestCount, newCurrent),
      lastActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
