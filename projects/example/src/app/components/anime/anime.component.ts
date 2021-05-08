import { Component, HostListener, ViewChild } from '@angular/core'
import { NgxAnimeComponent } from 'projects/ngx-anime/src/components/anime/anime.component'

@Component({ selector: 'app-anime', templateUrl: './anime.component.html', styleUrls: ['./anime.component.css'] })
export class AnimeComponent {
  @ViewChild(NgxAnimeComponent) anime: NgxAnimeComponent

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) {
    event.preventDefault()
    this.anime.play()
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent) {
    event.preventDefault()
    this.anime.reverse()
  }
}
