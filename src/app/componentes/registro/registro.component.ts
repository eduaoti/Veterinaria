import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MascotasService } from '../../services/mascotas.service';
import { AuthService } from '../../services/auth.service';
import { CitasService } from '../../services/citas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  imagenSeleccionada: File | null = null;
  mensaje: string = '';
  razas: string[] = [];
  estadoAlimentacionOptions: string[] = ['Excelente', 'Buena', 'Regular', 'Mala'];
  registrando: boolean = false;
  registroExitoso: boolean = false;
  serviciosCargados: any[] = [];
  totalServicios: number = 0;

  private DOG_API_KEY = 'live_Ye659BDqxfnmtLywj5JWDtZjIgdKyujZY7DiQPWhTx2iuS05HQPdFjv3w1aRNsiJ';
  private CAT_API_KEY = 'live_vRTcwSoPBkLclOLSXXkrEdc7du7LsAkxqFhTQUnUAmfkseBEgu2vk03zgMCOnbUS';

  private razasReptiles = {
    'Serpiente': ['Boa', 'Pitón', 'Culebra de maíz', 'Anaconda', 'Serpiente de cascabel'],
    'Lagarto': ['Iguana', 'Gecko', 'Lagarto de cola espinosa'],
    'Tortugas': ['Tortuga de tierra', 'Tortuga marina', 'Tortuga de caja']
  };

  private razasAves = {
    'Periquito': ['Periquito Australiano', 'Periquito Inglés'],
    'Canario': ['Canario de Color', 'Canario Timbrado'],
    'Loros': ['Loro Amazona', 'Loro gris africano', 'Loro arcoíris'],
  };

  private razasRoedores = {
    'Hámster': ['Hámster Sirio', 'Hámster Enano'],
    'Rata': ['Rata Doméstica']
  };

  constructor(
    private fb: FormBuilder,
    private mascotasService: MascotasService,
    private authService: AuthService,
    private citasService: CitasService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      dueno: this.fb.group({
        nombre: ['', Validators.required]
      }),
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      nombreMascota: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      sexo: ['', Validators.required],
      pesoKg: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      alergias: this.fb.group({
        existe: [false],
        observaciones: ['']
      }),
      alimentacion: this.fb.group({
        estado: ['', Validators.required],
        observaciones: ['']
      }),
      veterinario: this.fb.group({
        nombre: ['', Validators.required],
        clinica: ['Luxepet Health']
      }),
      fotoUrl: ['']
    });

    const duenoNombre = history.state.dueno || 'Nombre por defecto';
    this.registroForm.patchValue({ dueno: { nombre: duenoNombre } });

    const serviciosCita = history.state.servicios || [];
    if (serviciosCita.length > 0) {
      this.serviciosCargados = serviciosCita;
      this.totalServicios = this.calcularTotalServicios(serviciosCita);
    }

    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getUserInfo().subscribe(userInfo => {
        const nombreVet = `${userInfo.nombre} ${userInfo.apellidoPaterno} ${userInfo.apellidoMaterno}`;
        this.registroForm.patchValue({ veterinario: { nombre: nombreVet } });
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.imagenSeleccionada = file || null;
  }

  onEspecieChange(): void {
    this.razas = [];
    switch (this.registroForm.get('especie')?.value) {
      case 'canino':
        this.obtenerRazasPerro();
        break;
      case 'felino':
        this.obtenerRazasGato();
        break;
      case 'reptil':
        this.razas = Object.values(this.razasReptiles).flat();
        break;
      case 'ave':
        this.razas = Object.values(this.razasAves).flat();
        break;
      case 'roedor':
        this.razas = Object.values(this.razasRoedores).flat();
        break;
    }
  }

  obtenerRazasPerro(): void {
    this.http.get<any>('https://api.thedogapi.com/v1/breeds', {
      headers: { 'x-api-key': this.DOG_API_KEY }
    }).subscribe(response => {
      this.razas = response.map((breed: any) => breed.name);
    });
  }

  obtenerRazasGato(): void {
    this.http.get<any>('https://api.thecatapi.com/v1/breeds', {
      headers: { 'x-api-key': this.CAT_API_KEY }
    }).subscribe(response => {
      this.razas = response.map((breed: any) => breed.name);
    });
  }

  registrarMascota(): void {
    this.registrando = true;
    this.mensaje = '';
    const formData = new FormData();
    const { dueno, especie, raza, nombreMascota, edad, sexo, pesoKg, fechaIngreso, fechaNacimiento, alergias, alimentacion, veterinario } = this.registroForm.value;

    formData.append('dueno[nombre]', dueno.nombre);
    formData.append('especie', especie);
    formData.append('raza', raza);
    formData.append('nombreMascota', nombreMascota);
    formData.append('edad', edad);
    formData.append('sexo', sexo);
    formData.append('pesoKg', pesoKg);
    formData.append('fechaIngreso', fechaIngreso);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('alergias[existe]', alergias.existe);
    formData.append('alergias[observaciones]', alergias.observaciones);
    formData.append('alimentacion[estado]', alimentacion.estado);
    formData.append('alimentacion[observaciones]', alimentacion.observaciones);

    // 🚨 Aquí agregamos los servicios como JSON
    if (this.serviciosCargados.length > 0) {
      formData.append('servicios', JSON.stringify(this.serviciosCargados));
    }

    if (this.imagenSeleccionada) {
      formData.append('foto', this.imagenSeleccionada);
    } else {
      this.mensaje = 'La foto es obligatoria';
      this.registrando = false;
      return;
    }

    formData.append('veterinario[nombre]', veterinario.nombre);
    formData.append('veterinario[clinica]', veterinario.clinica);

    this.mascotasService.registrarMascota(formData).subscribe(
      (nuevaMascota: any) => {
        this.registrando = false;
        this.registroExitoso = true;
        this.mensaje = 'Mascota registrada exitosamente';
        this.registroForm.reset();
        this.imagenSeleccionada = null;

        const citaId = history.state.citaId;
        if (citaId && nuevaMascota._id) {
          this.actualizarCitaConMascota(citaId, nuevaMascota._id);
        }
      },
      (error) => {
        this.registrando = false;
        this.mensaje = 'Error al registrar la mascota: ' + (error.error?.message || 'Inténtelo de nuevo más tarde.');
        console.error('Detalles del error:', error);
      }
    );
  }

  actualizarCitaConMascota(citaId: string, idMascota: string): void {
    this.citasService.actualizarEstadoCita(citaId, 'atendida', idMascota).subscribe(
      () => console.log('Cita actualizada con mascota'),
      (error) => console.error('Error al actualizar la cita:', error)
    );
  }

  volverAlCalendario(): void {
    this.router.navigate(['/calendario']);
  }

  calcularTotalServicios(servicios: any[]): number {
    return servicios.reduce((total, servicio) => total + (servicio.precio || 0), 0);
  }
}
