import { Component, HostListener } from '@angular/core'

@Component({ selector: 'app-anime', templateUrl: './anime.component.html', styleUrls: ['./anime.component.css'] })
export class AnimeComponent {
  public animeActive: boolean = false

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) {
    event.preventDefault()
    this.animeActive = true
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent) {
    event.preventDefault()
    this.animeActive = false
  }
}
