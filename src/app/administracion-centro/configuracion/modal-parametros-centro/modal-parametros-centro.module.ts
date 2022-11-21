import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionCentroComponent } from './layout/configuracion-centro.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CentrosMedicosParametrosComponent } from './components/parametros-centro/centros-medicos-parametros.component';
import { ActualizarCentroComponent } from './components/actualizar-centro/actualizar-centro.component';
import { CentrosMedicosHorariosComponent } from './components/horarios-centro/centros-medicos-horarios.component';
import { TiposDocumentosComponent } from './components/tipos-documentos/tipos-documentos.component';



@NgModule({
  declarations: [
    ConfiguracionCentroComponent,
    CentrosMedicosParametrosComponent,
    ActualizarCentroComponent,
    CentrosMedicosHorariosComponent,
    TiposDocumentosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
  ]
})
export class ModalParametrosCentro { }
