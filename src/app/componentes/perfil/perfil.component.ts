import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  fotoPerfil: File | null = null;
  fotoPerfilUrl: string | null = null;
  usuario: any;
  isLoading: boolean = false;
  showOverlay: boolean = false;

  // Datos para edición
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  telefono: string = '';

  // Cambio de correo
  nuevoCorreo: string = '';
  codigoCorreo: string = '';
  cambioCorreoEnProceso: boolean = false;
  mensajeCambioCorreo: string = '';

  // Cambio de contraseña
  currentPassword: string = '';
  newPassword: string = '';
  repeatNewPassword: string = '';
  mensajeCambioPassword: string = '';

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.authService.getUserInfo().subscribe(user => {
      this.usuario = user;
      this.fotoPerfilUrl = user.fotoPerfil;
      this.nombre = user.nombre;
      this.apellidoPaterno = user.apellidoPaterno;
      this.apellidoMaterno = user.apellidoMaterno;
      this.telefono = user.telefono;
    }, error => {
      console.error('Error al cargar la información del usuario:', error);
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSizeInMB = 2;
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        alert('El tamaño del archivo no debe superar los 2 MB.');
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Formato de imagen no válido. Solo se permiten JPG, PNG y GIF.');
        return;
      }
      this.fotoPerfil = file;
      this.fotoPerfilUrl = URL.createObjectURL(this.fotoPerfil);
    }
  }

  uploadPhoto() {
    if (this.fotoPerfil) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('fotoPerfil', this.fotoPerfil);

      this.authService.uploadProfilePhoto(formData).subscribe(response => {
        if (response && response.fotoPerfil) {
          this.fotoPerfilUrl = response.fotoPerfil;
        }
        this.fotoPerfil = null;
        this.cdr.detectChanges();
        this.usuario.fotoPerfil = this.fotoPerfilUrl;
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, error => {
        console.error('Error al subir la foto de perfil:', error);
        this.isLoading = false;
      });
    }
  }

  // Guardar cambios de perfil (nombre, apellidos, teléfono)
  guardarCambiosPerfil() {
    this.authService.updateProfile({
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      telefono: this.telefono
    }).subscribe(
      res => alert('Datos actualizados correctamente.'),
      err => alert('Error al actualizar datos.')
    );
  }

  // Cambio de correo
  solicitarCambioCorreo() {
    this.authService.requestEmailChange(this.nuevoCorreo).subscribe(
      res => {
        this.cambioCorreoEnProceso = true;
        this.mensajeCambioCorreo = 'Se ha enviado un código a tu correo actual.';
      },
      err => alert('Error al solicitar el cambio de correo.')
    );
  }

  confirmarCambioCorreo() {
    this.authService.confirmEmailChange(this.codigoCorreo).subscribe(
      res => {
        this.cambioCorreoEnProceso = false;
        this.mensajeCambioCorreo = 'Correo actualizado correctamente. Vuelve a iniciar sesión.';
        this.loadUserInfo();
        // Puedes desloguear aquí si quieres que el usuario inicie sesión de nuevo
      },
      err => alert('Error al confirmar el cambio de correo.')
    );
  }

  // Cambio de contraseña
  cambiarPassword() {
    if (!this.currentPassword || !this.newPassword || !this.repeatNewPassword) {
      this.mensajeCambioPassword = 'Llena todos los campos.';
      return;
    }
    if (this.newPassword !== this.repeatNewPassword) {
      this.mensajeCambioPassword = 'Las contraseñas nuevas no coinciden.';
      return;
    }
    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe(
      res => {
        this.mensajeCambioPassword = 'Contraseña cambiada correctamente.';
        this.currentPassword = '';
        this.newPassword = '';
        this.repeatNewPassword = '';
      },
      err => this.mensajeCambioPassword = 'Error al cambiar la contraseña.'
    );
  }
}
