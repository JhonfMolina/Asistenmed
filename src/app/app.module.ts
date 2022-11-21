import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientModule } from './client/client.module';
import { AdminModule } from './admin/admin.module';

import { LayoutModule } from '@angular/cdk/layout';
import { RequestInterceptor } from './helpers/request.interceptor';
import { HeadersInterceptor } from './helpers/headers.interceptor';
import { AdministracionCentroModule } from './administracion-centro/administracion-centro.module';
import { SharedModule } from './shared/shared.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ClientModule,
    AdministracionCentroModule,
    AdminModule,
    LayoutModule,
  ],
  exports: [SharedModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
