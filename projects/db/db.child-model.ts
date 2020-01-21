import 'reflect-metadata'
import { Model } from './db.model'
import { NgxDbPortal } from './db.portal'

// @dynamic
export class ChildModel {
  public readonly parent: Model

  public static service(name: string) { return NgxDbPortal.services[name] }

  public static deserialize(data: any, parent: Model) {
    const record = new this(data, parent)
    return record
  }

  constructor(data: any = {}, parent: Model) {
    this.parent = parent
    Object.assign(this, data)
  }

  public serialize() {
    return Object.entries(this).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})
  }

  public getParent<T extends Model>() {
    return this.parent as T
  }

  public service(name: string) { return NgxDbPortal.services[name] }
}
