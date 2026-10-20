import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue } from 'motion/react';
import Starfield from './Starfield';
import Asteroids from './Asteroids';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Education from './Education';
import Contact from './Contact';

const SectionWrapper = ({ children, index, total, scrollYProgress }: { children: React.ReactNode, index: number, total: number, scrollYProgress: any }) => {
  const peak = index / (total - 1);
  const distance = 1 / (total - 1);

  const z = useTransform(
    scrollYProgress,
    [peak - distance, peak, peak + distance],
    [-4000, 0, 1000]
  );

  const opacity = useTransform(
    scrollYProgress,
    [peak - distance, peak - distance * 0.4, peak - distance * 0.15, peak, peak + distance * 0.15, peak + distance * 0.4, peak + distance],
    [0, 0, 1, 1, 1, 0, 0]
  );

  const display = useTransform(
    scrollYProgress,
    (v: number) => (v > peak - distance * 0.45 && v < peak + distance * 0.45) ? 'flex' : 'none'
  );

  // Pointer-events must be controlled on the OUTER full-screen wrapper (the
  // `absolute inset-0` layer), NOT the inner content container. Each section is a
  // full-viewport absolute layer with 3D z-transforms; without pointer-events-none
  // on the outer shell, an invisible section's full-screen container still
  // intercepts clicks before they can reach the active section underneath.
  const [isInteractive, setIsInteractive] = React.useState(false);
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v: number) => {
      setIsInteractive(Math.abs(v - peak) < distance * 0.45);
    });
    return unsubscribe;
  }, [scrollYProgress, peak, distance]);

  return (
    <motion.div
      style={{ z, opacity, display }}
      className={`absolute inset-0 flex items-center justify-center ${isInteractive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div className="w-full max-w-7xl px-6 max-h-screen overflow-y-auto py-8 scrollbar-hide">
        {children}
      </div>
    </motion.div>
  );
};

/** Rotating "JSTIN $" ring. Extracted as a component so Scene can unmount it
 *  outside its 0→0.3 visibility window — a 2400×2400 forever-rotating SVG is
 *  one of the heaviest persistent GPU layers on mobile during transitions. */
const TextRing = ({ scrollYProgress }: { scrollYProgress: any }) => (
  <motion.div
    className="absolute top-1/2 left-1/2 w-[min(2400px,160vmax)] h-[min(2400px,160vmax)] pointer-events-none"
    style={{
      x: "-50%",
      y: "-50%",
      z: useTransform(scrollYProgress, [0, 0.3], [-3000, 2000]),
      rotateX: useTransform(scrollYProgress, [0, 0.3], [60, 75]),
      rotateY: useTransform(scrollYProgress, [0, 0.3], [-5, 5]),
      opacity: useTransform(scrollYProgress, [0, 0.05, 0.2, 0.3], [0, 1, 1, 0]),
      willChange: "transform"
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="w-full h-full relative"
    >
      <svg viewBox="0 0 2400 2400" className="w-full h-full text-zinc-600/50">
        <path id="circlePath" d="M 1200, 1200 m -900, 0 a 900,900 0 1,1 1800,0 a 900,900 0 1,1 -1800,0" fill="none" />
        <text className="text-[5rem] font-bold uppercase tracking-[0.3em] fill-current" style={{ fontFamily: 'monospace' }}>
          <textPath href="#circlePath" startOffset="0%">
            {Array(15).fill('JSTIN $ ').join('')}
          </textPath>
        </text>
      </svg>
    </motion.div>
  </motion.div>
);

export default function Scene() {
  const { scrollYProgress, scrollY } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100, mass: 0.5 });
  const scrollVelocity = useVelocity(scrollY);

  const shakeX = useMotionValue(0);
  const shakeY = useMotionValue(0);

  // Desktop-only effects gate. The rotating ring is a huge composited texture
  // (up to 2400px × device-pixel-ratio) whose 3D transform changes every scroll
  // frame, and the camera shake translates the ENTIRE fixed scene per frame —
  // both force full-screen recomposition, which is what makes the Hero→About
  // transition stutter on phones. Kept for fine pointers, skipped on touch.
  const [fxEnabled] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : true
  );

  // The ring is only visible for progress 0→0.3; unmounting it afterwards frees
  // a huge rotating GPU layer for the rest of the page (esp. mobile).
  const [showRing, setShowRing] = useState(true);
  useEffect(() => {
    return smoothProgress.on('change', (v: number) => setShowRing(v < 0.35));
  }, [smoothProgress]);

  useAnimationFrame(() => {
    if (!fxEnabled) return;
    const v = scrollVelocity.get();
    const p = smoothProgress.get();

    // Check if we are between Hero(0) and Pitch(0.25), or Experience(0.75) and Contact(1)
    const isShakingZone1 = p > 0.02 && p < 0.23;
    const isShakingZone2 = p > 0.77 && p < 0.98;

    if (Math.abs(v) > 20 && (isShakingZone1 || isShakingZone2)) {
      const intensity = Math.min(Math.abs(v) / 100, 10);
      shakeX.set((Math.random() - 0.5) * intensity);
      shakeY.set((Math.random() - 0.5) * intensity);
    } else {
      if (shakeX.get() !== 0 || shakeY.get() !== 0) {
        shakeX.set(0);
        shakeY.set(0);
      }
    }
  });

  const navItems = ['Hero', 'About', 'Selected Works', 'Experience', 'Education', 'G?'];
  const totalSections = navItems.length;



  return (
    <div className="h-[800vh] relative bg-[#0a0a0a]">
      {/* Desktop Sidebar Navigation */}
      <div className="fixed left-4 md:left-6 bottom-8 md:bottom-12 z-50 hidden md:flex flex-col gap-3 md:gap-4 mix-blend-difference opacity-50 hover:opacity-100 transition-opacity duration-300">
        {navItems.map((item, idx) => (
          <button
            key={item}
            onClick={() => window.scrollTo({ top: (idx / (navItems.length - 1)) * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'smooth' })}
            className="text-[9px] md:text-[10px] text-left uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-3 interactive-hover"
          >
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              style={{
                opacity: useTransform(smoothProgress,
                  [(idx - 0.5) / (navItems.length - 1), idx / (navItems.length - 1), (idx + 0.5) / (navItems.length - 1)],
                  [0.2, 1, 0.2]
                ),
                scale: useTransform(smoothProgress,
                  [(idx - 0.5) / (navItems.length - 1), idx / (navItems.length - 1), (idx + 0.5) / (navItems.length - 1)],
                  [1, 1.5, 1]
                )
              }}
            />
            {item}
          </button>
        ))}
      </div>

      {/* Mobile Bottom Navigation — dots + labels, hidden on md+ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex md:hidden items-center gap-5 bg-black/40 backdrop-blur-md border border-zinc-800/60 rounded-full px-5 py-2.5">
        {navItems.map((item, idx) => (
          <button
            key={item}
            onClick={() => window.scrollTo({ top: (idx / (navItems.length - 1)) * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'smooth' })}
            className="flex items-center justify-center p-2 group active:scale-90 transition-transform"
            aria-label={item}
          >
            <motion.div
              className="rounded-full bg-white"
              style={{
                width: useTransform(smoothProgress,
                  [(idx - 0.4) / (navItems.length - 1), idx / (navItems.length - 1), (idx + 0.4) / (navItems.length - 1)],
                  [6, 10, 6]
                ),
                height: useTransform(smoothProgress,
                  [(idx - 0.4) / (navItems.length - 1), idx / (navItems.length - 1), (idx + 0.4) / (navItems.length - 1)],
                  [6, 10, 6]
                ),
                opacity: useTransform(smoothProgress,
                  [(idx - 0.4) / (navItems.length - 1), idx / (navItems.length - 1), (idx + 0.4) / (navItems.length - 1)],
                  [0.25, 1, 0.25]
                ),
              }}
            />
          </button>
        ))}
      </div>

      <motion.div
        className="fixed inset-0 overflow-hidden bg-[#0a0a0a] flex items-center justify-center perspective-1000"
        style={{ x: shakeX, y: shakeY }}
      >
        <Starfield />
        <Asteroids scrollYProgress={smoothProgress} />

        {/* Smoke Overlay — blend mode skipped on touch (full-screen blend pass
            over the animating canvas is a per-frame mobile GPU cost) */}
        <div className={`absolute inset-0 pointer-events-none opacity-40 bg-smoke animate-smoke ${fxEnabled ? 'mix-blend-screen' : ''}`}></div>

        {/* Text Ring — desktop only, unmounted outside its visibility window */}
        {fxEnabled && showRing && <TextRing scrollYProgress={smoothProgress} />}

        {/* pointer-events-none is critical: inside preserve-3d, this container's
            z=0 plane sits IN FRONT of sections at fractional negative translateZ
            (scrollYProgress never hits exactly 1.0 on fractional-DPR zoom levels)
            and would steal all clicks in 3D hit-testing. */}
        <div className="relative w-full h-full transform-style-3d pointer-events-none">
          <SectionWrapper index={0} total={6} scrollYProgress={smoothProgress}>
            <Hero scrollYProgress={smoothProgress} />
          </SectionWrapper>
          <SectionWrapper index={1} total={6} scrollYProgress={smoothProgress}>
            <About />
          </SectionWrapper>
          <SectionWrapper index={2} total={6} scrollYProgress={smoothProgress}>
            <Projects />
          </SectionWrapper>
          <SectionWrapper index={3} total={6} scrollYProgress={smoothProgress}>
            <Experience />
          </SectionWrapper>
          <SectionWrapper index={4} total={6} scrollYProgress={smoothProgress}>
            <Education />
          </SectionWrapper>
          <SectionWrapper index={5} total={6} scrollYProgress={smoothProgress}>
            <Contact />
          </SectionWrapper>
        </div>
      </motion.div>
    </div>
  );
}
