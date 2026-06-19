import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type QueryConstraint,
} from 'firebase/firestore';
import { getFirestoreDb, COLLECTIONS, createConverter } from '@/firebase/firestore';
import type { Activity, CarbonCategory } from '@/types';
import { logger } from '@/lib/logger';

const activityConverter = createConverter<Activity>();

function getActivitiesCollection() {
  return collection(getFirestoreDb(), COLLECTIONS.ACTIVITIES).withConverter(
    activityConverter
  );
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createActivity(
  data: Omit<Activity, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(getActivitiesCollection(), {
    ...data,
    id:        '',
    createdAt: new Date(),
  } as Activity);
  // patch the id back
  await updateDoc(ref, { id: ref.id });
  logger.db('Activity created', { id: ref.id, userId: data.userId });
  return ref.id;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getActivity(id: string): Promise<Activity | null> {
  const ref = doc(getActivitiesCollection(), id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : null;
}

export async function getUserActivities(
  userId: string,
  options?: {
    category?: CarbonCategory;
    limitCount?: number;
  }
): Promise<Activity[]> {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('date', 'desc'),
  ];

  if (options?.category) {
    constraints.push(where('category', '==', options.category));
  }
  if (options?.limitCount) {
    constraints.push(limit(options.limitCount));
  }

  const q = query(getActivitiesCollection(), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateActivity(
  id: string,
  updates: Partial<Omit<Activity, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const ref = doc(getFirestoreDb(), COLLECTIONS.ACTIVITIES, id);
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteActivity(id: string): Promise<void> {
  const ref = doc(getFirestoreDb(), COLLECTIONS.ACTIVITIES, id);
  await deleteDoc(ref);
  logger.db('Activity deleted', { id });
}
