import React from 'react';
import { RecordingItem } from '../types/recorder';
import {
  Film,
  Play,
  Download,
  Trash2,
  Calendar,
  HardDrive,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

interface RecordingsLibraryProps {
  recordings: RecordingItem[];
  onPlayRecording: (recording: RecordingItem) => void;
  onDeleteRecording: (id: string) => void;
  onRecordNew: () => void;
  className?: string;
}

export const RecordingsLibrary: React.FC<RecordingsLibraryProps> = ({
  recordings,
  onPlayRecording,
  onDeleteRecording,
  onRecordNew,
  className = '',
}) => {
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalSize = recordings.reduce((acc, curr) => acc + (curr.size || 0), 0);

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-cinzel text-lg font-bold text-amber-200">
              LOCAL STORAGE ARCHIVE
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {recordings.length} {recordings.length === 1 ? 'MOVIE' : 'MOVIES'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-storybook mt-0.5">
            Recordings automatically saved to your browser local storage database.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>Used: {formatBytes(totalSize)}</span>
          </div>
        </div>
      </div>

      {/* Grid of Recordings */}
      {recordings.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 mb-3 border border-neutral-700">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-base font-semibold text-neutral-200">
            No Recordings in Local Storage Yet
          </h3>
          <p className="font-storybook text-xs text-neutral-400 max-w-sm mt-1 mb-5">
            Hit Record Screen or Test Studio Track above to produce your first Motor TV Leo Story
            video with the watermarks automatically saved!
          </p>
          <button
            onClick={onRecordNew}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
          >
            Start First Recording
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recordings.map((rec) => (
            <div
              key={rec.id}
              className="group rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col shadow-lg"
            >
              {/* Thumbnail Container */}
              <div
                className="relative aspect-video bg-neutral-950 overflow-hidden cursor-pointer"
                onClick={() => onPlayRecording(rec)}
              >
                {rec.thumbnailUrl ? (
                  <img
                    src={rec.thumbnailUrl}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-700 bg-neutral-950">
                    <Film className="w-10 h-10" />
                  </div>
                )}

                {/* Big Play hover icon */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                  <div className="w-10 h-10 rounded-full bg-amber-500/90 text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono font-medium text-neutral-200">
                  {formatTime(rec.duration)}
                </div>

                {/* Watermark Tag */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-[9px] font-cinzel font-bold text-amber-300">
                    MOTOR TV
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-red-600/30 border border-red-500/40 text-[9px] font-mono font-bold text-red-300">
                    YT TV
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4
                    onClick={() => onPlayRecording(rec)}
                    className="font-storybook text-sm font-semibold text-neutral-100 hover:text-amber-300 cursor-pointer line-clamp-1 transition-colors"
                  >
                    {rec.storybookHeadline || rec.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-1">
                    <span>{formatDate(rec.createdAt)}</span>
                    <span>·</span>
                    <span>{formatBytes(rec.size)}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-800/80">
                  <button
                    onClick={() => onPlayRecording(rec)}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Movie</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {rec.url && (
                      <a
                        href={rec.url}
                        download={`${rec.title.replace(/\s+/g, '_')}.webm`}
                        className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
                        title="Download video"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => onDeleteRecording(rec.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                      title="Delete recording"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
