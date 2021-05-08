import { Component, HostListener } from '@angular/core'

@Component({ selector: 'app-anime', templateUrl: './anime.component.html', styleUrls: ['./anime.component.css'] })
export class AnimeComponent {
  public animeActive: boolean = false

  // @ViewChild(NgxAnimeComponent) anime: NgxAnimeComponent

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) {
    event.preventDefault()
    // this.anime.play()
    this.animeActive = true
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent) {
    event.preventDefault()
    // this.anime.reverse()
    this.animeActive = false
  }
}
