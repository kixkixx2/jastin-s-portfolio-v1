import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket } from 'lucide-react';
import { getAllPortfolioImageUrls, preloadImages } from '../utils/imagePreload';

const MAX_WAIT_MS = 20000;

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [waitingForAssets, setWaitingForAssets] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let cancelled = false;
    let animationDone = false;
    let imagesDone = false;
    let interval: ReturnType<typeof setInterval>;

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      setWaitingForAssets(false);
      setExploded(true);
      setTimeout(() => onCompleteRef.current(), 0);
    };

    const tryFinish = () => {
      if (cancelled || !animationDone || !imagesDone) return;
      finish();
    };

    preloadImages(getAllPortfolioImageUrls()).then(() => {
      if (cancelled) return;
      imagesDone = true;
      tryFinish();
    });

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          animationDone = true;
          if (!imagesDone) setWaitingForAssets(true);
          tryFinish();
        }
        return next;
      });
    }, 15);

    const safety = setTimeout(() => {
      if (cancelled) return;
      imagesDone = true;
      animationDone = true;
      clearInterval(interval);
      setProgress(100);
      finish();
    }, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(safety);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-[#0a0a0a]"
        animate={{ opacity: exploded ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      />

      <div className="flex flex-col items-center gap-8 w-full max-w-2xl px-6 relative z-10">
        <motion.div
          className="w-full flex justify-center h-48 md:h-64 relative overflow-hidden"
          animate={{
            scale: exploded ? 1.5 : 1,
            opacity: exploded ? 0 : 1,
            filter: exploded ? 'blur(12px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <svg className="w-full h-full" viewBox="0 0 800 400">
            <motion.text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="font-bold lowercase tracking-tighter"
              style={{ fontSize: '140px' }}
              fill="transparent"
              stroke="white"
              strokeWidth="2"
              initial={{ strokeDasharray: 1500, strokeDashoffset: 1500 }}
              animate={{ strokeDashoffset: 0, fill: exploded ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)' }}
              transition={{
                strokeDashoffset: { duration: 2.5, ease: 'easeInOut' },
                fill: { duration: 0.4 },
              }}
            >
              {'<jstin/>'}
            </motion.text>
          </svg>
        </motion.div>

        <motion.div
          className="w-full relative h-12 flex items-center"
          animate={{ opacity: exploded ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence>
            {!exploded && (
              <motion.div
                key="spaceship"
                className="absolute left-0 top-1/2 -translate-y-1/2 text-white z-10 flex items-center"
                style={{ left: `${progress}%`, x: '-100%' }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Rocket size={32} className="rotate-45" />
                <motion.div
                  className="w-12 h-1 bg-gradient-to-r from-transparent to-orange-500 rounded-full ml-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 0.2 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!exploded && (
              <motion.div
                key="asteroid"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16"
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full fill-zinc-600 animate-spin-slow" style={{ animationDuration: '10s' }}>
                  <path d="M49.5,8.5c11.7-1.3,21.8,4.1,28.6,12.7c6.8,8.5,13.6,18.8,12.2,29.9c-1.4,11.1-10.7,21.2-20.9,27c-10.3,5.8-21.5,7.3-32.5,4.7c-11-2.6-21.8-9.4-27.4-19C4,54.1,4.9,41.9,10.6,31.4C16.3,20.8,26.7,11.7,38,9.4C41.8,8.6,45.6,8.9,49.5,8.5z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {exploded && (
              <motion.div
                key="explosion"
                className="absolute right-4 z-50 top-1/2 -translate-y-1/2 z-20"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 10, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="w-16 h-16 rounded-full bg-orange-500 blur-md" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute w-full h-[1px] bg-zinc-800 top-1/2 -translate-y-1/2" />
        </motion.div>

        <motion.div
          className="text-zinc-500 font-mono text-sm tracking-widest uppercase"
          animate={{ opacity: exploded ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {waitingForAssets ? 'Loading assets...' : `Initializing / ${progress}%`}
        </motion.div>
      </div>
    </motion.div>
  );
}
