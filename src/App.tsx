import React, { useState, useEffect, useRef } from 'react';
import { RecordingItem } from './types/recorder';
import { getAllRecordings, deleteRecording } from './services/storage';
import { TopBar } from './components/TopBar';
import { StorybookHeaderlines, DEFAULT_STORY_HEADLINES } from './components/StorybookHeaderlines';
import { RecorderStudio } from './components/RecorderStudio';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { RecordingsLibrary } from './components/RecordingsLibrary';
import { WatermarkShowcase } from './components/WatermarkShowcase';
import { StorybookSection } from './components/StorybookSection';
import { Sparkles, CheckCircle2, Film } from 'lucide-react';

export default function App() {
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [currentHeadline, setCurrentHeadline] = useState<string>(
    `${DEFAULT_STORY_HEADLINES[0].chapter}: ${DEFAULT_STORY_HEADLINES[0].title}`
  );
  const [activePlayingRecording, setActivePlayingRecording] = useState<RecordingItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recorderRef = useRef<HTMLDivElement>(null);
  const libraryRef = useRef<HTMLDivElement>(null);

  // Load existing recordings from local storage database on mount
  useEffect(() => {
    loadSavedRecordings();
  }, []);

  const loadSavedRecordings = async () => {
    try {
      const items = await getAllRecordings();
      setRecordings(items);
    } catch (err) {
      console.warn('Failed to load saved recordings:', err);
    }
  };

  /**
   * Called immediately when recording finishes:
   * 1. Updates state list with the newly auto-saved recording
   * 2. Brings up the Video Player and starts playback automatically!
   * 3. Displays a persistent confirmation toast
   */
  const handleRecordingComplete = (newRecording: RecordingItem) => {
    setRecordings((prev) => [newRecording, ...prev.filter((r) => r.id !== newRecording.id)]);
    setActivePlayingRecording(newRecording);
    setIsPlayerOpen(true);

    showToast('✨ Recording automatically saved to Local Storage!');
  };

  const handlePlayRecording = (rec: RecordingItem) => {
    setActivePlayingRecording(rec);
    setIsPlayerOpen(true);
  };

  const handleDeleteRecording = async (id: string) => {
    try {
      await deleteRecording(id);
      setRecordings((prev) => prev.filter((r) => r.id !== id));
      if (activePlayingRecording?.id === id) {
        setIsPlayerOpen(false);
        setActivePlayingRecording(null);
      }
      showToast('Recording removed from local storage.');
    } catch (err) {
      console.error('Failed to delete recording:', err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  };

  const scrollToRecorder = () => {
    recorderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLibrary = () => {
    libraryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. TOP BAR CONTRACT */}
      <TopBar
        onScrollToRecorder={scrollToRecorder}
        onScrollToLibrary={scrollToLibrary}
        onOpenNewRecording={scrollToRecorder}
        recordingsCount={recordings.length}
      />

      {/* 2. STORYBOOK MOTOR TV HEADERLINES TICKER & SELECTOR */}
      <StorybookHeaderlines
        currentHeadline={currentHeadline}
        onSelectHeadline={(headline) => setCurrentHeadline(headline)}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-bounce duration-700">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/95 border border-emerald-500/50 shadow-2xl text-xs text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* MAIN STUDIO VIEWPORT */}
      <main className="flex-1 flex flex-col space-y-16 pb-20">
        {/* Studio Recorder Section */}
        <section ref={recorderRef} className="pt-6 px-4">
          <div className="max-w-4xl mx-auto mb-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MediaRecorder Broadcast Engine</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wider">
              MOTOR TV LEO STORY RECORDER
            </h2>
            <p className="font-storybook text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mt-1">
              Capture your screen with high-fidelity MediaRecorder API, preview with the Big Motor TV
              Leo Story Movie watermark and YouTube TV logo, and auto-save directly to local storage.
            </p>
          </div>

          <RecorderStudio
            currentHeadline={currentHeadline}
            onRecordingComplete={handleRecordingComplete}
          />
        </section>

        {/* Local Storage Media Archive */}
        <section ref={libraryRef}>
          <RecordingsLibrary
            recordings={recordings}
            onPlayRecording={handlePlayRecording}
            onDeleteRecording={handleDeleteRecording}
            onRecordNew={scrollToRecorder}
          />
        </section>

        {/* Storybook Chronicles Section */}
        <StorybookSection
          currentHeadline={currentHeadline}
          onSelectHeadline={(headline) => setCurrentHeadline(headline)}
          onScrollToRecorder={scrollToRecorder}
        />

        {/* Watermark Specification & Showcase */}
        <WatermarkShowcase />
      </main>

      {/* 3. CINEMA VIDEO PLAYER (Auto-opens on recording complete or library click) */}
      <VideoPlayerModal
        isOpen={isPlayerOpen}
        recording={activePlayingRecording}
        onClose={() => setIsPlayerOpen(false)}
        onRecordNew={scrollToRecorder}
      />

      {/* Clean Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-8 px-4 text-center text-xs text-neutral-400 font-storybook">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-amber-400">MOTOR TV LEO STORY MOVIE</span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400">Broadcasting Studio & Media Recorder</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-400">
            <span>Watermarks: Motor TV + YouTube TV</span>
            <span>·</span>
            <span>Storage: Client IndexedDB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
