import { Injectable } from '@angular/core'
import { NgxPushviewResolve } from 'ngx-pushview'

@Injectable({ providedIn: 'root' })
export class StackResolver implements NgxPushviewResolve<unknown> {
  resolve() {
    return new Promise((resolve) => setTimeout(resolve, 1000))
  }
}
