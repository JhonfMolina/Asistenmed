import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ParametrosModule } from './parametros/parametros.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MovimientosModule } from './movimientos/movimientos.module';
import { ConsultasModule } from './consultas/consultas.module';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ParametrosModule,
    MovimientosModule,
    ConsultasModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
