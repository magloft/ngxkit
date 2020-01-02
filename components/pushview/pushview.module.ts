import { NgModule } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxPushviewComponent } from './pushview.component'

@NgModule({
  declarations: [NgxPushviewComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MatIconModule, MatProgressSpinnerModule],
  exports: [NgxPushviewComponent]
})
export class NgxPushviewModule {}
