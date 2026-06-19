import { formatCarbon, calculateCarbonScore, cn, getFirebaseErrorMessage } from '@/lib/utils';

describe('formatCarbon', () => {
  it('formats grams for values < 1kg', () => {
    expect(formatCarbon(0.5)).toBe('500g CO₂e');
  });

  it('formats kg for values 1-999kg', () => {
    expect(formatCarbon(12.3)).toBe('12.3kg CO₂e');
  });

  it('formats tonnes for values >= 1000kg', () => {
    expect(formatCarbon(1500)).toBe('1.50t CO₂e');
  });

  it('handles negative values (savings)', () => {
    expect(formatCarbon(-2.5)).toBe('-2.5kg CO₂e');
  });
});

describe('calculateCarbonScore', () => {
  it('returns 100 for zero emissions', () => {
    expect(calculateCarbonScore(0)).toBe(100);
  });

  it('returns 0 for emissions at or above baseline', () => {
    expect(calculateCarbonScore(333)).toBe(0);
  });

  it('returns approximately 50 for half the baseline', () => {
    const score = calculateCarbonScore(166.5);
    expect(score).toBeGreaterThan(48);
    expect(score).toBeLessThan(52);
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('resolves tailwind conflicts', () => {
    expect(cn('px-2 px-4')).toBe('px-4');
  });
});

describe('getFirebaseErrorMessage', () => {
  it('returns friendly message for known error codes', () => {
    expect(getFirebaseErrorMessage('auth/email-already-in-use')).toContain('already registered');
    expect(getFirebaseErrorMessage('auth/wrong-password')).toContain('Incorrect password');
  });

  it('returns generic message for unknown error codes', () => {
    expect(getFirebaseErrorMessage('unknown/error')).toContain('unexpected error');
  });
});
