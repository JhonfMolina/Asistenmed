import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { DetalleOrdenMedica } from 'src/app/models/movimientos/detalle-orden-medica.model';
import { TipoDocumento } from 'src/app/models/parametros/tipo-documento.model';
import { NotificationService } from 'src/app/services/notification.service';
import { MedicamentosService } from '../../parametros/service/medicamentos.service';
import { MedicosService } from '../../parametros/service/medicos.service';
import { PacientesService } from '../../parametros/service/pacientes.service';
import { OrdenesMedicasService } from '../service/ordenes-medicas.service';
import { CentroMedicoParametro } from 'src/app/models/parametros/centro-medico-parametro.model';
import { CentrosMedicosParametrosService } from 'src/app/administracion-centro/service/centros-medicos-parametros.service';
import { DialogPacienteComponent } from '../../dialog-content/dialog-paciente/dialog-paciente.component';
import { MatDialog } from '@angular/material/dialog';
import { HistoriaClinicaService } from '../service/historia-clinica.service';
import { EvolucionesService } from '../service/evoluciones.service';
import { FarmaciasService } from '../../parametros/service/farmacias.service';
import { OrdenMedica } from 'src/app/models/movimientos/orden-medica.model';

@Component({
  selector: 'app-orden-medica-farmacia',
  templateUrl: './orden-medica-farmacia.component.html',
  styleUrls: ['./orden-medica-farmacia.component.scss']
})

export class OrdenMedicaFarmaciaComponent implements OnInit, OnDestroy {

  @Input() tipoOrdenMedica:             TipoDocumento | any;
  public parametro_centro:              CentroMedicoParametro | any;
  public formulario:                    FormGroup;
  public formularioDetalle:             FormGroup;
  public listadoPacientes:              Array<any> = [];
  public listadoMedicos:                Array<any> = [];
  public listadoFarmacias:              Array<any> = [];
  public listadoMedicamentos:           Array<any> = [];
  public listadoConsecutivosHistoria:   Array<any> = [];
  public listadoEvolucionMedica:        Array<any> = [];
  public detalle:                       Array<DetalleOrdenMedica> = [];
  public subscription:                  Subscription[] = [];
  public _botones:                      Botones | any;
  public CENTRO_MEDICO =                this._auth.getCookieCentroMedico();
  
