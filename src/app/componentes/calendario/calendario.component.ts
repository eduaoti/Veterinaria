import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { Router } from '@angular/router'; // Importa Router
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  mesActual: number;
  anioActual: number;
  diaSeleccionado: Date | null = null;
  citasDelDia: any[] = [];
  citasDelMes: any[] = [];
  citaSeleccionada: any = null;
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  diasDelMes: (Date | null)[] = [];
  horasDelDia = Array.from({ length: 10 }, (_, i) => `${8 + i}:00 - ${9 + i}:00`);
  citasPorHora: { [key: string]: any } = {};
  planesCuidado: any[] = []; // Propiedad para almacenar los planes de cuidado

  constructor(private citasService: CitasService, private router: Router) { // Inyecta Router
    const hoy = new Date();
    this.mesActual = hoy.getMonth();
    this.anioActual = hoy.getFullYear();
  }

  ngOnInit() {
    this.generarDiasDelMes();
  }

  obtenerMesAnioActual(): string {
    const opciones = { month: 'long', year: 'numeric' } as const;
    return new Date(this.anioActual, this.mesActual).toLocaleDateString('es-ES', opciones);
  }

  generarDiasDelMes() {
    this.diasDelMes = [];
    const primerDia = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDia = new Date(this.anioActual, this.mesActual + 1, 0);
  
    // Agregar días en blanco al inicio para alinear el primer día del mes
    for (let i = 0; i < primerDia.getDay(); i++) {
      this.diasDelMes.push(null);
    }
  
    // Generar los días del mes
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const dia = new Date(this.anioActual, this.mesActual, i);
      this.diasDelMes.push(dia);
    }
  
    // Actualizar las citas del mes
    this.actualizarCitasDelMes();
  }
  
  actualizarCitasDelMes() {
    this.citasService.obtenerTodasLasCitas().subscribe(citas => {
      this.citasDelMes = citas.filter(cita => {
        const fechaCita = new Date(cita.fechaHora);
        return (
          fechaCita.getMonth() === this.mesActual &&
          fechaCita.getFullYear() === this.anioActual
        );
      });
  
      // Procesar las citas para asignar colores y manejar estados
      this.citasDelMes.forEach(cita => {
        if (cita.estado === 'visita') {
          if (cita.idMascota && typeof cita.idMascota === 'object' && cita.idMascota.nombreMascota) {
            cita.nombreMascota = cita.idMascota.nombreMascota;
          } else {
            cita.nombreMascota = 'Sin nombre';
          }
          cita.color = 'yellow'; // Color específico para visitas
        } else {
          cita.nombreMascota = null;
        }
      });
    });
  }
  

  cambiarMes(cambio: number) {
    this.mesActual += cambio;

    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }

    this.generarDiasDelMes();
  }

  seleccionarDia(dia: Date) {
    if (this.esFinDeSemana(dia)) return;
  
    this.diaSeleccionado = dia;
    this.citaSeleccionada = null;
  
    const fechaISO = dia.toISOString().split('T')[0];
    this.citasDelDia = this.citasDelMes.filter(cita => {
      const fechaCita = new Date(cita.fechaHora).toISOString().split('T')[0];
      return fechaCita === fechaISO;
    });
  
    this.citasPorHora = {};
    this.citasDelDia.forEach(cita => {
      const hora = new Date(cita.fechaHora).getHours();
      const horaString = `${hora}:00 - ${hora + 1}:00`;
  
      // Validar y asignar el nombre de la mascota
      if (typeof cita.idMascota === 'object' && cita.idMascota) {
        cita.nombreMascota = cita.idMascota.nombreMascota || 'Sin nombre';
        cita.idMascota = cita.idMascota._id || 'Sin ID'; // Validación adicional para _id
      } else {
        cita.nombreMascota = cita.nombreMascota || 'Sin nombre';
      }
  
      this.citasPorHora[horaString] = cita;
    });
  }
  mostrarCita(cita: any) {
    if (cita.estado === 'visita') {
      // Verifica y extrae el idMascota
      const idMascota = typeof cita.idMascota === 'object' ? cita.idMascota._id : cita.idMascota;
  
      console.log('idMascota:', idMascota); // Depuración
  
      if (!idMascota || typeof idMascota !== 'string') {
        console.error('El idMascota no es válido:', cita.idMascota);
        return;
      }
  
      // Realiza la solicitud al servicio con un idMascota válido
      this.citasService.obtenerPlanPorMascota(idMascota).subscribe(
        (plan) => {
          this.citaSeleccionada = {
            ...cita,
            plan, // Incluye el plan en la cita seleccionada
          };
        },
        (error) => {
          console.error('Error al obtener el plan de cuidado:', error);
          this.citaSeleccionada = null;
        }
      );
    } else {
      this.citaSeleccionada = cita;
    }
  }
  
  esHoy(dia: Date): boolean {
    const hoy = new Date();
    return (
      hoy.getFullYear() === dia.getFullYear() &&
      hoy.getMonth() === dia.getMonth() &&
      hoy.getDate() === dia.getDate()
    );
  }

  tieneCitas(dia: Date): boolean {
    const fechaISO = dia.toISOString().split('T')[0];
    return this.citasDelMes.some(cita => {
      const fechaCita = new Date(cita.fechaHora).toISOString().split('T')[0];
      return fechaCita === fechaISO;
    });
  }

  esFinDeSemana(dia: Date): boolean {
    const diaSemana = dia.getDay();
    return diaSemana === 0 || diaSemana === 6;
  }

  getMonthClass() {
    switch (this.mesActual) {
      case 0: return 'enero';
      case 1: return 'febrero';
      case 2: return 'marzo';
      case 3: return 'abril';
      case 4: return 'mayo';
      case 5: return 'junio';
      case 6: return 'julio';
      case 7: return 'agosto';
      case 8: return 'septiembre';
      case 9: return 'octubre';
      case 10: return 'noviembre';
      case 11: return 'diciembre';
      default: return '';
    }
  }

  getMonthIcon() {
    switch (this.mesActual) {
      case 0: return 'fas fa-fireworks';
      case 1: return 'fas fa-heart';
      case 2: return 'fas fa-leaf';
      case 3: return 'fas fa-egg';
      case 4: return 'fas fa-briefcase';
      case 5: return 'fas fa-sun';
      case 6: return 'fas fa-flag-usa';
      case 7: return 'fas fa-umbrella-beach';
      case 8: return 'fas fa-flag';
      case 9: return 'fas fa-ghost';
      case 10: return 'fas fa-skull';
      case 11: return 'fas fa-tree';
      default: return '';
    }
  }

  redirigirARegistroMascotas(cita: any) {
    const nuevoEstado = 'en proceso de atención';
    this.citasService.actualizarEstadoCita(cita._id, nuevoEstado, '').subscribe(() => {
      this.router.navigate(['/registro'], {
        state: {
          dueno: cita.cliente,
          citaId: cita._id,
          servicios: cita.servicios || []
        }
      });
    }, error => {
      console.error('Error al actualizar el estado de la cita:', error);
    });
  }
  
  redirigirARegistroPlan(cita: any) {
    this.router.navigate(['/planes'], { 
      queryParams: { 
        idMascota: cita.idMascota, 
        nombreMascota: cita.nombreMascota || cita.mascota, // Asegúrate de usar el campo correcto
        correoDueno: cita.correo, 
        nombreDueno: cita.cliente 
      } 
    });
  }
  calcularTotalServicios(servicios: any[]): number {
    return servicios.reduce((total, servicio) => total + (servicio.precio || 0), 0);
  }
  
}
