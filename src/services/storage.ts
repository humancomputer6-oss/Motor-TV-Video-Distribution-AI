import { RecordingItem } from '../types/recorder';

const DB_NAME = 'MotorTvLeoStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'recordings';

function getIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this browser'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open database'));
    };
  });
}

/**
 * Automatically persists the recording to client-side storage (IndexedDB)
 */
export async function autoSaveRecording(recording: RecordingItem): Promise<RecordingItem> {
  try {
    const db = await getIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const recordToSave = {
        id: recording.id,
        title: recording.title,
        createdAt: recording.createdAt,
        duration: recording.duration,
        size: recording.size,
        mimeType: recording.mimeType,
        blob: recording.blob,
        thumbnailUrl: recording.thumbnailUrl,
        storybookHeadline: recording.storybookHeadline,
        recordedResolution: recording.recordedResolution,
        burnInWatermarks: recording.burnInWatermarks,
      };

      const request = store.put(recordToSave);

      request.onsuccess = () => {
        // Also save lightweight metadata to localStorage index for rapid discovery
        try {
          const raw = localStorage.getItem('motortv_recordings_meta');
          const existingList: { id: string; title: string; createdAt: number; duration: number }[] = raw ? JSON.parse(raw) : [];
          const updated = [
            { id: recording.id, title: recording.title, createdAt: recording.createdAt, duration: recording.duration },
            ...existingList.filter((item) => item.id !== recording.id),
          ];
          localStorage.setItem('motortv_recordings_meta', JSON.stringify(updated.slice(0, 50)));
        } catch {
          // ignore localStorage errors
        }

        resolve(recording);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.error('Error auto-saving recording:', err);
    throw err;
  }
}

/**
 * Retrieve all saved recordings from local storage database
 */
export async function getAllRecordings(): Promise<RecordingItem[]> {
  try {
    const db = await getIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records: RecordingItem[] = request.result || [];
        // Map blobs to object URLs for immediate preview/playback
        const withUrls = records.map((rec) => {
          if (rec.blob && !rec.url) {
            rec.url = URL.createObjectURL(rec.blob);
          }
          return rec;
        });

        // Sort latest first
        withUrls.sort((a, b) => b.createdAt - a.createdAt);
        resolve(withUrls);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('Failed to load recordings from IndexedDB, returning empty', err);
    return [];
  }
}

/**
 * Retrieve a specific recording by ID
 */
export async function getRecordingById(id: string): Promise<RecordingItem | null> {
  const db = await getIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const rec = request.result as RecordingItem | undefined;
      if (rec && rec.blob && !rec.url) {
        rec.url = URL.createObjectURL(rec.blob);
      }
      resolve(rec || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Delete a recording from local storage
 */
export async function deleteRecording(id: string): Promise<void> {
  const db = await getIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      try {
        const raw = localStorage.getItem('motortv_recordings_meta');
        if (raw) {
          const list = JSON.parse(raw);
          const filtered = list.filter((i: { id: string }) => i.id !== id);
          localStorage.setItem('motortv_recordings_meta', JSON.stringify(filtered));
        }
      } catch {
        // ignore
      }
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
