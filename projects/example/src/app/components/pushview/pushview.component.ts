import { Component } from '@angular/core'
import { NgxPushviewStackConfig } from 'ngx-pushview'
import { StackOneComponent } from './stack.one.component'
import { StackResolver } from './stack.resolver'
import { StackTwoComponent } from './stack.two.component'

export enum StackPaneId { ONE = 'one', TWO = 'two' }

@Component({
  selector: 'app-pushview',
  template: '<h2>NgxPushview</h2><ngx-pushview show-close-button="true" [activePaneId]="activePaneId" [stackConfigs]="stackConfigs"></ngx-pushview>'
})
export class PushviewComponent {
  activePaneId: StackPaneId = StackPaneId.ONE
  stackConfigs: NgxPushviewStackConfig[] = [
    { id: 'one', label: 'Stack One', simple: true, component: StackOneComponent },
    { id: 'two', label: 'Strack Two', simple: true, component: StackTwoComponent, resolve: { timeout: StackResolver } }
  ]

  constructor() { }
}
