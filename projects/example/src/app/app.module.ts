import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgxDbModule } from 'ngx-db'
import { NgxPushviewModule } from 'ngx-pushview'
import { AppComponent } from './app.component'
import { Publication } from './models/Publication'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxPushviewModule,
    NgxDbModule.forRoot({ name: 'example', version: 1, models: [Publication] })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
