import { NgxPushSubscription, NgxPushSubscriptionJSON, NgxPushSubscriptionOptionsInit, PushManagerBase } from './PushManagerBase'

export type SafariPermission = 'default' | 'granted' | 'denied'

export interface SafariPushSubscriptionNative {
  permission: SafariPermission
  deviceToken: string
}

export interface SafariPush {
  pushNotification: {
    permission: (webPushID: string) => SafariPushSubscriptionNative
    requestPermission(url: string, websitePushID: string, userInfo: { [key: string]: any }, callback: (data: SafariPushSubscriptionNative) => void)
  }
}

declare global {
  interface Window {
    safari?: SafariPush
  }
}

const PERMISSION_MAP: { [key in SafariPermission]: PermissionState } = {
  default: 'prompt',
  granted: 'granted',
  denied: 'denied'
}

export class PushSubscriptionSafari implements NgxPushSubscription {
  readonly provider: string = 'safari'
  readonly endpoint: string = null
  readonly expirationTime: number | null = null
  readonly options: PushSubscriptionOptions = null

  constructor(private subscription: SafariPushSubscriptionNative, private registration: ServiceWorkerRegistration) { }

  getKey(): null { return null }
  toJSON(): NgxPushSubscriptionJSON {
    const { deviceToken, permission } = this.subscription
    return { deviceToken, permission }
  }

  async unsubscribe(): Promise<boolean> { return true }
  getRegistration() { return this.registration }
}

export class PushManagerSafari extends PushManagerBase {
  constructor(registration: ServiceWorkerRegistration, private webPushId: string) { super(registration) }

  getRegistration() { return this.registration }

  async getSubscription(): Promise<NgxPushSubscription | null> {
    const permissionState = await this.permissionState()
    if (permissionState !== 'granted') { return null }
    const nativeSubscription = window.safari.pushNotification.permission(this.webPushId)
    if (!nativeSubscription) { return null }
    return new PushSubscriptionSafari(nativeSubscription, this.registration)
  }

  async permissionState(): Promise<PermissionState> {
    const permissionData = window.safari.pushNotification.permission(this.webPushId)
    return PERMISSION_MAP[permissionData.permission]
  }

  async subscribe({ url, userInfo }: NgxPushSubscriptionOptionsInit = {}): Promise<NgxPushSubscription> {
    const subscription = await new Promise<SafariPushSubscriptionNative>((resolve, reject) => {
      window.safari.pushNotification.requestPermission(url, this.webPushId, userInfo, (value) => {
        if (value.permission === 'denied') {
          reject(new Error('Safari Push Permission denied'))
        } else {
          resolve(value)
        }
      })
    })
    return new PushSubscriptionSafari(subscription, this.registration)
  }
}
