
export type NgxPushSubscriptionOptionsInit = PushSubscriptionOptionsInit & {
  url?: string
  userInfo?: { [key: string]: any }
}

export interface NgxPushSubscriptionJSON {
  endpoint?: string
  expirationTime?: number | null
  keys?: Record<string, string>
  deviceToken?: string
  permission?: string
}

export interface NgxPushSubscription {
  readonly provider: string
  readonly expirationTime: number | null
  readonly options: PushSubscriptionOptionsInit
  getKey(name: PushEncryptionKeyName): ArrayBuffer | null
  toJSON(): NgxPushSubscriptionJSON
  unsubscribe(): Promise<boolean>
}

export abstract class PushManagerBase {
  constructor(protected registration: ServiceWorkerRegistration) {}
  abstract getSubscription(): Promise<NgxPushSubscription | null>
  abstract permissionState(options: NgxPushSubscriptionOptionsInit): Promise<PushPermissionState>
  abstract subscribe(options: NgxPushSubscriptionOptionsInit): Promise<NgxPushSubscription>
}
