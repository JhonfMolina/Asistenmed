import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarHistoriaComponent } from './consultar-historia/consultar-historia.component';

const routes: Routes = [
  {path:'consultar-historia', component: ConsultarHistoriaComponent, data:{ title:'AsistenMed | Consultar Historia' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasRoutingModule { }
