import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogCategoriaDiagnosticoComponent } from './dialog-categoria-diagnostico/dialog-categoria-diagnostico.component';
import { DialogPacienteComponent } from './dialog-paciente/dialog-paciente.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DialogEvolucionComponent } from './dialog-evolucion/dialog-evolucion.component';
import { DialogMedicoComponent } from './dialog-medico/dialog-medico.component';



@NgModule({
  declarations: [
    DialogCategoriaDiagnosticoComponent,
    DialogPacienteComponent,
    DialogEvolucionComponent,
    DialogMedicoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
  ]
})
export class DialogContentModule { }
