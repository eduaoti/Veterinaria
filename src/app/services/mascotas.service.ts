import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private apiUrl = 'https://veterinaria-backend-production-f7f7.up.railway.app/api/mascotas';
  
  constructor(private http: HttpClient) {}

  // Método para registrar una nueva mascota
  registrarMascota(mascota: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, mascota);
  }

  // Método para obtener todas las mascotas
  obtenerTodasLasMascotas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Método para obtener una mascota por ID
  obtenerMascotaPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para actualizar una mascota por ID
  actualizarMascota(id: string, mascotaData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, mascotaData);
  }

  // Método para eliminar una mascota por ID
  eliminarMascota(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Métodos para el historial de vacunas

  // Obtener el historial de vacunas de una mascota por ID
  obtenerHistorialVacunas(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/historial`);
  }

  // Agregar una vacuna al historial de una mascota
  agregarVacuna(id: string, vacuna: { nombre: string; dosis: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/historial`, {
      vacunas: [vacuna],
      visitas: [],
    });
  }

  // Agregar una visita al historial de una mascota
  agregarVisita(
    id: string,
    visita: { comentario: string; veterinario: string }
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/historial`, {
      vacunas: [],
      visitas: [visita],
    });
  }
  obtenerMascotasFiltradas(filtros: { nombre?: string; dueno?: string }): Observable<any[]> {
    let params = new HttpParams();
    if (filtros.nombre) {
      params = params.set('nombre', filtros.nombre);
    }
    if (filtros.dueno) {
      params = params.set('dueno', filtros.dueno);
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }
// Métodos adicionales para gestionar el historial
buscarMascotas(filtro: { nombreMascota?: string; nombreDueno?: string }): Observable<any[]> {
  const params = new HttpParams()
    .set('nombreMascota', filtro.nombreMascota || '')
    .set('nombreDueno', filtro.nombreDueno || '');
  return this.http.get<any[]>(`${this.apiUrl}/buscar`, { params });
}

obtenerHistorialMascota(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}/historial`);
}

agregarHistorialVacunas(id: string, vacunas: any[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/${id}/historial`, { vacunas });
}

}
