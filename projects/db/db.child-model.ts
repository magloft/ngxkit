import 'reflect-metadata'
import { Model } from './db.model'

// @dynamic
export class ChildModel {
  public readonly parent: Model

  constructor(data: any = {}, parent: Model) {
    this.parent = parent
    Object.assign(this, data)
  }

  public static deserialize(data: any, parent: Model) {
    const record = new this(data, parent)
    return record
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
}
