import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { CentrosMedicosService } from '../../service/centros-medicos.service';
import { CentroMedico } from 'src/app/models/parametros/centro-medico.model';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { ConfiguracionCentroComponent } from '../modal-parametros-centro/layout/configuracion-centro.component';

@Component({
  selector: 'app-listado-centros-medicos',
  templateUrl: './listado-centros-medicos.component.html',
  styleUrls: ['./listado-centros-medicos.component.scss']
})
export class ListadoCentrosMedicosComponent implements OnInit {

  public subscription: Subscription[] = [];
  public listadoCentrosMedicos: Array<any> = [];
  
  constructor(
    private _router: Router,
    public _centrosMedicosService: CentrosMedicosService,
    public dialog: MatDialog,
    private _authService: AuthService
    ) { }

  ngOnInit(): void {
    this.getListadoCentrosMedicos();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ingresarCentroMedico(centro_medico: CentroMedico){
    this._authService.setCookieCentroMedico(centro_medico)
    this._router.navigate(['/admin']);
  }

  getListadoCentrosMedicos() {
    this.subscription.push(this._centrosMedicosService.getListadoCentrosMedicos().subscribe((resp) => {
      this.listadoCentrosMedicos = resp.data;
      
    }));
  }

  modalParametrizarCentro(centro_medico: CentroMedico){
    const dialogRef = this.dialog.open(ConfiguracionCentroComponent,{
      data: centro_medico,
      width:'100%',
      minHeight:'500px'
    });
    dialogRef.afterClosed().subscribe(() => this.getListadoCentrosMedicos() );
  }

}
