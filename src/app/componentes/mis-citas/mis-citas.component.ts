import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { MascotasService } from '../../services/mascotas.service';
import { PlanesService } from '../../services/planes.service';
import { Router } from '@angular/router';

import * as FileSaver from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DatePipe } from '@angular/common'; // Importa DatePipe


@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.css'],
  providers: [DatePipe] // Asegúrate de que DatePipe esté disponible como proveedor

})
export class MisCitasComponent implements OnInit {
  citas: any[] = [];
  citasEnEspera: any[] = [];
  citasEnProceso: any[] = [];
  citasAtendidas: any[] = [];
  citasVisitas: any[] = [];
  planesCuidado: any[] = []; // Almacena los planes de cuidado
  selectedMascota: any = null;
  loading: boolean = false;
  tab: string = 'en-espera';

  constructor(
    private citasService: CitasService,
    private mascotasService: MascotasService,
    private planesService: PlanesService,
    private router: Router,
    private datePipe: DatePipe // Inyecta DatePipe
  ) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

 cargarCitas(): void {
  const email = localStorage.getItem('email');
  if (email) {
    this.citasService.obtenerCitasPorEmail(email).subscribe(
      (data) => {
        this.citas = data.map(cita => ({
          ...cita,
          mascotaNombre: cita.mascotaNombre || 'Sin nombre', // Asegúrate de incluir el nombre
        }));
        this.filtrarCitas();
      },
      (error) => console.error('Error al obtener citas:', error)
    );

    this.cargarPlanesCuidado(email); // Cargar planes
  }
}


  cargarPlanesCuidado(email: string): void {
    this.planesService.obtenerPlanesPorCorreo(email).subscribe(
      (planes) => {
        this.planesCuidado = planes;
      },
      (error) => console.error('Error al obtener planes de cuidado:', error)
    );
  }

  filtrarCitas(): void {
    console.log('Filtrando citas:', this.citas);
    this.citasEnEspera = this.citas.filter(cita => cita.estado === 'en espera de atención');
    this.citasEnProceso = this.citas.filter(cita => cita.estado === 'en proceso de atención');
    this.citasAtendidas = this.citas.filter(cita => cita.estado === 'atendida');
    this.citasVisitas = this.citas.filter(cita => cita.estado === 'visita'); // Filtrar las citas con estado "visita"
    console.log('Citas en espera:', this.citasEnEspera);
    console.log('Citas en proceso:', this.citasEnProceso);
    console.log('Citas atendidas:', this.citasAtendidas);
    console.log('Citas visitas:', this.citasVisitas);
  }
  

  openExpedienteModal(cita: any): void {
    if (cita.idMascota) {
      this.mascotasService.obtenerMascotaPorId(cita.idMascota).subscribe(
        async (detalle) => {
          this.selectedMascota = detalle;
  
          // Ajustar la fecha de nacimiento para que refleje la zona horaria local
          if (this.selectedMascota.fechaNacimiento) {
            const fechaNacimientoUTC = new Date(this.selectedMascota.fechaNacimiento);
            this.selectedMascota.fechaNacimiento = new Date(
              fechaNacimientoUTC.getUTCFullYear(),
              fechaNacimientoUTC.getUTCMonth(),
              fechaNacimientoUTC.getUTCDate()
            );
          }
  
          const bootstrap = await import('bootstrap');
          const expedienteModal = new bootstrap.Modal(document.getElementById('expedienteModal')!);
          expedienteModal.show();
        },
        (error) => console.error('Error al cargar detalles de la mascota:', error)
      );
    }
  }
  
  downloadExpediente(): void {
    if (!this.selectedMascota) return; // Asegúrate de que selectedMascota está definido
  
    const mascota = this.selectedMascota;
    const fechaIngreso = this.datePipe.transform(mascota.fechaIngreso, "d 'de' MMMM 'de' y", 'es');
    const fechaNacimiento = this.datePipe.transform(mascota.fechaNacimiento, "d 'de' MMMM 'de' y", 'es', 'UTC');
  
    let content = `
      Nombre de la Mascota: ${mascota.nombreMascota}
      Especie: ${mascota.especie}
      Raza: ${mascota.raza}
      Edad: ${mascota.edad} años
      Sexo: ${mascota.sexo}
      Peso: ${mascota.pesoKg} kg
      Fecha de Ingreso: ${fechaIngreso}
      Fecha de Nacimiento: ${fechaNacimiento}
      Alergias: ${mascota.alergias?.existe ? mascota.alergias.observaciones : 'Ninguna'}
      Alimentación: ${mascota.alimentacion.estado}
      Veterinario: ${mascota.veterinario.nombre}
    `;
  
    if (mascota.vacunas && mascota.vacunas.length > 0) {
      content += '\nVacunas:\n';
      mascota.vacunas.forEach((vacuna: any, index: number) => {
        content += `  ${index + 1}. Nombre: ${vacuna.nombre}, Dosis: ${vacuna.dosis}\n`;
      });
    }
  
    const blob = new Blob([content], { type: 'application/msword' });
    FileSaver.saveAs(blob, `${mascota.nombreMascota}_Expediente.doc`);
  }

  

  agendarCita(): void {
    this.router.navigate(['/agendar-cita']);
  }

  editarCita(id: string): void {
    this.router.navigate([`/agendar-cita/${id}`]);
  }

  eliminarCita(id: string): void {
    const confirmacion = confirm('Esta cita se eliminará permanentemente. ¿Estás de acuerdo?');

    if (confirmacion) {
      this.citasService.eliminarCita(id).subscribe(
        () => {
          this.citas = this.citas.filter(cita => cita._id !== id);
          this.filtrarCitas();
        },
        (error) => console.error('Error al eliminar la cita:', error)
      );
    }
  }

  selectTab(tab: string): void {
    this.tab = tab;
  }
  agruparPlanesPorMascota(): any[] {
    const agrupados = this.planesCuidado.reduce((acc: any, plan: any) => {
      if (!acc[plan.nombreMascota]) {
        acc[plan.nombreMascota] = [];
      }
      acc[plan.nombreMascota].push(plan);
      return acc;
    }, {});
  
    return Object.keys(agrupados).map(nombreMascota => ({
      nombreMascota,
      planes: agrupados[nombreMascota],
    }));
  }
  calcularTotalServicios(servicios: any[]): number {
    return servicios.reduce((total, servicio) => total + (servicio.precio || 0), 0);
  }
  
  
}
