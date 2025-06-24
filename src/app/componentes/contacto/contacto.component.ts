import { Component, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  constructor(private renderer: Renderer2) {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const scrollBottomBtn = document.getElementById('scrollBottomBtn');

    const scrollPosition = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollTopBtn && scrollBottomBtn) {
      if (scrollPosition > 200) {
        this.renderer.addClass(scrollTopBtn, 'show');
      } else {
        this.renderer.removeClass(scrollTopBtn, 'show');
      }

      if (scrollPosition < maxScroll - 200) {
        this.renderer.addClass(scrollBottomBtn, 'show');
      } else {
        this.renderer.removeClass(scrollBottomBtn, 'show');
      }
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom(): void {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
}