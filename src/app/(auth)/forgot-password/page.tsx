'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { resetPassword } from '@/firebase/auth';
import { getFirebaseErrorMessage } from '@/lib/utils';
import { Leaf, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await resetPassword(data.email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      toast.error(getFirebaseErrorMessage(code));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-primary">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">CarbonMirror</span>
          </Link>
        </div>

        <div className="glass-card p-8">
          {!sent ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold font-display text-text-primary">Reset password</h1>
                <p className="text-text-muted mt-1 text-sm">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

                <button type="submit" disabled={isSubmitting} className="btn-brand w-full" aria-busy={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />Sending…</>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <motion.div
              className="text-center space-y-4 py-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle2 className="w-16 h-16 text-brand-400 mx-auto" />
              <h2 className="text-xl font-bold font-display text-text-primary">Check your inbox</h2>
              <p className="text-text-muted text-sm">
                We sent a password reset link to <strong className="text-text-primary">{getValues('email')}</strong>.
                It may take a few minutes to arrive.
              </p>
            </motion.div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
