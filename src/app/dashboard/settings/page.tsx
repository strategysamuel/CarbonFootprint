'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  Globe,
  Ruler,
  Shield,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Check,
  LogOut,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme    = 'light' | 'dark' | 'system';
type Units    = 'metric' | 'imperial';
type Language = 'en' | 'fr' | 'de' | 'es' | 'ja' | 'zh';

interface Settings {
  displayName:    string;
  email:          string;
  theme:          Theme;
  units:          Units;
  language:       Language;
  notifications:  boolean;
  weeklyReport:   boolean;
  nudges:         boolean;
}

const INITIAL: Settings = {
  displayName:   'Samuel Mensah',
  email:         'samuel@example.com',
  theme:         'dark',
  units:         'metric',
  language:      'en',
  notifications: true,
  weeklyReport:  true,
  nudges:        true,
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  description,
  children,
  delay = 0,
}: {
  icon:        React.ElementType;
  title:       string;
  description: string;
  children:    React.ReactNode;
  delay?:      number;
}) {
  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {/* Section header */}
      <div className="px-6 py-4 border-b border-surface-border flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-950 flex items-center justify-center mt-0.5 flex-shrink-0">
          <Icon className="w-4 h-4 text-brand-400" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-semibold text-text-primary text-sm">{title}</h2>
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">{children}</div>
    </motion.div>
  );
}

// ─── Form field ───────────────────────────────────────────────────────────────

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked:  boolean;
  onChange: (v: boolean) => void;
  label:    string;
  id:       string;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <label htmlFor={id} className="text-sm text-text-secondary cursor-pointer select-none">
        {label}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0',
          checked ? 'bg-brand-600' : 'bg-surface-tertiary border border-surface-border'
        )}
        style={{ height: '22px', width: '40px' }}
      >
        <span
          className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}

// ─── Theme picker ─────────────────────────────────────────────────────────────

const THEMES: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: 'light',  label: 'Light',  icon: Sun     },
  { value: 'dark',   label: 'Dark',   icon: Moon    },
  { value: 'system', label: 'System', icon: Monitor },
];

