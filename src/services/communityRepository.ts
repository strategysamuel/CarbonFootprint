import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc
} from 'firebase/firestore';
import { getFirestoreDb } from '@/firebase/firestore';
import type { UserProfile, Team } from '@/types';

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  country: string;
  saved: number;
  streak: number;
  level: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  reward: string;
  participants: number;
  daysLeft: number;
  joined: boolean;
}

export async function getGlobalLeaderboard(): Promise<LeaderboardUser[]> {
  const q = query(
    collection(getFirestoreDb(), 'users'),
    orderBy('stats.totalCarbonSaved', 'desc'),
    limit(50)
  );
  
  const snap = await getDocs(q);
  
  return snap.docs.map((d, index) => {
    const data = d.data() as UserProfile;
    return {
      rank: index + 1,
      userId: d.id,
      name: data.displayName || 'Anonymous',
      avatar: (data.displayName || 'A').substring(0, 2).toUpperCase(),
      country: data.onboardingData?.country || '🌍',
      saved: data.stats?.totalCarbonSaved || 0,
      streak: data.stats?.currentStreak || 0,
      level: data.stats?.level || 1,
    };
  });
}

export async function getActiveChallenges(): Promise<Challenge[]> {
  const q = query(collection(getFirestoreDb(), 'challenges'));
  const snap = await getDocs(q);
  
  // Return mocked data if empty (for demo purposes)
  if (snap.empty) {
    return [
      {
        id: '1',
        title: 'No-Car Week',
        description: 'Go 7 days without using a personal vehicle. Walk, cycle, or use public transit.',
        category: 'Transport',
        icon: '🚲',
        reward: '+500 XP + "Pedal Hero" badge',
        participants: 1248,
        daysLeft: 5,
        joined: false,
      },
      {
        id: '2',
        title: 'Plant-Based Month',
        description: 'Commit to plant-based meals for the entire month.',
        category: 'Food',
        icon: '🌱',
        reward: '+1200 XP + "Herbivore" badge',
        participants: 3891,
        daysLeft: 21,
        joined: false,
      }
    ];
  }

  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Challenge));
}

export async function getUserTeams(userId: string): Promise<Team[]> {
  const q = query(collection(getFirestoreDb(), 'teams'));
  const snap = await getDocs(q);
  
  // For demo: filter if member, but if empty, just return some mocks
  if (snap.empty) {
    return [
      {
        id: '1',
        name: 'Green Commuters',
        type: 'office',
        createdBy: 'system',
        members: [userId],
        totalCarbonSaved: 834.2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Team))
    .filter(t => t.members.includes(userId));
}

export async function createTeam(teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
  const docRef = await addDoc(collection(getFirestoreDb(), 'teams'), {
    ...teamData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return {
    id: docRef.id,
    ...teamData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
