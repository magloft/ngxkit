import { Inject, Injectable } from '@angular/core'
import { NgxDbPortal } from './db.portal'
import { CONFIG_TOKEN, CursorCallback, DBConfig, DBMode, schema, TransactionCallback } from './db.schema'
import { createObjectStore, getCursor, openDatabase, runTransaction } from './db.util'

@Injectable({ providedIn: 'root' })
export class NgxDbService {
  public ready: Promise<IDBDatabase>

  constructor(@Inject(CONFIG_TOKEN) private dbConfig: DBConfig) {
    if (!dbConfig.name) { throw new Error('NgxDb: Please, provide the dbName in the configuration') }
    if (!dbConfig.version) { throw new Error('NgxDb: Please, provide the db version in the configuration') }
    dbConfig.schema = schema
    createObjectStore(dbConfig)
    this.ready = openDatabase(this.dbConfig.name, this.dbConfig.version)
    NgxDbPortal.dbService = this
  }

  public async run<T>(store: string, mode: DBMode, callback: TransactionCallback): Promise<T> {
    return runTransaction<T>(await this.ready, mode, store, callback)
  }

  public findAll<T>(store: string): Promise<T> {
    return this.run(store, DBMode.readonly, (transaction) => transaction.objectStore(store).getAll())
  }

  public add<T>(store: string, value: T, key?: any): Promise<number> {
    return this.run(store, DBMode.readwrite, (transaction) => transaction.objectStore(store).add(value, key))
  }

  public remove(store: string, key: any): Promise<void> {
    return this.run(store, DBMode.readwrite, (transaction) => transaction.objectStore(store).delete(key))
  }

  public removeAll(store: string): Promise<void> {
    return this.run(store, DBMode.readwrite, (transaction) => transaction.objectStore(store).clear())
  }

  public update<T>(store: string, value: T, key?: IDBValidKey): Promise<number> {
    return this.run(store, DBMode.readwrite, (transaction) => transaction.objectStore(store).put(value, key))
  }

  public count(store: string, key?: IDBValidKey | IDBKeyRange): Promise<number> {
    return this.run(store, DBMode.readonly, (transaction) => transaction.objectStore(store).count(key))
  }

  public async findByKeys(store: string, keys: Set<number>) {
    const arr = Array.from(keys).sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    const lower = arr[0]
    const upper = arr[arr.length - 1]
    const bounds = IDBKeyRange.bound(lower, upper)
    let i = 0
    const results = []
    await getCursor(await this.ready, DBMode.readonly, store, (transaction) => {
      return transaction.objectStore(store).index('id').openCursor(bounds)
    }, (cursor) => {
      while (cursor.key > arr[i]) {
        i += 1
        if (i === arr.length) { return false }
      }
      if (cursor.key === arr[i]) {
        results.push(cursor.value)
        cursor.continue()
      } else {
        cursor.continue(arr[i])
      }
      return true
    })
    return results
  }

  public async findByCursor(store: string, callback: TransactionCallback, next: CursorCallback) {
    return getCursor(await this.ready, DBMode.readonly, store, callback, next)
  }
}
