'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight, Leaf, TrendingDown, Users, Zap, Globe2, Target } from 'lucide-react';

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Animated Earth SVG ───────────────────────────────────────────────────────

function AnimatedEarth() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(20,180,124,0.15) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orbit ring 1 */}
      <motion.div
        className="absolute w-[320px] h-[320px] rounded-full border border-brand-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-400 shadow-brand" />
      </motion.div>

      {/* Orbit ring 2 */}
      <motion.div
        className="absolute w-[240px] h-[240px] rounded-full border border-accent-500/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent-400" />
      </motion.div>

      {/* Central globe */}
      <motion.div
        className="relative w-40 h-40 rounded-full flex items-center justify-center"
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'linear-gradient(135deg, #14b47c 0%, #0ea5e9 100%)',
          boxShadow: '0 0 60px rgba(20,180,124,0.4), 0 0 120px rgba(14,165,233,0.2)',
        }}
      >
        <Globe2 className="w-20 h-20 text-white/90" strokeWidth={1} />

        {/* Surface shimmer */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
        </div>
      </motion.div>

      {/* Floating stat badges */}
      {[
        { label: 'CO₂ Saved',  value: '2.4t',  angle: 45,  radius: 190, color: 'brand' },
        { label: 'Active',     value: '12.8k', angle: 150, radius: 180, color: 'accent' },
        { label: 'Reduction',  value: '34%',   angle: 270, radius: 185, color: 'brand' },
      ].map(({ label, value, angle, radius, color }) => {
        const rad = (angle * Math.PI) / 180;
        const x   = Math.cos(rad) * radius;
        const y   = Math.sin(rad) * radius;
        return (
          <motion.div
            key={label}
            className="absolute glass-card px-3 py-2 text-center"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + angle / 500 }}
          >
            <div className={`text-lg font-bold font-display text-${color}-400`}>{value}</div>
            <div className="text-xs text-text-muted">{label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Feature Cards ────────────────────────────────────────────────────────────

const features = [
  {
    icon:        TrendingDown,
    title:       'Track Your Impact',
    description: 'Log daily activities and instantly see their carbon footprint in real-time.',
    gradient:    'from-brand-500/20 to-brand-700/5',
    iconColor:   'text-brand-400',
  },
  {
    icon:        Zap,
    title:       'AI-Powered Coaching',
    description: 'Personalized sustainability advice from Gemini AI, tailored to your lifestyle.',
    gradient:    'from-accent-500/20 to-accent-700/5',
    iconColor:   'text-accent-400',
  },
  {
    icon:        Users,
    title:       'Community Challenges',
    description: 'Join teams, compete in leaderboards, and create positive change together.',
    gradient:    'from-purple-500/20 to-purple-700/5',
    iconColor:   'text-purple-400',
  },
  {
    icon:        Target,
    title:       'Achievable Goals',
    description: 'Set realistic reduction targets with science-backed milestones and rewards.',
    gradient:    'from-amber-500/20 to-amber-700/5',
    iconColor:   'text-amber-400',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: '12.8K', label: 'Active Users' },
  { value: '3,240t', label: 'CO₂ Saved' },
  { value: '89%',   label: 'Report Behaviour Change' },
  { value: '4.8★',  label: 'User Rating' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-surface-primary">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(20,180,124,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,180,124,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-gradient">CarbonMirror</span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
              <a href="#features"  className="hover:text-brand-400 transition-colors">Features</a>
              <a href="#how"       className="hover:text-brand-400 transition-colors">How It Works</a>
              <a href="#community" className="hover:text-brand-400 transition-colors">Community</a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link href="/login"  className="btn-ghost py-2 px-4 text-sm hidden sm:flex">Sign In</Link>
              <Link href="/signup" className="btn-brand py-2 px-4 text-sm">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center glow-section pt-16">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
            {/* Left — copy */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div variants={fadeUp} className="inline-flex">
                <span className="flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/60 px-4 py-1.5 text-sm text-brand-400 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                  </span>
                  Climate Action Platform
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeUp} className="space-y-2">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight">
                  <span className="text-gradient">CarbonMirror</span>
                </h1>
                <p className="text-xl sm:text-2xl text-text-secondary font-light leading-relaxed max-w-lg">
                  See the world you create through your everyday choices.
                </p>
              </motion.div>

              {/* Description */}
              <motion.p variants={fadeUp} className="text-base text-text-muted leading-relaxed max-w-md">
                CarbonMirror transforms carbon tracking into a journey of awareness, community, and lasting behavioural change — powered by AI and driven by you.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="btn-brand text-base gap-2 group">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="btn-ghost text-base">
                  Learn More
                </a>
              </motion.div>

              {/* Social proof */}
              <motion.div variants={fadeUp} className="flex items-center gap-4 text-sm text-text-muted">
                <div className="flex -space-x-2">
                  {['#14b47c', '#0ea5e9', '#a855f7', '#f59e0b'].map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-surface-primary flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span>Joined by <strong className="text-text-primary">12,800+</strong> climate-conscious individuals</span>
              </motion.div>
            </motion.div>

            {/* Right — Earth visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative h-[500px] hidden lg:flex items-center justify-center"
              aria-hidden="true"
            >
              <AnimatedEarth />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="border-y border-surface-border bg-surface-secondary/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-bold font-display text-gradient">{value}</div>
                <div className="text-sm text-text-muted mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 glow-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display text-gradient">
              Everything You Need to Act
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              A complete platform designed around behavioural science to make sustainable living intuitive, rewarding, and social.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, gradient, iconColor }, i) => (
              <motion.div
                key={title}
                className="glass-card p-6 space-y-4 group hover:border-brand-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient}`}
                >
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="font-semibold text-text-primary font-display">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="glass-card p-12 space-y-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(20,180,124,0.1) 0%, rgba(14,165,233,0.05) 100%)',
            }}
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold font-display">
                Ready to See Your{' '}
                <span className="text-gradient">Carbon Mirror</span>?
              </h2>
              <p className="text-text-muted text-lg">
                Join thousands already making a difference. It takes 2 minutes to get started.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-brand text-lg px-8 py-4 gap-2 group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="text-xs text-text-muted">Free forever · No credit card required · Powered by Google Cloud</p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-brand-500" />
              <span>© 2025 CarbonMirror. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-brand-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-brand-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
