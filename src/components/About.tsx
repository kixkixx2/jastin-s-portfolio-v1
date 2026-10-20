import React from 'react';
import { PORTFOLIO_DATA } from '../data';

export default function About() {
  return (
    <div className="text-center max-w-5xl mx-auto flex flex-col items-center">
      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-12">About</h2>
      <p className="text-3xl md:text-5xl lg:text-6xl leading-tight font-bold text-white mb-16 tracking-tight">
        Young <span className="text-white hover:text-lime-400 active:text-lime-400 transition-colors duration-300 interactive-hover">innovator</span> entering the corporate world to turn complex challenges into intelligent, <span className="text-white hover:text-lime-400 active:text-lime-400 transition-colors duration-300 interactive-hover">AI</span>-driven realities.
      </p>

      <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
        {PORTFOLIO_DATA.skills.stack.map(skill => (
          <span key={skill} className="px-5 py-2 border border-zinc-800/50 bg-black/60 rounded-full text-zinc-400 font-mono text-sm uppercase interactive-hover hover:border-lime-400 hover:text-white transition-colors">
            {skill}
          </span>
        ))}
        {PORTFOLIO_DATA.skills.ai.slice(0, 3).map(skill => (
          <span key={skill} className="px-5 py-2 border border-zinc-800/50 bg-black/60 rounded-full text-zinc-400 font-mono text-sm uppercase interactive-hover hover:border-lime-400 hover:text-white transition-colors">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
