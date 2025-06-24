import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalendarModule } from 'primeng/calendar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxCaptchaModule } from 'ngx-captcha';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { VeterinarioInicioComponent } from './componentes/veterinario-inicio/veterinario-inicio.component';
import { ClienteInicioComponent } from './componentes/cliente-inicio/cliente-inicio.component';
import { AgendarCitasComponent } from './componentes/agendar-citas/agendar-citas.component';
import { ClienteRegistroComponent } from './componentes/cliente-registro/cliente-registro.component';
import { MisCitasComponent } from './componentes/mis-citas/mis-citas.component';
import { NavbarClienteComponent } from './navbar/navbar-cliente/navbar-cliente.component';
import { RecuperacionPasswordComponent } from './componentes/recuperacion-password/recuperacion-password.component';
import { NavbarVeterinarioComponent } from './navbar/navbar-veterinario/navbar-veterinario.component';
import { CalendarioComponent } from './componentes/calendario/calendario.component';
import { NavbarHomeComponent } from './navbar/navbar-home/navbar-home.component';
import { VeterinariaComponent } from './componentes/veterinaria/veterinaria.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { TokenExpiredDialogComponent } from './componentes/token-expired-dialog/token-expired-dialog.component';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { ExpedientesComponent } from './componentes/expedientes/expedientes.component';
import { PDBuilderComponent } from './componentes/pdbuilder/pdbuilder.component';
import { PlanesComponent } from './componentes/planes/planes.component';
import { NosotrosComponent } from './componentes/nosotros/nosotros.component';
import { ServiciosComponent } from './componentes/servicios/servicios.component';
import { ContactoComponent } from './componentes/contacto/contacto.component';
import { NotFoundComponent } from './componentes/not-found/not-found.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
import { AvisoPrivacidadComponent } from './aviso-privacidad/aviso-privacidad.component';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegistroComponent,
    VeterinarioInicioComponent,
    ClienteInicioComponent,
    AgendarCitasComponent,
    ClienteRegistroComponent,
    MisCitasComponent,
    NavbarClienteComponent,
    RecuperacionPasswordComponent,
    NavbarVeterinarioComponent,
    CalendarioComponent,
    NavbarHomeComponent,
    VeterinariaComponent,
    PerfilComponent,
    TokenExpiredDialogComponent,
    ExpedientesComponent,
    PDBuilderComponent,
    PlanesComponent,
    NosotrosComponent,
    ServiciosComponent,
    ContactoComponent,
    NotFoundComponent,
    BreadcrumbsComponent,
    AvisoPrivacidadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CalendarModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgxCaptchaModule

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true } // Agregar el interceptor
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
