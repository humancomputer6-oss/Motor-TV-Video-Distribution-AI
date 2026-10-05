import React from 'react';
import { DEFAULT_STORY_HEADLINES } from './StorybookHeaderlines';
import { BookOpen, Sparkles, Film, ArrowRight, Check } from 'lucide-react';

interface StorybookSectionProps {
  currentHeadline: string;
  onSelectHeadline: (headline: string) => void;
  onScrollToRecorder: () => void;
  className?: string;
}

export const StorybookSection: React.FC<StorybookSectionProps> = ({
  currentHeadline,
  onSelectHeadline,
  onScrollToRecorder,
  className = '',
}) => {
  return (
    <section id="story-section" className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-cinzel text-lg font-bold text-amber-200">
              MOTOR TV STORYBOOK CHRONICLES
            </h2>
            <span className="text-xs font-mono text-neutral-400">· Leo Story Movie Anthology</span>
          </div>
          <p className="text-xs text-neutral-400 font-storybook mt-0.5">
            Select a chapter headline to stamp across your screen recording and player marquee.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onScrollToRecorder}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Apply to Studio Recorder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEFAULT_STORY_HEADLINES.map((chapter, idx) => {
          const isSelected = currentHeadline.includes(chapter.chapter);
          return (
            <div
              key={chapter.id}
              onClick={() => onSelectHeadline(`${chapter.chapter}: ${chapter.title}`)}
              className={`rounded-xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-cinzel text-[11px] font-bold text-amber-400 tracking-wider">
                    {chapter.chapter}
                  </span>
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-400/40">
                      <Check className="w-3 h-3" /> ACTIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-500">
                      Act 0{idx + 1}
                    </span>
                  )}
                </div>

                <h3 className="font-storybook text-base font-semibold text-neutral-100 group-hover:text-amber-200 transition-colors">
                  {chapter.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {chapter.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span className="text-[10px]">MOTOR TV SPECIAL</span>
                <span className="text-amber-400 text-xs">★ Select Act</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
