import React from 'react';
import { motion, useTransform, MotionValue } from 'motion/react';

const AsteroidItem = ({ asteroid, scrollYProgress }: { asteroid: any, scrollYProgress: MotionValue<number> }) => {
  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [-20 * asteroid.speed, 100 * asteroid.speed]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [asteroid.rotation, asteroid.rotation + 360 * asteroid.speed]
  );
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${asteroid.x}%`,
        top: `${asteroid.y}%`,
        width: asteroid.size,
        height: asteroid.size,
        y: useTransform(yOffset, v => `${v}vh`),
        rotate,
        opacity: 0.15,
        willChange: 'transform' // Hardware accel hint
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full fill-zinc-500">
        <path d="M49.5,8.5c11.7-1.3,21.8,4.1,28.6,12.7c6.8,8.5,13.6,18.8,12.2,29.9c-1.4,11.1-10.7,21.2-20.9,27c-10.3,5.8-21.5,7.3-32.5,4.7c-11-2.6-21.8-9.4-27.4-19C4,54.1,4.9,41.9,10.6,31.4C16.3,20.8,26.7,11.7,38,9.4C41.8,8.6,45.6,8.9,49.5,8.5z" />
      </svg>
    </motion.div>
  );
};

export default function Asteroids({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Generate random asteroid positions
  const asteroids = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      speed: Math.random() * 2 + 1,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {asteroids.map(asteroid => (
        <React.Fragment key={asteroid.id}>
          <AsteroidItem asteroid={asteroid} scrollYProgress={scrollYProgress} />
        </React.Fragment>
      ))}
    </div>
  );
}
