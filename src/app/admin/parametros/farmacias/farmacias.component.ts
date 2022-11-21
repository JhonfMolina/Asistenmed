import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Botones } from 'src/app/helpers/btn-accion';
import { Farmacia } from 'src/app/models/parametros/farmacia.model';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { TipoIdentificacionService } from 'src/app/services/tipo-identificacion.service';
import { NotificationService } from 'src/app/services/notification.service';
import { FarmaciasService } from '../service/farmacias.service';
import { AuthService } from 'src/app/client/auth/service/auth.service';

@Component({
  selector: 'app-farmacias',
  templateUrl: './farmacias.component.html',
  styleUrls: ['./farmacias.component.scss']
})
export class FarmaciasComponent implements OnInit, OnDestroy {

  public formulario: FormGroup;
  public centrosMedicos: Array<any> = [];
  public listadoTiposIdentificaciones: Array<any> = [];
  public listadoDepartamentos: Array<any> = [];
  public listadoCiudades: Array<any> = [];
  public displayedColumns: string[] = ['identificacion','razon_social', 'descripcion', 'seleccionar'];
  public dataSource = new MatTableDataSource();
  public subscription: Subscription[] = [];
  public _botones: Botones | any;
  public CENTRO_MEDICO = this._auth.getCookieCentroMedico();

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    public _farmaciasService: FarmaciasService,
    public _tipoIdentificacionService: TipoIdentificacionService,
    public _departamentoService: DepartamentosService,
    public _ciudadesService: CiudadesService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {
    this.formulario = this._formBuilder.group({
      _id:                      [''],
      razon_social:             ['', Validators.required],
      utilidad_tipo_identificacion_id:      ['', Validators.required],
      identificacion:           ['', Validators.required],
      utilidad_departamento_id: ['', Validators.required],
      utilidad_ciudad_id:       ['', Validators.required],
      direccion:                [''],
      telefonos:                [''],
      descripcion:              [''],
      estado:                   [false]
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
   
    this.subscription.push(
      this._farmaciasService.refresh.subscribe(() => this.getListadoFarmacias())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
    this.inicializador();
    this.formControl()['utilidad_departamento_id'].valueChanges.subscribe((resp) => {
      if (resp) {
        this.getListadoCiudadesPorDepartamento(resp);
      }
    });
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataFarmacia = () => {
    return new Farmacia(
    this.CENTRO_MEDICO.id,
    this.formControl()['razon_social'].value,
    this.formControl()['utilidad_tipo_identificacion_id'].value,
    this.formControl()['identificacion'].value,
    this.formControl()['utilidad_departamento_id'].value,
    this.formControl()['utilidad_ciudad_id'].value,
    this.formControl()['direccion'].value,
    this.formControl()['telefonos'].value,
    this.formControl()['descripcion'].value,
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

  setEditarFarmacia(elemento: Farmacia) {
    this.formulario.patchValue({
      _id:                        elemento.id,
      razon_social:               elemento.razon_social,
      utilidad_tipo_identificacion_id:    elemento.utilidad_tipo_identificacion_id,
      identificacion:             elemento.identificacion,
      utilidad_departamento_id:   elemento.utilidad_departamento_id,
      utilidad_ciudad_id:         elemento.utilidad_ciudad_id,
      direccion:                  elemento.direccion,
      telefonos:                  elemento.telefonos,
      descripcion:                elemento.descripcion,
      estado:                     elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO

  inicializador() {
    setTimeout(() => {
      this.getListadoTiposIdentificaciones();
      this.getListadoDepartamentos();
    }, 0);
  }

  getListadoDepartamentos() {
    this.subscription.push(this._departamentoService.getListadoDepartamentos().subscribe((resp) => {
      this.listadoDepartamentos = resp.data;
    }));
  }

  getListadoCiudadesPorDepartamento(departamento: string) {
    this.listadoCiudades = [];
    this.subscription.push(this._ciudadesService
      .getListadoCiudadesPorDepartamento(departamento)
      .subscribe((resp) => (this.listadoCiudades = resp.data)));
  }

  getListadoTiposIdentificaciones() {
    this.subscription.push(this._tipoIdentificacionService.getListadoTipoIdentificacion().subscribe((resp) => {
      this.listadoTiposIdentificaciones = resp.data;
    }));
  }

  getListadoFarmacias() {
    this.subscription.push(this._farmaciasService.getListadoFarmacias(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postFarmacia() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._farmaciasService.postFarmacia(this.dataFarmacia()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Farmacia creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putFarmacia() {    
    if (this.formulario.valid) {
      this.subscription.push(this._farmaciasService.putFarmacia(this.dataFarmacia(), this.formControl()['_id'].value).subscribe((resp) => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Farmacia actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
