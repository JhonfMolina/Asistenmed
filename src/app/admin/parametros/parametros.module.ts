import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrosRoutingModule } from './parametros-routing.module';
import { PacientesComponent } from './pacientes/pacientes.component';
import { MedicosComponent } from './medicos/medicos.component';
//import { ServiciosMedicosComponent } from './servicios-medicos/servicios-medicos.component';
import { TiposConsultasComponent } from './tipos-consultas/tipos-consultas.component';
import { ConveniosAdministrativosComponent } from './convenios-administrativos/convenios-administrativos.component';
import { DiagnosticosComponent } from './diagnosticos/diagnosticos.component';
import { CategoriasDiagnosticosComponent } from './categorias-diagnosticos/categorias-diagnosticos.component';
import { AdmisionesComponent } from './admisiones/admisiones.component';
import { ViasIngresosComponent } from './vias-ingresos/vias-ingresos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogContentModule } from '../dialog-content/dialog-content.module';
import { HomeDashboardComponent } from '../home-dashboard/home-dashboard.component';
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


@NgModule({
  declarations: [
    PacientesComponent,
    MedicosComponent,
    //ServiciosMedicosComponent,
    TiposConsultasComponent,
    ConveniosAdministrativosComponent,
    DiagnosticosComponent,
    CategoriasDiagnosticosComponent,
    AdmisionesComponent,
    ViasIngresosComponent,
    HomeDashboardComponent,
    ExamenesComponent,
    ImagenologiasComponent,
    MedicamentosComponent,
    FarmaciasComponent,
    LaboratoriosComponent,
    ParametrosHistoriaComponent,
    RegimenesComponent,
    CentrosImagenesComponent,
    TipoCitasComponent,
    GestionHorarioMedicoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParametrosRoutingModule,
    DialogContentModule
  ]
})
export class ParametrosModule { }
