import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/** Returns true when the primary input is a touchscreen (no fine pointer). */
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: coarse)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isTouch;
}

export default function MouseParallax({
  children,
  className = '',
  factor = 0.05,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  factor?: number;
  style?: React.CSSProperties;
}) {
  const isTouch = useIsTouch();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Skip listener on touch devices — springs stay at 0 (no visual offset)
    if (isTouch) return;

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) * factor);
      mouseY.set((e.clientY - window.innerHeight / 2) * factor);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [factor, isTouch, mouseX, mouseY]);

  // On touch devices render a plain div — zero overhead, zero offset
  if (isTouch) {
    return (
      <div style={style} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div style={{ x, y, ...style }} className={className}>
      {children}
    </motion.div>
  );
}