function ThemePicker({
  value,
  onChange,
}: {
  value:    Theme;
  onChange: (t: Theme) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme selection">
      {THEMES.map(({ value: v, label, icon: Icon }) => (
        <button
          key={v}
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn(
            'relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200',
            value === v
              ? 'border-brand-500 bg-brand-950/60 text-brand-400'
              : 'border-surface-border text-text-muted hover:text-text-primary hover:bg-surface-tertiary'
          )}
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
          <span className="text-xs font-medium">{label}</span>
          {value === v && (
            <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-brand-500 flex items-center justify-center">
              <Check className="w-2 h-2 text-white" aria-hidden="true" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(INITIAL);
  const [saved,    setSaved]    = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    // In production this would call userRepository.updateUserSettings()
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleDeleteAccount() {
    // In production: auth.deleteAccount() + cleanup
    setDeleteOpen(false);
    alert('Account deletion would be triggered here in production.');
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex items-start justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Settings</h1>
          <p className="text-text-muted text-sm mt-1">Manage your account and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          id="save-settings-btn"
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
            saved
              ? 'bg-green-600 text-white'
              : 'btn-brand'
          )}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </motion.div>

      {/* ── Profile ── */}
      <Section icon={User} title="Profile" description="Your public identity on CarbonMirror." delay={0.05}>
        <Field label="Display name">
          <input
            type="text"
            id="display-name-input"
            value={settings.displayName}
            onChange={(e) => set('displayName', e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-surface-secondary text-text-primary
                       px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </Field>

        <Field label="Email address" hint="Email cannot be changed without re-authentication.">
          <div className="flex gap-2">
            <input
              type="email"
              id="email-input"
              value={settings.email}
              readOnly
              className="w-full rounded-xl border border-surface-border bg-surface-tertiary/50 text-text-muted
                         px-3 py-2.5 text-sm cursor-not-allowed"
            />
            <button className="btn-ghost text-sm px-3 py-2.5 flex-shrink-0">
              Change
            </button>
          </div>
        </Field>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-tertiary/40">
          <div className="w-14 h-14 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {settings.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">{settings.displayName}</p>
            <p className="text-xs text-text-muted mt-0.5">{settings.email}</p>
          </div>
          <button className="btn-ghost text-xs px-3 py-2 flex-shrink-0">
            Upload photo
          </button>
        </div>
      </Section>

      {/* ── Appearance ── */}
      <Section icon={Palette} title="Appearance" description="Customise how CarbonMirror looks." delay={0.1}>
        <Field label="Theme">
          <ThemePicker value={settings.theme} onChange={(t) => set('theme', t)} />
        </Field>
      </Section>

      {/* ── Preferences ── */}
      <Section icon={Globe} title="Preferences" description="Language and measurement units." delay={0.15}>
        <Field label="Language">
          <select
            id="language-select"
            value={settings.language}
            onChange={(e) => set('language', e.target.value as Language)}
            className="w-full rounded-xl border border-surface-border bg-surface-secondary text-text-primary
                       px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="en">🇬🇧 English</option>
            <option value="fr">🇫🇷 French</option>
            <option value="de">🇩🇪 German</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="ja">🇯🇵 Japanese</option>
            <option value="zh">🇨🇳 Chinese (Simplified)</option>
          </select>
        </Field>

        <Field label="Units">
          <div className="grid grid-cols-2 gap-2">
            {(['metric', 'imperial'] as Units[]).map((u) => (
              <button
                key={u}
                onClick={() => set('units', u)}
                className={cn(
                  'flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  settings.units === u
                    ? 'border-brand-500 bg-brand-950/60 text-brand-400'
                    : 'border-surface-border text-text-muted hover:text-text-primary hover:bg-surface-tertiary'
                )}
              >
                <Ruler className="w-4 h-4" aria-hidden="true" />
                {u.charAt(0).toUpperCase() + u.slice(1)}
                {settings.units === u && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* ── Notifications ── */}
      <Section icon={Bell} title="Notifications" description="Control what updates you receive." delay={0.2}>
        <div className="space-y-4">
          <Toggle
            id="notifications-toggle"
            checked={settings.notifications}
            onChange={(v) => set('notifications', v)}
            label="Push notifications"
          />
          <Toggle
            id="weekly-report-toggle"
            checked={settings.weeklyReport}
            onChange={(v) => set('weeklyReport', v)}
            label="Weekly carbon summary email"
          />
          <Toggle
            id="nudges-toggle"
            checked={settings.nudges}
            onChange={(v) => set('nudges', v)}
            label="Behavioural nudges from AI Coach"
          />
        </div>
      </Section>

      {/* ── Danger Zone ── */}
      <motion.div
        className="glass-card overflow-hidden border border-red-500/20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.25 }}
      >
        <div className="px-6 py-4 border-b border-red-500/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-950/50 flex items-center justify-center mt-0.5 flex-shrink-0">
            <Shield className="w-4 h-4 text-red-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary text-sm">Danger Zone</h2>
            <p className="text-xs text-text-muted mt-0.5">Irreversible actions — proceed with caution.</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          {/* Sign out */}
          <button
            id="sign-out-btn"
            className="w-full flex items-center justify-between p-4 rounded-xl border border-surface-border
                       hover:bg-surface-tertiary transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-text-muted group-hover:text-text-primary" aria-hidden="true" />
              <div className="text-left">
                <div className="text-sm font-medium text-text-primary">Sign out</div>
                <div className="text-xs text-text-muted">Sign out of your current session.</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted" aria-hidden="true" />
          </button>

          {/* Delete account */}
          <button
            id="delete-account-btn"
            onClick={() => setDeleteOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-red-500/20
                       hover:bg-red-950/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-red-400" aria-hidden="true" />
              <div className="text-left">
                <div className="text-sm font-medium text-red-400">Delete account</div>
                <div className="text-xs text-text-muted">Permanently delete your account and all data.</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400/60" aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        description="This will permanently delete your account, all activity logs, goals, and personal data. This action cannot be undone."
        confirmLabel="Yes, Delete My Account"
        cancelLabel="Keep Account"
        variant="danger"
      />
    </div>
  );
}
