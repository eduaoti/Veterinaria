import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { TokenExpiredDialogComponent } from '../componentes/token-expired-dialog/token-expired-dialog.component';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private dialog: MatDialog, private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const dialogRef = this.dialog.open(TokenExpiredDialogComponent, {
            disableClose: true
          });

          return dialogRef.afterClosed().pipe(
            switchMap((extended) => {
              if (extended) {
                // Si el usuario extendió la sesión, reintentar la petición original
                const newToken = localStorage.getItem('token');
                const clonedReq = req.clone({ 
                  setHeaders: { Authorization: `Bearer ${newToken}` } 
                });
                return next.handle(clonedReq);
              }
              // Si no extendió, cerrar sesión
              this.authService.logout();
              return throwError(() => new Error('Sesión expirada. Por favor, vuelve a iniciar sesión.'));
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
