import { Component } from '@angular/core'
import { NgxPushviewComponent } from 'ngx-pushview'

@Component({
  selector: 'app-stack-two',
  template: '<button (click)="stack.prev()">Previous Page</button>',
  styles: [':host{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;height:320px;}button{display:block;}']
})
export class StackTwoComponent {
  constructor(public stack: NgxPushviewComponent) { }
}
