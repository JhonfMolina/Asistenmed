import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultasRoutingModule } from './consultas-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsultarHistoriaComponent } from './consultar-historia/consultar-historia.component';


@NgModule({
  declarations: [
    ConsultarHistoriaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ConsultasRoutingModule
  ]
})
export class ConsultasModule { }
