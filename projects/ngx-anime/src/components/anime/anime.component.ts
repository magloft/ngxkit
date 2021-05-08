import { Component, Directive, ElementRef, Host, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import anime from 'animejs'

@Directive({ selector: '[ngxAnimate]' })
export class NgxAnimateDirective implements OnInit {
  @Input('ngxAnimate') animation: anime.AnimeAnimParams

  constructor(private element: ElementRef<SVGGElement>, @Host() private parent: NgxAnimeComponent) { }

  ngOnInit() {
    this.parent.add({ ...this.animation, targets: this.element.nativeElement })
  }
}

@Component({
  selector: 'ngx-anime',
  styleUrls: ['./anime.component.scss'],
  templateUrl: './anime.component.html'
})
export class NgxAnimeComponent implements OnInit, OnChanges {
  @Input() timeline: anime.AnimeParams = {}
  @Input() active?: boolean

  private instance: anime.AnimeTimelineInstance

  ngOnInit() {
    this.instance = anime.timeline({ autoplay: false, ...this.timeline })
    if (this.active && this.instance.paused) {
      this.play()
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.active || !this.instance) { return }
    if (changes.active.currentValue === true) {
      this.play()
    } else if (changes.active.currentValue === false) {
      this.reverse()
    }
  }

  add(animation: anime.AnimeAnimParams) {
    this.instance.add(animation, 0)
  }

  play(): Promise<void> {
    if (this.instance.reversed) {
      this.instance.reverse()
    } else {
      this.instance.play()
    }
    if (this.instance.paused) { this.instance.play() }
    return this.instance.finished
  }

  reverse(): Promise<void> {
    if (this.instance.reversed) {
      this.instance.play()
    } else {
      this.instance.reverse()
    }
    if (this.instance.paused) { this.instance.play() }
    return this.instance.finished
  }
}
