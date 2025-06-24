import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar-cliente',
  templateUrl: './navbar-cliente.component.html',
  styleUrls: ['./navbar-cliente.component.css'],
})
export class NavbarClienteComponent implements OnInit {
  menuVisible = false;
  profileMenuVisible = false;
  isWideScreen = window.innerWidth > 768;
  fotoPerfil: string = '';
  lastScrollTop = 0;
  navbarHidden = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private eRef: ElementRef
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getUserInfo().subscribe({
        next: (userInfo) => {
          if (userInfo.fotoPerfil) {
            this.fotoPerfil = userInfo.fotoPerfil;
            if (!this.fotoPerfil.startsWith('http')) {
              const baseUrl = 'http://localhost:3000/';
              this.fotoPerfil = `${baseUrl}${this.fotoPerfil}`;
            }
            localStorage.setItem('fotoPerfil', this.fotoPerfil);
          }
        },
        error: (err) => console.error('Error al obtener la información del usuario:', err),
      });
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && !this.isWideScreen) {
        this.menuVisible = false;
        this.profileMenuVisible = false;
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.isWideScreen = window.innerWidth > 768;
    if (this.isWideScreen) {
      this.menuVisible = true;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
  
    if (currentScroll > this.lastScrollTop && currentScroll > 100) {
      this.navbarHidden = true;  // Oculta al bajar
    } else {
      this.navbarHidden = false; // Muestra al subir
    }
  
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target) && !this.isWideScreen) {
      this.menuVisible = false;
      this.profileMenuVisible = false;
    }
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  toggleProfileMenu() {
    this.profileMenuVisible = !this.profileMenuVisible;
  }

  agendarCita() {
    this.router.navigate(['/agendar-cita']);
  }

  verMisCitas() {
    this.router.navigate(['/mis-citas']);
  }

  verPerfil() {
    this.router.navigate(['/perfil']);
  }

  salir() {
    localStorage.removeItem('token');
    localStorage.removeItem('fotoPerfil');
    this.router.navigate(['/principio']);
    localStorage.removeItem('rol'); // ✅ elimina el rol

  }
}