  constructor(
    public _ordenesMedicasService: OrdenesMedicasService,
    public _pacientesService: PacientesService,
    public _medicosService: MedicosService,
    public _historiaClinicaService: HistoriaClinicaService,
    public _evolucionesService: EvolucionesService,
    public _centroMedicoParametroService: CentrosMedicosParametrosService,
    public _medicamentosService: MedicamentosService,
    public _farmaciasService: FarmaciasService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
    public dialog: MatDialog,
  ) { 
    this.formulario = this._formBuilder.group({
      _id:                            [''],
      asistencial_farmacia_id:        [''],
      consecutivo:                    ['', Validators.required],
      asistencial_paciente_id:        ['', Validators.required],
      asistencial_paciente:           ['', Validators.required],
      asistencial_medico_id:          ['', Validators.required],
      asistencial_evolucion_id:       ['', Validators.required],
      fecha:                          ['', Validators.required],
    });

    this.formularioDetalle = this._formBuilder.group({
      asistencial_medicamento_id:   ['', Validators.required],
      cantidad:                     ['', Validators.required],
      descripcion:                  [''],
    })
  }
  
  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getCentroMedicoParametro();
    });
    
    this._botones = new Botones();
    this._botones.ctaInicial();
    this.inicializador();
    this.formControl()['asistencial_paciente_id'].valueChanges.subscribe(resp => {
      if (resp) {
        this.getListadoConsecutivosHistoria();
      }
    });
    this.formControl()['consecutivo'].valueChanges.subscribe(resp => {
      if (resp) {
        this.getListadoEvolucionMedica();
      }
    })
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = () => this.formulario.controls;
  formDetalleControl = () => this.formularioDetalle.controls;

  dataOrdenServicio = () => {
    return new OrdenMedica(
      this.CENTRO_MEDICO.id,
      Number(this.tipoOrdenMedica.id),
      Number(this.formControl()['asistencial_paciente_id'].value),
      Number(this.formControl()['asistencial_medico_id'].value),
      Number(this.formControl()['asistencial_evolucion_id'].value),
      Number(this.tipoOrdenMedica.consecutivo),
      moment(this.formControl()['fecha'].value,).format('YYYY-MM-DD').toString(),
      this.detalle
    )
  }

  limpiarVista() {
    this.formulario.reset();
    this._botones.ctaInicial();
  }

  //SUBSCRIPCION A SERVICIO

  inicializador() {
    setTimeout(() => {
      this.getListadoPacientes();
      this.getListadoMedicos();
      this.getListadoMedicamentos();
      this.getListadoFarmacias();
    }, 0);
  }

  getCentroMedicoParametro() {
    this.subscription.push(this._centroMedicoParametroService.getParametroCentroMedico(this.CENTRO_MEDICO.id).subscribe((resp) => {
      let centro: CentroMedicoParametro = resp.data;
      if (centro) {
        this.parametro_centro = {
          asistencial_centro_medico_id: centro.asistencial_centro_medico_id,
          asistencial_tipo_documento_historia_id: centro.asistencial_tipo_documento_historia_id,
          asistencial_tipo_documento_imagenologia_id: centro.asistencial_tipo_documento_imagenologia_id,
          asistencial_tipo_documento_laboratorio_id: centro.asistencial_tipo_documento_laboratorio_id,
          asistencial_tipo_documento_medicamento_id: centro.asistencial_tipo_documento_medicamento_id,
          duracion_cita: centro.duracion_cita
        };
      }
    }));
  }

  getListadoEvolucionMedica() {
    this.subscription.push(this._evolucionesService.getListadoEvolucionMedica(this.formControl()['consecutivo'].value, this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoEvolucionMedica = resp.data;
      console.log(this.listadoEvolucionMedica);
      
    }));
  }

  getListadoConsecutivosHistoria() {
    this.subscription.push(this._historiaClinicaService.getListadoConsecutivosHistoria(this.CENTRO_MEDICO.id, this.formControl()['asistencial_paciente_id'].value).subscribe((resp) => {
      this.listadoConsecutivosHistoria = resp.data;
    }));
  }

  getListadoPacientes() {
    this.subscription.push(this._pacientesService.getListadoPacientes(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoPacientes = resp.data;
    }));
  }

  getListadoMedicos() {
    this.subscription.push(this._medicosService.getListadoMedicos(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoMedicos = resp.data;
    }));
  }

  getListadoMedicamentos() {
    this.subscription.push(this._medicamentosService.getListadoMedicamentos(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoMedicamentos = resp.data;
      console.log(resp);
      
    }));
  }

  getListadoFarmacias() {
    this.subscription.push(this._farmaciasService.getListadoFarmacias(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoFarmacias = resp.data;
    }));
  }

  eliminarItemDetalle(index:any) {
    this.detalle.splice(index , 1);
  }

  pushItemDetalle(){
    this.formularioDetalle.markAllAsTouched();
    this.formularioDetalle.updateValueAndValidity();
    const medicamento = this.listadoMedicamentos.find(
      (item) => item.id == this.formDetalleControl()['asistencial_medicamento_id'].value
    )
    if (this.formularioDetalle.valid) {
      this.detalle.push(
        new DetalleOrdenMedica(
          this.CENTRO_MEDICO.id,
          this.formDetalleControl()['descripcion'].value,
          Number(this.formDetalleControl()['cantidad'].value),
          medicamento.id,
          '',
          '',
          medicamento.nombre,
          '',
          '',
          this.formControl()['asistencial_farmacia_id'].value,
          '',
          ''
        )
      )
      this.formularioDetalle.reset();
    }else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  postOrdenMedica(){
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._ordenesMedicasService.postOrdenMedica(this.dataOrdenServicio()).subscribe(() => {
        this.formulario.reset();
        this.detalle = [];
        this._mensaje.mensajeSuccess('Orden medica creada exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  modalPacientes(){
    if(!this.parametro_centro) return this._mensaje.mensajeInfo('Debe parametrizar su centro medico para continuar.');
    const dialogRef = this.dialog.open(DialogPacienteComponent);
    dialogRef.afterClosed().subscribe((paciente) => {
      if (!paciente) return;
      this.formulario.patchValue({
        asistencial_paciente_id:          paciente.id,
        asistencial_paciente:             `${paciente.utilidad_tipo_identificacion_abreviatura} ${paciente.identificacion} - ${paciente.primer_nombre} ${paciente.primer_apellido} ${paciente.segundo_apellido}`,
      })
    } );
  }

}
