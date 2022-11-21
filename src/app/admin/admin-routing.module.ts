import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {path:'', component: HomeDashboardComponent, data:{ title:'AsistenMed | Bienvenido' }},
      {
        path: 'parametros',
        loadChildren: () =>
          import('./parametros/parametros-routing.module').then(
            (m) => m.ParametrosRoutingModule
          ),
      },
      {
        path: 'movimientos',
        loadChildren: () =>
          import('./movimientos/movimientos-routing.module').then(
            (m) => m.MovimientosRoutingModule
          ),
      },
      {
        path: 'consultas',
        loadChildren: () =>
          import('./consultas/consultas-routing.module').then(
            (m) => m.ConsultasRoutingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
