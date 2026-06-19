'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open:       boolean;
  onClose:    () => void;
  title:      string;
  description?: string;
  children:   ReactNode;
  size?:      'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby={description ? 'modal-desc' : undefined}
            className={cn(
              'fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 w-full mx-auto',
              sizes[size]
            )}
            initial={{ opacity: 0, scale: 0.96, y: '-48%' }}
            animate={{ opacity: 1, scale: 1,    y: '-50%' }}
            exit={{   opacity: 0, scale: 0.96, y: '-48%' }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div
              className={cn(
                'glass-card p-6 shadow-2xl',
                className
              )}
              style={{ borderColor: 'rgba(20,180,124,0.25)' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold font-display text-text-primary"
                  >
                    {title}
                  </h2>
                  {description && (
                    <p id="modal-desc" className="text-sm text-text-muted mt-0.5">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors flex-shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
