import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private currentId: string | null = null;
  private currentTab: ElementRef | null | undefined = null;
  private tabContainerHeight = 70;

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.initializeStickyNavigation();
  }

  private initializeStickyNavigation(): void {
    const self = this;

    this.renderer2.listen(this.elementRef.nativeElement, 'click', (event: Event) => {
      self.onTabClick(event);
    });

    this.renderer2.listen('window', 'scroll', () => {
      self.onScroll();
    });

    this.renderer2.listen('window', 'resize', () => {
      self.onResize();
    });
  }

  private onTabClick(event: Event): void {
    event.preventDefault();
    const element = event.target as HTMLElement;
    const href = element.getAttribute('href');
    if (href) {
      let rect = this.document.querySelector(href)?.getBoundingClientRect() as DOMRect
      const scrollTop = rect.top - this.tabContainerHeight + 1;
      if (scrollTop) {
        this.renderer2.setProperty(this.document.querySelector('.container'), 'scrollTop', scrollTop);
      }
    }
  }

  private onScroll(): void {
    this.checkTabContainerPosition();
    this.findCurrentTabSelector();
  }

  private onResize(): void {
    if (this.currentId) {
      this.setSliderCss();
    }
  }

  private checkTabContainerPosition(): void {
    let obj = this.document.querySelector('.et-hero-tabs') as HTMLElement
    const offset = obj.getBoundingClientRect().top +
      obj.offsetHeight - this.tabContainerHeight;

    if (offset && window.scrollY > offset) {
      this.renderer2.addClass(this.document.querySelector('.et-hero-tabs-container'), 'et-hero-tabs-container--top');
    } else {
      this.renderer2.removeClass(this.document.querySelector('.et-hero-tabs-container'), 'et-hero-tabs-container--top');
    }
  }

  private findCurrentTabSelector(): void {
    let newCurrentId: string | undefined;
    let newCurrentTab: ElementRef | undefined;
    const self = this;

    this.document.querySelectorAll('.et-hero-tab').forEach((tab: Element) => {
      const id = tab.getAttribute('href');
      if (id) {
        let rect = this.document.querySelector(id)?.getBoundingClientRect() as DOMRect
        const offsetTop = rect.top - self.tabContainerHeight;
        const offsetBottom = rect.bottom - self.tabContainerHeight;
        if (offsetTop && offsetBottom && window.scrollY > offsetTop && window.scrollY < offsetBottom) {
          newCurrentId = id;
          newCurrentTab = new ElementRef(tab);
        }
      }
    });

    if (newCurrentId && (this.currentId !== newCurrentId || this.currentId === null)) {
      this.currentId = newCurrentId;
      this.currentTab = newCurrentTab;
      this.setSliderCss();
    }
  }

  private setSliderCss(): void {
    let width = '0';
    let left = '0';
    
    if (this.currentTab) {
      width = this.currentTab.nativeElement.style.width;
      left = this.currentTab.nativeElement.getBoundingClientRect().left + 'px';
    }

    this.renderer2.setStyle(this.document.querySelector('.et-hero-tab-slider'), 'width', width);
    this.renderer2.setStyle(this.document.querySelector('.et-hero-tab-slider'), 'left', left);
  }
}
