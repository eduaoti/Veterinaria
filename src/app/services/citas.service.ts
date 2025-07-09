import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiUrl = 'https://veterinaria-backend-production-f7f7.up.railway.app/api/citas';
  private apiUrlPlanes = 'https://veterinaria-backend-production-f7f7.up.railway.app/api/planes';
  
  
  constructor(private http: HttpClient) {}

  // Método para agendar una nueva cita
  agendarCita(cita: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/agendar`, cita);
  }

  // Método para obtener citas por fecha
  obtenerCitasPorFecha(fecha: string): Observable<any[]> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<any[]>(`${this.apiUrl}/por-fecha`, { params });
  }

  // Método para obtener citas por correo electrónico
  obtenerCitasPorEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/email/${email}`);
  }

  // Método para obtener una cita por ID
  obtenerCitaPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para eliminar una cita
  eliminarCita(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  editarCita(id: string, citaData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/editar/${id}`, citaData);
  }
  
  
  
  // Método para obtener todas las citas
  obtenerTodasLasCitas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todas`);
  }

  // Método para iniciar atención de una cita
  iniciarAtencion(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/iniciar-atencion/${id}`, {});
  }

  // Método para finalizar atención de una cita
  finalizarAtencion(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/finalizar-atencion/${id}`, {});
  }

  // Método para actualizar el estado de una cita
  actualizarEstadoCita(id: string, estado: string, idMascota: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/editar-estado/${id}`, { estado, idMascota });
  }

  // Método para obtener citas atendidas por correo electrónico
  obtenerCitasAtendidasPorEmail(email: string): Observable<any[]> {
    const params = new HttpParams().set('estado', 'atendida');
    return this.http.get<any[]>(`${this.apiUrl}/email/${email}`, { params });
  }

  // Método para obtener citas atendidas
  obtenerCitasAtendidas(): Observable<any[]> {
    const params = new HttpParams().set('estado', 'atendida');
    return this.http.get<any[]>(`${this.apiUrl}/atendidas`, { params });
  }
  // Método para obtener disponibilidad de horas
  obtenerDisponibilidad(fecha: string): Observable<{ fecha: string; horasDisponibles: string[] }> {
    return this.http.get<{ fecha: string; horasDisponibles: string[] }>(
      `${this.apiUrl}/disponibilidad`,
      {
        params: new HttpParams().set('fecha', fecha),
      }
    );
  }
  obtenerPlanPorMascota(idMascota: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlPlanes}/plan-por-mascota/${idMascota}`);
  }
  agregarVisita(visita: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/citas/visitas/agregar', visita);
}

  
}
