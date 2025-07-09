import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanesService {
  private planesUrl = 'https://veterinaria-backend-production-f7f7.up.railway.app/api/planes';
  private citasUrl = 'https://veterinaria-backend-production-f7f7.up.railway.app/api/citas';
  
  
  constructor(private http: HttpClient) {}

  crearPlanConCitas(plan: any): Observable<any> {
    return this.http.post<any>(`${this.planesUrl}/crear-plan-con-citas`, plan);
}
obtenerPlanPorMascota(idMascota: string): Observable<any> {
  return this.http.get<any>(`${this.planesUrl}/plan-por-mascota/${idMascota}`);
}

obtenerPlanesPorCorreo(correo: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.planesUrl}/planes-por-correo`, {
    params: { correo }
  });
}
actualizarPlanConCitas(plan: any): Observable<any> {
  return this.http.put<any>(`${this.planesUrl}/actualizar-plan-con-citas/${plan.idMascota}`, plan);
}


}
