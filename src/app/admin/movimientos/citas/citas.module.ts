import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionCitasComponent } from './asignacion-citas/asignacion-citas.component';
import { ConfirmacionCitasComponent } from './confirmacion-citas/confirmacion-citas.component';
import { CancelacionCitasComponent } from './cancelacion-citas/cancelacion-citas.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    AsignacionCitasComponent,
    ConfirmacionCitasComponent,
    CancelacionCitasComponent,
  ],
  exports: [
    AsignacionCitasComponent,
    ConfirmacionCitasComponent,
    CancelacionCitasComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class CitasModule { }
