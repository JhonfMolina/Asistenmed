import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CentroMedico } from 'src/app/models/parametros/centro-medico.model';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProgressBarService } from 'src/app/services/progress-bar.service';
import { TipoIdentificacionService } from 'src/app/services/tipo-identificacion.service';
import { CentrosMedicosService } from '../../service/centros-medicos.service';


@Component({
  selector: 'app-centros-medicos',
  templateUrl: './centros-medicos.component.html',
  styleUrls: ['./centros-medicos.component.scss'],
})
export class CentrosMedicosComponent implements OnInit, OnDestroy {
  public formulario: UntypedFormGroup;
  public listadoTipoIdentificacion: Array<any> = [];
  public listadoDepartamentos: Array<any> = [];
  public listadoCiudades: Array<any> = [];
  public subscription: Subscription[] = [];
  
  constructor(
    public _centrosMedicosService: CentrosMedicosService,
    public _departamenosService: DepartamentosService,
    public _ciudadesService: CiudadesService,
    public _formBuilder: UntypedFormBuilder,
    public _progressBar: ProgressBarService,
    public _mensaje: NotificationService,
    public _tipoIdentificacion: TipoIdentificacionService,
  ) {}

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
    this.formulario = this._formBuilder.group({
      _id:                                [''],
      utilidad_tipo_identificacion_id:    ['', Validators.required],
      identificacion:                     ['', Validators.required],
      razon_social:                       ['', Validators.required],
      descripcion:                        [''],
      telefonos:                           [''],
      direccion:                          [''],
      utilidad_departamento_id:           ['', Validators.required],
      utilidad_ciudad_id:                 ['', Validators.required],
      estado:                             [true],
    });
   
    setTimeout(() => {
      this.getListadoTipoIdentificacion();
      this.getListadoDepartamentos();
    }, 0);
    this.formControl().utilidad_departamento_id.valueChanges.subscribe((resp) => {
      if (resp) {
        this.getListadoCiudades(resp);
      }
    });
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = () => this.formulario.controls;

  dataCentroMedico = () => {
    return new CentroMedico(
    this.formControl().utilidad_tipo_identificacion_id.value,
    this.formControl().identificacion.value,
    this.formControl().razon_social.value,
    this.formControl().utilidad_departamento_id.value,
    this.formControl().utilidad_ciudad_id.value,
    this.formControl().direccion.value,
    this.formControl().telefonos.value,
    this.formControl().descripcion.value,
    this.formControl().estado.value ? Number(true) : Number(false),
    this.formControl()._id.value
    )
  };


  limpiarVista() {
    this.formulario.reset();
  }

  setEditar(elemento: CentroMedico) {
    this.formulario.patchValue({
      _id:                                  elemento.id,
      utilidad_tipo_identificacion_id:      elemento.utilidad_tipo_identificacion_id,
      identificacion:                       elemento.identificacion,
      razon_social:                         elemento.razon_social,
      descripcion:                          elemento.descripcion,
      telefonos:                            elemento.telefonos,
      direccion:                            elemento.direccion,
      utilidad_departamento_id:             elemento.utilidad_departamento_id,
      utilidad_ciudad_id:                   elemento.utilidad_ciudad_id,
      estado:                               elemento.estado,
    });
  }

  //SUBSCRIPCION A SERVICIO

  getListadoTipoIdentificacion() {
    this.subscription.push(this._tipoIdentificacion.getListadoTipoIdentificacion()
      .subscribe((resp) => {
        this.listadoTipoIdentificacion = resp.data;
      }));
  }

  postCentroMedico() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._centrosMedicosService.postCentroMedico(this.dataCentroMedico())
        .subscribe(() => {
          this.formulario.reset();
          this._mensaje.mensajeSuccess('Centro médico creado exitosamente.');
        }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putCentroMedico() {
    if (this.formulario.valid) {
      this._centrosMedicosService
        .putCentroMedico(this.dataCentroMedico(), this.formControl()._id.value)
        .subscribe(() => {
          this.formulario.reset();
          this._mensaje.mensajeSuccess(
            'Centro médico actualizado exitosamente.'
          );
        });
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  getListadoDepartamentos() {
    this._departamenosService.getListadoDepartamentos().subscribe((resp) => {
      this.listadoDepartamentos = resp.data;
    });
  }

  getListadoCiudades(departamentoId: string) {
    this._ciudadesService
      .getListadoCiudadesPorDepartamento(departamentoId)
      .subscribe((resp) => {
        this.listadoCiudades = resp.data;
      });
  }
}
