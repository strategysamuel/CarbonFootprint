'use client';

import { Modal } from './Modal';

interface ConfirmDialogProps {
  open:         boolean;
  onClose:      () => void;
  onConfirm:    () => void;
  title:        string;
  description:  string;
  confirmLabel?: string;
  cancelLabel?:  string;
  variant?:     'danger' | 'warning';
  loading?:     boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  variant      = 'danger',
  loading      = false,
}: ConfirmDialogProps) {
  const dangerStyles =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-500 text-white'
      : 'bg-amber-600 hover:bg-amber-500 text-white';

  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="sm">
      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="btn-ghost flex-1 text-sm py-2.5"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200
            active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${dangerStyles}`}
        >
          {loading ? 'Processing…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
