import { Component, OnInit } from '@angular/core';
import { MascotasService } from '../../services/mascotas.service';

@Component({
  selector: 'app-pd-builder',
  templateUrl: './pdbuilder.component.html',
  styleUrls: ['./pdbuilder.component.css'],
})
export class PDBuilderComponent implements OnInit {
  mascotas: any[] = [];
  historial: any[] = [];
  filtros = {
    nombreMascota: '',
    nombreDueno: '',
  };

  constructor(private mascotasService: MascotasService) {}

  ngOnInit() {
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.mascotasService.obtenerTodasLasMascotas().subscribe(
      (data) => {
        this.mascotas = data;
      },
      (error) => {
        console.error('Error al cargar mascotas:', error);
      }
    );
  }

  buscarMascotas() {
    this.mascotasService.buscarMascotas(this.filtros).subscribe(
      (data) => {
        this.mascotas = data;
      },
      (error) => {
        console.error('Error al buscar mascotas:', error);
      }
    );
  }

  verHistorial(id: string) {
    this.mascotasService.obtenerHistorialMascota(id).subscribe(
      (data) => {
        this.historial = data;
        console.log('Historial:', this.historial);
      },
      (error) => {
        console.error('Error al obtener el historial:', error);
      }
    );
  }
}
