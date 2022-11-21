import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { CentrosMedicosService } from 'src/app/administracion-centro/service/centros-medicos.service';
import { CentroMedico } from 'src/app/models/parametros/centro-medico.model';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProgressBarService } from 'src/app/services/progress-bar.service';
import { TipoIdentificacionService } from 'src/app/services/tipo-identificacion.service';

@Component({
  selector: 'app-actualizar-centro',
  templateUrl: './actualizar-centro.component.html',
  styleUrls: ['./actualizar-centro.component.scss']
})
export class ActualizarCentroComponent implements OnInit {

  public formulario:                      UntypedFormGroup;
  public listadoTipoIdentificacion:       Array<any> = [];
  public listadoDepartamentos:            Array<any> = [];
  public listadoCiudades:                 Array<any> = [];
  public subscription:                    Subscription[] = [];
  @Input()                                centro_medico:CentroMedico;

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
      telefono:                           [''],
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
    this.formControl().telefono.value,
    this.formControl().descripcion.value,
    this.formControl().estado.value ? Number(true) : Number(false),
    this.formControl()._id.value
    )
  };

  setEditar() {
    if (this.centro_medico) {
      this.formulario.patchValue({
        _id:                                  this.centro_medico.id,
        utilidad_tipo_identificacion_id:      this.centro_medico.utilidad_tipo_identificacion_id,
        identificacion:                       this.centro_medico.identificacion,
        razon_social:                         this.centro_medico.razon_social,
        descripcion:                          this.centro_medico.descripcion,
        telefono:                             this.centro_medico.telefonos,
        direccion:                            this.centro_medico.direccion,
        utilidad_departamento_id:             this.centro_medico.utilidad_departamento_id,
        utilidad_ciudad_id:                   this.centro_medico.utilidad_ciudad_id,
        estado:                               this.centro_medico.estado,
      });
    }
  }

  //SUBSCRIPCION A SERVICIO

  getListadoTipoIdentificacion() {
    this.subscription.push(this._tipoIdentificacion.getListadoTipoIdentificacion()
    .subscribe((resp) => {
      this.listadoTipoIdentificacion = resp.data;
    }));
  }

  getListadoDepartamentos() {
    this.subscription.push(this._departamenosService.getListadoDepartamentos()
    .subscribe((resp) => {
      this.listadoDepartamentos = resp.data;
      this.setEditar();
    }));
  }

  getListadoCiudades(departamentoId: string) {
    this.subscription.push(this._ciudadesService.getListadoCiudadesPorDepartamento(departamentoId)
    .subscribe((resp) => {
      this.listadoCiudades = resp.data;
    }));
  }

  putCentroMedico() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._centrosMedicosService.putCentroMedico(this.dataCentroMedico(), this.formControl()._id.value)
        .subscribe(() => {
          this._mensaje.mensajeSuccess(
            'Centro médico actualizado exitosamente.'
          );
        }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }
}
