import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar-home',
  templateUrl: './navbar-home.component.html',
  styleUrls: ['./navbar-home.component.css']
})
export class NavbarHomeComponent {
  menuVisible = false;
  isWideScreen = window.innerWidth > 768;
  isHidden = false;
  lastScrollTop = 0;
  activeRoute = '';
  busqueda: string = '';
  mostrarMensaje = false;
  mensajeBusqueda = '';
  mostrarBuscador = false;

  // Posición inicial del buscador flotante
  posX = 20;
  posY = 140;

  dragging = false;
  dragOffsetX = 0;
  dragOffsetY = 0;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.urlAfterRedirects;
      }
    });
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isWideScreen = window.innerWidth > 768;
    if (this.isWideScreen) {
      this.menuVisible = false;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    this.isHidden = currentScroll > this.lastScrollTop && currentScroll > 0;
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    this.cdr.detectChanges();
  }

  toggleMenu() {
    if (!this.isWideScreen) {
      this.menuVisible = !this.menuVisible;
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    if (!this.isWideScreen) {
      this.menuVisible = false;
    }
  }

  toggleBuscador() {
    this.mostrarBuscador = !this.mostrarBuscador;
  }

  buscar() {
    const keyword = this.busqueda.trim().toLowerCase();

    const rutas: { [key: string]: string } = {
      contacto: '/contacto',
      contacto1: '/contacto',
      nosotros: '/nosotros',
      login: '/login',
      ingresar: '/login',
      registro: '/cliente-registro',
      registrar: '/cliente-registro',
      servicios: '/servicios',
      servicio: '/servicios',
      agendar: '/agendar-citas',
      citas: '/mis-citas'
    };

    const ruta = rutas[keyword];

    if (ruta) {
      this.router.navigate([ruta]);
      this.busqueda = '';
      this.mostrarMensaje = false;
      this.mostrarBuscador = false;
    } else {
      this.mensajeBusqueda = `No se encontró la sección para "${this.busqueda}".`;
      this.mostrarMensaje = true;
      setTimeout(() => {
        this.mostrarMensaje = false;
        this.mensajeBusqueda = '';
      }, 3000);
    }
  }

  // Arrastre con mouse
  startDrag(event: MouseEvent) {
    this.dragging = true;
    this.dragOffsetX = event.clientX - this.posX;
    this.dragOffsetY = event.clientY - this.posY;
  }

  onDrag(event: MouseEvent) {
    if (this.dragging) {
      this.posX = event.clientX - this.dragOffsetX;
      this.posY = event.clientY - this.dragOffsetY;
    }
  }

  endDrag() {
    this.dragging = false;
  }

  // Arrastre con dedo (touch)
  startTouch(event: TouchEvent) {
    const touch = event.touches[0];
    this.dragging = true;
    this.dragOffsetX = touch.clientX - this.posX;
    this.dragOffsetY = touch.clientY - this.posY;
  }

  onTouchMove(event: TouchEvent) {
    if (this.dragging) {
      const touch = event.touches[0];
      this.posX = touch.clientX - this.dragOffsetX;
      this.posY = touch.clientY - this.dragOffsetY;
    }
  }

  endTouch() {
    this.dragging = false;
  }
}
