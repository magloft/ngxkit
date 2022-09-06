import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxDbModule } from 'ngx-db'
import { NgxPushviewModule } from 'ngx-pushview'
import { AppRoutingModule } from './app.routing.module'
import { AppComponent } from './components/app/app.component'
import { DbComponent } from './components/db/db.component'
import { Publication } from './components/db/db.models'
import { IndexComponent } from './components/index/index.component'
import { PushviewComponent } from './components/pushview/pushview.component'

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DbComponent,
    PushviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxDbModule.forRoot({ name: 'example', version: 1, models: [Publication] }),
    NgxPushviewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
