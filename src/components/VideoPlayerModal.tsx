import React, { useRef, useState, useEffect } from 'react';
import { RecordingItem, WatermarkPosition } from '../types/recorder';
import { WatermarkOverlay } from './WatermarkBadge';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  CheckCircle,
  Sliders,
  X,
  Layers,
  Sparkles,
  Film,
} from 'lucide-react';

interface VideoPlayerModalProps {
  recording: RecordingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordNew: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  recording,
  isOpen,
  onClose,
  onRecordNew,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Watermark interactive controls
  const [showWatermarkSettings, setShowWatermarkSettings] = useState(false);
  const [showMotorTv, setShowMotorTv] = useState(true);
  const [showYouTubeTv, setShowYouTubeTv] = useState(true);
  const [motorTvPosition, setMotorTvPosition] = useState<WatermarkPosition>('top-right');
  const [youTubeTvPosition, setYouTubeTvPosition] = useState<WatermarkPosition>('top-left');
  const [motorTvScale, setMotorTvScale] = useState(1.15);
  const [youTubeTvScale, setYouTubeTvScale] = useState(1.0);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.95);

  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay prevented or video not ready:', err);
            setIsPlaying(false);
          });
      }
    }
  }, [isOpen, recording]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || recording?.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const handleRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false));
    }
  };

  const handleDownload = () => {
    if (!recording?.url) return;
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `${recording.title.replace(/\s+/g, '_')}_motortv_leo.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  if (!isOpen || !recording) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full max-w-5xl bg-neutral-950 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto group"
      >
        {/* Theatre Stage Banner / Auto-Save Confirmation */}
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xs font-bold text-amber-300 tracking-wider">
                  MOTOR TV PLAYER
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3" /> Auto-Saved to Local Storage
                </span>
              </div>
              <span className="text-xs text-neutral-300 font-storybook truncate">
                {recording.storybookHeadline || recording.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWatermarkSettings(!showWatermarkSettings)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                showWatermarkSettings
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
              title="Watermark Overlay Settings"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Watermarks</span>
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs flex items-center gap-1.5 transition-colors"
              title="Download recording"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Video</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas Container with Watermarks */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={recording.url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            loop={isLooping}
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* WATERMARKS OVERLAY (Always active unless user customizes) */}
          <WatermarkOverlay
            showMotorTv={showMotorTv}
            showYouTubeTv={showYouTubeTv}
            motorTvPosition={motorTvPosition}
            youTubeTvPosition={youTubeTvPosition}
            motorTvScale={motorTvScale}
            youTubeTvScale={youTubeTvScale}
            opacity={watermarkOpacity}
          />

          {/* Storybook Chyron across bottom-center during playback */}
          {recording.storybookHeadline && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 max-w-[85%] text-center hidden md:block">
              <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-200/90 text-xs font-storybook tracking-wide shadow-xl">
                ★ {recording.storybookHeadline} ★
              </div>
            </div>
          )}

          {/* Watermark Live Customizer Panel */}
          {showWatermarkSettings && (
            <div className="absolute top-16 right-4 z-40 bg-neutral-900/95 backdrop-blur-md border border-amber-500/40 rounded-xl p-4 shadow-2xl w-80 text-xs space-y-3.5 text-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-cinzel font-bold text-amber-400">WATERMARK CONTROLS</span>
                <button
                  onClick={() => setShowWatermarkSettings(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Motor TV Watermark Settings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-amber-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Motor TV Leo Movie Logo
                  </label>
                  <input
                    type="checkbox"
                    checked={showMotorTv}
                    onChange={(e) => setShowMotorTv(e.target.checked)}
                    className="accent-amber-500"
                  />
                </div>
                {showMotorTv && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-neutral-400 block mb-1">Position</span>
                      <select
                        value={motorTvPosition}
                        onChange={(e) => setMotorTvPosition(e.target.value as WatermarkPosition)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-[11px] text-neutral-200"
                      >
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block mb-1">
                        Scale ({Math.round(motorTvScale * 100)}%)
                      </span>
                      <input
                        type="range"
                        min="0.7"
                        max="1.7"
                        step="0.1"
                        value={motorTvScale}
                        onChange={(e) => setMotorTvScale(parseFloat(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* YouTube TV Watermark Settings */}
              <div className="space-y-2 border-t border-neutral-800 pt-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-red-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    YouTube TV Logo
                  </label>
                  <input
                    type="checkbox"
                    checked={showYouTubeTv}
                    onChange={(e) => setShowYouTubeTv(e.target.checked)}
                    className="accent-red-500"
                  />
                </div>
                {showYouTubeTv && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-neutral-400 block mb-1">Position</span>
                      <select
                        value={youTubeTvPosition}
                        onChange={(e) => setYouTubeTvPosition(e.target.value as WatermarkPosition)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-[11px] text-neutral-200"
                      >
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block mb-1">
                        Scale ({Math.round(youTubeTvScale * 100)}%)
                      </span>
                      <input
                        type="range"
                        min="0.7"
                        max="1.6"
                        step="0.1"
                        value={youTubeTvScale}
                        onChange={(e) => setYouTubeTvScale(parseFloat(e.target.value))}
                        className="w-full accent-red-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Opacity slider */}
              <div className="border-t border-neutral-800 pt-2.5">
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Watermark Opacity</span>
                  <span className="font-mono">{Math.round(watermarkOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>
          )}

          {/* Big Center Play/Pause Overlay indicator when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500/90 text-neutral-950 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-20"
            >
              <Play className="w-8 h-8 ml-1 fill-current" />
            </button>
          )}

          {/* Video Player Floating Controls Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-4 z-30 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Scrubber Progress Bar */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 1}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>

            {/* Action buttons bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={togglePlay}
                  className="p-2 text-white hover:text-amber-400 transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    onClick={toggleMute}
                    className="p-1.5 text-neutral-300 hover:text-white transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 accent-amber-400 bg-neutral-700 rounded cursor-pointer"
                  />
                </div>

                {/* Speed selector */}
                <div className="hidden sm:flex items-center gap-1 text-xs">
                  {[1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        playbackRate === rate
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    isLooping ? 'text-amber-400 bg-amber-500/20' : 'text-neutral-400 hover:text-white'
                  }`}
                  title={isLooping ? 'Looping enabled' : 'Enable loop'}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 text-neutral-300 hover:text-white transition-colors"
                  title="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & next action */}
        <div className="px-4 py-3 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-neutral-400 text-[11px] font-mono">
            <span>Duration: {formatTime(recording.duration)}</span>
            <span>Size: {formatBytes(recording.size)}</span>
            <span>Res: {recording.recordedResolution || '1080p'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onRecordNew();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-colors shadow-md flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Record New Movie</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
