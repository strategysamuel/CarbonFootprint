import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';

// ─── Tailwind Utilities ───────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatDate(date: Date, pattern = 'MMM d, yyyy'): string {
  return format(date, pattern);
}

// ─── Carbon Utilities ─────────────────────────────────────────────────────────

/**
 * Formats kg CO2e with appropriate unit (g, kg, t).
 */
export function formatCarbon(kg: number): string {
  if (Math.abs(kg) < 1) return `${(kg * 1000).toFixed(0)}g CO₂e`;
  if (Math.abs(kg) >= 1000) return `${(kg / 1000).toFixed(2)}t CO₂e`;
  return `${kg.toFixed(1)}kg CO₂e`;
}

/**
 * Returns a color class based on carbon value (green = good, red = bad).
 */
export function carbonColorClass(kg: number): string {
  if (kg <= 0) return 'text-brand-500';
  if (kg < 5)  return 'text-yellow-500';
  if (kg < 20) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Returns a score 0–100 based on monthly emissions (lower = better).
 * Baseline: avg person emits ~4000kg/year = ~333kg/month.
 */
export function calculateCarbonScore(monthlyEmissionsKg: number): number {
  const baseline = 333;
  const score = Math.max(0, Math.min(100, ((baseline - monthlyEmissionsKg) / baseline) * 100));
  return Math.round(score);
}

// ─── Error Utilities ──────────────────────────────────────────────────────────

export function getFirebaseErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use':  'This email is already registered.',
    'auth/invalid-email':         'Please enter a valid email address.',
    'auth/user-not-found':        'No account found with this email.',
    'auth/wrong-password':        'Incorrect password. Please try again.',
    'auth/too-many-requests':     'Too many attempts. Please try again later.',
    'auth/network-request-failed':'Network error. Check your connection.',
    'auth/popup-closed-by-user':  'Sign-in cancelled.',
    'auth/cancelled-popup-request': 'Sign-in cancelled.',
    'permission-denied':          'You do not have permission to perform this action.',
    'unavailable':                'Service temporarily unavailable. Please try again.',
  };
  return messages[code] ?? 'An unexpected error occurred. Please try again.';
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}…`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
