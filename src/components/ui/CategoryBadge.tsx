import { Car, Utensils, Zap, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CarbonCategory } from '@/types';

interface CategoryBadgeProps {
  category:  CarbonCategory;
  size?:     'sm' | 'md';
  className?: string;
  showLabel?: boolean;
}

const config: Record<
  CarbonCategory,
  { label: string; icon: React.ElementType; bg: string; text: string }
> = {
  transportation: {
    label: 'Transport',
    icon:  Car,
    bg:    'bg-brand-950',
    text:  'text-brand-400',
  },
  food: {
    label: 'Food',
    icon:  Utensils,
    bg:    'bg-sky-950',
    text:  'text-sky-400',
  },
  energy: {
    label: 'Energy',
    icon:  Zap,
    bg:    'bg-purple-950',
    text:  'text-purple-400',
  },
  waste: {
    label: 'Waste',
    icon:  Trash2,
    bg:    'bg-amber-950',
    text:  'text-amber-400',
  },
};

export function CategoryBadge({
  category,
  size      = 'md',
  className,
  showLabel = true,
}: CategoryBadgeProps) {
  const { label, icon: Icon, bg, text } = config[category];
  const isSmall = size === 'sm';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        bg,
        text,
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      <Icon className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />
      {showLabel && label}
    </span>
  );
}
