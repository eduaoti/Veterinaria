import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agendar-citas',
  templateUrl: './agendar-citas.component.html',
  styleUrls: ['./agendar-citas.component.css'],
})
export class AgendarCitasComponent implements OnInit {
  dueno: string = '';
  fecha: Date | undefined;
  hora: string = '';
  comentario: string = '';
  correo: string = ''; 
  errorMessage: string = '';
  successMessage: string = '';
  showSuccess: boolean = false; 
  minDate: Date = new Date();
  horasDisponibles: { hora: string; ocupada: boolean }[] = [];
  fechasDeshabilitadas: Date[] = []; 
  loading: boolean = false; 
  cita: any;
  esReagendacion: boolean = false;
  citaId: string | null = null;

  // NUEVO: Servicios tipo carrito
  serviciosDisponibles = [
    { nombre: 'Vacuna antirrábica', precio: 200 },
    { nombre: 'Vacuna triple felina', precio: 250 },
    { nombre: 'Desparasitación', precio: 150 },
    { nombre: 'Baño medicado', precio: 180 },
    { nombre: 'Corte de uñas', precio: 50 },
    { nombre: 'Limpieza dental', precio: 300 }
  ];
  servicioSeleccionado: any = null;
  serviciosAgregados: any[] = [];

  constructor(
    private citaService: CitasService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.verificarToken();
    this.obtenerInformacionUsuario();
    this.generarHorasDisponibles();
    this.citaId = this.route.snapshot.paramMap.get('id');  
    this.serviciosAgregados = [{ nombre: 'Cita médica', precio: 400, fijo: true }];
    this.obtenerCita();
    this.esReagendacion = !!this.citaId;
  }

  private verificarToken() {
    const token = localStorage.getItem('token');
    if (!token || this.isTokenExpired(token)) {
      this.router.navigate(['/principio']);
      return;
    }

    setTimeout(() => {
      this.router.navigate(['/principio']); 
    }, 3600000);
  }

