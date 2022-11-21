import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administracion-centro',
  templateUrl: './administracion-centro.component.html',
  styleUrls: ['./administracion-centro.component.scss']
})
export class AdministracionCentroComponent implements OnInit {
  
  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  menuItems = [
    { path: '/administracion-centro/gestion/centro-medico', title: 'Nuevo Centro Medico',  icon:'queue' },
    { path: '/administracion-centro', title: 'Listado de Centros',  icon:'view_list' }
  ] 

  

}
