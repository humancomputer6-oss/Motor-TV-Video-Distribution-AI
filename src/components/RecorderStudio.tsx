import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RecordingItem, RecorderStatus, WatermarkConfig, WatermarkPosition } from '../types/recorder';
import { autoSaveRecording } from '../services/storage';
import { WatermarkOverlay, MotorTvLeoLogo, YouTubeTvLogo } from './WatermarkBadge';
import {
  Monitor,
  Mic,
  MicOff,
  Video,
  Play,
  Square,
  Pause,
  PlayCircle,
  Sparkles,
  Sliders,
  Settings,
  AlertCircle,
  HelpCircle,
  Radio,
  Flame,
} from 'lucide-react';

interface RecorderStudioProps {
  currentHeadline: string;
  onRecordingComplete: (recording: RecordingItem) => void;
  className?: string;
}

export const RecorderStudio: React.FC<RecorderStudioProps> = ({
  currentHeadline,
  onRecordingComplete,
  className = '',
}) => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [burnInWatermarks, setBurnInWatermarks] = useState(true);
  const [useStudioAnimationFallback, setUseStudioAnimationFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Watermark configuration for burn-in and preview
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
    showMotorTv: true,
    showYouTubeTv: true,
    motorTvPosition: 'top-right',
    youTubeTvPosition: 'top-left',
    motorTvScale: 1.15,
    youTubeTvScale: 1.0,
    opacity: 0.95,
    burnIntoVideo: true,
  });

  // Media references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Hidden video and canvas for composition and burn-in
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const compositorCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const simCarPosRef = useRef({ x: 0, speed: 6, angle: 0 });

  // Pre-load emblem for canvas drawing if burn-in is enabled
  const logoImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/src/assets/images/motortv_leo_logo_1791178248549.jpg';
    img.onload = () => {
      logoImageRef.current = img;
    };
  }, []);

  // Clear timer helper
  const clearTimer = () => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  /**
   * Draw the video frame, Big Motor TV Leo Story Watermark, YouTube TV watermark, and Storybook Headline
   * directly onto the compositor canvas for baked-in recording!
   */
  const drawCompositorFrame = useCallback(() => {
    const canvas = compositorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw source (either real screen video or studio animated simulation)
    const video = previewVideoRef.current;
    if (video && video.readyState >= 2 && !useStudioAnimationFallback) {
      ctx.drawImage(video, 0, 0, width, height);
    } else {
      // Animated Studio Test Generator ("Motor TV Leo Track")
      const time = performance.now() / 1000;
      simCarPosRef.current.x = (simCarPosRef.current.x + simCarPosRef.current.speed) % (width + 200);

      // Night asphalt gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#09090b');
      bgGrad.addColorStop(0.5, '#18181b');
      bgGrad.addColorStop(1, '#0a0a0c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Cinematic speed grid lines
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 60) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Highway lanes
      const roadY = height * 0.58;
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, roadY, width, height * 0.38);

      // Golden racing stripes
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.setLineDash([40, 30]);
      ctx.lineDashOffset = -time * 200;
      ctx.beginPath();
      ctx.moveTo(0, roadY + 70);
      ctx.lineTo(width, roadY + 70);
      ctx.stroke();
      ctx.setLineDash([]);

      // Neon road lights
      for (let k = 0; k < 6; k++) {
        const lx = ((k * 240 + time * 300) % (width + 100)) - 50;
        ctx.fillStyle = 'rgba(234, 179, 8, 0.4)';
        ctx.beginPath();
        ctx.arc(lx, roadY - 10, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Leo's Golden Sports Car silhouette
      const carX = simCarPosRef.current.x - 100;
      const carY = roadY + 30;

      // Glow behind car
      const carGlow = ctx.createRadialGradient(carX + 60, carY + 20, 10, carX + 60, carY + 20, 120);
      carGlow.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
      carGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = carGlow;
      ctx.fillRect(carX - 50, carY - 40, 240, 120);

      // Car body
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.roundRect(carX, carY + 12, 130, 26, [8, 18, 4, 4]);
      ctx.fill();

      // Cockpit / roof
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(carX + 35, carY - 2, 60, 18, [12, 12, 0, 0]);
      ctx.fill();

      // Wheels
      ctx.fillStyle = '#262626';
      ctx.beginPath();
      ctx.arc(carX + 26, carY + 38, 12, 0, Math.PI * 2);
      ctx.arc(carX + 104, carY + 38, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(carX + 26, carY + 38, 4, 0, Math.PI * 2);
      ctx.arc(carX + 104, carY + 38, 4, 0, Math.PI * 2);
      ctx.fill();

      // Headlight beams
      const beamGrad = ctx.createLinearGradient(carX + 130, carY + 20, carX + 360, carY + 20);
      beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
      beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(carX + 130, carY + 18);
      ctx.lineTo(carX + 360, carY - 10);
      ctx.lineTo(carX + 360, carY + 60);
      ctx.lineTo(carX + 130, carY + 32);
      ctx.closePath();
      ctx.fill();

      // Center Movie Title
      ctx.textAlign = 'center';
      ctx.font = 'bold 38px "Cinzel", serif';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 15;
      ctx.fillText('MOTOR TV LEO STORY MOVIE', width / 2, height * 0.28);
      ctx.shadowBlur = 0;

      ctx.font = 'italic 18px "Playfair Display", serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(currentHeadline || 'The Grand Cinematic Chronicles', width / 2, height * 0.35);

      // Studio recording watermark hint
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('LIVE STUDIO COMPOSITOR · MEDIA RECORDER RUNNING', width / 2, height * 0.94);
    }

    // 2. BURN-IN WATERMARKS & STORYBOOK HEADERLINE ON CANVAS
    if (burnInWatermarks) {
      ctx.save();

      // Top Storybook Chyron Banner
      ctx.fillStyle = 'rgba(10, 10, 12, 0.85)';
      ctx.fillRect(0, 0, width, 44);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 44);
      ctx.lineTo(width, 44);
      ctx.stroke();

      // Storybook headerline text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 15px "Playfair Display", serif';
      ctx.fillStyle = '#fef3c7';
      ctx.fillText(`★ MOTOR TV STORYBOOK: ${currentHeadline} ★`, width / 2, 22);

      // A. BIG MOTOR TV LEO STORY MOVIE WATERMARK (Top Right)
      ctx.globalAlpha = watermarkConfig.opacity;
      const mtvWidth = 270;
      const mtvHeight = 72;
      const mtvX = width - mtvWidth - 24;
      const mtvY = 60;

      // Dark glass container with gold border
      ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
      ctx.beginPath();
      ctx.roundRect(mtvX, mtvY, mtvWidth, mtvHeight, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw emblem image or lion emoji fallback
      if (logoImageRef.current && logoImageRef.current.complete) {
        ctx.drawImage(logoImageRef.current, mtvX + 10, mtvY + 10, 52, 52);
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(mtvX + 10, mtvY + 10, 52, 52, 8);
        ctx.fill();
        ctx.fillStyle = '#171717';
        ctx.font = 'bold 24px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🦁', mtvX + 36, mtvY + 36);
      }

      // Motor TV Leo Typography
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '900 17px "Cinzel", serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('MOTOR TV', mtvX + 72, mtvY + 12);

      // 4K Badge
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#fde68a';
      ctx.fillText('4K MOVIE', mtvX + 185, mtvY + 15);

      // Leo Story Movie subtitle
      ctx.font = 'italic 600 13px "Playfair Display", serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('LEO STORY MOVIE ★', mtvX + 72, mtvY + 32);

      ctx.font = '800 8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.fillText('CINEMATIC BROADCAST', mtvX + 72, mtvY + 50);

      // B. YOUTUBE TV WATERMARK (Top Left)
      const ytvWidth = 175;
      const ytvHeight = 44;
      const ytvX = 24;
      const ytvY = 60;

      // Dark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
      ctx.beginPath();
      ctx.roundRect(ytvX, ytvY, ytvWidth, ytvHeight, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(115, 115, 115, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Red Play Box
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.roundRect(ytvX + 10, ytvY + 11, 26, 20, 5);
      ctx.fill();

      // White Play triangle
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(ytvX + 20, ytvY + 16);
      ctx.lineTo(ytvX + 28, ytvY + 21);
      ctx.lineTo(ytvX + 20, ytvY + 26);
      ctx.closePath();
      ctx.fill();

      // YouTube TV text
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('YouTube', ytvX + 42, ytvY + 21);

      ctx.fillStyle = '#FF0000';
      ctx.font = '900 15px sans-serif';
      ctx.fillText('TV', ytvX + 108, ytvY + 21);

      // Live dot
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(ytvX + 138, ytvY + 21, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('LIVE', ytvX + 146, ytvY + 21);

      ctx.restore();
    }

    animationFrameRef.current = requestAnimationFrame(drawCompositorFrame);
  }, [burnInWatermarks, currentHeadline, useStudioAnimationFallback, watermarkConfig]);

  // Start rendering loop when preparing or recording
  useEffect(() => {
    if (status === 'recording' || status === 'paused' || status === 'preparing') {
      animationFrameRef.current = requestAnimationFrame(drawCompositorFrame);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [status, drawCompositorFrame]);

  /**
   * Start Screen Recording using the MediaRecorder API
   */
  const startRecording = async (forceSimMode: boolean = false) => {
    setErrorMessage(null);
    recordedChunksRef.current = [];
    setStatus('preparing');

    try {
      let captureStream: MediaStream | null = null;

      if (!forceSimMode && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        try {
          const displayOptions: any = {
            video: {
              cursor: 'always',
              displaySurface: 'monitor',
              frameRate: { ideal: 30, max: 60 },
            },
            audio: true, // Screen audio
          };
          captureStream = await navigator.mediaDevices.getDisplayMedia(displayOptions);
          setUseStudioAnimationFallback(false);
        } catch (displayErr: any) {
          console.warn('DisplayMedia canceled or rejected, falling back to simulated studio track:', displayErr);
          // If user cancels permission or browser denies displayMedia in sandbox, offer Studio Test track!
          if (displayErr.name === 'NotAllowedError') {
            setErrorMessage('Screen share permission was declined. Switching to Motor TV Leo Studio Simulation track.');
          }
          setUseStudioAnimationFallback(true);
        }
      } else {
        setUseStudioAnimationFallback(true);
      }

      // Initialize compositor canvas resolution (1280 x 720 HD)
      const canvas = compositorCanvasRef.current;
      if (canvas) {
        canvas.width = 1280;
        canvas.height = 720;
      }

      // If we got display stream, mount it to the preview video element
      if (captureStream && previewVideoRef.current) {
        streamRef.current = captureStream;
        previewVideoRef.current.srcObject = captureStream;
        await previewVideoRef.current.play();

        // If user clicks browser "Stop Sharing" floating button, cleanly stop recording
        captureStream.getVideoTracks()[0].onended = () => {
          stopRecording();
        };
      }

      // Optional Microphone Audio
      let micStream: MediaStream | null = null;
      if (micEnabled && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = micStream;
        } catch (e) {
          console.warn('Mic access denied or unavailable', e);
        }
      }

      // Countdown 3.. 2.. 1..
      setCountdown(3);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCountdown(2);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCountdown(1);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCountdown(null);

      // Determine stream to feed into MediaRecorder
      let recordStream: MediaStream;

      if (burnInWatermarks && canvas) {
        // Capture stream from the composited canvas with the baked-in Big Watermarks!
        const canvasStream = canvas.captureStream(30);

        // Mix audio tracks if available
        const audioTracks: MediaStreamTrack[] = [];
        if (captureStream) {
          audioTracks.push(...captureStream.getAudioTracks());
        }
        if (micStream) {
          audioTracks.push(...micStream.getAudioTracks());
        }

        audioTracks.forEach((track) => canvasStream.addTrack(track));
        recordStream = canvasStream;
      } else if (captureStream) {
        recordStream = captureStream;
        if (micStream) {
          micStream.getAudioTracks().forEach((track) => recordStream.addTrack(track));
        }
      } else if (canvas) {
        recordStream = canvas.captureStream(30);
      } else {
        throw new Error('No capture source available');
      }

      // Select supported MIME type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];
      const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

      const mediaRecorder = new MediaRecorder(recordStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 3000000, // 3 Mbps high quality
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        await handleRecordingFinished(selectedMime);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(500); // 500ms chunk slices

      setStatus('recording');
      setTimerSeconds(0);
      clearTimer();
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Failed to initiate recording:', err);
      setErrorMessage(`Failed to start recording: ${err.message || 'Unknown error'}`);
      setStatus('idle');
      setCountdown(null);
    }
  };

  /**
   * Pause / Resume
   */
  const pauseRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.pause();
      setStatus('paused');
      clearTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && status === 'paused') {
      mediaRecorderRef.current.resume();
      setStatus('recording');
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  /**
   * Stop Recording
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      setStatus('processing');
      clearTimer();
      mediaRecorderRef.current.stop();

      // Clean up capture streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
    }
  };

  /**
   * When recording stops, compile Blob, generate thumbnail, auto-save to local storage, and trigger player!
   */
  const handleRecordingFinished = async (mimeType: string) => {
    try {
      const blob = new Blob(recordedChunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);

      // Generate a thumbnail from current canvas or video snapshot
      let thumbnailUrl: string | undefined;
      if (compositorCanvasRef.current) {
        thumbnailUrl = compositorCanvasRef.current.toDataURL('image/jpeg', 0.6);
      }

      const newId = `rec_${Date.now()}`;
      const title = `Motor TV Leo Movie - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const recordingItem: RecordingItem = {
        id: newId,
        title,
        createdAt: Date.now(),
        duration: timerSeconds,
        size: blob.size,
        mimeType,
        blob,
        url,
        thumbnailUrl,
        storybookHeadline: currentHeadline,
        recordedResolution: '1080p Studio HD',
        burnInWatermarks,
      };

      // AUTO-SAVE TO LOCAL STORAGE (IndexedDB) AUTOMATICALLY!
      await autoSaveRecording(recordingItem);

      setStatus('idle');
      setTimerSeconds(0);

      // Trigger automatic video player playback immediately!
      onRecordingComplete(recordingItem);
    } catch (err: any) {
      console.error('Error finishing and auto-saving recording:', err);
      setErrorMessage('Failed to save recording to storage.');
      setStatus('idle');
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Hidden processing elements */}
      <video ref={previewVideoRef} className="hidden" muted playsInline />

      {/* Main Studio Console Viewport */}
      <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
        {/* Compositor Canvas (Live stream view) */}
        <canvas
          ref={compositorCanvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-contain bg-neutral-950"
        />

        {/* Live Watermark Overlay during preview/idle */}
        {status === 'idle' && (
          <WatermarkOverlay
            showMotorTv={watermarkConfig.showMotorTv}
            showYouTubeTv={watermarkConfig.showYouTubeTv}
            motorTvPosition={watermarkConfig.motorTvPosition}
            youTubeTvPosition={watermarkConfig.youTubeTvPosition}
            motorTvScale={watermarkConfig.motorTvScale}
            youTubeTvScale={watermarkConfig.youTubeTvScale}
            opacity={watermarkConfig.opacity}
          />
        )}

        {/* Big Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-40">
            <span className="font-cinzel text-8xl font-black text-amber-400 animate-ping">
              {countdown}
            </span>
            <span className="font-storybook text-neutral-300 text-lg mt-4 italic">
              Preparing Motor TV Leo Movie Stage...
            </span>
          </div>
        )}

        {/* IDLE Center Hero & Start Controls */}
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[2px] p-6 text-center z-20">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-xl shadow-amber-500/20 mb-3 flex items-center justify-center">
              <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Video className="w-7 h-7" />
              </div>
            </div>

            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-amber-100 tracking-wider">
              MOTOR TV LEO STORY RECORDER
            </h1>
            <p className="font-storybook text-neutral-300 text-xs sm:text-sm max-w-md mt-1 mb-5">
              Screen recording studio with auto-saving to local storage, featuring the big Motor TV
              Leo Story Movie and YouTube TV watermarks.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => startRecording(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-neutral-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Monitor className="w-4 h-4" />
                <span>Record Screen</span>
              </button>

              <button
                onClick={() => startRecording(true)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-amber-300 font-semibold text-xs tracking-wide transition-all flex items-center gap-2"
                title="Generates animated cinematic track without opening desktop screen share"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Test Studio Track</span>
              </button>
            </div>
          </div>
        )}

        {/* RECORDING / PAUSED Floating Live Control Hub */}
        {(status === 'recording' || status === 'paused') && (
          <div className="absolute bottom-4 inset-x-4 max-w-xl mx-auto bg-neutral-950/90 backdrop-blur-md border border-amber-500/50 rounded-2xl p-3 shadow-2xl z-30 flex items-center justify-between gap-3">
            {/* Live Indicator & Timer */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/70 border border-red-500/40">
                <span
                  className={`w-2.5 h-2.5 rounded-full bg-red-500 ${status === 'recording' ? 'animate-pulse' : ''}`}
                ></span>
                <span className="text-[11px] font-mono font-bold text-red-300 uppercase">
                  {status === 'recording' ? 'REC' : 'PAUSED'}
                </span>
              </div>
              <span className="font-mono text-base font-bold text-amber-300 tabular-nums">
                {formatTime(timerSeconds)}
              </span>
            </div>

            {/* Story headline snippet */}
            <div className="hidden sm:block text-xs font-storybook text-neutral-300 truncate max-w-[160px]">
              {currentHeadline}
            </div>

            {/* Recorder controls */}
            <div className="flex items-center gap-2">
              {status === 'recording' ? (
                <button
                  onClick={pauseRecording}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                  title="Pause recording"
                >
                  <Pause className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="p-2 rounded-lg bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors"
                  title="Resume recording"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              )}

              <button
                onClick={stopRecording}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                title="Stop recording and open player"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Finish & Play</span>
              </button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {status === 'processing' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-40 p-4 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin mb-4"></div>
            <h3 className="font-cinzel text-lg font-bold text-amber-200">
              Finalizing Motor TV Leo Movie...
            </h3>
            <p className="text-xs text-neutral-400 mt-1 font-storybook">
              Encoding video, baking watermarks, and auto-saving to local storage.
            </p>
          </div>
        )}
      </div>

      {/* Error alert banner if any */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-neutral-400 hover:text-white text-xs ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Recorder Settings & Options Bar */}
      <div className="max-w-4xl mx-auto mt-4 px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-neutral-300">
          {/* Mic Toggle */}
          <button
            type="button"
            onClick={() => setMicEnabled(!micEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              micEnabled
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-500'
            }`}
          >
            {micEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{micEnabled ? 'Mic Narration: ON' : 'Mic: OFF'}</span>
          </button>

          {/* Burn-in watermark toggle */}
          <button
            type="button"
            onClick={() => setBurnInWatermarks(!burnInWatermarks)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              burnInWatermarks
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}
            title="Bakes the Motor TV and YouTube TV watermarks directly onto recorded video frames"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Watermarks Burn-In: {burnInWatermarks ? 'Active' : 'Player Only'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-neutral-400 text-[11px] font-mono">
          <span>Target: 1080p 30fps</span>
          <span>·</span>
          <span>Storage: Auto Local Storage</span>
        </div>
      </div>
    </div>
  );
};
