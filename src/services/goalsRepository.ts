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
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb, COLLECTIONS, createConverter } from '@/firebase/firestore';
import type { Goal, GoalStatus } from '@/types';
import { logger } from '@/lib/logger';

const goalConverter = createConverter<Goal>();

function getGoalsCollection() {
  return collection(getFirestoreDb(), COLLECTIONS.GOALS).withConverter(goalConverter);
}

export async function createGoal(data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(getGoalsCollection(), {
    ...data,
    id:        '',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Goal);
  await updateDoc(ref, { id: ref.id });
  logger.db('Goal created', { id: ref.id, userId: data.userId });
  return ref.id;
}

export async function getGoal(id: string): Promise<Goal | null> {
  const ref = doc(getGoalsCollection(), id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : null;
}

export async function getUserGoals(
  userId: string,
  status?: GoalStatus
): Promise<Goal[]> {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  ];
  if (status) constraints.push(where('status', '==', status));

  const q = query(getGoalsCollection(), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function updateGoal(
  id: string,
  updates: Partial<Omit<Goal, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const ref = doc(getFirestoreDb(), COLLECTIONS.GOALS, id);
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
}

export async function deleteGoal(id: string): Promise<void> {
  const ref = doc(getFirestoreDb(), COLLECTIONS.GOALS, id);
  await deleteDoc(ref);
}
