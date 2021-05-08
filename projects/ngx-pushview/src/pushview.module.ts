import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { NgxPushviewComponent } from './pushview.component'

@NgModule({
  declarations: [NgxPushviewComponent],
  imports: [CommonModule, NoopAnimationsModule],
  exports: [NgxPushviewComponent]
})
export class NgxPushviewModule { }
