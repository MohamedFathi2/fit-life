/** Minimal promise wrapper around IndexedDB. Stores: docs (synced data), meta (cursor etc.), blobs (photos). */
export interface DocRow { k: string; col: string; id: string; data: unknown; ts: number; deleted: boolean; dirty: boolean }

let dbp: Promise<IDBDatabase> | null = null;
function db() {
  dbp ||= new Promise((res, rej) => {
    const rq = indexedDB.open('fitlife', 2);
    rq.onupgradeneeded = () => {
      const d = rq.result;
      for (const s of Array.from(d.objectStoreNames)) d.deleteObjectStore(s); // v1 was the single-file prototype
      d.createObjectStore('docs', { keyPath: 'k' });
      d.createObjectStore('meta');
      d.createObjectStore('blobs');
    };
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  });
  return dbp;
}

async function run<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest | void): Promise<T> {
  const d = await db();
  return new Promise((res, rej) => {
    const tx = d.transaction(store, mode);
    const r = fn(tx.objectStore(store));
    tx.oncomplete = () => res((r ? r.result : undefined) as T);
    tx.onerror = () => rej(tx.error);
    tx.onabort = () => rej(tx.error);
  });
}

export const idb = {
  allDocs: () => run<DocRow[]>('docs', 'readonly', s => s.getAll()),
  putDocs: async (rows: DocRow[]) => {
    if (!rows.length) return;
    const d = await db();
    await new Promise<void>((res, rej) => {
      const tx = d.transaction('docs', 'readwrite'); const s = tx.objectStore('docs');
      rows.forEach(r => s.put(r));
      tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
    });
  },
  clearDocs: () => run<void>('docs', 'readwrite', s => s.clear()),
  getMeta: <T,>(k: string) => run<T | undefined>('meta', 'readonly', s => s.get(k)),
  setMeta: (k: string, v: unknown) => run<void>('meta', 'readwrite', s => s.put(v, k)),
  clearMeta: () => run<void>('meta', 'readwrite', s => s.clear()),
  getBlob: (k: string) => run<{ blob: Blob; uploaded: boolean } | undefined>('blobs', 'readonly', s => s.get(k)),
  setBlob: (k: string, v: { blob: Blob; uploaded: boolean }) => run<void>('blobs', 'readwrite', s => s.put(v, k)),
  delBlob: (k: string) => run<void>('blobs', 'readwrite', s => s.delete(k)),
  blobKeys: () => run<string[]>('blobs', 'readonly', s => s.getAllKeys()),
  clearBlobs: () => run<void>('blobs', 'readwrite', s => s.clear()),
};
