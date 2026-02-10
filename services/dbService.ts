

/**
 * HYPERXGEN VAULT_DB v1.0
 * IndexedDB implementation for massive design buffer persistence (Update 5).
 */

import { Preset, KernelConfig, LogEntry, ExtractionResult } from '../types.ts';

const DB_NAME = 'HYPERXGEN_VAULT';
const DB_VERSION = 2; // Upped version to introduce new stores
const STORES = {
  PRESETS: 'presets',
  RECENT: 'recent',
  CONFIG: 'config',
  LOGS: 'logs',
  GLOBAL_DNA: 'global_dna'
};

class VaultDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve();
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        Object.values(STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            if ([STORES.PRESETS, STORES.RECENT].includes(storeName)) { // Removed ARCHIVES
              db.createObjectStore(storeName, { keyPath: 'id' });
            } else {
              db.createObjectStore(storeName);
            }
          }
        });
        // Delete old stores if they exist and are no longer needed (for downgrade/cleanup)
        if (db.objectStoreNames.contains('archives')) {
          db.deleteObjectStore('archives');
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => reject(new Error('VAULT_DB_INIT_FAILED'));
    });
  }

  private async getStore(name: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(name, mode);
    return transaction.objectStore(name);
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const store = await this.getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(new Error(`VAULT_READ_ERROR: ${storeName}`));
    });
  }

  async saveAll<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    const transaction = store.transaction;
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new Error(`VAULT_WRITE_ERROR: ${storeName}`));
      
      store.clear();
      items.forEach(item => store.put(item));
    });
  }

  async clearStore(storeName: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`VAULT_CLEAR_ERROR: ${storeName}`));
    });
  }

  // Methods for singleton-like stores
  async saveItem<T>(storeName: string, key: string, value: T): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(new Error(`VAULT_SAVE_ITEM_ERROR: ${storeName} - ${e}`));
    });
  }

  async getItem<T>(storeName: string, key: string): Promise<T | undefined> {
    const store = await this.getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(new Error(`VAULT_GET_ITEM_ERROR: ${storeName}`));
    });
  }
}

export const vaultDb = new VaultDB();