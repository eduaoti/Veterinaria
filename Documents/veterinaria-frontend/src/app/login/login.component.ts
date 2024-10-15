import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service'; // Asegúrate de que esta ruta sea correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // O la ruta de tu archivo de estilos
})
export class LoginComponent {
  loginForm: FormGroup;
  emailControl: AbstractControl;
  passwordControl: AbstractControl;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // Asignar los controles a las variables
    this.emailControl = this.loginForm.get('email') as AbstractControl;
    this.passwordControl = this.loginForm.get('password') as AbstractControl;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Login exitoso:', response);
          // Redireccionar o guardar el token en localStorage
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error al iniciar sesión:', error);
          alert('Credenciales incorrectas');
        }
      );
    }
  }
}
