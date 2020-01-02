import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, style } from '@angular/animations'
import { Component, ComponentFactory, ComponentFactoryResolver, ElementRef, Injector, Input, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core'
import { NgxPushviewResolve, NgxPushviewResolveData, NgxPushviewResolveResult } from './pushview.resolve'

export interface NgxPushviewStackConfig {
  id: string
  label: string
  component: Type<any>
  resolve?: NgxPushviewResolveData
}

@Component({
  selector: 'ngx-pushview',
  styleUrls: ['./pushview.component.scss'],
  templateUrl: './pushview.component.html'
})
export class NgxPushviewComponent implements OnInit {
  @Input() activePaneId: string
  @Input() stackConfigs: NgxPushviewStackConfig[]

  @ViewChild('container', { static: true }) private container: ElementRef
  @ViewChild('label', { static: true }) private label: ElementRef
  @ViewChild('stackContainer', { static: true, read: ViewContainerRef }) stackContainer: ViewContainerRef

  private itemWidth: number
  public loading = false
  public activeStackConfig: NgxPushviewStackConfig

  constructor(private builder: AnimationBuilder, private elementRef: ElementRef, private injector: Injector, private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.itemWidth = this.elementRef.nativeElement.offsetWidth
    this.activeStackConfig = this.stackConfigs.find(({ id }) => id === this.activePaneId)
    this.renderStack(this.activeStackConfig)
  }

  public next() {
    return this.slideToIndex(this.activeStackIndex + 1)
  }

  public prev() {
    return this.slideToIndex(this.activeStackIndex - 1)
  }

  private get activeStackIndex() {
    return this.stackConfigs.indexOf(this.activeStackConfig)
  }

  private async slideToIndex(index: number) {
    const { activeStackConfig, stackConfigs, activeStackIndex, container, label, itemWidth } = this
    if (index < 0 || index > stackConfigs.length - 1 || activeStackIndex === index) { return }
    const currentIndex = stackConfigs.indexOf(activeStackConfig)
    let direction = (currentIndex > index) ? +1 : -1

    await Promise.all([
      this.playAnimation([
        style({ transform: 'translateX(0px)', opacity: 1 }),
        animate('150ms ease-in', style({ transform: `translateX(${direction * itemWidth}px)`, opacity: 0 })),
      ], container.nativeElement),
      this.playAnimation([
        style({ transform: 'translateY(0px)', opacity: 1 }),
        animate('150ms ease-in', style({ transform: `translateY(${direction * 16}px)`, opacity: 0 })),
      ], label.nativeElement),
    ])

    this.loading = true
    this.activeStackConfig = await this.renderStack(stackConfigs[index])
    this.loading = false
    if (this.activeStackIndex === activeStackIndex) {
      direction = -direction
    }

    await Promise.all([
      this.playAnimation([
        style({ transform: `translateX(${-direction * itemWidth}px)`, opacity: 0 }),
        animate('150ms ease-out', style({ transform: `translateX(0px)`, opacity: 1 })),
      ], container.nativeElement),
      this.playAnimation([
        style({ transform: `translateY(${-direction * 16}px)`, opacity: 0 }),
        animate('150ms ease-out', style({ transform: `translateY(0px)`, opacity: 1 })),
      ], label.nativeElement)
    ])
  }

  private playAnimation(data: AnimationMetadata | AnimationMetadata[], element: HTMLElement) {
    return new Promise((resolve) => {
      const animation = this.builder.build(data)
      const player: AnimationPlayer = animation.create(element)
      player.onDone(resolve)
      player.play()
    })
  }

  private async renderStack(stackConfig: NgxPushviewStackConfig) {
    const { resolve = {} } = stackConfig
    const result = new NgxPushviewResolveResult()
    const injector: Injector = Injector.create({
      providers: [{ provide: NgxPushviewComponent, useValue: this }, { provide: NgxPushviewResolveResult, useValue: result }],
      parent: this.injector
    })
    let resolveError
    let newStackConfig
    await Promise.all(Object.entries(resolve).map(([key, resolver]) => {
      return injector.get<NgxPushviewResolve<any>>(resolver).resolve().then((value) => { result.set(key, value) })
    })).catch((error) => { resolveError = error })
    if (resolveError) {
      result.set('error', resolveError)
      newStackConfig = this.activeStackConfig
    } else {
      newStackConfig = stackConfig
    }
    const factory: ComponentFactory<Component> = this.resolver.resolveComponentFactory(newStackConfig.component)
    this.stackContainer.clear()
    this.stackContainer.createComponent(factory, 0, injector)
    return newStackConfig
  }
}
