import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperacion-password',
  templateUrl: './recuperacion-password.component.html',
  styleUrls: ['./recuperacion-password.component.css']
})
export class RecuperacionPasswordComponent {
  emailForm: FormGroup;
  codeForm: FormGroup;
  passwordForm: FormGroup;
  step: number = 1;
  successMessage: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;          // Para mostrar/ocultar la contraseña
  showConfirmPassword: boolean = false;   // Para mostrar/ocultar la confirmación de la contraseña

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.codeForm = this.fb.group({
      code: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator }); // Agregar validador de coincidencia de contraseñas
  }

  onSendCode() {
    const email = this.emailForm.get('email')?.value;
    this.authService.sendRecoveryCode(email).subscribe({
      next: response => {
        this.successMessage = 'Código enviado a tu correo.';
        this.errorMessage = '';
        this.step = 2;
      },
      error: err => {
        this.errorMessage = 'Error al enviar el código.';
        this.successMessage = '';
      }
    });
  }

  onVerifyCode() {
    const code = this.codeForm.get('code')?.value;
    const email = this.emailForm.get('email')?.value;

    this.authService.verifyRecoveryCode(email, code).subscribe({
      next: response => {
        this.successMessage = 'Código verificado.';
        this.errorMessage = '';
        this.step = 3;
      },
      error: err => {
        this.errorMessage = 'Código incorrecto.';
        this.successMessage = '';
      }
    });
  }

  onResetPassword() {
    const email = this.emailForm.get('email')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;

    this.authService.resetPassword(email, newPassword).subscribe({
      next: response => {
        this.successMessage = 'Contraseña restablecida con éxito.';
        this.errorMessage = '';

        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']); // Asegúrate de que la ruta sea correcta
        }, 2000);
      },
      error: err => {
        this.errorMessage = 'Error al restablecer la contraseña.';
        this.successMessage = '';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']); // Cambia la ruta si es necesario
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Validador para comparar contraseñas
  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatchedPasswords: true };
  }
}
