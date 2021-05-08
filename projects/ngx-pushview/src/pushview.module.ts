import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxPushviewComponent } from './pushview.component'

@NgModule({
  declarations: [NgxPushviewComponent],
  imports: [BrowserModule, BrowserAnimationsModule],
  exports: [NgxPushviewComponent]
})
export class NgxPushviewModule { }
