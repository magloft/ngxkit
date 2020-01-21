import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgxDbModule } from 'projects/db/public-api'
import { AppComponent } from './app.component'
import { Article } from './models/Article'
import { Publication } from './models/Publication'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDbModule.forRoot({
      name: 'example',
      version: 1,
      models: [Article, Publication]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
