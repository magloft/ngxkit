import { camelize, pluralize } from 'inflection'
import 'reflect-metadata'
import { NgxDbPortal } from './db.portal'
import { DBMode, DbSchemaStoreAttributeOptions, getStoreAttributes, setStoreAttribute } from './db.schema'

export function attribute(options: DbSchemaStoreAttributeOptions = {}) {
  return (target: any, key: string) => {
    const type = Reflect.getMetadata('design:type', target, key)
    const BaseModel: typeof Model = target.constructor
    setStoreAttribute(BaseModel.store, key, type, options)
  }
}

// @dynamic
export class Model {
  public id?: number

  public static get store() { return camelize(pluralize(this.name), true)}
  public get store() { return this.Class.store }

  protected static get service() { return NgxDbPortal.dbService }
  protected get service() { return NgxDbPortal.dbService }

  constructor(data: any = {}) {
    Object.assign(this, data)
  }

  public static async findAll() {
    const results = await this.service.findAll<any>(this.store)
    return results.map((result) => new this(result))
  }

  public static async findOne(index: string, value: any) {
    const result = await this.service.run(this.store, DBMode.readonly, (transaction) => {
      return transaction.objectStore(this.store).index(index).get(value)
    })
    return result ? new this(result) as any : null
  }

  public static async findByKeys(keys): Promise<any> {
    const results = await this.service.findByKeys(this.store, keys)
    return results.map((result) => new this(result))
  }

  public static async findBy(index: string, value: any) {
    const results = []
    await this.service.findByCursor(this.store, (transaction) => {
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
    await this.service.findByCursor(this.store, (transaction) => {
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
    await this.service.removeAll(this.store)
  }

  public static async create(data: any): Promise<any> {
    const record = new this(data)
    await record.save()
    return record as any
  }

  public async save(data: any = {}) {
    if (data) { Object.assign(this, data) }
    const attributes = { ...this.attributes }
    if (this.id) {
      await this.service.update(this.store, attributes)
    } else {
      this.id = await this.service.add(this.store, attributes)
    }
  }

  public remove() {
    return this.service.remove(this.store, this.id)
  }

  public get attributes() {
    const attributes = getStoreAttributes(this.store)
    return Object.keys(attributes).reduce((obj, key) => {
      if (this[key] !== undefined) { obj[key] = this[key] }
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
