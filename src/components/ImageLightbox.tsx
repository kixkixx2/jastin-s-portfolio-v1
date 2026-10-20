import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { prefetchCarouselNeighbors } from '../utils/imagePreload';

export interface ImageLightboxState {
  images: string[];
  index: number;
  alt?: string;
}

interface ImageLightboxProps {
  state: ImageLightboxState | null;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export function ImageLightbox({ state, onClose, onIndexChange }: ImageLightboxProps) {
  const images = state?.images ?? [];
  const index = state?.index ?? 0;
  const alt = state?.alt ?? 'Image';
  const hasMultiple = images.length > 1;

  const goTo = useCallback(
    (next: number) => {
      if (!hasMultiple) return;
      const wrapped = (next + images.length) % images.length;
      onIndexChange?.(wrapped);
    },
    [hasMultiple, images.length, onIndexChange]
  );

  useEffect(() => {
    if (!state) return;
    prefetchCarouselNeighbors(images, index);
  }, [state, images, index]);

  useEffect(() => {
    if (!state) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [state, index, onClose, goTo]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {state && images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] flex flex-col bg-black/95 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded image view"
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 shrink-0 safe-area-top"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-zinc-400 font-mono text-xs sm:text-sm tabular-nums">
              {hasMultiple ? `${index + 1} / ${images.length}` : 'Tap outside to close'}
            </span>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors interactive-hover active:scale-95"
              aria-label="Close expanded view"
            >
              <X size={22} />
            </button>
          </div>

          {/* Image area */}
          <div
            className="flex-1 flex items-center justify-center relative min-h-0 px-2 sm:px-8 pb-4 sm:pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {hasMultiple && (
              <button
                onClick={() => goTo(index - 1)}
                className="absolute left-1 sm:left-4 z-20 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors interactive-hover active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={`${alt}${hasMultiple ? ` - ${index + 1}` : ''}`}
                className="max-w-[min(100%,96vw)] max-h-[min(100%,78dvh)] sm:max-h-[min(100%,82dvh)] w-auto h-auto object-contain select-none"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                draggable={false}
              />
            </AnimatePresence>

            {hasMultiple && (
              <button
                onClick={() => goTo(index + 1)}
                className="absolute right-1 sm:right-4 z-20 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors interactive-hover active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Dot indicators — mobile friendly */}
          {hasMultiple && (
            <div
              className="flex justify-center gap-2 pb-4 sm:pb-6 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onIndexChange?.(i)}
                  className={`rounded-full transition-all interactive-hover ${
                    i === index ? 'w-6 h-2 bg-lime-400' : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/** Clickable image wrapper with expand hint */
export function ExpandableImageTrigger({
  src,
  alt,
  className = '',
  objectFit = 'contain',
  onExpand,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  objectFit?: 'contain' | 'cover';
  onExpand: () => void;
  children?: React.ReactNode;
}) {
  const fitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <button
      type="button"
      onClick={onExpand}
      className={`group/expand relative w-full h-full block cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/60 rounded-[inherit] ${className}`}
      aria-label={`Expand ${alt}`}
    >
      {children ?? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full ${fitClass} pointer-events-none`}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/expand:bg-black/30 transition-colors duration-300 rounded-[inherit]">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-mono uppercase tracking-wider opacity-0 group-hover/expand:opacity-100 sm:opacity-0 sm:group-hover/expand:opacity-100 transition-opacity duration-300">
          <ZoomIn size={14} />
          <span className="hidden sm:inline">Expand</span>
        </span>
      </span>
      {/* Always-visible tap hint on touch devices */}
      <span className="absolute bottom-2 right-2 sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white/80 pointer-events-none">
        <ZoomIn size={14} />
      </span>
    </button>
  );
}

export function useImageLightbox() {
  const [lightbox, setLightbox] = React.useState<ImageLightboxState | null>(null);

  const openLightbox = useCallback((images: string[], index = 0, alt = 'Image') => {
    if (!images.length) return;
    setLightbox({ images, index: Math.min(index, images.length - 1), alt });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const setLightboxIndex = useCallback((index: number) => {
    setLightbox((prev) => (prev ? { ...prev, index } : null));
  }, []);

  return { lightbox, openLightbox, closeLightbox, setLightboxIndex };
}
