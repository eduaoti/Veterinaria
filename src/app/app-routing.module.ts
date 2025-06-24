import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
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

// 👉 Importa tus guards
import { AuthGuard } from './guards/auth.guard';
import { RolGuard } from './guards/rol.guard';

const routes: Routes = [
  // Rutas públicas (sin guard)
  { path: '', redirectTo: '/principio', pathMatch: 'full' },
  { path: 'principio', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cliente-registro', component: ClienteRegistroComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'recuperar-contraseña', component: RecuperacionPasswordComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'aviso-privacidad', component: AvisoPrivacidadComponent },

  // CLIENTE: solo puede acceder si está logueado y su rol es 'cliente'
  { 
    path: 'cliente-inicio', 
    component: ClienteInicioComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: 'cliente' }
  },
  { 
    path: 'agendar-cita', 
    component: AgendarCitasComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: 'cliente' }
  },
  { 
    path: 'mis-citas', 
    component: MisCitasComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: 'cliente' }
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: ['cliente', 'veterinario'] }
  }, 
  { 
    path: 'agendar-cita/:id', 
    component: AgendarCitasComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: 'cliente' }
  },

  // VETERINARIO: solo puede acceder si está logueado y su rol es 'veterinario'
  { 
    path: 'veterinario-inicio', 
    component: VeterinarioInicioComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: 'veterinario' }
  },
  { 
    path: 'calendario', 
    component: CalendarioComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: 'veterinario' }
  },
  { 
    path: 'expedientes', 
    component: ExpedientesComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: 'veterinario' }
  },
  { 
    path: 'historial-vacunas', 
    component: PDBuilderComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: 'veterinario' }
  },
  { 
    path: 'planes', 
    component: PlanesComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: 'veterinario' }
  },
  { 
    path: 'registro', 
    component: RegistroComponent,
    canActivate: [AuthGuard, RolGuard],
    data: { expectedRole: 'veterinario' }
  },

  // Not found
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
