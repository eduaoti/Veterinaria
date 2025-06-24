import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-token-expired-dialog',
  template: `
    <div class="dialog-container">
      <h1 class="dialog-title">Sesión expirada</h1>
      <p class="dialog-message">Tu sesión ha expirado. ¿Quieres extenderla?</p>
      <div class="dialog-actions">
        <button mat-button class="extend-btn" (click)="onExtend()">Extender Sesión</button>
        <button mat-button class="logout-btn" (click)="onLogout()">Cerrar Sesión</button>
      </div>
    </div>
  `,
  styleUrls: ['./token-expired-dialog.component.css']
})
export class TokenExpiredDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<TokenExpiredDialogComponent>,
    private authService: AuthService
  ) {}

  onExtend(): void {
    this.authService.renewToken().subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.dialogRef.close(true); // Indicar que el token se renovó
      },
      () => this.onLogout() // Si falla, cerrar sesión
    );
  }

  onLogout(): void {
    this.authService.logout();
    this.dialogRef.close(false);
  }
}
