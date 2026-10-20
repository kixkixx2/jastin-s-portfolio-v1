import React, { useEffect, useState, useRef } from 'react';
import { motion, useTransform, MotionValue, useMotionValue, animate } from 'motion/react';
import { PORTFOLIO_DATA } from '../data';
import { Mail, Phone, ExternalLink, ArrowDown } from 'lucide-react';
import Magnetic from './Magnetic';
import MouseParallax from './MouseParallax';

import profileImgSrc from '../../assets/profile.jpg';
import jastinImgSrc from '../../assets/jastin.jpg';

const profileImg = profileImgSrc;
const jastinImg = jastinImgSrc;

const DismantleChar = ({ char, i, p, isTransparent }: { char: string, i: number, p: MotionValue<number>, isTransparent: boolean }) => {
  const randX = ((i * 47) % 200) - 100;
  const randY = ((i * 73) % 200) - 100;
  const randZ = ((i * 113) % 400) + 100;
  const randRotX = ((i * 137) % 180) - 90;
  const randRotY = ((i * 149) % 180) - 90;

  const x = useTransform(p, [0, 0.15], [0, randX * 6]);
  const y = useTransform(p, [0, 0.15], [0, randY * 6]);
  const z = useTransform(p, [0, 0.15], [0, randZ * 5]);
  const rotateX = useTransform(p, [0, 0.15], [0, randRotX]);
  const rotateY = useTransform(p, [0, 0.15], [0, randRotY]);
  const opacity = useTransform(p, [0.05, 0.15], [1, 0]);

  return (
    <motion.span
      className={`inline-block ${isTransparent ? 'text-transparent' : 'text-white'}`}
      style={{ x, y, z, rotateX, rotateY, opacity }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

const DismantleText = ({ text, progress, isTransparent }: { text: string, progress: MotionValue<number> | undefined, isTransparent: boolean }) => {
  const defaultProgress = useMotionValue(0);
  const scrollP = progress || defaultProgress;

  const loadP = useMotionValue(1);

  useEffect(() => {
    animate(loadP, 0, { duration: 2, ease: [0.16, 1, 0.3, 1] });
  }, [loadP]);

  const p = useTransform(() => Math.min(scrollP.get() + loadP.get(), 1));

  return (
    <span className="flex justify-center" style={{ WebkitTextStroke: isTransparent ? '2px white' : 'none' }}>
      {text.split('').map((char, i) => (
        <React.Fragment key={i}>
          <DismantleChar char={char} i={i} p={p} isTransparent={isTransparent} />
        </React.Fragment>
      ))}
    </span>
  );
};

/** Shared card flip — used in both mobile and desktop layouts */
function CardFlip({
  isFlipped,
  onFlip,
  className = '',
}: {
  isFlipped: boolean;
  onFlip: () => void;
  className?: string;
}) {
  return (
    <div
      className={`cursor-pointer relative ${className}`}
      style={{ perspective: 1000, WebkitPerspective: 1000 }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 320, damping: 26 }}
        onClick={onFlip}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full rounded-lg overflow-hidden border border-zinc-800 md:grayscale md:hover:grayscale-0 transition-all duration-700"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <img src={profileImg} alt="Profile" className="w-full h-full object-cover" fetchPriority="high" decoding="async" />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full rounded-lg overflow-hidden border border-zinc-800 md:grayscale md:hover:grayscale-0 transition-all duration-700"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <img src={jastinImg} alt="Jastin" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>
      </motion.div>
    </div>
  );
}

/** True at/above the md breakpoint. Used to mount only ONE layout at a time —
 *  rendering both mobile and desktop DismantleText trees meant ~2x per-character
 *  3D transform work every scroll frame on phones (half of it display:none). */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const fn = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return isDesktop;
}

export default function Hero({ scrollYProgress }: { scrollYProgress?: MotionValue<number> }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isDesktop = useIsDesktop();
  const userFlippedRef = useRef(false);

  const handleFlip = () => {
    userFlippedRef.current = true;
    setIsFlipped((prev) => !prev);
  };

  // Quick hint flip on enter so users know the card is interactive
  useEffect(() => {
    const flipOut = setTimeout(() => {
      if (userFlippedRef.current) return;
      setIsFlipped(true);
    }, 350);
    const flipBack = setTimeout(() => {
      if (userFlippedRef.current) return;
      setIsFlipped(false);
    }, 900);

    return () => {
      clearTimeout(flipOut);
      clearTimeout(flipBack);
    };
  }, []);

  return (
    <div className="relative h-screen w-full mx-auto">

      {/* ── MOBILE layout (flex column — no absolute overlap) ─────────────── */}
      {!isDesktop && (
      <div className="flex flex-col h-full md:hidden pt-24 pb-28 px-4">
        {/* Name + subtitle */}
        <div className="flex flex-col items-start flex-shrink-0 pointer-events-none">
          <motion.h1
            className="text-[15vw] font-bold tracking-tighter leading-[0.85] uppercase perspective-1000 flex flex-col items-start"
            style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
          >
            <DismantleText text={PORTFOLIO_DATA.name.split(' ')[0]} progress={scrollYProgress} isTransparent={true} />
            <DismantleText text={PORTFOLIO_DATA.name.split(' ').slice(1).join(' ')} progress={scrollYProgress} isTransparent={false} />
          </motion.h1>
          <p className="mt-4 text-zinc-500 font-mono uppercase tracking-widest text-sm pl-1">( Developer )</p>
        </div>

        {/* Card pushed to bottom-right via flex-1 + self-align */}
        <div className="flex-1 flex items-end justify-end pointer-events-auto">
          <CardFlip
            isFlipped={isFlipped}
            onFlip={handleFlip}
            className="w-44 h-60 sm:w-52 sm:h-72"
          />
        </div>
      </div>
      )}

      {/* ── DESKTOP layout (absolute positioned, md+) ─────────────────────── */}
      {isDesktop && (<>
      <MouseParallax
        factor={0.03}
        className="hidden md:block text-left space-y-3 font-mono text-zinc-400 text-sm absolute left-8 md:left-24 top-32 z-20"
      >
        <>{/* empty */}</>
      </MouseParallax>

      <MouseParallax
        factor={0.1}
        className="hidden md:flex w-full flex-col items-start justify-center absolute top-0 left-0 right-0 bottom-0 z-20 pointer-events-none pl-8"
      >
        <motion.h1
          className="text-[11vw] font-bold tracking-tighter leading-[0.85] uppercase mix-blend-difference perspective-1000 flex flex-col items-start"
          style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
        >
          <DismantleText text={PORTFOLIO_DATA.name.split(' ')[0]} progress={scrollYProgress} isTransparent={true} />
          <DismantleText text={PORTFOLIO_DATA.name.split(' ').slice(1).join(' ')} progress={scrollYProgress} isTransparent={false} />
        </motion.h1>
        <p className="mt-6 text-zinc-500 font-mono uppercase tracking-widest text-sm pl-2">( Developer )</p>
      </MouseParallax>

      <div className="hidden md:block absolute right-8 z-30 top-1/2 -translate-y-1/2 pointer-events-auto">
        <MouseParallax
          factor={0.05}
          className="w-72 h-96 lg:w-[26rem] lg:h-[34rem]"
          style={{ perspective: 1000, WebkitPerspective: 1000 } as React.CSSProperties}
        >
          <CardFlip
            isFlipped={isFlipped}
            onFlip={handleFlip}
            className="w-full h-full"
          />
        </MouseParallax>
      </div>
      </>)}

    </div>
  );
}
