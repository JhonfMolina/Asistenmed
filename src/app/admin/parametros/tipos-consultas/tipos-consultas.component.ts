import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { TipoConsulta } from 'src/app/models/parametros/tipo-consulta.model';
import { NotificationService } from 'src/app/services/notification.service';
import { TipoConsultasService } from '../service/tipos-consultas.service';

@Component({
  selector: 'app-tipos-consultas',
  templateUrl: './tipos-consultas.component.html',
  styleUrls: ['./tipos-consultas.component.scss']
})
export class TiposConsultasComponent implements OnInit, OnDestroy {

  public formulario:            FormGroup;
  public displayedColumns:      string[] = ['nombre', 'seleccionar'];
  public dataSource =           new MatTableDataSource();
  public listadoCentrosMedicos: Array<any> = [];
  public subscription:          Subscription[] = [];
  public _botones:              Botones | any;
  public CENTRO_MEDICO =        this._auth.getCookieCentroMedico();

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _tipoConsultasService: TipoConsultasService,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {
    this.formulario = this._formBuilder.group({
      _id:                    [''],
      nombre:                 ['', Validators.required],
      estado:                 [],
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
    
    this.subscription.push(
      this._tipoConsultasService.refresh.subscribe(() => this.getListadoTipoConsultas())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

   //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataTipoConsulta = () => {
    return new TipoConsulta(
      this.CENTRO_MEDICO.id,
      this.formControl()['nombre'].value,
      this.formControl()['estado'].value? Number(true): Number(false),
      this.formControl()['_id'].value
    )
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  limpiarVista() {
    this.dataSource.data = [];
    this.formulario.reset();
    this._botones.ctaInicial();
  }

  setEditarTipoConsulta(elemento: TipoConsulta) {
    this.formulario.patchValue({
      _id:                elemento.id,
      nombre:             elemento.nombre,
      estado:             elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  // SUSCRIPCION A SERVICIO
  getListadoTipoConsultas() {
    this.subscription.push(this._tipoConsultasService.getListadoTipoConsultas(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postTipoConsultas() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._tipoConsultasService.postTipoConsultas(this.dataTipoConsulta()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Tipo de consulta creada exitosamente.');
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putTipoConsultas() {    
    if (this.formulario.valid) {
      this.subscription.push(this._tipoConsultasService.putTipoConsultas(this.dataTipoConsulta(), this.formControl()['_id'].value).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Tipo de consulta actualizada exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
