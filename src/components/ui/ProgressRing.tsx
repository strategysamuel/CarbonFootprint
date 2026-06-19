'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  /** 0–100 */
  value:       number;
  size?:       number;
  strokeWidth?: number;
  color?:      string;
  trackColor?: string;
  label?:      string;
  className?:  string;
}

export function ProgressRing({
  value,
  size        = 80,
  strokeWidth = 6,
  color       = '#14b47c',
  trackColor  = 'rgba(20,180,124,0.12)',
  label,
  className,
}: ProgressRingProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius       = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset       = circumference - (clampedValue / 100) * circumference;

  const circleRef = useRef<SVGCircleElement>(null);

  // Animate on mount / value change
  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)';
    el.style.strokeDashoffset = String(offset);
  }, [offset]);

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Progress: ${clampedValue}%${label ? ` — ${label}` : ''}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference} /* starts at 0, animates to target */
        />
      </svg>

      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold font-display text-text-primary leading-none">
          {clampedValue}%
        </span>
        {label && (
          <span className="text-[10px] text-text-muted leading-tight mt-0.5 text-center px-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
