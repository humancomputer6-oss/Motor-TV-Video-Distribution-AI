import React, { useState } from 'react';
import { StoryHeadlineItem } from '../types/recorder';
import { BookOpen, Sparkles, ChevronRight, Edit3, Volume2 } from 'lucide-react';

export const DEFAULT_STORY_HEADLINES: StoryHeadlineItem[] = [
  {
    id: 'ch-1',
    chapter: 'CHAPTER I',
    title: "The Lion's Engine Awakens",
    tagline: 'Dawn at the Golden Grand Prix & the birth of a speed legend.',
  },
  {
    id: 'ch-2',
    chapter: 'CHAPTER II',
    title: 'Midnight Highway of Dreams',
    tagline: 'Leo races against time through the neon-lit obsidian mountains.',
  },
  {
    id: 'ch-3',
    chapter: 'CHAPTER III',
    title: 'The Silver Roadster & The Lost Map',
    tagline: 'A story of courage, vintage chrome, and unyielding brotherhood.',
  },
  {
    id: 'ch-4',
    chapter: 'CHAPTER IV',
    title: 'The Roar of Circuit Royale',
    tagline: 'Tuning the golden V12 engine for the ultimate cinematic showdown.',
  },
  {
    id: 'ch-5',
    chapter: 'CHAPTER V',
    title: 'Victory Under the Golden Laurel',
    tagline: 'Leo crosses the finish line into cinematic immortality.',
  },
];

interface StorybookHeaderlinesProps {
  currentHeadline: string;
  onSelectHeadline: (headline: string) => void;
  className?: string;
}

export const StorybookHeaderlines: React.FC<StorybookHeaderlinesProps> = ({
  currentHeadline,
  onSelectHeadline,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState(currentHeadline);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customText.trim()) {
      onSelectHeadline(customText.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {/* Ornate Storybook Border & Header Bar */}
      <div className="relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-y border-amber-500/30 px-4 py-2.5 shadow-lg">
        {/* Subtle decorative gold filigree corner cues */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Storybook badge & Active Chapter */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="font-cinzel text-[11px] font-bold tracking-widest uppercase">
                STORYBOOK CHRONICLES
              </span>
            </div>
            <span className="text-neutral-500 text-xs hidden sm:inline">|</span>
            <span className="text-amber-400/80 font-cinzel text-xs font-semibold tracking-wider">
              MOTOR TV SPECIAL
            </span>
          </div>

          {/* Center Story Headline Banner / Editor */}
          <div className="flex-1 text-center px-2 min-w-0">
            {isEditing ? (
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 max-w-lg mx-auto">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter custom Storybook Motor TV Headline..."
                  className="w-full bg-neutral-900 border border-amber-500/60 rounded px-3 py-1 text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400 font-storybook"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-amber-500 text-neutral-950 font-semibold text-xs rounded hover:bg-amber-400 transition-colors shrink-0"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-neutral-400 text-xs hover:text-neutral-200 transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 group cursor-pointer" onClick={() => setIsEditing(true)}>
                <span className="text-amber-400 text-xs select-none">“</span>
                <h2 className="font-storybook text-sm md:text-base font-semibold text-amber-100 tracking-wide truncate group-hover:text-amber-300 transition-colors">
                  {currentHeadline}
                </h2>
                <span className="text-amber-400 text-xs select-none">”</span>
                <button
                  type="button"
                  title="Edit storybook headline"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-amber-300"
                >
                  <Edit3 className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Chapter Selector Pills / Chips */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto max-w-full pb-1 md:pb-0">
            {DEFAULT_STORY_HEADLINES.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  const fullHeadline = `${item.chapter}: ${item.title}`;
                  onSelectHeadline(fullHeadline);
                  setCustomText(fullHeadline);
                }}
                className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors whitespace-nowrap ${
                  currentHeadline.includes(item.chapter)
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'bg-neutral-800/80 text-neutral-400 hover:text-amber-200 hover:bg-neutral-800 border border-neutral-700/50'
                }`}
                title={`${item.title} - ${item.tagline}`}
              >
                Act {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Marquee Ticker */}
      <div className="bg-black/90 py-1 border-b border-neutral-800 text-[11px] font-mono text-neutral-400 overflow-hidden relative">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {DEFAULT_STORY_HEADLINES.concat(DEFAULT_STORY_HEADLINES).map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-2">
              <span className="text-amber-400 font-cinzel font-bold text-[10px] tracking-widest">
                {item.chapter}
              </span>
              <span className="text-neutral-200 font-storybook font-medium">{item.title}</span>
              <span className="text-neutral-500">—</span>
              <span className="text-neutral-400 text-[10px]">{item.tagline}</span>
              <span className="text-amber-500/60 ml-3">★</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
