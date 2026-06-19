'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import EcoScoreModal from './EcoScoreModal';
import {
  Leaf,
  LayoutDashboard,
  Activity,
  Target,
  Users,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: '/dashboard',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/dashboard/activities', label: 'Activities', icon: Activity        },
  { href: '/dashboard/goals',      label: 'Goals',      icon: Target          },
  { href: '/dashboard/community',  label: 'Community',  icon: Users           },
  { href: '/dashboard/ai-coach',   label: 'AI Coach',   icon: Bot             },
  { href: '/dashboard/analytics',  label: 'Analytics',  icon: BarChart3       },
  { href: '/dashboard/settings',   label: 'Settings',   icon: Settings        },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  return (
    <div
      className="h-full flex flex-col border-r border-surface-border bg-surface-secondary/80 backdrop-blur-sm"
      style={{ background: 'linear-gradient(180deg, rgba(13,31,22,0.95) 0%, rgba(4,13,9,0.95) 100%)' }}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-surface-border', collapsed ? 'justify-center' : 'gap-3 justify-between')}>
        <Link href="/dashboard" className="flex items-center gap-2" aria-label="CarbonMirror home">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              className="font-display font-bold text-base text-gradient overflow-hidden whitespace-nowrap"
            >
              CarbonMirror
            </motion.span>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={onToggle}
            className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-surface-tertiary"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Toggle button when collapsed */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="mx-auto mt-2 text-text-muted hover:text-text-primary transition-colors p-2 rounded-lg hover:bg-surface-tertiary"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto hide-scrollbar" aria-label="Dashboard navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'nav-item',
                isActive && 'active',
                collapsed && 'justify-center px-2'
              )}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn('p-4 border-t border-surface-border', collapsed && 'flex justify-center')}>
        {!collapsed ? (
          <button 
            onClick={() => setIsScoreModalOpen(true)}
            className="w-full text-left glass-card p-3 space-y-1 hover:bg-surface-tertiary/50 transition-colors cursor-pointer group"
          >
            <div className="text-xs text-brand-400 font-semibold flex items-center justify-between">
              <span>🌱 Eco Score</span>
              <span className="text-[10px] text-text-muted group-hover:text-text-primary transition-colors">Details →</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
              <div className="h-full w-3/5 rounded-full bg-brand-gradient" style={{ width: '60%' }} />
            </div>
            <div className="text-xs text-text-muted">60 / 100 — Good</div>
          </button>
        ) : (
          <button 
            onClick={() => setIsScoreModalOpen(true)}
            className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-bold text-white hover:opacity-80 transition-opacity cursor-pointer"
            title="View Eco Score Breakdown"
          >
            60
          </button>
        )}
      </div>
      <EcoScoreModal isOpen={isScoreModalOpen} onClose={() => setIsScoreModalOpen(false)} />
    </div>
  );
}
