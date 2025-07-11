import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';



//Cifrado en tránsito garantizado mediante HTTPS (Railway).

//Control de excepciones para evitar exposición de información sensible a usuarios finales.
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://veterinaria-backend-production-f7f7.up.railway.app/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  register(nombre: string, apellidoPaterno: string, apellidoMaterno: string, email: string, password: string, telefono: string, role: string = 'cliente'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { nombre, apellidoPaterno, apellidoMaterno, email, password, telefono, role });
  }

  verifyAccount(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify`, { email, verificationCode: code });
  }

  sendRecoveryCode(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-recovery-code`, { email });
  }

  verifyRecoveryCode(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-recovery-code`, { email, code });
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { email, newPassword });
  }

  getUserInfo(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}/user-info`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(catchError(this.handleError.bind(this)));
  }

  uploadProfilePhoto(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-profile-photo`, formData, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).pipe(catchError(this.handleError.bind(this)));
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getUserRole(): string {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || 'cliente';
      } catch (error) {
        this.logout();
      }
    }
    return 'cliente';
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      this.logout();
    }
    return throwError(() => new Error(error.message));
  }

  renewToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/renew-token`, {}, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
  }
  // PUT para actualizar los datos de perfil (excepto email y password)
updateProfile(data: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/update-profile`, data, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }).pipe(catchError(this.handleError.bind(this)));
}

// POST para solicitar el cambio de correo (envía código al correo actual)
requestEmailChange(newEmail: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/request-email-change`, { newEmail }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }).pipe(catchError(this.handleError.bind(this)));
}

// POST para confirmar el cambio de correo (con el código que le llega al usuario)
confirmEmailChange(code: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/confirm-email-change`, { code }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }).pipe(catchError(this.handleError.bind(this)));
}

// POST para cambiar la contraseña
changePassword(currentPassword: string, newPassword: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/change-password`, { currentPassword, newPassword }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }).pipe(catchError(this.handleError.bind(this)));
}

  
}