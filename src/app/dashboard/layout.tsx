'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router      = useRouter();
  const user        = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loading     = useAuthStore((s) => s.loading);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Redirect if not authenticated (client-side guard in addition to middleware)
  useEffect(() => {
    if (initialized && !loading && !user) {
      router.replace('/login');
    }
  }, [user, initialized, loading, router]);

  // Set auth cookie for middleware
  useEffect(() => {
    if (user) {
      document.cookie = 'cm_session=1; path=/; max-age=3600; SameSite=Lax';
    }
  }, [user]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary" role="status" aria-label="Loading">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-text-muted text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-surface-primary">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}
        aria-label="Main navigation"
      >
        <Sidebar
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-72 z-50 md:hidden flex flex-col"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              aria-label="Mobile navigation"
            >
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar onMenuClick={() => setMobileSidebarOpen((o) => !o)} />
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          id="main-content"
          aria-label="Dashboard content"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
