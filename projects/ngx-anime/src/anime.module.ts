import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { NgxAnimateDirective, NgxAnimeComponent } from './components/anime/anime.component'

@NgModule({
  declarations: [NgxAnimeComponent, NgxAnimateDirective],
  imports: [CommonModule],
  exports: [NgxAnimeComponent, NgxAnimateDirective]
})
export class NgxAnimeModule { }
