import { Component, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent {
  constructor(private renderer: Renderer2) {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const scrollBottomBtn = document.getElementById('scrollBottomBtn');
    const scrollPosition = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollTopBtn && scrollBottomBtn) {
      // Mostrar el botón de subir si se ha desplazado más de 200px
      if (scrollPosition > 200) {
        this.renderer.addClass(scrollTopBtn, 'show');
      } else {
        this.renderer.removeClass(scrollTopBtn, 'show');
      }

      // Mostrar el botón de bajar si no estamos al final de la página
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