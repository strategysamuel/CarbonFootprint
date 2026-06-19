'use client';

/**
 * Firebase Cloud Messaging — Architecture Preparation
 *
 * FCM is initialised lazily on the client only, since it requires
 * a service worker and browser APIs that are not available on the server.
 *
 * Usage in a future prompt:
 *   import { initFCM, subscribeToMessages } from '@/firebase/messaging';
 *   const token = await initFCM();
 *   subscribeToMessages((payload) => console.log(payload));
 */

import type { Messaging } from 'firebase/messaging';

let _messaging: Messaging | null = null;

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator)) return null;
  if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) return null;

  if (_messaging) return _messaging;

  const { getMessaging } = await import('firebase/messaging');
  const { firebaseApp } = await import('./firebase');
  _messaging = getMessaging(firebaseApp);
  return _messaging;
}

export async function getFCMToken(): Promise<string | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  try {
    const { getToken } = await import('firebase/messaging');
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, { vapidKey });
    return token ?? null;
  } catch {
    // FCM may fail in development — gracefully return null
    return null;
  }
}

export async function subscribeToMessages(
  callback: (payload: unknown) => void
): Promise<() => void> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};

  const { onMessage } = await import('firebase/messaging');
  return onMessage(messaging, callback);
}
