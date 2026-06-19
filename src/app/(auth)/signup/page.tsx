'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/features/auth/AuthProvider';
import { signUpWithEmail, signInWithGoogle } from '@/firebase/auth';
import { getFirebaseErrorMessage } from '@/lib/utils';
import { Leaf, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const signupSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email:       z.string().email('Please enter a valid email'),
    password:    z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path:    ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function SignupPage() {
  const [showPwd, setShowPwd]   = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, initialized } = useAuth();

  useEffect(() => {
    if (initialized && user) {
      window.location.href = '/onboarding';
    }
  }, [initialized, user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(data: SignupFormData) {
    try {
      await signUpWithEmail(data.email, data.password, data.displayName);
      toast.success('Account created! Let\'s set up your profile.');
    } catch (err: unknown) {
      const code    = (err as { code?: string })?.code ?? '';
      toast.error(getFirebaseErrorMessage(code));
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome to CarbonMirror!');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      toast.error(getFirebaseErrorMessage(code));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-primary">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">CarbonMirror</span>
          </Link>
          <h1 className="text-2xl font-bold font-display text-text-primary">Create your account</h1>
          <p className="text-text-muted mt-1 text-sm">Start your sustainability journey today — free forever</p>
        </div>

        <div className="glass-card p-8 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isSubmitting}
            className="w-full btn-ghost gap-3 justify-center"
            aria-label="Sign up with Google"
          >
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="relative" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border" />
            </div>
            <div className="relative flex justify-center text-xs text-text-muted">
              <span className="bg-surface-secondary px-3">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="displayName" className="text-sm font-medium text-text-secondary">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input
                  id="displayName"
                  type="text"
                  autoComplete="name"
                  {...register('displayName')}
                  className="w-full bg-surface-tertiary border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Jane Smith"
                  aria-invalid={!!errors.displayName}
                  aria-describedby={errors.displayName ? 'name-error' : undefined}
                />
              </div>
              {errors.displayName && (
                <p id="name-error" className="text-xs text-red-400" role="alert">{errors.displayName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-text-secondary">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="w-full bg-surface-tertiary border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-xs text-red-400" role="alert">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-text-secondary">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className="w-full bg-surface-tertiary border border-surface-border rounded-xl pl-10 pr-12 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'pwd-error' : undefined}
                />
                <button type="button" onClick={() => setShowPwd((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary" aria-label={showPwd ? 'Hide password' : 'Show password'}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="pwd-error" className="text-xs text-red-400" role="alert">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-text-secondary">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input
                  id="confirmPassword"
                  type={showCpwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className="w-full bg-surface-tertiary border border-surface-border rounded-xl pl-10 pr-12 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Repeat your password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'cpwd-error' : undefined}
                />
                <button type="button" onClick={() => setShowCpwd((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary" aria-label={showCpwd ? 'Hide password' : 'Show password'}>
                  {showCpwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="cpwd-error" className="text-xs text-red-400" role="alert">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting || googleLoading} className="btn-brand w-full" aria-busy={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />Creating account…</>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
