'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { signOutUser } from '@/firebase/auth';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ─── Top Bar ──────────────────────────────────────────────────────────────────

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const router       = useRouter();
  const user         = useAuthStore((s) => s.user);
  const profile      = useAuthStore((s) => s.profile);
  const unreadCount  = useNotificationStore((s) => s.unreadCount);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  async function handleSignOut() {
    try {
      await signOutUser();
      document.cookie = 'cm_session=; path=/; max-age=0';
      document.cookie = 'cm_onboarded=; path=/; max-age=0';
      toast.success('Signed out successfully.');
      router.push('/');
    } catch {
      toast.error('Failed to sign out.');
    }
  }

  const displayName = user?.displayName ?? profile?.displayName ?? 'User';
  const email       = user?.email ?? '';
  const photoURL    = user?.photoURL;
  const initials    = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-surface-border bg-surface-secondary/80 backdrop-blur-sm z-30 flex-shrink-0">
      {/* Left — mobile menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search placeholder */}
        <div className="hidden sm:flex items-center gap-2 bg-surface-tertiary border border-surface-border rounded-xl px-3 py-2 text-sm text-text-muted w-48">
          <span>⌘K</span>
          <span>Search…</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
            className="relative p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-expanded={notifOpen}
            aria-haspopup="true"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] rounded-full bg-brand-500 flex items-center justify-center text-[10px] font-bold text-white"
                aria-hidden="true"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-80 glass-card p-4 z-50"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                role="dialog"
                aria-label="Notifications"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-text-primary">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-brand-400">{unreadCount} new</span>
                  )}
                </div>
                <div className="text-center py-8 text-text-muted text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No notifications yet
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-tertiary transition-colors"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label="Profile menu"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-gradient flex items-center justify-center flex-shrink-0">
              {photoURL ? (
                <Image src={photoURL} alt={displayName} width={32} height={32} className="object-cover w-full h-full" />
              ) : (
                <span className="text-xs font-bold text-white">{initials}</span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-text-primary leading-tight">{displayName}</div>
              <div className="text-xs text-text-muted truncate max-w-[120px]">{email}</div>
            </div>
            <ChevronDown className={cn('w-4 h-4 text-text-muted transition-transform hidden sm:block', profileOpen && 'rotate-180')} aria-hidden="true" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-56 glass-card py-2 z-50"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                role="menu"
                aria-label="Profile options"
              >
                <div className="px-4 py-2 border-b border-surface-border mb-1">
                  <div className="text-sm font-medium text-text-primary">{displayName}</div>
                  <div className="text-xs text-text-muted">{email}</div>
                </div>

                {[
                  { href: '/dashboard/settings', label: 'Profile',  icon: User     },
                  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
                ].map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
                    role="menuitem"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {label}
                  </a>
                ))}

                <div className="border-t border-surface-border mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
