import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './client.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './auth/login/login.component';
import { RevistaDigitalComponent } from './revista-digital/revista-digital.component';
import { PlanesPreciosComponent } from './planes-precios/planes-precios.component';
import { PreferirnosComponent } from './preferirnos/preferirnos.component';



@NgModule({
  declarations: [
    ClientComponent,
    HomeComponent,
    LoginComponent,
    RevistaDigitalComponent,
    PlanesPreciosComponent,
    PreferirnosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class ClientModule { }
