import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha'; // Asegúrate de importar esto

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  emailControl: AbstractControl;
  passwordControl: AbstractControl;
  errorMessage: string | null = null;
  captchaResolved: boolean = false;
  siteKey: string = '6LcJGRErAAAAAFqwwjVLr9-YQ29u4-hULbA7BsTF';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.emailControl = this.loginForm.get('email') as AbstractControl;
    this.passwordControl = this.loginForm.get('password') as AbstractControl;
  }

  onSubmit(): void {
    if (this.loginForm.valid && this.captchaResolved) {
      const { email, password } = this.loginForm.value;
    
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Login exitoso:', response);
    
          const userRole = response.role; 
          const token = response.token; 
    
          localStorage.setItem('token', token);
          localStorage.setItem('email', email);
          localStorage.setItem('rol', userRole); // 👉 GUARDA EL ROL
    
          if (userRole === 'veterinario') {
            this.router.navigate(['/veterinario-inicio']);
          } else if (userRole === 'cliente') {
            this.router.navigate(['/cliente-inicio']);
          }
        },
        (error) => {
          console.error('Error al iniciar sesión:', error);
          this.errorMessage = 'Credenciales incorrectas';
        }
      );
    }
  }
  onCaptchaResolved(captchaResponse: string | null): void {
    console.log('Captcha response:', captchaResponse);
    this.captchaResolved = !!captchaResponse;
  }
  
  onRegister(): void {
    this.router.navigate(['/cliente-registro']);
  }

  onForgotPassword(): void {
    this.router.navigate(['/recuperar-contraseña']);
  }
}
