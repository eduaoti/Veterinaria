import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { MascotasService } from '../../services/mascotas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})
export class ExpedientesComponent implements OnInit {
  citasAtendidas: any[] = [];
  citasFiltradas: any[] = [];
  loading: boolean = true;
  selectedMascota: any = null; // Almacena la mascota seleccionada para el modal
  filtroNombreDueno: string = ''; // Almacena el valor del filtro del dueño
  filtroNombreMascota: string = ''; // Almacena el valor del filtro de la mascota
  totalServicios: number = 0;


  constructor(
    private citasService: CitasService,
    private mascotasService: MascotasService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.cargarCitasAtendidas();
  }

  cargarCitasAtendidas(): void {
    this.citasService.obtenerCitasAtendidas().subscribe(
      async (data) => {
        const citasConMascotas = await Promise.all(
          data.map(async (cita) => {
            if (cita.idMascota) {
              try {
                const mascota = await this.mascotasService.obtenerMascotaPorId(cita.idMascota).toPromise();
                return { ...cita, mascota };
              } catch (error) {
                console.error('Error al obtener detalles de la mascota:', error);
                return cita;
              }
            }
            return cita;
          })
        );
        this.citasAtendidas = citasConMascotas;
        this.aplicarFiltro(); // Aplica el filtro inicialmente
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener citas atendidas:', error);
        this.loading = false;
      }
    );
  }
  
  aplicarFiltro(): void {
    this.citasFiltradas = this.citasAtendidas.filter(cita =>
      cita.cliente.toLowerCase().includes(this.filtroNombreDueno.toLowerCase()) &&
      (cita.mascota?.nombreMascota?.toLowerCase().includes(this.filtroNombreMascota.toLowerCase()) || this.filtroNombreMascota === '')
    );
  }
  async openExpedienteModal(cita: any): Promise<void> {
    if (cita.idMascota) {
      try {
        const detalle = await this.mascotasService.obtenerMascotaPorId(cita.idMascota).toPromise();
        this.selectedMascota = detalle;
  
        // Cálculo de edad si no viene
        if (!this.selectedMascota.edad && this.selectedMascota.fechaNacimiento) {
          const fechaNacimiento = new Date(this.selectedMascota.fechaNacimiento);
          this.selectedMascota.edad = new Date().getFullYear() - fechaNacimiento.getFullYear();
        }
  
        // ✅ Cálculo total de servicios
        this.totalServicios = this.selectedMascota.servicios?.reduce((total: number, s: any) => total + (s.precio || 0), 0) || 0;
  
        const bootstrap = await import('bootstrap');
        const expedienteModal = new bootstrap.Modal(document.getElementById('expedienteModal')!);
        expedienteModal.show();
      } catch (error) {
        console.error('Error al cargar detalles de la mascota:', error);
      }
    }
  }
  
  
  irAPlanes(mascota: any, correo: string, nombreDueno: string): void {
    this.router.navigate(['/planes'], {
      queryParams: {
        idMascota: mascota._id,
        nombreMascota: mascota.nombreMascota,
        correoDueno: correo,
        nombreDueno: nombreDueno, // Pasa el nombre del dueño correctamente
      }
    });
  }
  
  
}
