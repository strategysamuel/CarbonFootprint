'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { completeOnboarding } from '@/services/userRepository';
import type { AgeGroup, Motivation, CarbonCategory, ChallengeType, OnboardingData } from '@/types';
import { Leaf, ChevronRight, ChevronLeft, Loader2, CheckCircle2, MapPin, User, Heart, Target, Users2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WizardData {
  country:          string;
  city:             string;
  ageGroup:         AgeGroup | '';
  motivation:       Motivation | '';
  carbonGoals:      CarbonCategory[];
  challengeInterests: ChallengeType[];
}

// ─── Step Definitions ─────────────────────────────────────────────────────────

const STEPS = ['Location', 'About You', 'Motivation', 'Goals', 'Challenges'] as const;

// ─── Option Sets ──────────────────────────────────────────────────────────────

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: 'under-18', label: 'Under 18' },
  { value: '18-24',    label: '18 – 24' },
  { value: '25-34',    label: '25 – 34' },
  { value: '35-44',    label: '35 – 44' },
  { value: '45-54',    label: '45 – 54' },
  { value: '55-64',    label: '55 – 64' },
  { value: '65+',      label: '65+' },
];

const MOTIVATIONS: { value: Motivation; label: string; emoji: string; description: string }[] = [
  { value: 'save-money',          label: 'Save Money',          emoji: '💰', description: 'Reduce expenses by cutting waste and energy use.' },
  { value: 'protect-environment', label: 'Protect Environment', emoji: '🌍', description: 'Leave a healthier planet for all living beings.' },
  { value: 'improve-health',      label: 'Improve Health',      emoji: '💚', description: 'Choose habits that benefit both you and the planet.' },
  { value: 'future-generations',  label: 'Future Generations',  emoji: '👶', description: 'Act today so tomorrow\'s children have a livable world.' },
];

const CARBON_GOALS: { value: CarbonCategory; label: string; emoji: string; description: string }[] = [
  { value: 'transportation', label: 'Transportation', emoji: '🚗', description: 'Flights, car trips, and commutes.' },
  { value: 'food',           label: 'Food',           emoji: '🥗', description: 'Diet choices and food waste.' },
  { value: 'energy',         label: 'Energy',         emoji: '⚡', description: 'Home electricity and heating.' },
  { value: 'waste',          label: 'Waste',           emoji: '♻️', description: 'Recycling and landfill reduction.' },
];

const CHALLENGE_TYPES: { value: ChallengeType; label: string; emoji: string; description: string }[] = [
  { value: 'individual', label: 'Individual', emoji: '🧍', description: 'Personal challenges at your own pace.' },
  { value: 'family',     label: 'Family',     emoji: '👨‍👩‍👧', description: 'Involve your household in shared goals.' },
  { value: 'office',     label: 'Office',     emoji: '🏢', description: 'Collaborate with your workplace team.' },
  { value: 'college',    label: 'College',    emoji: '🎓', description: 'Compete and cooperate with classmates.' },
];

// ─── Multi-select Option Card ─────────────────────────────────────────────────

function OptionCard({
  emoji,
  label,
  description,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-xl border text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-500',
        selected
          ? 'border-brand-500/60 bg-brand-950 shadow-brand'
          : 'border-surface-border bg-surface-secondary hover:border-brand-500/30 hover:bg-surface-tertiary'
      )}
      aria-pressed={selected}
    >
      {selected && (
        <motion.div
          className="absolute top-3 right-3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <CheckCircle2 className="w-4 h-4 text-brand-400" aria-hidden="true" />
        </motion.div>
      )}
      <div className="text-2xl mb-2" aria-hidden="true">{emoji}</div>
      <div className="font-semibold text-sm text-text-primary">{label}</div>
      <div className="text-xs text-text-muted mt-1 leading-relaxed">{description}</div>
    </button>
  );
}

