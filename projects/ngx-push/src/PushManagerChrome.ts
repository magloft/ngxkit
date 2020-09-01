import { NgxPushSubscription, NgxPushSubscriptionJSON, PushManagerBase } from './PushManagerBase'

export class PushSubscriptionChrome implements PushSubscription, NgxPushSubscription {
  constructor(private subscription: PushSubscription) {}
  readonly provider: string = 'chrome'
  get expirationTime(): number | null { return this.subscription.expirationTime }
  get options(): PushSubscriptionOptions { return this.subscription.options }
  get endpoint(): string { return this.subscription.endpoint }
  getKey(name: PushEncryptionKeyName): ArrayBuffer | null { return this.subscription.getKey(name) }
  toJSON(): NgxPushSubscriptionJSON { return this.subscription.toJSON() }
  unsubscribe(): Promise<boolean> { return this.subscription.unsubscribe() }
}

export class PushManagerChrome extends PushManagerBase {
  async getSubscription(): Promise<NgxPushSubscription | null> {
    const subscription = await this.registration.pushManager.getSubscription()
    if (!subscription) { return null }
    return new PushSubscriptionChrome(subscription)
  }

  permissionState(options: PushSubscriptionOptionsInit): Promise<PushPermissionState> {
    return this.registration.pushManager.permissionState(options)
  }

  async subscribe(options: PushSubscriptionOptionsInit = {}): Promise<NgxPushSubscription> {
    const subscription = await this.registration.pushManager.subscribe(options)
    if (!subscription) { return null }
    return new PushSubscriptionChrome(subscription)
  }
}
