import React, { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { prefetchCarouselNeighbors } from '../utils/imagePreload';
import { ImageLightbox, useImageLightbox } from './ImageLightbox';

export default function Experience() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { lightbox, openLightbox, closeLightbox, setLightboxIndex } = useImageLightbox();
  const images = (PORTFOLIO_DATA.experience[0] as any).images || [];

  useEffect(() => {
    if (images.length === 0) return;
    prefetchCarouselNeighbors(images, currentImageIndex);
  }, [currentImageIndex, images]);

  useEffect(() => {
    if (images.length === 0 || lightbox) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, lightbox]);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-24 px-4 sm:px-8">
      <ImageLightbox
        state={lightbox}
        onClose={closeLightbox}
        onIndexChange={(index) => {
          setLightboxIndex(index);
          setCurrentImageIndex(index);
        }}
      />

      <div className="w-full lg:w-1/2 flex flex-col">
        <h2 className="text-[12vw] lg:text-8xl font-bold uppercase tracking-tighter text-zinc-800 mb-6 lg:mb-12 leading-none">Experience</h2>
        <div className="space-y-8 lg:space-y-16">
          {PORTFOLIO_DATA.experience.map(exp => (
            <div key={exp.id} className="relative">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2 lg:mb-4">
                <h3 className="text-xl sm:text-3xl font-bold uppercase">{exp.company}</h3>
                <span className="text-lime-400 text-xs sm:text-sm font-mono shrink-0">{exp.date}</span>
              </div>
              <h4 className="text-base sm:text-xl text-zinc-400 font-light mb-3 lg:mb-6">{exp.role}</h4>
              <ul className="space-y-2 lg:space-y-4 text-zinc-500 font-mono text-xs sm:text-sm">
                {exp.points.map((pt, i) => (
                  <li key={i} className="flex gap-2 lg:gap-4">
                    <span className="text-zinc-700">+</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center mt-6 lg:mt-0">
        <div className="w-full h-48 sm:h-64 lg:h-96 rounded-lg overflow-hidden border border-zinc-800 transition-all duration-700 relative group/carousel">
          {images.length > 0 ? (
            <>
              <button
                type="button"
                onClick={() => openLightbox(images, currentImageIndex, 'Experience')}
                className="absolute inset-0 z-10 cursor-zoom-in group/expand focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/60"
                aria-label="Expand experience image"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt="Experience"
                    className="w-full h-full object-cover absolute inset-0 pointer-events-none"
                    loading="lazy"
                    decoding="async"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    draggable={false}
                  />
                </AnimatePresence>
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/expand:bg-black/30 transition-colors duration-300">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-mono uppercase tracking-wider opacity-0 group-hover/expand:opacity-100 transition-opacity duration-300">
                    <ZoomIn size={14} />
                    <span className="hidden sm:inline">Expand</span>
                  </span>
                </span>
                <span className="absolute bottom-3 right-3 sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white/80 pointer-events-none">
                  <ZoomIn size={14} />
                </span>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length); }}
                className="absolute left-2 sm:left-4 z-20 top-1/2 -translate-y-1/2 bg-black/50 p-2.5 sm:p-3 rounded-full text-white opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity interactive-hover active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % images.length); }}
                className="absolute right-2 sm:right-4 z-20 top-1/2 -translate-y-1/2 bg-black/50 p-2.5 sm:p-3 rounded-full text-white opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity interactive-hover active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-none">
                {images.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </div>
            </>
          ) : (
            <img src="https://placehold.co/600x800/27272a/a1a1aa?text=Internship+Image" alt="Internship" className="w-full h-full object-cover" />
          )}
        </div>
      </div>
    </div>
  );
}