// ─── Onboarding Wizard ────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState<WizardData>({
    country:            '',
    city:               '',
    ageGroup:           '',
    motivation:         '',
    carbonGoals:        [],
    challengeInterests: [],
  });

  function toggleArray<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0: return data.country.trim().length > 0 && data.city.trim().length > 0;
      case 1: return data.ageGroup !== '';
      case 2: return data.motivation !== '';
      case 3: return data.carbonGoals.length > 0;
      case 4: return data.challengeInterests.length > 0;
      default: return false;
    }
  }

  async function handleFinish() {
    if (!user) { toast.error('Not authenticated.'); return; }
    setSubmitting(true);
    try {
      const onboardingData: OnboardingData = {
        country:            data.country,
        city:               data.city,
        ageGroup:           data.ageGroup as AgeGroup,
        motivation:         data.motivation as Motivation,
        carbonGoals:        data.carbonGoals,
        challengeInterests: data.challengeInterests,
        completedAt:        new Date(),
      };
      await completeOnboarding(user.uid, onboardingData);

      // Set onboarding cookie for middleware
      document.cookie = 'cm_onboarded=true; path=/; max-age=31536000; SameSite=Lax';

      toast.success('You\'re all set! Welcome to CarbonMirror 🌱');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to save your preferences. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const stepVariants = {
    enter:  { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit:   { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-primary">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">CarbonMirror</span>
          </div>

          <h1 className="text-2xl font-bold font-display text-text-primary">
            Let&apos;s personalise your experience
          </h1>
          <p className="text-text-muted mt-1 text-sm">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 rounded-full bg-surface-tertiary overflow-hidden" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #14b47c, #0ea5e9)' }}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="glass-card p-8 min-h-[360px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {/* ─── Step 0: Location ─── */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-950 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-text-primary">Where are you based?</h2>
                      <p className="text-sm text-text-muted">Helps us localise carbon data for your region.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="country" className="text-sm font-medium text-text-secondary">Country</label>
                      <input
                        id="country"
                        type="text"
                        value={data.country}
                        onChange={(e) => setData((d) => ({ ...d, country: e.target.value }))}
                        className="w-full bg-surface-tertiary border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                        placeholder="e.g. United Kingdom"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="city" className="text-sm font-medium text-text-secondary">City</label>
                      <input
                        id="city"
                        type="text"
                        value={data.city}
                        onChange={(e) => setData((d) => ({ ...d, city: e.target.value }))}
                        className="w-full bg-surface-tertiary border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                        placeholder="e.g. London"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Step 1: Age Group ─── */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-950 flex items-center justify-center">
                      <User className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-text-primary">Your age group</h2>
                      <p className="text-sm text-text-muted">We&apos;ll tailor advice to your life stage.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2" role="group" aria-label="Age group selection">
                    {AGE_GROUPS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setData((d) => ({ ...d, ageGroup: value }))}
                        className={cn(
                          'py-3 rounded-xl border text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-500',
                          data.ageGroup === value
                            ? 'border-brand-500/60 bg-brand-950 text-brand-400'
                            : 'border-surface-border bg-surface-secondary text-text-muted hover:border-brand-500/30 hover:text-text-primary'
                        )}
                        aria-pressed={data.ageGroup === value}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Step 2: Motivation ─── */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-950 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-text-primary">What drives you?</h2>
                      <p className="text-sm text-text-muted">Select your primary motivation.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3" role="group" aria-label="Motivation selection">
                    {MOTIVATIONS.map((m) => (
                      <OptionCard
                        key={m.value}
                        emoji={m.emoji}
                        label={m.label}
                        description={m.description}
                        selected={data.motivation === m.value}
                        onClick={() => setData((d) => ({ ...d, motivation: m.value }))}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Step 3: Carbon Goals ─── */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-950 flex items-center justify-center">
                      <Target className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-text-primary">Focus areas</h2>
                      <p className="text-sm text-text-muted">Select all carbon areas you want to track.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3" role="group" aria-label="Carbon goal selection">
                    {CARBON_GOALS.map((g) => (
                      <OptionCard
                        key={g.value}
                        emoji={g.emoji}
                        label={g.label}
                        description={g.description}
                        selected={data.carbonGoals.includes(g.value)}
                        onClick={() => setData((d) => ({ ...d, carbonGoals: toggleArray(d.carbonGoals, g.value) }))}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Step 4: Challenge Interests ─── */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-950 flex items-center justify-center">
                      <Users2 className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-text-primary">Challenge style</h2>
                      <p className="text-sm text-text-muted">How do you prefer to take on challenges?</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3" role="group" aria-label="Challenge type selection">
                    {CHALLENGE_TYPES.map((c) => (
                      <OptionCard
                        key={c.value}
                        emoji={c.emoji}
                        label={c.label}
                        description={c.description}
                        selected={data.challengeInterests.includes(c.value)}
                        onClick={() => setData((d) => ({ ...d, challengeInterests: toggleArray(d.challengeInterests, c.value) }))}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="btn-ghost py-2 px-4 text-sm gap-2 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="btn-brand py-2 px-6 text-sm gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={!canAdvance() || submitting}
                className="btn-brand py-2 px-6 text-sm gap-2"
                aria-busy={submitting}
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                ) : (
                  <>Let&apos;s Go! 🌱</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
