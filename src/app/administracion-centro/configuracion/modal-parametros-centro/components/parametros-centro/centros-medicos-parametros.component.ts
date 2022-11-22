import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CentrosMedicosParametrosService } from 'src/app/administracion-centro/service/centros-medicos-parametros.service';
import { TiposDocumentosService } from 'src/app/administracion-centro/service/tipos-documentos.service';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { CentroMedicoParametro } from 'src/app/models/parametros/centro-medico-parametro.model';
import { CentroMedico } from 'src/app/models/parametros/centro-medico.model';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-centros-medicos-parametros',
  templateUrl: './centros-medicos-parametros.component.html',
  styleUrls: ['./centros-medicos-parametros.component.scss']
})
export class CentrosMedicosParametrosComponent implements OnInit, OnDestroy {

  public formulario:                      FormGroup;
  public _botones:                        Botones | any;
  public minutosAtencion:                 number[] = [15, 20, 30, 45, 60];
  public _centroMedicoParametro:          CentroMedicoParametro | any;;
  public listadoTipoDocumento:            Array<any> = [];
  @Input()                                centro_medico:CentroMedico | any;;

  public subscription: Subscription[] = [];
  
  constructor( 
    public _formBuilder: UntypedFormBuilder,
    public _centroMedicoParametroService: CentrosMedicosParametrosService,
    public _mensaje: NotificationService,
    public _tiposDocumentosService: TiposDocumentosService,
    ) { 
      this.formulario = this._formBuilder.group({
        _id:                                                  [''],
        asistencial_tipo_documento_historia_id:               ['', Validators.required],
        asistencial_tipo_documento_medicamento_id:            ['', Validators.required],
        asistencial_tipo_documento_imagenologia_id:           [''],
        asistencial_tipo_documento_laboratorio_id:            [''],
        duracion_cita:                                        ['', Validators.required],
        estado:                                               [''],
      });
    }

  ngOnInit(): void {
    
    this._botones = new Botones();
    this._botones.ctaInicial();
    this.inicializador()
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;


  dataCentroMedicoParametro = () => {
    return new CentroMedicoParametro(
      this.centro_medico.id!,
      this.formControl()['duracion_cita'].value,
      this.formControl()['asistencial_tipo_documento_historia_id'].value,
      this.formControl()['asistencial_tipo_documento_medicamento_id'].value,
      this.formControl()['asistencial_tipo_documento_imagenologia_id'].value,
      this.formControl()['asistencial_tipo_documento_laboratorio_id'].value,
      this.formControl()['estado'].value? Number(true): Number(false),
      this.formControl()['_id'].value,
    )
  };

  setEditarCentroMedicoParametro (elemento: CentroMedicoParametro) {
    this.formulario.patchValue({
      _id:                                              elemento.id,
      asistencial_centro_medico_id:                     this.centro_medico.id!,
      asistencial_tipo_documento_historia_id:           elemento.asistencial_tipo_documento_historia_id,
      asistencial_tipo_documento_medicamento_id:        elemento.asistencial_tipo_documento_medicamento_id,
      asistencial_tipo_documento_imagenologia_id:       elemento.asistencial_tipo_documento_imagenologia_id,
      asistencial_tipo_documento_laboratorio_id:        elemento.asistencial_tipo_documento_laboratorio_id,
      duracion_cita:                                    elemento.duracion_cita,
      estado:                                           elemento.estado,
    });
    elemento ? this._botones.ctaActualizar() : this._botones.ctaInicial();
  }

  //SUBSCRIPCION A SERVICIO

  inicializador() {
    setTimeout(() => {
      this.getCentroMedicoParametro();
      this.getListadoTiposDocumentos()
    }, 0);
  }

  getListadoTiposDocumentos() {
    this.subscription.push(this._tiposDocumentosService.getListadoTipoDocumentos(this.centro_medico.id!,[0]).subscribe((resp) => {
      this.listadoTipoDocumento = resp.data;
    }));
  }

  getCentroMedicoParametro() {
    this.subscription.push(this._centroMedicoParametroService.getParametroCentroMedico(this.centro_medico.id!).subscribe((resp) => {
      this._centroMedicoParametro = resp.data;
      if (this._centroMedicoParametro) {
        this.setEditarCentroMedicoParametro(this._centroMedicoParametro)
      }
    }));
  }

  postCentroMedicoParametro() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._centroMedicoParametroService.postParametroCentroMedico(this.dataCentroMedicoParametro()).subscribe(() => {
        this._mensaje.mensajeSuccess('Parametro de centro medico creado exitosamente.');
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putCentroMedicoParametro() { 
    if (this.formulario.valid) {
      this.subscription.push(this._centroMedicoParametroService.putParametroCentroMedico(this.dataCentroMedicoParametro(), this.formControl()['_id'].value).subscribe(() => {
        this._mensaje.mensajeSuccess('Parametro de centro medico actualizado exitosamente.');
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
