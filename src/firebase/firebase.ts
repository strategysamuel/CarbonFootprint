import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

// ─── Environment Validation ───────────────────────────────────────────────────

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

function validateFirebaseConfig(): void {
  if (typeof window === 'undefined') return; // skip on server

  const missing = requiredEnvVars.filter(
    (key) => !process.env[key] || process.env[key] === ''
  );

  if (missing.length > 0) {
    console.warn(
      `[CarbonMirror] Missing Firebase environment variables:\n${missing.join('\n')}\n` +
        'Copy .env.example to .env.local and fill in your Firebase credentials.'
    );
  }
}

// ─── Firebase Config ──────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
};

// ─── Singleton Initialization ─────────────────────────────────────────────────

function getFirebaseApp(): FirebaseApp {
  validateFirebaseConfig();

  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  return initializeApp(firebaseConfig);
}

export const firebaseApp = getFirebaseApp();
export { firebaseConfig };
