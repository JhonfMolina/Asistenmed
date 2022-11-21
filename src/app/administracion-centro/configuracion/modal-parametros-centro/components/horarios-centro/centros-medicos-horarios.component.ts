import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CentrosMedicosHorariosService } from 'src/app/administracion-centro/service/centros-medicos-horarios.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { CentroMedicoHorario } from 'src/app/models/parametros/centro-medico-horario';
import { CentroMedico } from 'src/app/models/parametros/centro-medico.model';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-centros-medicos-horarios',
  templateUrl: './centros-medicos-horarios.component.html',
  styleUrls: ['./centros-medicos-horarios.component.scss']
})
export class CentrosMedicosHorariosComponent implements OnInit, OnDestroy {

  public formulario:                      UntypedFormGroup;
  public diasSemana:                      string[] = ['lunes','martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  public listadoHorarios:                 Array<any> = [];
  public subscription:                    Subscription[] = [];
  public _botones:                        Botones;
  @Input()                                centro_medico:CentroMedico;

  constructor( 
    public _centroMedicoHorarioService: CentrosMedicosHorariosService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService
    ) { }

  ngOnInit(): void {
    this.formulario = this._formBuilder.group({
      _id:                      [''],
      dia_semana:               ['', Validators.required],
      hora_apertura:            ['', Validators.required],
      hora_cierre:              ['', Validators.required],
      hora_descanso_inicial:    [''],
      hora_descanso_final:      [''],
      intervaloReceso:          [false],
      estado:                   [false],
    });
    this._botones = new Botones();
    this._botones.ctaInicial();
    this.inicializador()
    this.formControl().dia_semana.valueChanges.subscribe((resp) => {
      if (resp) {
        this.findCentroMedicoHorario(resp);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  limpiarVista() {
    this.formulario.reset();
    this._botones.ctaInicial();
    this.inicializador();
  }

  limpiarFormulario(){
    this.formulario.patchValue({
      _id:                            '',
      hora_apertura:                  '',
      hora_cierre:                    '',
      hora_descanso_inicial:          '',
      hora_descanso_final:            '',
      intervaloReceso:                Number(false),
      estado:                         Number(false),
    });
    this._botones.ctaInicial();
  }

  dataCentroMedicoHorario = () => {
    return new CentroMedicoHorario(
      this.centro_medico.id!,
      this.formControl().dia_semana.value,
      this.formControl().hora_apertura.value,
      this.formControl().hora_cierre.value,
      this.formControl().hora_descanso_inicial.value,
      this.formControl().hora_descanso_final.value,
      this.formControl().estado.value? Number(true): Number(false),
      this.formControl()._id.value
    )
  };

  setEditarCentroMedicoHorario (elemento: CentroMedicoHorario) {
    this.formulario.patchValue({
      _id:                            elemento.id,
      hora_apertura:                  elemento.hora_apertura,
      hora_cierre:                    elemento.hora_cierre,
      hora_descanso_inicial:          (elemento.hora_descanso_inicial)? elemento.hora_descanso_inicial: undefined,
      hora_descanso_final:            (elemento.hora_descanso_inicial)? elemento.hora_descanso_final: undefined,
      intervaloReceso:                (elemento.hora_descanso_inicial)? Number(true): Number(false),
      estado:                         elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO

  inicializador() {
    setTimeout(() => {
      this.getListadoCentroMedicoHorarios();
    }, 0);
  }

  getListadoCentroMedicoHorarios() {
    this.subscription.push(this._centroMedicoHorarioService.getListadoHorariosCentroMedico(this.centro_medico.id!).subscribe((resp) => {
      this.listadoHorarios = resp.data;
    }));
  }


  findCentroMedicoHorario = (dia: any) => {
    if (!this.listadoHorarios.length){ return undefined }
    let horario = this.listadoHorarios.find((item) => item.dia_semana == dia)
    return (!horario) ? this.limpiarFormulario() : this.setEditarCentroMedicoHorario(horario);
  };

  postCentroMedicoHorario() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._centroMedicoHorarioService.postHorarioCentroMedico(this.dataCentroMedicoHorario()).subscribe(() => {
        this._mensaje.mensajeSuccess('Parametro de centro medico creado exitosamente.')
        this.limpiarVista();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putCentroMedicoParametro() {        
    if (this.formulario.valid) {
      this.subscription.push(this._centroMedicoHorarioService.putHorarioCentroMedico(this.dataCentroMedicoHorario(), this.formControl()._id.value).subscribe(() => {
        this._mensaje.mensajeSuccess('Parametro de centro medico actualizado exitosamente.');
        this._botones.ctaInicial();
        this.limpiarVista();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
