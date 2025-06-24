import { Component, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-registro',
  templateUrl: './cliente-registro.component.html',
  styleUrls: ['./cliente-registro.component.css']
})
export class ClienteRegistroComponent implements AfterViewChecked {
  registroForm: FormGroup;
  verificationForm: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  isLoading: boolean = false;
  isVerificationStep: boolean = false; 
  reCaptchaVerified: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  captchaResolved: boolean = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/)
        ]
      ],
      confirmPassword: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      avisoPrivacidadAceptado: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
    
    this.verificationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required]
    });
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onCaptchaResolved(captchaResponse: string | null): void {
    this.captchaResolved = !!captchaResponse;
  }
  
  onSubmit() {
    if (this.registroForm.valid && this.captchaResolved) {
      this.isLoading = true;
      const { nombre, apellidoPaterno, apellidoMaterno, email, password, telefono } = this.registroForm.value;
      this.authService.register(nombre, apellidoPaterno, apellidoMaterno, email, password, telefono)
        .subscribe({
          next: response => {
            this.isLoading = false;
            this.mensajeExito = response.message;
            this.mensajeError = '';
            this.isVerificationStep = true;
          },
          error: err => {
            this.isLoading = false;
            this.mensajeError = err.error.message;
            this.mensajeExito = '';
          }
        });
    } else {
      this.mensajeError = 'Por favor completa todos los campos correctamente, verifica el reCAPTCHA y acepta el Aviso de Privacidad.';
    }
  }
  
  onVerify() {
    if (this.verificationForm.valid) {
      const { email, code } = this.verificationForm.value;
      this.authService.verifyAccount(email, code).subscribe({
        next: response => {
          this.mensajeExito = response.message;
          this.mensajeError = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: err => {
          this.mensajeError = err.error.message;
          this.mensajeExito = '';
        }
      });
    } else {
      this.mensajeError = 'Por favor ingresa el código de verificación.';
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const container = document.querySelector('.login-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
