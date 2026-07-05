"use client";

const DB_NAME = "aioms-offline";
const DB_VERSION = 1;
const STORE_NAME = "pending-sales";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

export type OfflineSale = {
  items: { productId: string; quantity: number; unitPrice: number }[];
  paymentMethod: string;
  cashAmount?: number;
  kbzPayAmount?: number;
  cbPayAmount?: number;
  wavePayAmount?: number;
  timestamp: number;
  synced: boolean;
};

export async function saveOfflineSale(sale: Omit<OfflineSale, "timestamp" | "synced">): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add({ ...sale, timestamp: Date.now(), synced: false });
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getPendingSales(): Promise<(OfflineSale & { id: number })[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as (OfflineSale & { id: number })[]);
    request.onerror = () => reject(request.error);
  });
}

export async function markSaleSynced(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const sale = getReq.result;
      if (sale) {
        sale.synced = true;
        store.put(sale);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function clearSyncedSales(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.openCursor();
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null;
      if (cursor) {
        if (cursor.value.synced) {
          cursor.delete();
        }
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function syncPendingSales(): Promise<{ synced: number; failed: number }> {
  const pending = await getPendingSales();
  let synced = 0;
  let failed = 0;

  for (const sale of pending) {
    if (sale.synced) continue;
    try {
      const response = await fetch("/api/sales/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: sale.items,
          paymentMethod: sale.paymentMethod,
          cashAmount: sale.cashAmount,
          kbzPayAmount: sale.kbzPayAmount,
          cbPayAmount: sale.cbPayAmount,
          wavePayAmount: sale.wavePayAmount,
        }),
      });
      if (response.ok) {
        await markSaleSynced(sale.id);
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  await clearSyncedSales();
  return { synced, failed };
}

export function useOfflineSync() {
  function setupOnlineListener() {
    if (typeof window === "undefined") return;
    window.addEventListener("online", async () => {
      const result = await syncPendingSales();
      if (result.synced > 0) {
        window.dispatchEvent(
          new CustomEvent("offline-sync", { detail: result })
        );
      }
    });
  }

  return { setupOnlineListener, getPendingSales, syncPendingSales };
}
