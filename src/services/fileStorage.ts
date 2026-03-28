// IndexedDB-based file storage for manga covers and chapter PDFs
const DB_NAME = "mangaverse-files";
const DB_VERSION = 1;
const COVERS_STORE = "covers";
const CHAPTERS_STORE = "chapters";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(COVERS_STORE)) {
        db.createObjectStore(COVERS_STORE);
      }
      if (!db.objectStoreNames.contains(CHAPTERS_STORE)) {
        db.createObjectStore(CHAPTERS_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putFile(store: string, key: string, file: File): Promise<string> {
  const db = await openDB();
  const blob = new Blob([await file.arrayBuffer()], { type: file.type });
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(blob, key);
    tx.oncomplete = () => resolve(key);
    tx.onerror = () => reject(tx.error);
  });
}

async function getFile(store: string, key: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => {
      if (req.result) {
        resolve(URL.createObjectURL(req.result));
      } else {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

async function deleteFile(store: string, key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllKeys(store: string): Promise<string[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAllKeys();
    req.onsuccess = () => resolve(req.result as string[]);
    req.onerror = () => reject(req.error);
  });
}

// ---- Public API ----

export const fileStorage = {
  // Covers: key = mangaId
  saveCover: (mangaId: string, file: File) => putFile(COVERS_STORE, mangaId, file),
  getCover: (mangaId: string) => getFile(COVERS_STORE, mangaId),
  deleteCover: (mangaId: string) => deleteFile(COVERS_STORE, mangaId),

  // Chapters: key = "mangaId-chapterNumber"
  saveChapter: (mangaId: string, chapterNumber: number, file: File) =>
    putFile(CHAPTERS_STORE, `${mangaId}-${chapterNumber}`, file),
  getChapter: (mangaId: string, chapterNumber: number) =>
    getFile(CHAPTERS_STORE, `${mangaId}-${chapterNumber}`),
  deleteChapter: (mangaId: string, chapterNumber: number) =>
    deleteFile(CHAPTERS_STORE, `${mangaId}-${chapterNumber}`),
  
  // Get all chapter keys for a manga
  getChapterKeys: async (mangaId: string) => {
    const allKeys = await getAllKeys(CHAPTERS_STORE);
    return allKeys.filter((k) => k.startsWith(`${mangaId}-`));
  },

  // Delete all files for a manga (cover + all chapters)
  deleteAllForManga: async (mangaId: string) => {
    await deleteFile(COVERS_STORE, mangaId);
    const chapterKeys = await getAllKeys(CHAPTERS_STORE);
    for (const key of chapterKeys.filter((k) => k.startsWith(`${mangaId}-`))) {
      await deleteFile(CHAPTERS_STORE, key);
    }
  },
};
