import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Método para navegar a la página de inicio (login)
  onIniciar() {
    this.router.navigate(['/login']); // Cambia '/login' a la ruta que necesites
  }

  // Método para desplazarse hacia arriba
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Escucha de eventos de desplazamiento para mostrar/ocultar el botón
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const button = document.getElementById('back-to-top');
    if (button) {
      // Mostrar el botón si se ha desplazado más de 300px
      if (window.scrollY > 300) {
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    }
  }
}
