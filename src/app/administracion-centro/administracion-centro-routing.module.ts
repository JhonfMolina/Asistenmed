import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionCentroComponent } from './administracion-centro.component';
import { ListadoCentrosMedicosComponent } from './configuracion/listado-centros-medicos/listado-centros-medicos.component';


const routes: Routes = [
  {
    path: '',
    component: AdministracionCentroComponent,
    children: [
      {path:'', component: ListadoCentrosMedicosComponent, data:{ title:'AsistenMed | Listado Centro Medico' }},
      {
        path: 'gestion',
        loadChildren: () =>
          import('./configuracion/configuracion-routing.module').then(
            (m) => m.ConfiguracionRoutingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionCentroRoutingModule { }
