export interface RecordingItem {
  id: string;
  title: string;
  createdAt: number;
  duration: number; // in seconds
  size: number; // in bytes
  mimeType: string;
  blob?: Blob;
  url?: string;
  thumbnailUrl?: string;
  storybookHeadline: string;
  recordedResolution: string;
  burnInWatermarks: boolean;
}

export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface WatermarkConfig {
  showMotorTv: boolean;
  showYouTubeTv: boolean;
  motorTvPosition: WatermarkPosition;
  youTubeTvPosition: WatermarkPosition;
  motorTvScale: number; // e.g. 1.0, 1.25, 1.5
  youTubeTvScale: number;
  opacity: number; // 0.2 to 1.0
  burnIntoVideo: boolean; // Burned in via HTML5 canvas capture stream
}

export interface StoryHeadlineItem {
  id: string;
  chapter: string;
  title: string;
  tagline: string;
}

export type RecorderStatus = 'idle' | 'preparing' | 'recording' | 'paused' | 'processing';
