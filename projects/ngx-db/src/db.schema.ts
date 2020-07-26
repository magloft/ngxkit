import { InjectionToken } from '@angular/core'
import { ChildModel } from './db.child-model'
import { Model } from './db.model'

export type TransactionCallback = (transaction: IDBTransaction) => IDBRequest
export type CursorCallback = (cursor: IDBCursorWithValue) => boolean
export enum DBMode { readonly = 'readonly', readwrite = 'readwrite' }

export interface DBConfig {
  name: string
  version: number
  models: typeof Model[]
  schema?: DbSchema
}

export interface DbSchemaStoreAttribute {
  key: string
  type: typeof Number | typeof String | typeof Array
  unique: boolean
  primary: boolean
  required: boolean
  multiEntry: boolean
  ModelType?: typeof ChildModel
}

export interface DbSchemaStoreCollectionOptions extends DbSchemaStoreAttributeOptions {
  ModelType: typeof ChildModel
}

export interface DbSchemaStoreAttributeOptions {
  unique?: boolean
  primary?: boolean
  required?: boolean
  multiEntry?: boolean
}

export interface DbSchemaStore {
  name: string
  attributes: {[key: string]: DbSchemaStoreAttribute}
}

export interface DbSchema {
  stores: {[key: string]: DbSchemaStore}
}

export const CONFIG_TOKEN = new InjectionToken<DBConfig>(null)

export const schema: DbSchema = {
  stores: {}
}

export function setStoreAttribute(store: string, key: string, type: typeof Number | typeof String | typeof Array, options: DbSchemaStoreAttributeOptions) {
  if (!schema.stores[store]) { schema.stores[store] = { attributes: {}, name: store } }
  const defaults = { primary: false, required: false, unique: false, multiEntry: false }
  schema.stores[store].attributes[key] = { ...defaults, key, type, ...options }
}

export function getStoreAttributes(store: string) {
  return schema.stores[store].attributes
}

export function getStoreCollections(store: string) {
  return Object.values(schema.stores[store].attributes).filter((attribute) => attribute.ModelType != null)
}
