import { Type } from '@angular/core'

export interface NgxPushviewStackConfig {
  id: string
  label: string
  component: Type<any>
  resolve?: NgxPushviewResolveData
  data?: NgxPushviewResolveData
}

export interface NgxPushviewTransition {
  from: NgxPushviewStackConfig
  to: NgxPushviewStackConfig
}

export declare interface NgxPushviewResolveData {
  [name: string]: any
}

export declare interface NgxPushviewResolve<T> {
  resolve(transition?: NgxPushviewTransition): Promise<T>
}

export class NgxPushviewResolveResult {
  constructor(private data: NgxPushviewResolveData = {}) {
    this.data = {}
  }

  set(key: string, value: any) {
    this.data[key] = value
  }

  get(key: string) {
    return this.data[key]
  }

  keys() {
    return Object.keys(this.data)
  }
}
