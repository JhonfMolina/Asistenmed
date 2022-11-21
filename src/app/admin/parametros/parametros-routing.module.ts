import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasDiagnosticosComponent } from './categorias-diagnosticos/categorias-diagnosticos.component';
import { ConveniosAdministrativosComponent } from './convenios-administrativos/convenios-administrativos.component';
import { DiagnosticosComponent } from './diagnosticos/diagnosticos.component';
import { MedicosComponent } from './medicos/medicos.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { TiposConsultasComponent } from './tipos-consultas/tipos-consultas.component';
import { ViasIngresosComponent } from './vias-ingresos/vias-ingresos.component';
import { ExamenesComponent } from './examenes/examenes.component';
import { ImagenologiasComponent } from './imagenologias/imagenologias.component';
import { MedicamentosComponent } from './medicamentos/medicamentos.component';
import { FarmaciasComponent } from './farmacias/farmacias.component';
import { LaboratoriosComponent } from './laboratorios/laboratorios.component';
import { ParametrosHistoriaComponent } from './parametros-historia/parametros-historia.component';
import { RegimenesComponent } from './regimenes/regimenes.component';
import { CentrosImagenesComponent } from './centros-imagenes/centros-imagenes.component';
import { TipoCitasComponent } from './tipo-citas/tipo-citas.component';
import { GestionHorarioMedicoComponent } from './gestion-horario-medico/gestion-horario-medico.component';

const routes: Routes = [
  {path:'vias-ingreso', component: ViasIngresosComponent, data:{ title:'AsistenMed | Vias de Ingreso' }},
  {path:'tipos-consultas', component: TiposConsultasComponent, data:{ title:'AsistenMed | Tipos de Consultas' }},
  {path:'pacientes', component: PacientesComponent, data:{ title:'AsistenMed | Pacientes' }},
  {path:'medicos', component: MedicosComponent, data:{ title:'AsistenMed | Medicos' }},
  {path:'gestion-horario-medico', component: GestionHorarioMedicoComponent, data:{ title:'AsistenMed | Gestión horarios Medicos' }},
  {path:'categorias-diagnosticos', component: CategoriasDiagnosticosComponent, data:{ title:'AsistenMed | Categorias Diagnosticos' }},
  {path:'diagnosticos', component: DiagnosticosComponent, data:{ title:'AsistenMed | Diagnosticos' }},
  {path:'convenios-administrativos', component: ConveniosAdministrativosComponent, data:{ title:'AsistenMed | Convenios Administrativos' }},
  {path:'farmacias', component: FarmaciasComponent, data:{ title:'AsistenMed | Farmacias' }},
  {path:'laboratorios', component: LaboratoriosComponent, data:{ title:'AsistenMed | Laboratorios' }},
  {path:'centros-imagenes', component: CentrosImagenesComponent, data:{ title:'AsistenMed | Centros Medicos' }},
  {path:'examenes', component: ExamenesComponent, data:{ title:'AsistenMed | Examenes' }},
  {path:'medicamentos', component: MedicamentosComponent, data:{ title:'AsistenMed | Medicamentos' }},
  {path:'imagenologias', component: ImagenologiasComponent, data:{ title:'AsistenMed | Imagenologias' }},
  {path:'parametros-historia', component: ParametrosHistoriaComponent, data:{ title:'AsistenMed | Parametros Historia' }},
  {path:'regimenes', component: RegimenesComponent, data:{ title:'AsistenMed | Regimenes' }},
  {path:'tipo-citas', component: TipoCitasComponent, data:{ title:'AsistenMed | Tipo de Citas' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }
