import React from 'react';
import { Film, Video } from 'lucide-react';

interface TopBarProps {
  onScrollToRecorder: () => void;
  onScrollToLibrary: () => void;
  onOpenNewRecording: () => void;
  recordingsCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onScrollToRecorder,
  onScrollToLibrary,
  onOpenNewRecording,
  recordingsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-cinzel text-lg sm:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 hover:opacity-90 transition-opacity"
        >
          MOTOR TV
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-300">
          <button
            onClick={onScrollToRecorder}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Studio Recorder
          </button>
          <a
            href="#story-section"
            className="hover:text-amber-400 transition-colors"
          >
            Storybook Chapters
          </a>
          <button
            onClick={onScrollToLibrary}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Local Archive</span>
            {recordingsCount > 0 && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {recordingsCount}
              </span>
            )}
          </button>
          <a
            href="#watermark-showcase"
            className="hover:text-amber-400 transition-colors"
          >
            Watermark Suite
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewRecording}
            className="px-3.5 py-1.5 text-xs font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Record Screen</span>
          </button>
        </div>
      </div>
    </header>
  );
};
