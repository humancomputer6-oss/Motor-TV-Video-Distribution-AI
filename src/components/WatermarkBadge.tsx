import React from 'react';
import { WatermarkPosition } from '../types/recorder';

interface WatermarkProps {
  type: 'motortv' | 'youtubetv';
  position?: WatermarkPosition;
  scale?: number;
  opacity?: number;
  className?: string;
}

export const MotorTvLeoLogo: React.FC<{ scale?: number; opacity?: number; className?: string }> = ({
  scale = 1,
  opacity = 0.95,
  className = '',
}) => {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top right',
        opacity,
      }}
      className={`select-none pointer-events-none transition-all duration-200 ${className}`}
    >
      <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-amber-500/40 shadow-2xl shadow-amber-950/40">
        {/* Emblem */}
        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-amber-400/60 shadow-inner bg-gradient-to-br from-amber-600/40 to-neutral-900 flex items-center justify-center">
          <img
            src="/src/assets/images/motortv_leo_logo_1791178248549.jpg"
            alt="Motor TV Leo Emblem"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Graceful fallback to styled SVG
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          {/* Fallback Icon inside if image not loaded yet */}
          <div className="absolute inset-0 flex items-center justify-center text-amber-300 font-cinzel font-black text-lg pointer-events-none">
            🦁
          </div>
        </div>

        {/* Lockup Typography */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-cinzel font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 text-sm drop-shadow-sm">
              MOTOR TV
            </span>
            <span className="px-1 py-0.2 text-[9px] font-mono tracking-tighter bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded">
              4K HD
            </span>
          </div>
          <div className="font-storybook tracking-wide text-xs text-neutral-100 font-semibold drop-shadow italic flex items-center gap-1 mt-0.5">
            <span>LEO STORY MOVIE</span>
            <span className="text-amber-400 text-[10px]">★</span>
          </div>
          <span className="text-[8px] uppercase tracking-widest text-amber-200/70 font-mono">
            CINEMATIC BROADCAST
          </span>
        </div>
      </div>
    </div>
  );
};

export const YouTubeTvLogo: React.FC<{ scale?: number; opacity?: number; className?: string }> = ({
  scale = 1,
  opacity = 0.95,
  className = '',
}) => {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        opacity,
      }}
      className={`select-none pointer-events-none transition-all duration-200 ${className}`}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-neutral-700/60 shadow-xl">
        {/* Red YouTube TV Play Badge */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-4.5 bg-[#FF0000] rounded-md flex items-center justify-center shadow-sm">
            <div className="w-0 h-0 border-y-[3.5px] border-y-transparent border-l-[6.5px] border-l-white ml-0.5"></div>
          </div>
          <span className="font-bold text-sm tracking-tight text-white flex items-center">
            YouTube <span className="ml-1 text-red-500 font-black">TV</span>
          </span>
        </div>
        <div className="h-3 w-px bg-neutral-700 mx-0.5"></div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-mono tracking-wider font-semibold text-neutral-300 uppercase">
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
};

export const WatermarkOverlay: React.FC<{
  showMotorTv?: boolean;
  showYouTubeTv?: boolean;
  motorTvPosition?: WatermarkPosition;
  youTubeTvPosition?: WatermarkPosition;
  motorTvScale?: number;
  youTubeTvScale?: number;
  opacity?: number;
}> = ({
  showMotorTv = true,
  showYouTubeTv = true,
  motorTvPosition = 'top-right',
  youTubeTvPosition = 'top-left',
  motorTvScale = 1.0,
  youTubeTvScale = 1.0,
  opacity = 0.95,
}) => {
  const getPositionClass = (pos: WatermarkPosition) => {
    switch (pos) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-16 left-4';
      case 'bottom-right':
        return 'bottom-16 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {showYouTubeTv && (
        <div className={`absolute ${getPositionClass(youTubeTvPosition)}`}>
          <YouTubeTvLogo scale={youTubeTvScale} opacity={opacity} />
        </div>
      )}

      {showMotorTv && (
        <div className={`absolute ${getPositionClass(motorTvPosition)}`}>
          <MotorTvLeoLogo scale={motorTvScale} opacity={opacity} />
        </div>
      )}
    </div>
  );
};
