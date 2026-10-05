import React, { useState } from 'react';
import { MotorTvLeoLogo, YouTubeTvLogo } from './WatermarkBadge';
import { ShieldCheck, Sparkles, Tv, Eye, Sliders, Check } from 'lucide-react';

export const WatermarkShowcase: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [scale, setScale] = useState(1.1);
  const [opacity, setOpacity] = useState(1);
  const [bgChoice, setBgChoice] = useState<'dark' | 'stage' | 'video'>('stage');

  return (
    <section id="watermark-showcase" className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-cinzel text-lg font-bold text-amber-200">
              WATERMARK SPECIFICATION SUITE
            </h2>
            <span className="text-xs font-mono text-neutral-400">· Official Broadcast Emblems</span>
          </div>
          <p className="text-xs text-neutral-400 font-storybook mt-0.5">
            Designed for high-definition 4K video recording, live cinema streaming, and local storage archiving.
          </p>
        </div>

        {/* Backdrop Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
          <button
            onClick={() => setBgChoice('stage')}
            className={`px-2.5 py-1 rounded transition-colors ${
              bgChoice === 'stage' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Stage Projector
          </button>
          <button
            onClick={() => setBgChoice('dark')}
            className={`px-2.5 py-1 rounded transition-colors ${
              bgChoice === 'dark' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Pure Obsidian
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: The Big Motor TV Leo Story Movie Watermark Logo */}
        <div className="rounded-2xl border border-amber-500/30 bg-neutral-900/60 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-cinzel text-xs font-bold text-amber-400 tracking-wider">
                PRIMARY CINEMA WATERMARK
              </span>
              <span className="text-[10px] font-mono text-amber-300/80 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                Dynamic Burn-In
              </span>
            </div>

            <h3 className="font-storybook text-lg font-bold text-neutral-100">
              Big Motor TV Leo Story Movie Logo
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Features the golden lion cinema emblem, automotive speed typography, 4K HD broadcast tag, and classic movie star accents. Automatically burned into the screen video frames and overlaid inside the playback studio.
            </p>

            {/* Interactive Preview Canvas */}
            <div
              className={`mt-5 rounded-xl border border-neutral-800 p-6 min-h-[160px] flex items-center justify-center relative overflow-hidden ${
                bgChoice === 'stage'
                  ? 'bg-gradient-to-tr from-neutral-950 via-amber-950/30 to-neutral-900'
                  : 'bg-neutral-950'
              }`}
            >
              <MotorTvLeoLogo scale={scale} opacity={opacity} />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Aspect: 4:1 Broadcast Lockup</span>
            <span className="text-amber-400">Position: Corner Scalable</span>
          </div>
        </div>

        {/* Card 2: YouTube TV Watermark Logo */}
        <div className="rounded-2xl border border-red-500/30 bg-neutral-900/60 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-red-400 tracking-wider">
                SECONDARY BROADCAST WATERMARK
              </span>
              <span className="text-[10px] font-mono text-red-300 bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                YouTube TV Live
              </span>
            </div>

            <h3 className="font-storybook text-lg font-bold text-neutral-100">
              YouTube TV Watermark Logo
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Authentic broadcast badge featuring the vibrant YouTube red emblem, bold typographic lockup, and live transmission indicator. Renders in sync with the primary Motor TV watermark.
            </p>

            {/* Interactive Preview Canvas */}
            <div
              className={`mt-5 rounded-xl border border-neutral-800 p-6 min-h-[160px] flex items-center justify-center relative overflow-hidden ${
                bgChoice === 'stage'
                  ? 'bg-gradient-to-tr from-neutral-950 via-neutral-900 to-red-950/20'
                  : 'bg-neutral-950'
              }`}
            >
              <YouTubeTvLogo scale={scale} opacity={opacity} />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Type: SVG Vector Broadcast Lockup</span>
            <span className="text-red-400">Live Indicator: Active</span>
          </div>
        </div>
      </div>
    </section>
  );
};
