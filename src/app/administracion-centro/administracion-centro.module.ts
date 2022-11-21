import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracionCentroRoutingModule } from './administracion-centro-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdministracionCentroComponent } from './administracion-centro.component';
import { ConfiguracionModule } from './configuracion/configuracion.module';


@NgModule({
  declarations: [
    AdministracionCentroComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ConfiguracionModule,
    AdministracionCentroRoutingModule,
  ]
})
export class AdministracionCentroModule { }
