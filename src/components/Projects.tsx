import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PORTFOLIO_DATA } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { prefetchCarouselNeighbors, preloadImages } from '../utils/imagePreload';
import { ImageLightbox, ExpandableImageTrigger, useImageLightbox } from './ImageLightbox';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { lightbox, openLightbox, closeLightbox, setLightboxIndex } = useImageLightbox();

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const project = PORTFOLIO_DATA.projects.find((p) => p.id === selectedProject);
    if (!project) return;
    const imgs = project.images ?? (project.image ? [project.image] : []);
    if (imgs.length > 0) preloadImages(imgs);
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const project = PORTFOLIO_DATA.projects.find((p) => p.id === selectedProject);
    if (!project?.images || project.images.length <= 1) return;
    prefetchCarouselNeighbors(project.images, currentImageIndex);
  }, [selectedProject, currentImageIndex]);

  const openProjectLightbox = (project: (typeof PORTFOLIO_DATA.projects)[0]) => {
    const imgs = project.images ?? (project.image ? [project.image] : []);
    if (imgs.length === 0) return;
    openLightbox(imgs, currentImageIndex, project.title);
  };

  return (
    <div className="relative w-full h-[80vh] flex items-center justify-center">
      <ImageLightbox
        state={lightbox}
        onClose={closeLightbox}
        onIndexChange={(index) => {
          setLightboxIndex(index);
          setCurrentImageIndex(index);
        }}
      />

      <div className="absolute top-0 w-full text-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">Selected Works</h2>
      </div>

      <div className="relative w-full max-w-4xl aspect-square md:aspect-auto md:h-full">
        {PORTFOLIO_DATA.projects.map((project, idx) => {
          const positions = [
            { top: '25%', left: '20%' },
            { top: '30%', left: '75%' },
            { top: '75%', left: '30%' },
            { top: '70%', left: '70%' },
            { top: '50%', left: '15%' },
            { top: '50%', left: '85%' },
          ];
          const pos = positions[idx % positions.length];

          return (
            <div
              key={project.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center group interactive-hover active:scale-95 cursor-pointer px-4 py-3 -mx-4 -my-3 z-10 hover:z-30"
              style={pos}
              onClick={() => setSelectedProject(project.id)}
            >
              <div className="relative inline-flex items-center justify-center gap-3">
                <h3 className="relative z-10 text-2xl sm:text-3xl md:text-5xl font-bold uppercase transition-all duration-500 text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.6)] group-hover:[-webkit-text-stroke:1px_transparent] group-hover:text-white group-active:text-white md:group-hover:scale-110 drop-shadow-md md:group-hover:drop-shadow-2xl">
                  {(project as any).displayTitle || project.title.split(' ')[0]}
                </h3>
                
                {/* Mobile Click Indicator */}
                <div className="flex md:hidden items-center justify-center w-7 h-7 rounded-full border border-lime-400/50 text-lime-400 bg-black/50 backdrop-blur-sm group-hover:bg-lime-400 group-hover:text-black transition-colors duration-300 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                </div>
              </div>
              <p className="absolute z-10 text-xs text-lime-400 mt-2 opacity-100 md:opacity-60 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 font-mono w-full text-center left-0 -bottom-6 md:-bottom-4">
                {project.date}
              </p>

              {/* Hover Image Indicator */}
              {(() => {
                const coverImage = project.image || (project.images && project.images[0]);
                if (!coverImage) return null;
                return (
                  <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-48 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none -z-10 scale-75 group-hover:scale-100 group-hover:rotate-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                    <div className="absolute inset-0 bg-black/50 z-10"></div>
                    <img src={coverImage} className="w-full h-full object-cover" alt="" />
                  </div>
                );
              })()}
            </div>
          );
        })}

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-zinc-800 font-bold uppercase tracking-tighter text-[15vw] leading-none opacity-20">
            Works
          </div>
        </div>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm cursor-auto"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent
                className="bg-zinc-900 border border-zinc-800 p-4 sm:p-8 max-w-2xl w-full rounded-2xl shadow-2xl relative cursor-auto max-h-[92dvh] overflow-y-auto"
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3 right-3 sm:top-6 sm:right-6 text-zinc-400 hover:text-white transition-colors interactive-hover active:scale-95 z-10 w-10 h-10 flex items-center justify-center"
                  aria-label="Close project details"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {(() => {
                  const project = PORTFOLIO_DATA.projects.find(p => p.id === selectedProject);
                  if (!project) return null;
                  const projectImages = project.images ?? (project.image ? [project.image] : []);
                  const currentSrc = project.images?.[currentImageIndex] ?? project.image ?? project.images?.[0];

                  return (
                    <>
                      {projectImages.length > 0 && currentSrc && (
                        <div className="w-full h-40 sm:h-56 mb-4 rounded-lg overflow-hidden border border-zinc-800 relative group/carousel bg-zinc-950">
                          <ExpandableImageTrigger
                            src={currentSrc}
                            alt={project.title}
                            onExpand={() => openProjectLightbox(project)}
                          />

                          {project.images && project.images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length); }}
                                className="absolute left-2 z-50 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity interactive-hover active:scale-95"
                                aria-label="Previous image"
                              >
                                <ChevronLeft size={20} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % project.images!.length); }}
                                className="absolute right-2 z-50 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity interactive-hover active:scale-95"
                                aria-label="Next image"
                              >
                                <ChevronRight size={20} />
                              </button>
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
                                {project.images.map((_, i) => (
                                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentImageIndex ? 'bg-white' : 'bg-white/30'}`} />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 uppercase tracking-tighter pr-10">{project.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                        <p className="text-lime-400 font-mono text-xs sm:text-sm">{project.date}</p>
                        {(project as any).link && (
                          <a
                            href={(project as any).link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-lime-400 text-xs sm:text-sm font-mono flex items-center gap-1 transition-colors w-fit"
                          >
                            Live Link
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                        )}
                      </div>

                      {project.stack && (
                        <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
                          {project.stack.map((tech, i) => (
                            <span key={i} className="px-2.5 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] sm:text-xs font-mono rounded-full border border-zinc-700">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <ul className="space-y-2 sm:space-y-3 text-zinc-300 text-xs sm:text-sm">
                        {project.points.map((pt, i) => (
                          <li key={i} className="flex gap-2 sm:gap-3 items-start">
                            <span className="text-zinc-600 mt-0.5">+</span>
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
