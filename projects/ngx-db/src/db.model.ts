import { camelize, pluralize } from 'inflection'
import 'reflect-metadata'
import { NgxDbPortal } from './db.portal'
import { DBMode, DbSchemaStoreAttributeOptions, DbSchemaStoreCollectionOptions, getStoreAttributes, getStoreCollections, setStoreAttribute } from './db.schema'

export function attribute(options: DbSchemaStoreAttributeOptions = {}) {
  return (target: any, key: string) => {
    const type = Reflect.getMetadata('design:type', target, key)
    const BaseModel: typeof Model = target.constructor
    setStoreAttribute(BaseModel.store, key, type, options)
  }
}

export function collection(options: DbSchemaStoreCollectionOptions) {
  return (target: any, key: string) => {
    const type = Reflect.getMetadata('design:type', target, key)
    if (type !== Array) { throw new Error('@collection properties require type Array') }
    const BaseModel: typeof Model = target.constructor
    setStoreAttribute(BaseModel.store, key, type, options)
  }
}

// @dynamic
export class Model {
  public id?: number

  public static get store() { return camelize(pluralize(this.name), true)}
  public static get db() { return NgxDbPortal.dbService }
  public static service<T>(name: string): T { return NgxDbPortal.services[name] }

  public static async findAll<T>(): Promise<T[]> {
    const results = await this.db.findAll<any>(this.store)
    return results.map((result) => new this(result))
  }

  public static async findOne<T>(index: string, value: any): Promise<T> {
    const result = await this.db.run(this.store, DBMode.readonly, (transaction) => {
      return transaction.objectStore(this.store).index(index).get(value)
    })
    return result ? new this(result) as any : null
  }

  public static async findByKeys(keys): Promise<any> {
    const results = await this.db.findByKeys(this.store, keys)
    return results.map((result) => new this(result))
  }

  public static async findBy(index: string, value: any) {
    const results = []
    await this.db.findByCursor(this.store, (transaction) => {
      return transaction.objectStore(this.store).index(index).openCursor()
    }, (cursor) => {
      if (cursor.key === value) { results.push(cursor.value) }
      cursor.continue()
      return true
    })
    return results.map((result) => new this(result))
  }

  public static async where(filter: any) {
    const results = []
    await this.db.findByCursor(this.store, (transaction) => {
      return transaction.objectStore(this.store).openCursor()
    }, (cursor) => {
      const mismatch = Object.entries(filter).find(([key, value]) => {
        return cursor.value[key] !== value
      })
      if (!mismatch) {
        results.push(cursor.value)
      }
      cursor.continue()
      return true
    })
    return results.map((result) => new this(result))
  }

  public static async removeAll() {
    await this.db.removeAll(this.store)
  }

  public static async create(data: any): Promise<any> {
    const record = new this(data)
    await record.save()
    return record as any
  }

  public get store() { return this.Class.store }
  protected get db() { return NgxDbPortal.dbService }
  public service<T>(name: string): T { return NgxDbPortal.services[name] }

  constructor(data: any = {}) {
    Object.assign(this, data)
    for (const { key, ModelType } of getStoreCollections(this.store)) {
      const entries = this[key] || []
      this[key] = entries.map((entry) => ModelType.deserialize(entry, this))
    }
  }

  public async save(data: any = {}) {
    if (data) { Object.assign(this, data) }
    const attributes = { ...this.attributes }
    if (this.id) {
      await this.db.update(this.store, attributes)
    } else {
      this.id = await this.db.add(this.store, attributes)
    }
  }

  public remove() {
    return this.db.remove(this.store, this.id)
  }

  public get attributes() {
    const attributes = getStoreAttributes(this.store)
    return Object.entries(attributes).reduce((obj, [key, { ModelType }]) => {
      if (this[key] !== undefined) {
        obj[key] = ModelType != null ? this[key].map((record) => record.serialize()) : this[key]
      }
      return obj
    }, {})
  }

  public get Class(): typeof Model {
    return this.constructor as any
  }

  public get persisted() {
    return this.id != null
  }
}
