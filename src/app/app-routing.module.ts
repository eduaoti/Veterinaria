import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Asegúrate de que la ruta sea correcta
import { HomeComponent } from './home/home.component'; // Asegúrate de que la ruta sea correcta
import { VeterinarioInicioComponent } from './componentes/veterinario-inicio/veterinario-inicio.component';
import { ClienteInicioComponent } from './componentes/cliente-inicio/cliente-inicio.component';
import { AgendarCitasComponent } from './componentes/agendar-citas/agendar-citas.component';
import { ClienteRegistroComponent } from './componentes/cliente-registro/cliente-registro.component';
import { MisCitasComponent } from './componentes/mis-citas/mis-citas.component';
import { RecuperacionPasswordComponent } from './componentes/recuperacion-password/recuperacion-password.component';
import { CalendarioComponent } from './componentes/calendario/calendario.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { ExpedientesComponent } from './componentes/expedientes/expedientes.component';
import { PDBuilderComponent } from './componentes/pdbuilder/pdbuilder.component';
import { PlanesComponent } from './componentes/planes/planes.component';
import { ServiciosComponent } from './componentes/servicios/servicios.component';
import { ContactoComponent } from './componentes/contacto/contacto.component';
import { NosotrosComponent } from './componentes/nosotros/nosotros.component';
import { NotFoundComponent } from './componentes/not-found/not-found.component';
import { AvisoPrivacidadComponent } from './aviso-privacidad/aviso-privacidad.component';


const routes: Routes = [
  { path: '', redirectTo: '/principio', pathMatch: 'full' }, // Redirige a Home por defecto
  { path: 'principio', component: HomeComponent }, // Ruta para el componente Home
  { path: 'login', component: LoginComponent }, // Ruta para el componente de inicio de sesión
  { path: 'veterinario-inicio', component: VeterinarioInicioComponent},
  { path: 'cliente-inicio', component: ClienteInicioComponent},
  { path: 'agendar-cita', component: AgendarCitasComponent},
  { path: 'cliente-registro', component: ClienteRegistroComponent},
  { path: 'mis-citas', component: MisCitasComponent},
  { path: 'agendar-cita/:id', component: AgendarCitasComponent }, // Ruta para editar cita
  { path: 'recuperar-contraseña', component: RecuperacionPasswordComponent },
  { path: 'calendario', component: CalendarioComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'expedientes', component: ExpedientesComponent},
  { path: 'historial-vacunas', component: PDBuilderComponent},
  { path: 'planes', component: PlanesComponent},
  { path: 'servicios', component: ServiciosComponent},
  { path: 'contacto', component: ContactoComponent},
  { path: 'nosotros', component: NosotrosComponent},
  { path: 'aviso-privacidad', component: AvisoPrivacidadComponent },
  { path: '**', component: NotFoundComponent },



  // Aquí puedes agregar más rutas según tu aplicación
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
