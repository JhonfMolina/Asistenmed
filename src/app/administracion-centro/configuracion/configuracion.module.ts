import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ListadoCentrosMedicosComponent } from './listado-centros-medicos/listado-centros-medicos.component';
import { CentrosMedicosComponent } from './centros-medicos/centros-medicos.component';
import { ModalParametrosCentro } from './modal-parametros-centro/modal-parametros-centro.module';


@NgModule({
  declarations: [
    CentrosMedicosComponent,
    ListadoCentrosMedicosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    ConfiguracionRoutingModule,
    ModalParametrosCentro
  ]
})
export class ConfiguracionModule { }
