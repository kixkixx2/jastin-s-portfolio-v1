import React, { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { prefetchCarouselNeighbors } from '../utils/imagePreload';
import { ImageLightbox, useImageLightbox } from './ImageLightbox';

export default function Education() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { lightbox, openLightbox, closeLightbox, setLightboxIndex } = useImageLightbox();

  const images = (PORTFOLIO_DATA.education as any).images || [];
  const cumLaudeImage = (PORTFOLIO_DATA.education as any).cumLaudeImage as string;

  const goToImage = (src: string) => {
    const idx = images.indexOf(src);
    if (idx >= 0) {
      setSelectedImage(null);
      setCurrentImageIndex(idx);
    } else {
      setSelectedImage(selectedImage === src ? null : src);
    }
  };

  const isImageActive = (src: string) =>
    selectedImage === src || (!selectedImage && images[currentImageIndex] === src);

  const displayImage = selectedImage || (images.length > 0 ? images[currentImageIndex] : 'https://placehold.co/600x800/27272a/a1a1aa?text=Education+Image');

  const openCurrentLightbox = () => {
    if (selectedImage) {
      openLightbox([selectedImage], 0, 'Education');
      return;
    }
    if (images.length > 0) {
      openLightbox(images, currentImageIndex, 'Education');
    }
  };

  useEffect(() => {
    if (images.length === 0 || selectedImage) return;
    prefetchCarouselNeighbors(images, currentImageIndex);
  }, [currentImageIndex, images, selectedImage]);

  useEffect(() => {
    if (images.length === 0 || selectedImage || lightbox) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, selectedImage, lightbox]);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-24 px-4 sm:px-8">
      <ImageLightbox
        state={lightbox}
        onClose={closeLightbox}
        onIndexChange={(index) => {
          setLightboxIndex(index);
          if (!selectedImage) setCurrentImageIndex(index);
        }}
      />

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center order-2 lg:order-1 mt-6 lg:mt-0">
        <div className="w-full h-48 sm:h-64 lg:h-[28rem] xl:h-[32rem] rounded-lg overflow-hidden border border-zinc-800 transition-all duration-700 relative group/carousel">
          <div className="absolute inset-0 bg-zinc-950" />

          <button
            type="button"
            onClick={openCurrentLightbox}
            className="absolute inset-0 z-10 cursor-zoom-in group/expand focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/60"
            aria-label="Expand education image"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={displayImage}
                src={displayImage}
                alt="Education"
                className="w-full h-full absolute inset-0 object-contain p-2 pointer-events-none"
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                draggable={false}
              />
            </AnimatePresence>
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/expand:bg-black/20 transition-colors duration-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-mono uppercase tracking-wider opacity-0 group-hover/expand:opacity-100 transition-opacity duration-300">
                <ZoomIn size={14} />
                <span className="hidden sm:inline">Expand</span>
              </span>
            </span>
            <span className="absolute bottom-3 right-3 sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white/80 pointer-events-none">
              <ZoomIn size={14} />
            </span>
          </button>

          {!selectedImage && images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length); }}
                className="absolute left-2 sm:left-4 z-20 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2.5 sm:p-3 rounded-full text-white opacity-100 transition-all interactive-hover"
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % images.length); }}
                className="absolute right-2 sm:right-4 z-20 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2.5 sm:p-3 rounded-full text-white opacity-100 transition-all interactive-hover"
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
          )}

          {selectedImage && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/60 hover:bg-black/80 px-3 py-2 sm:px-4 rounded-full text-white transition-all interactive-hover z-20 text-xs uppercase tracking-wider font-mono"
            >
              ✕ Gallery
            </button>
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col pt-0 lg:pt-16 order-1 lg:order-2">
        <h2 className="text-[12vw] lg:text-8xl font-bold uppercase tracking-tighter text-zinc-800 mb-4 lg:mb-8 leading-none lg:text-right">Education</h2>

        <div className="lg:text-right mb-4 lg:mb-8">
          <h3 className="text-xl sm:text-3xl font-bold uppercase mb-2">{PORTFOLIO_DATA.education.degree}</h3>
          <h4 className="text-base sm:text-xl text-zinc-400 font-light mb-4">{PORTFOLIO_DATA.education.school}</h4>
          <button
            className={`inline-block px-4 py-2 border rounded-full font-mono text-xs sm:text-sm interactive-hover cursor-pointer active:scale-95 relative z-10 hover:bg-zinc-800/50 transition-all duration-300 ${isImageActive(cumLaudeImage) ? 'border-lime-400 text-lime-400 bg-zinc-800/50' : 'border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500'}`}
            onClick={() => goToImage(cumLaudeImage)}
          >
            {PORTFOLIO_DATA.education.honors} • GWA: {PORTFOLIO_DATA.education.gwa}
          </button>
        </div>

        <div className="space-y-3 lg:space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2 lg:mb-4 lg:text-right">Certifications</h3>
          {PORTFOLIO_DATA.education.certifications.map((cert, i) => (
            <button
              key={i}
              className={`w-full flex flex-col items-start lg:items-end gap-1 border-b border-zinc-900 pb-2 lg:pb-4 pt-2 interactive-hover cursor-pointer active:scale-95 relative z-10 group text-left lg:text-right transition-all px-3 -mx-3 rounded-lg hover:bg-zinc-800/30 ${isImageActive((cert as any).image) ? 'bg-zinc-800/30' : ''}`}
              onClick={() => goToImage((cert as any).image)}
            >
              <span className={`text-sm sm:text-lg transition-colors duration-300 ${isImageActive((cert as any).image) ? 'text-lime-400' : 'text-zinc-300 group-hover:text-white'}`}>{cert.title}</span>
              <span className="text-xs text-lime-400/50 font-mono">{cert.date}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
