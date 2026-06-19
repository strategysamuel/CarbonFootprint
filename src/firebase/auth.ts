import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type Auth,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { firebaseApp } from './firebase';
import { logger } from '@/lib/logger';

// ─── Auth Singleton ───────────────────────────────────────────────────────────

let _auth: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(firebaseApp);
  }
  return _auth;
}

// ─── Providers ────────────────────────────────────────────────────────────────

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// ─── Auth Methods ─────────────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  try {
    const result = await signInWithPopup(auth, googleProvider);
    logger.auth('Google sign-in successful', { uid: result.user.uid });
    return result;
  } catch (error) {
    logger.error('Google sign-in failed', { error });
    throw error;
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    logger.auth('Email sign-in successful', { uid: result.user.uid });
    return result;
  } catch (error) {
    logger.error('Email sign-in failed', { error });
    throw error;
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    logger.auth('Email sign-up successful', { uid: result.user.uid });
    return result;
  } catch (error) {
    logger.error('Email sign-up failed', { error });
    throw error;
  }
}

export async function resetPassword(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    logger.auth('Password reset email sent', { email });
  } catch (error) {
    logger.error('Password reset failed', { error });
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  try {
    await signOut(auth);
    logger.auth('User signed out');
  } catch (error) {
    logger.error('Sign-out failed', { error });
    throw error;
  }
}

export function subscribeToAuthState(
  callback: (user: User | null) => void
): () => void {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export { onAuthStateChanged };
export type { User, UserCredential };
