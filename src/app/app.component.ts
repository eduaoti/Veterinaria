import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  rol: string | null = null;
  rutaActual: string = '';

  rutasSinNavbar: string[] = ['/login', '/cliente-registro', '/nosotros', '/contacto', '/servicios', '/principio'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.rutaActual = event.urlAfterRedirects;
        this.rol = localStorage.getItem('rol');
      }
    });
  }

  mostrarNavbar(): boolean {
    return !this.rutasSinNavbar.some(ruta => this.rutaActual.startsWith(ruta));
  }
}
