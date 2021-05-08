import { Component } from '@angular/core'
import { NgxPushviewComponent } from 'ngx-pushview'

@Component({
  selector: 'app-stack-one',
  template: '<button (click)="stack.next()">Next Page</button>',
  styles: [':host{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;height:320px;}']
})
export class StackOneComponent {
  constructor(public stack: NgxPushviewComponent) { }
}
