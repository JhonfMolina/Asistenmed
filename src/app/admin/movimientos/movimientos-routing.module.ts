import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaMedicaComponent } from './agenda-medica/agenda-medica.component';
import { CitasComponent } from './citas/citas.component';
import { EvolucionMedicaComponent } from './evolucion-medica/evolucion-medica.component';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { OrdenMedicaComponent } from './orden-medica/orden-medica.component';

const routes: Routes = [
  {path:'agenda-medica', component: AgendaMedicaComponent, data:{ title:'AsistenMed | Agenda Medica' }},
  {path:'citas', component: CitasComponent, data:{ title:'AsistenMed | Citas Medicas' }},
  {path:'historia-clinica', component: HistoriaClinicaComponent, data:{ title:'AsistenMed | Historia Clinica' }},
  {path:'evolucion-medica', component: EvolucionMedicaComponent, data:{ title:'AsistenMed | Evolución Medica' }},
  {path:'orden-medica', component: OrdenMedicaComponent, data:{ title:'AsistenMed | Orden Medica' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }
