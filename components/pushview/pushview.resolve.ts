export declare interface NgxPushviewResolveData {
  [name: string]: any
}

export declare interface NgxPushviewResolve<T> {
  resolve(): Promise<T>
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
