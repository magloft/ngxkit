import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxDbModule } from 'ngx-db'
import { NgxPushviewModule } from 'ngx-pushview'
import { NgxAnimeModule } from 'projects/ngx-anime/src/anime.module'
import { AppRoutingModule } from './app.routing.module'
import { AnimeComponent } from './components/anime/anime.component'
import { AppComponent } from './components/app/app.component'
import { DbComponent } from './components/db/db.component'
import { Publication } from './components/db/db.models'
import { IndexComponent } from './components/index/index.component'
import { PushviewComponent } from './components/pushview/pushview.component'

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AnimeComponent,
    DbComponent,
    PushviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxAnimeModule,
    NgxDbModule.forRoot({ name: 'example', version: 1, models: [Publication] }),
    NgxPushviewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
