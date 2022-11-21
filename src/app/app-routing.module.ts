import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LoginComponent } from './client/auth/login/login.component';
import { ClientComponent } from './client/client.component';
import { HomeComponent } from './client/home/home.component';
import { PlanesPreciosComponent } from './client/planes-precios/planes-precios.component';
import { PreferirnosComponent } from './client/preferirnos/preferirnos.component';
import { RevistaDigitalComponent } from './client/revista-digital/revista-digital.component';
import { TokenizationGuard } from './guards/guard-tokenization.guard';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled'
};

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: '', component: HomeComponent, data:{ title:'AsistenMed' } },
      { path: 'preferirnos', component: PreferirnosComponent, data:{title:'AsistenMed | Razones Para Preferirnos'}},
      { path: 'planes', component: PlanesPreciosComponent, data:{title:'AsistenMed | Planes y Precios'}},
      { path: 'revista', component: RevistaDigitalComponent, data:{title:'AsistenMed | Revista Digital'}},
      { path: 'login', component: LoginComponent, data:{ title:'AsistenMed | Inicio De Sesión' }},
    ],
  },
  {
    path: 'administracion-centro',
    loadChildren: () =>
      import('./administracion-centro/administracion-centro-routing.module').then(
        (m) => m.AdministracionCentroRoutingModule
      ), canActivate: [TokenizationGuard]
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-routing.module').then(
        (m) => m.AdminRoutingModule
      ),canActivate: [TokenizationGuard]
  },

  { path: '**', component: PageNotFoundComponent },

];



@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
