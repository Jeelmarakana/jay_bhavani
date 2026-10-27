import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[data-3d-reveal], [data-3d-tilt]',
  standalone: true,
})
export class MotionDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const host = this.element.nativeElement;
    if (!host.hasAttribute('data-3d-reveal')) return;

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      this.renderer.addClass(host, 'is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.renderer.addClass(host, 'is-visible');
          this.observer?.unobserve(host);
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    const host = this.element.nativeElement;
    if (
      !host.hasAttribute('data-3d-tilt') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const bounds = host.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    this.renderer.setStyle(host, '--tilt-x', `${rotateX}deg`);
    this.renderer.setStyle(host, '--tilt-y', `${rotateY}deg`);
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    const host = this.element.nativeElement;
    this.renderer.removeStyle(host, '--tilt-x');
    this.renderer.removeStyle(host, '--tilt-y');
  }
}
