import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data';
import Magnetic from './Magnetic';
import { Linkedin, Github, Phone, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Contact links defined as data so the markup stays flat and every
// anchor gets the same click-safe treatment.
const SOCIAL_LINKS = [
  {
    label: 'Resume',
    href: 'https://kixkixx2.github.io/resume/',
    icon: FileText,
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jastin-lamug-0253253a4/',
    icon: Linkedin,
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/kixkixx2',
    icon: Github,
    external: true,
  },
  {
    label: '+63 917 457 2531',
    href: 'tel:+639174572531',
    icon: Phone,
    external: false,
  },
];

export default function Contact() {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className="relative z-10 pointer-events-auto text-center flex flex-col items-center justify-center w-full max-h-[85vh]">
      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 lg:mb-8">
        Let's Talk
      </h2>

      <div className="relative flex items-center justify-center gap-2 md:gap-6 mb-6 lg:mb-12">
        <div className="text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter pointer-events-none select-none">
          ANO G?
        </div>
        
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          onPointerEnter={(e) => { if (e.pointerType === 'mouse') setShowTranslation(true); }}
          onPointerLeave={(e) => { if (e.pointerType === 'mouse') setShowTranslation(false); }}
          className="text-2xl md:text-4xl hover:scale-110 active:scale-95 transition-transform text-zinc-500 hover:text-lime-400 interactive-hover cursor-pointer"
          title="Translate"
          aria-label="Translate 'Ano G?'"
        >
          ☄️
        </button>

        <AnimatePresence>
          {showTranslation && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-1/2 -bottom-12 md:-bottom-16 -translate-x-1/2 bg-black/80 text-lime-400 text-xs md:text-sm px-4 py-2 rounded-lg border border-lime-400/30 backdrop-blur-md pointer-events-none whitespace-nowrap shadow-xl z-20"
            >
              "Ano G?" is a Tagalog slang for "Are you down?" or "Are you Game?"
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email: anchor itself is the hit area (padded, stationary). Magnetic only
          animates the visual — clicks land on the <a>, not a moving wrapper. */}
      <Magnetic>
        <a
          href={`mailto:${PORTFOLIO_DATA.email}`}
          className="inline-block text-[5vw] sm:text-3xl md:text-5xl lg:text-6xl font-bold lowercase tracking-tighter interactive-hover break-words sm:break-normal px-4 py-3 text-center hover:text-lime-400 active:text-lime-400 transition-colors"
        >
          {PORTFOLIO_DATA.email}
        </a>
      </Magnetic>

      <div className="mt-6 lg:mt-16 text-zinc-500 font-mono text-xs uppercase tracking-widest text-center px-4 pointer-events-none select-none">
        Isabela, Philippines • Earth
      </div>

      <div className="mt-6 lg:mt-16 flex flex-col md:flex-row flex-wrap justify-center items-center md:items-start gap-4 md:gap-12 text-zinc-400 font-mono text-xs md:text-sm px-4">
        {SOCIAL_LINKS.map(({ label, href, icon: Icon, external }) => (
          <React.Fragment key={label}>
            <Magnetic>
            <a
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="interactive-hover hover:text-white active:text-white transition-colors flex flex-col items-center gap-3 p-4 min-w-[44px] min-h-[44px]"
            >
              <Icon size={24} />
              <span className="text-center">{label}</span>
            </a>
            </Magnetic>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
