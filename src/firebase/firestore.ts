import {
  getFirestore,
  type Firestore,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { firebaseApp } from './firebase';

// ─── Firestore Singleton ──────────────────────────────────────────────────────

let _db: Firestore | null = null;

export function getFirestoreDb(): Firestore {
  if (!_db) {
    _db = getFirestore(firebaseApp);
  }
  return _db;
}

// ─── Collection Names ─────────────────────────────────────────────────────────

export const COLLECTIONS = {
  USERS:              'users',
  ACTIVITIES:         'activities',
  GOALS:              'goals',
  NUDGES:             'nudges',
  NOTIFICATIONS:      'notifications',
  TEAMS:              'teams',
  BADGES:             'badges',
  ACHIEVEMENTS:       'achievements',
  STREAKS:            'streaks',
  AI_RECOMMENDATIONS: 'aiRecommendations',
} as const;

// ─── Converter Factory ────────────────────────────────────────────────────────

/**
 * Creates a type-safe Firestore converter that handles Date <-> Timestamp
 * transformation automatically.
 */
export function createConverter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T): DocumentData {
      return convertDatesToTimestamps(data) as DocumentData;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      const data = snapshot.data();
      return convertTimestampsToDates({ id: snapshot.id, ...data }) as T;
    },
  };
}

// ─── Date / Timestamp Helpers ─────────────────────────────────────────────────

function convertDatesToTimestamps(obj: unknown): unknown {
  if (obj instanceof Date) return Timestamp.fromDate(obj);
  if (Array.isArray(obj)) return obj.map(convertDatesToTimestamps);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k,
        convertDatesToTimestamps(v),
      ])
    );
  }
  return obj;
}

function convertTimestampsToDates(obj: unknown): unknown {
  if (obj instanceof Timestamp) return obj.toDate();
  if (Array.isArray(obj)) return obj.map(convertTimestampsToDates);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k,
        convertTimestampsToDates(v),
      ])
    );
  }
  return obj;
}

export { Timestamp };
