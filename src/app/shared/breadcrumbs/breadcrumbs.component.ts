import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbLinks: { label: string, url: string }[] = [];
  isVisible = true;
  lastScrollTop = 0;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const decodedUrl = decodeURIComponent(event.urlAfterRedirects);
        this.generateBreadcrumbs(decodedUrl);
      }
    });
  }

  ngOnInit(): void {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    this.isVisible = scrollTop < this.lastScrollTop;
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  private formatLabel(part: string): string {
    const map: { [key: string]: string } = {
      'principio': 'PRINCIPIO',
      'login': 'INICIAR SESIÓN',
      'cliente-inicio': 'CLIENTE',
      'veterinario-inicio': 'VETERINARIO',
      'agendar-cita': 'AGENDAR CITA',
      'cliente-registro': 'REGISTRO CLIENTE',
      'mis-citas': 'MIS CITAS',
      'recuperar-contraseña': 'RECUPERAR CONTRASEÑA',
      'calendario': 'CALENDARIO',
      'perfil': 'PERFIL',
      'registro': 'REGISTRO USUARIO',
      'expedientes': 'EXPEDIENTES',
      'historial-vacunas': 'HISTORIAL VACUNAS',
      'planes': 'PLANES',
      'servicios': 'SERVICIOS',
      'contacto': 'CONTACTO',
      'nosotros': 'NOSOTROS'
    };

    return map[part] || part.replace(/-/g, ' ').toUpperCase();
  }
  private generateBreadcrumbs(url: string) {
    console.log('URL recibida:', url); // Depuración: Verifica la URL que se pasa a la función
    
    const path = url.split('?')[0]; // Elimina los parámetros de la URL
    const segments = path.startsWith('/') ? path.slice(1).split('/') : path.split('/');
    console.log('Segmentos:', segments); // Verifica los segmentos
  
    let accumulatedPath = '';
    this.breadcrumbLinks = [];
  
    // Agregar "INICIO" al principio
    this.breadcrumbLinks.push({ label: 'INICIO', url: '/' });
  
    segments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      console.log(`Segmento ${index}: ${segment}`); // Depuración: Muestra cada segmento
  
      // Comprobamos si es un ID basado en la longitud o en el formato (usando una expresión regular más flexible)
      if (index === segments.length - 1 && segment.match(/^[A-Fa-f0-9]{24,32}$/)) { // Ajusta la expresión regular si es necesario
        console.log('ID encontrado, reemplazando por EDITAR CITA');
        this.breadcrumbLinks.push({
          label: 'EDITAR CITA', // El texto que quieres mostrar en lugar del ID
          url: accumulatedPath
        });
      } else {
        this.breadcrumbLinks.push({
          label: this.formatLabel(segment),
          url: accumulatedPath
        });
      }
    });
  
    console.log('Migas de pan generadas:', this.breadcrumbLinks); // Depuración: Verifica las migas de pan generadas
  }
}  