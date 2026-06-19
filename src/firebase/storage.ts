import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseApp } from './firebase';

let _storage: FirebaseStorage | null = null;

export function getFirebaseStorage(): FirebaseStorage {
  if (!_storage) {
    _storage = getStorage(firebaseApp);
  }
  return _storage;
}

// ─── Storage Paths ────────────────────────────────────────────────────────────

export const STORAGE_PATHS = {
  userAvatar: (uid: string) => `users/${uid}/avatar`,
  activityImage: (uid: string, activityId: string) =>
    `users/${uid}/activities/${activityId}`,
  teamImage: (teamId: string) => `teams/${teamId}/image`,
} as const;
