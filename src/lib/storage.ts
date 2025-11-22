export interface HistoryItem {
    id: string
    image: string
    originalImage?: string
    description?: string
    timestamp: number
}

const DB_NAME = 'PolaroidDB'
const DB_VERSION = 1
const STORES = {
    KEYVAL: 'keyval',
    HISTORY: 'history'
}

export class Storage {
    private db: IDBDatabase | null = null

    private async open(): Promise<IDBDatabase> {
        if (this.db) return this.db

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => {
                this.db = request.result
                resolve(request.result)
            }

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result
                if (!db.objectStoreNames.contains(STORES.KEYVAL)) {
                    db.createObjectStore(STORES.KEYVAL)
                }
                if (!db.objectStoreNames.contains(STORES.HISTORY)) {
                    db.createObjectStore(STORES.HISTORY, { keyPath: 'id' })
                }
            }
        })
    }

    async set(key: string, value: any): Promise<void> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORES.KEYVAL, 'readwrite')
            const store = transaction.objectStore(STORES.KEYVAL)
            const request = store.put(value, key)
            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve()
        })
    }

    async get<T>(key: string): Promise<T | null> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORES.KEYVAL, 'readonly')
            const store = transaction.objectStore(STORES.KEYVAL)
            const request = store.get(key)
            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve(request.result || null)
        })
    }

    async addHistory(item: HistoryItem): Promise<void> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORES.HISTORY, 'readwrite')
            const store = transaction.objectStore(STORES.HISTORY)
            const request = store.add(item)
            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve()
        })
    }

    async getHistory(): Promise<HistoryItem[]> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORES.HISTORY, 'readonly')
            const store = transaction.objectStore(STORES.HISTORY)
            const request = store.getAll()
            request.onerror = () => reject(request.error)
            request.onsuccess = () => {
                // Sort by timestamp desc
                const results = request.result as HistoryItem[]
                resolve(results.sort((a, b) => b.timestamp - a.timestamp))
            }
        })
    }

    async deleteHistory(id: string): Promise<void> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORES.HISTORY, 'readwrite')
            const store = transaction.objectStore(STORES.HISTORY)
            const request = store.delete(id)
            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve()
        })
    }

    async clearHistory(): Promise<void> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORES.HISTORY, 'readwrite')
            const store = transaction.objectStore(STORES.HISTORY)
            const request = store.clear()
            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve()
        })
    }
}

export const db = new Storage()
