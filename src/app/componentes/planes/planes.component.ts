import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanesService } from '../../services/planes.service';
import { CitasService } from '../../services/citas.service';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css'],
})
export class PlanesComponent implements OnInit {
  planesForm!: FormGroup;
  horasDisponibles: { hora: string; ocupada: boolean }[] = [];
  errorMessage: string = '';

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
    private planesService: PlanesService,
    private citasService: CitasService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.planesForm = this.fb.group({
      idMascota: [''],
      dieta: [''],
      ejercicio: [''],
      visitas: this.fb.array([]),
      nombreMascota: [''],
      correoDueno: [''],
      nombreDueno: [''],
    });

    this.route.queryParams.subscribe((params) => {
      const { idMascota, nombreMascota, correoDueno, nombreDueno } = params;

      this.planesForm.patchValue({
        idMascota: idMascota ? String(idMascota) : '',
        nombreMascota: nombreMascota || '',
        correoDueno: correoDueno || '',
        nombreDueno: nombreDueno || '',
      });
    });

    this.serviciosAgregados = [{ nombre: 'Consulta médica', precio: 400, fijo: true }];
    this.generarHorasDisponibles();
  }

  get visitas(): FormArray {
    return this.planesForm.get('visitas') as FormArray;
  }

  agregarVisita(): void {
    this.visitas.push(
      this.fb.group({
        fecha: [''],
        hora: [''],
        descripcion: [''],
      })
    );
  }

  eliminarVisita(index: number): void {
    this.visitas.removeAt(index);
  }

  generarHorasDisponibles(): void {
    const inicio = 8;
    const fin = 18;
    this.horasDisponibles = [];

    for (let i = inicio; i < fin; i++) {
      const horaFormateada = `${i.toString().padStart(2, '0')}:00`;
      this.horasDisponibles.push({ hora: horaFormateada, ocupada: false });
    }
  }

  onDateChange(index: number): void {
    const fechaSeleccionada = this.visitas.at(index).get('fecha')?.value;

    if (!fechaSeleccionada) {
      this.errorMessage = 'Por favor, selecciona una fecha válida.';
      return;
    }

    const fechaAjustada = new Date(fechaSeleccionada);
    fechaAjustada.setMinutes(fechaAjustada.getMinutes() + fechaAjustada.getTimezoneOffset());

    this.visitas.at(index).get('fecha')?.setValue(fechaAjustada.toISOString().split('T')[0]);

    this.errorMessage = '';
    this.citasService.obtenerDisponibilidad(fechaSeleccionada).subscribe(
      (respuesta) => {
        if (respuesta && respuesta.horasDisponibles) {
          this.horasDisponibles = respuesta.horasDisponibles.map((hora: string) => ({
            hora,
            ocupada: false,
          }));
        } else {
          this.horasDisponibles = [];
        }
      },
      (error) => {
        console.error('Error al obtener disponibilidad de horas:', error);
        this.errorMessage = 'Error al obtener disponibilidad. Intenta nuevamente.';
      }
    );
  }

  agregarServicio() {
    if (this.servicioSeleccionado) {
      const yaExiste = this.serviciosAgregados.find(s => s.nombre === this.servicioSeleccionado.nombre);
      if (!yaExiste) {
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

  crearPlan(): void {
    const plan = this.planesForm.value;

    plan.visitas = plan.visitas.map((visita: any) => {
      const fecha = new Date(visita.fecha);
      visita.fecha = fecha.toISOString().split('T')[0];
      return visita;
    });

    plan.servicios = this.serviciosAgregados;

    if (!plan.correoDueno || !plan.nombreDueno || !plan.nombreMascota) {
      this.errorMessage = 'El correo, el nombre del dueño y el nombre de la mascota son obligatorios.';
      return;
    }

    this.planesService.obtenerPlanPorMascota(plan.idMascota).subscribe({
      next: (planExistente) => {
        if (planExistente) {
          this.planesService.actualizarPlanConCitas(plan).subscribe(
            () => {
              alert('Plan y citas actualizados exitosamente.');
              this.planesForm.reset();
              this.horasDisponibles = [];
              this.router.navigate(['/planes']);
            },
            (error) => {
              console.error('Error al actualizar el plan:', error);
              this.errorMessage = 'Error al actualizar el plan. Intenta nuevamente.';
            }
          );
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.planesService.crearPlanConCitas(plan).subscribe(
            () => {
              alert('Plan y citas creados exitosamente.');
              this.planesForm.reset();
              this.horasDisponibles = [];
              this.router.navigate(['/calendario']);
            },
            (crearError) => {
              console.error('Error al crear el plan:', crearError);
              this.errorMessage = 'Error al crear el plan. Intenta nuevamente.';
            }
          );
        } else {
          console.error('Error al verificar el plan existente:', error);
          this.errorMessage = 'Error al verificar el plan existente. Intenta nuevamente.';
        }
      },
    });
  }
}
