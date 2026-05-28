import type { StateStorage } from 'zustand/middleware';

const DATABASE_NAME = 'currency-hub';
const STORE_NAME = 'key-value';
const DATABASE_VERSION = 1;

let databasePromise: Promise<IDBDatabase> | null = null;

function openDatabase() {
  if (databasePromise) {
    return databasePromise;
  }

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to open IndexedDB'));
  });

  return databasePromise;
}

function isIndexedDbAvailable() {
  return typeof indexedDB !== 'undefined';
}

export const indexedDbStorage: StateStorage = {
  async getItem(name) {
    if (!isIndexedDbAvailable()) {
      return null;
    }

    try {
      const database = await openDatabase();

      return await new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readonly');
        const request = transaction.objectStore(STORE_NAME).get(name);

        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () =>
          reject(request.error ?? new Error('Failed to read IndexedDB value'));
      });
    } catch {
      return null;
    }
  },
  async setItem(name, value) {
    if (!isIndexedDbAvailable()) {
      return;
    }

    try {
      const database = await openDatabase();

      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const request = transaction.objectStore(STORE_NAME).put(value, name);

        request.onsuccess = () => resolve();
        request.onerror = () =>
          reject(request.error ?? new Error('Failed to write IndexedDB value'));
      });
    } catch {
      return;
    }
  },
  async removeItem(name) {
    if (!isIndexedDbAvailable()) {
      return;
    }

    try {
      const database = await openDatabase();

      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const request = transaction.objectStore(STORE_NAME).delete(name);

        request.onsuccess = () => resolve();
        request.onerror = () =>
          reject(
            request.error ?? new Error('Failed to remove IndexedDB value'),
          );
      });
    } catch {
      return;
    }
  },
};
