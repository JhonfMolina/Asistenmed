import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovimientosRoutingModule } from './movimientos-routing.module';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { OrdenMedicaComponent } from './orden-medica/orden-medica.component';
import { OrdenMedicaImagenologiaComponent } from './orden-medica-imagenologia/orden-medica-imagenologia.component';
import { OrdenMedicaLaboratorioComponent } from './orden-medica-laboratorio/orden-medica-laboratorio.component';
import { OrdenMedicaFarmaciaComponent } from './orden-medica-farmacia/orden-medica-farmacia.component';
import { EvolucionMedicaComponent } from './evolucion-medica/evolucion-medica.component';
import { AgendaMedicaComponent } from './agenda-medica/agenda-medica.component';
import { CitasComponent } from './citas/citas.component';
import { CitasModule } from './citas/citas.module';
import { ConsultaMedicaComponent } from './consulta-medica/consulta-medica.component';


@NgModule({
  declarations: [
    HistoriaClinicaComponent,
    OrdenMedicaComponent,
    OrdenMedicaImagenologiaComponent,
    OrdenMedicaLaboratorioComponent,
    OrdenMedicaFarmaciaComponent,
    EvolucionMedicaComponent,
    AgendaMedicaComponent,
    CitasComponent,
    ConsultaMedicaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MovimientosRoutingModule,
    CitasModule
  ]
})
export class MovimientosModule { }
