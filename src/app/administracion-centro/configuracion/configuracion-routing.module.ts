import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentrosMedicosComponent } from './centros-medicos/centros-medicos.component';

const routes: Routes = [
  {path:'centro-medico', component: CentrosMedicosComponent, data:{ title:'AsistenMed | Nuevo Centro' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
