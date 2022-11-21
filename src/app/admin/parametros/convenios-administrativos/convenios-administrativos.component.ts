import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { Convenio } from 'src/app/models/parametros/convenio.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ConveniosService } from '../service/convenios.service';

@Component({
  selector: 'app-convenios-administrativos',
  templateUrl: './convenios-administrativos.component.html',
  styleUrls: ['./convenios-administrativos.component.scss']
})
export class ConveniosAdministrativosComponent implements OnInit, OnDestroy {

  public formulario:            FormGroup;
  public centrosMedicos:        Array<any> = [];
  public displayedColumns:      string[] = ['codigo', 'nombre', 'seleccionar'];
  public dataSource =           new MatTableDataSource();
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
    public _conveniosService: ConveniosService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {
    this.formulario = this._formBuilder.group({
      _id:                  [''],
      codigo:               ['', Validators.required],
      nombre:               ['', Validators.required],
      fecha_inicio:         [''],
      fecha_fin:            [''],
      estado:               [false],
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
   
    this.subscription.push(
      this._conveniosService.refresh.subscribe(() => this.getListadoConvenios())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataConvenio = () => {
    return new Convenio(
      this.CENTRO_MEDICO.id,
      this.formControl()['codigo'].value,
      this.formControl()['nombre'].value,
      this.formControl()['fecha_inicio'].value,
      this.formControl()['fecha_fin'].value,
      this.formControl()['estado'].value? Number(true): Number(false),
      this.formControl()['_id'].value
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  limpiarVista() {
    this.dataSource.data = [];
    this.formulario.reset();
    this._botones.ctaInicial();
  }

  setEditarConvenio(elemento: Convenio) {
    this.formulario.patchValue({
      _id:                  elemento.id,
      codigo:               elemento.codigo,
      nombre:               elemento.nombre,
      fecha_inicio:         elemento.fecha_inicio,
      fecha_fin:            elemento.fecha_fin,
      estado:               elemento.estado,
    })
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO
  getListadoConvenios() {
    this.subscription.push(this._conveniosService.getListadoConvenios(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postConvenio() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._conveniosService.postConvenio(this.dataConvenio()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Convenio creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putConvenio() {    
    if (this.formulario.valid) {
      this.subscription.push(this._conveniosService.putConvenio(this.dataConvenio(),  this.formControl()['_id'].value).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Convenio actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }
}
