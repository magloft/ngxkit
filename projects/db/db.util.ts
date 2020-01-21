import { CursorCallback, DBConfig, DBMode, TransactionCallback } from './db.schema'

export function createObjectStore(dbConfig: DBConfig) {
  const { name, version, schema } = dbConfig
  const request: IDBOpenDBRequest = indexedDB.open(name, version)
  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const database: IDBDatabase = (event.target as any).result
    for (const store of Object.values(schema.stores)) {
      const primaryAttribute = Object.values(store.attributes).find(({ primary }) => primary)
      const objectStore = database.createObjectStore(store.name, { autoIncrement: true, keyPath: primaryAttribute.key })
      for (const attribute of Object.values(store.attributes)) {
        const { unique, multiEntry } = attribute
        objectStore.createIndex(attribute.key, attribute.key, { unique, multiEntry })
      }
    }
    database.close()
  }

  request.onsuccess = (e: any) => {
    e.target.result.close()
  }
}

export function runRequest<T>(request: IDBRequest | IDBOpenDBRequest, upgradeCallback?: (event: Event, db: IDBDatabase) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => { resolve(request.result as T) }
    request.onerror = () => { reject(request.error) }
    if (request instanceof IDBOpenDBRequest && typeof upgradeCallback === 'function') {
      request.onupgradeneeded = (event: Event) => {
        upgradeCallback(event, request.result)
      }
    }
  })
}

export function openDatabase(dbName: string, version: number, upgradeCallback?: (event: Event, db: IDBDatabase) => void): Promise<IDBDatabase> {
  const request = indexedDB.open(dbName, version)
  return runRequest<IDBDatabase>(request, upgradeCallback)
}

export function runTransaction<T>(db: IDBDatabase, mode: DBMode, store: string, callback: TransactionCallback): Promise<T> {
  return runRequest<T>(callback(db.transaction(store, mode)))
}

export function getCursor(db: IDBDatabase, mode: DBMode, store: string, callback: TransactionCallback, next: CursorCallback): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, mode)
    const request = callback(transaction)
    request.onerror = reject
    request.onsuccess = () => {
      const cursor = request.result
      if (!cursor) { resolve(); return }
      const result = next(cursor)
      if (!result) { resolve() }
    }
  })
}

export interface Options {
  store: string
  dbMode: IDBTransactionMode
  error: (e: Event) => any
  complete: (e: Event) => any
  abort?: any
}

export function createTransaction(db: IDBDatabase, options: Options): IDBTransaction {
  const trans: IDBTransaction = db.transaction(options.store, options.dbMode)
  trans.onerror = options.error
  trans.oncomplete = options.complete
  trans.onabort = options.abort
  return trans
}

export function optionsGenerator(type: any, store: any, reject: (event: Event) => void, resolve: () => void): Options {
  return {
    store,
    dbMode: type,
    error: (event: Event) => { reject(event) },
    complete: () => { resolve() },
    abort: (event: Event) => { reject(event) }
  }
}
