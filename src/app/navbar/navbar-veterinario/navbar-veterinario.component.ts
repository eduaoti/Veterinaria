import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar-veterinario',
  templateUrl: './navbar-veterinario.component.html',
  styleUrls: ['./navbar-veterinario.component.css']
})
export class NavbarVeterinarioComponent implements OnInit {
  menuVisible = false;
  profileMenuVisible = false;
  isWideScreen = window.innerWidth > 768;
  fotoPerfil: string = '';
  navbarHidden = false;
  lastScrollTop = 0;

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
            this.fotoPerfil = userInfo.fotoPerfil.startsWith('http')
              ? userInfo.fotoPerfil
              : `http://localhost:3000/${userInfo.fotoPerfil}`;
            localStorage.setItem('fotoPerfil', this.fotoPerfil);
          }
        },
        error: (err) => console.error('Error al obtener la información del usuario:', err)
      });
    }

    // Oculta el menú al navegar
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.menuVisible = false;
        this.profileMenuVisible = false;
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.isWideScreen = window.innerWidth > 768;
    if (this.isWideScreen) this.menuVisible = true;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    this.navbarHidden = scrollTop > this.lastScrollTop;
    this.lastScrollTop = Math.max(0, scrollTop);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
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

  verExpedientes() {
    this.router.navigate(['/expedientes']);
  }

  verCalendario() {
    this.router.navigate(['/calendario']);
  }

  verPerfil() {
    this.router.navigate(['/perfil']);
  }

  salir() {
    localStorage.removeItem('token');
    localStorage.removeItem('fotoPerfil');
    localStorage.removeItem('rol'); // ✅ elimina el rol
    this.router.navigate(['/principio']);
  }
}
