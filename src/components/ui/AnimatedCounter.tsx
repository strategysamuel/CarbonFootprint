'use client';

import { useEffect, useRef } from 'react';
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
} from 'framer-motion';

interface AnimatedCounterProps {
  value:       number;
  duration?:   number;   // seconds
  decimals?:   number;
  prefix?:     string;
  suffix?:     string;
  className?:  string;
}

export function AnimatedCounter({
  value,
  duration  = 1.2,
  decimals  = 1,
  prefix    = '',
  suffix    = '',
  className,
}: AnimatedCounterProps) {
  const motionVal  = useMotionValue(0);
  const rounded    = useTransform(motionVal, (v) =>
    `${prefix}${v.toFixed(decimals)}${suffix}`
  );
  const prevRef    = useRef(0);

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => motionVal.set(v),
    });
    prevRef.current = value;
    return controls.stop;
  }, [value, duration, motionVal]);

  return (
    <motion.span className={className}>
      {rounded}
    </motion.span>
  );
}
