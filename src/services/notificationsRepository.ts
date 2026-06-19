import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb, COLLECTIONS, createConverter } from '@/firebase/firestore';
import type { AppNotification } from '@/types';

const notificationConverter = createConverter<AppNotification>();

function getNotificationsCollection() {
  return collection(getFirestoreDb(), COLLECTIONS.NOTIFICATIONS).withConverter(
    notificationConverter
  );
}

export async function createNotification(
  data: Omit<AppNotification, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(getNotificationsCollection(), {
    ...data,
    id:        '',
    createdAt: new Date(),
  } as AppNotification);
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

export async function getUserNotifications(
  userId: string,
  limitCount = 20
): Promise<AppNotification[]> {
  const q = query(
    getNotificationsCollection(),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function markNotificationRead(id: string): Promise<void> {
  const ref = doc(getFirestoreDb(), COLLECTIONS.NOTIFICATIONS, id);
  await updateDoc(ref, { status: 'read', readAt: serverTimestamp() });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const q = query(
    getNotificationsCollection(),
    where('userId', '==', userId),
    where('status', '==', 'unread')
  );
  const snapshot = await getDocs(q);
  const updates = snapshot.docs.map((d) =>
    updateDoc(d.ref, { status: 'read', readAt: serverTimestamp() })
  );
  await Promise.all(updates);
}
