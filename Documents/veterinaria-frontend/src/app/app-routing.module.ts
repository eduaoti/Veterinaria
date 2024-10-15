import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Asegúrate de que la ruta sea correcta
import { HomeComponent } from './home/home.component'; // Asegúrate de que la ruta sea correcta


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirige a Home por defecto
  { path: 'home', component: HomeComponent }, // Ruta para el componente Home
  { path: 'login', component: LoginComponent }, // Ruta para el componente de inicio de sesión

  // Aquí puedes agregar más rutas según tu aplicación
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
