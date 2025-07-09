// src/app/guards/rol.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class RolGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['expectedRole'];
    const userRole = localStorage.getItem('rol');
    
    // Permite que expectedRoles sea string o arreglo
    if (
      (Array.isArray(expectedRoles) && expectedRoles.includes(userRole)) ||
      expectedRoles === userRole
    ) {
      return true;
    }
    // Redirige según el rol actual
    if (userRole === 'veterinario') {
      this.router.navigate(['/veterinario-inicio']);
    } else if (userRole === 'cliente') {
      this.router.navigate(['/cliente-inicio']);
    } else {
      this.router.navigate(['/login']);
    }
    return false;
  }
}