  private obtenerInformacionUsuario() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getUserInfo().subscribe(
        (response) => {
          this.dueno = `${response.nombre} ${response.apellidoPaterno} ${response.apellidoMaterno}`;
          this.correo = response.email;
        },
        (error) => console.error('Error al obtener la información del usuario', error)
      );
    }
  }

  private obtenerCita() {
    if (this.citaId) {
      this.citaService.obtenerCitaPorId(this.citaId).subscribe(
        (cita) => {
          if (cita) {
            this.cita = cita; 
            this.dueno = cita.cliente; 
            this.fecha = cita.fechaHora ? new Date(cita.fechaHora) : undefined; 
            this.hora = this.formatearHora(cita.fechaHora); 
            this.comentario = cita.comentario;
            this.correo = cita.correo;
            this.serviciosAgregados = cita.servicios || [];
          }
        },
        (error) => this.errorMessage = 'Error al cargar los datos de la cita. Por favor, intenta de nuevo.'
      );
    }
  }

  private formatearHora(fechaHora: string): string {
    const fecha = new Date(fechaHora);
    return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
  }

  private generarHorasDisponibles() {
    const inicio = 8; 
    const fin = 18; 
    this.horasDisponibles = [];

    for (let i = inicio; i < fin; i++) {
      const horaFormateada = `${i.toString().padStart(2, '0')}:00`;
      this.horasDisponibles.push({ hora: horaFormateada, ocupada: false });
    }
  }

  onDateChange() {
    if (!this.fecha) {
      this.errorMessage = 'Por favor, selecciona una fecha válida.';
      return;
    }

    const dayOfWeek = this.fecha.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      this.errorMessage = 'No se pueden seleccionar sábados ni domingos.';
      this.fecha = undefined;
      return;
    }

    this.errorMessage = '';
    const formattedDate = this.formatDate(this.fecha);

    this.citaService.obtenerCitasPorFecha(formattedDate).subscribe(
      (citas) => {
        this.marcarHorasOcupadas(citas);
        this.verificarDiaCompleto();
      },
      (error) => console.error('Error al obtener las citas', error)
    );
  }

  private marcarHorasOcupadas(citas: any[]) {
    this.generarHorasDisponibles();
    citas.forEach((cita) => {
      const horaCita = new Date(cita.fechaHora).getHours();
      const horaFormateada = `${horaCita.toString().padStart(2, '0')}:00`;
      const horaDisponible = this.horasDisponibles.find((h) => h.hora === horaFormateada);
      if (horaDisponible) {
        horaDisponible.ocupada = true;
      }
    });
  }

  private verificarDiaCompleto() {
    const todasOcupadas = this.horasDisponibles.every((h) => h.ocupada);
    if (todasOcupadas && this.fecha) {
      this.fechasDeshabilitadas.push(this.fecha);
    }
  }

  onAgendar() {
    this.errorMessage = '';
    this.showSuccess = false;
    this.loading = true;

    const fechaCompleta = new Date(this.fecha!);
    const [hora, minutos] = this.hora.split(':');
    fechaCompleta.setHours(parseInt(hora, 10), parseInt(minutos, 10));
    
    const citaData = {
      cliente: this.dueno,
      fecha: this.formatDate(this.fecha!),
      hora: this.hora,
      comentario: this.comentario,
      correo: this.correo,
      servicios: this.serviciosAgregados
    };

    setTimeout(() => {
      if (this.citaId) {
        this.reagendarCita(citaData);
      } else {
        this.agendarCita(citaData);
      }
    }, 3000);
  }

  private agendarCita(citaData: any) {
    this.citaService.agendarCita(citaData).subscribe(
      () => {
        this.successMessage = 'Cita agendada con éxito.';
        this.showSuccess = true;
        this.loading = false;

        setTimeout(() => {
          this.showSuccess = false;
          this.successMessage = '';
          this.resetForm();
        }, 3000);
      },
      (error) => {
        this.loading = false;
        this.errorMessage = `Error al agendar la cita: ${error.status} - ${error.message}`;
        if (error.error && error.error.message) {
          this.errorMessage += ` - ${error.error.message}`;
        }
      }
    );
  }

  private reagendarCita(citaData: any) {
    this.citaService.editarCita(this.citaId!, citaData).subscribe(
      () => {
        this.successMessage = 'Cita reagendada con éxito.';
        this.showSuccess = true;
        this.loading = false;

        setTimeout(() => {
          this.showSuccess = false;
          this.resetForm();
          this.router.navigate(['/mis-citas']);
        }, 3000);
      },
      (error) => {
        this.loading = false;
        this.errorMessage = `Error al reagendar la cita: ${error.error.message || error.message}`;
      }
    );
  }

  private resetForm() {
    this.fecha = undefined;
    this.hora = '';
    this.comentario = '';
    this.serviciosAgregados = [];
    this.citaId = null;
    this.generarHorasDisponibles();
    this.errorMessage = '';
    this.successMessage = '';
    this.showSuccess = false; 
  }

  cancelar() {
    if (this.esReagendacion) {
      this.router.navigate(['/mis-citas']);
    } else {
      this.resetFormNombreCorreo();
    }
  }

  private resetFormNombreCorreo() {
    this.fecha = undefined;
    this.hora = '';
    this.comentario = '';
    this.serviciosAgregados = [];
  }

  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() > exp;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 🔁 Métodos del carrito
  agregarServicio() {
    if (this.servicioSeleccionado) {
      const yaAgregado = this.serviciosAgregados.find(s => s.nombre === this.servicioSeleccionado.nombre);
      if (!yaAgregado) {
        this.serviciosAgregados.push({ ...this.servicioSeleccionado });
      }
    }
  }

  quitarServicio(index: number) {
    if (this.serviciosAgregados[index]?.fijo) return;
    this.serviciosAgregados.splice(index, 1);
  }
  
  calcularTotalServicios(): number {
    return this.serviciosAgregados.reduce((total, s) => total + s.precio, 0);
  }
}
