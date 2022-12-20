import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs/internal/Subscription';
import { CentrosMedicosParametrosService } from 'src/app/administracion-centro/service/centros-medicos-parametros.service';
import { TiposDocumentosService } from 'src/app/administracion-centro/service/tipos-documentos.service';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { Evolucion, HistoriaClinica } from 'src/app/models/movimientos/historia-clinica.model';
import { CentroMedicoParametro } from 'src/app/models/parametros/centro-medico-parametro.model';
import { Convenio } from 'src/app/models/parametros/convenio.model';
import { Paciente } from 'src/app/models/parametros/paciente.model';
import { Regimen } from 'src/app/models/parametros/regimenes.model';
import { NotificationService } from 'src/app/services/notification.service';
import { DialogEvolucionComponent } from '../../dialog-content/dialog-evolucion/dialog-evolucion.component';
import { DialogPacienteComponent } from '../../dialog-content/dialog-paciente/dialog-paciente.component';
import { ConveniosService } from '../../parametros/service/convenios.service';
import { PacientesService } from '../../parametros/service/pacientes.service';
import { RegimenesService } from '../../parametros/service/regimenes.service';
import { HistoriaClinicaService } from '../service/historia-clinica.service';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.scss'],
})
export class HistoriaClinicaComponent implements OnInit , OnDestroy{

  public parametro_centro:              CentroMedicoParametro | any;
  public formulario:                    FormGroup;
  public subscription:                  Subscription[] =    [];
  public listadoConvenios:              Array<Convenio> =   [];
  public listadoRegimenes:              Array<Regimen> =    [];
  public evolucion:                     Array<Evolucion> =  [];
  public _botones:                      Botones | any;
  public consecutivo:                   any;
  public fecha_consulta;
  public CENTRO_MEDICO =                this._auth.getCookieCentroMedico();
  public paciente:                      Paciente | any;
  public id_historia:                   string = ""

  constructor(
    public _conveniosService:             ConveniosService,
    public _regimenesService:             RegimenesService,
    public _pacientesService:             PacientesService,
    public _historiaClinicaService:       HistoriaClinicaService,
    public _formBuilder:                  FormBuilder,
    public _mensaje:                      NotificationService,
    public _centroMedicoParametroService: CentrosMedicosParametrosService,
    public _tiposDocumentosService:       TiposDocumentosService,
    public _auth:                         AuthService,
    public dialog:                        MatDialog,
  ) {
    this.fecha_consulta = moment().format("YYYY-MM-DD");    
    this.formulario = this._formBuilder.group({
      _id:                              [''],
      asistencial_paciente_id:          ['', Validators.required],
      nombre_paciente:                  [''],
      numero_identificacion:            [''],
      fecha_nacimiento:                 [''],
      residencia_actual:                [''],
      telefono:                         [''],
      sexo:                             [''],
      edad:                             [''],
      asistencial_convenio_id:          ['', Validators.required],
      asistencial_regimen_id:           ['', Validators.required],
      antecedentes_normales:            ['', Validators.required],
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getCentroMedicoParametro();
    });
    this._botones = new Botones();
    this._botones.ctaInicial();
    this.formControl()['asistencial_convenio_id'].valueChanges.subscribe(convenio => {
      this.subscription.push(this._regimenesService.getListadoRegimenesConvenios(this.CENTRO_MEDICO.id, convenio).subscribe((resp) => {
        if (resp) {
          this.listadoRegimenes = resp.data;
        }
      }));
    });
    this.formControl()['asistencial_paciente_id'].valueChanges.subscribe( ()=> this.getListadoTiposDocumentos())
   
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  formControl = ()=> this.formulario.controls;

  dataHistoriaClinica = () => {
    return new HistoriaClinica (
      this.CENTRO_MEDICO.id,
      this.formControl()['asistencial_paciente_id'].value,
      this.formControl()['asistencial_convenio_id'].value,
      this.formControl()['asistencial_regimen_id'].value,
      this.parametro_centro.asistencial_tipo_documento_historia_id,
      this.consecutivo,
      this.formControl()['antecedentes_normales'].value,
      this.fecha_consulta
    )
  };

  dataPaciente = () => {
    return new Paciente(
      this.paciente.asistencial_centro_medico_id,
      this.paciente.utilidad_tipo_identificacion_id,
      this.paciente.identificacion,
      this.paciente.primer_nombre,
      this.paciente.primer_apellido,
      this.paciente.fecha_nacimiento,
      this.paciente.sexo,
      this.paciente.utilidad_departamento_id,
      this.paciente.utilidad_ciudad_id,
      this.paciente.barrio,
      this.formControl()['residencia_actual'].value,
      this.formControl()['telefono'].value,
      this.paciente.segundo_nombre,
      this.paciente.segundo_apellido,
      this.paciente.estado_civil,
      this.paciente.grupo_sanguineo,
      this.paciente.factor_sanguineo,
      this.paciente.correo,
      this.paciente.estado,
      this.paciente.id,
    )
  }

  
  //SUBSCRIPCION A SERVICIO

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
      this.getListadoConvenios();      
    }));
  }

  getListadoTiposDocumentos() {
    this.subscription.push(this._tiposDocumentosService.getListadoTipoDocumentos(this.CENTRO_MEDICO.id,[1]).subscribe((resp) => {
     if (this.paciente) {
       let documento = resp.data.filter((response:any) => response.slug.includes('historia'));
       this.consecutivo = this.paciente.identificacion + '-' + documento[0].consecutivo;
     }
    }));
  }

  getListadoConvenios() {
    this.subscription.push(this._conveniosService.getListadoConvenios(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoConvenios = resp.data;
    }));
  }

  putPacientes() {
    this.subscription.push(
      this._pacientesService
        .putPaciente(this.dataPaciente(), this.formControl()['asistencial_paciente_id'].value)
        .subscribe()
    );
  }

  modalPacientes(){
    if(!this.parametro_centro) return this._mensaje.mensajeInfo('Debe parametrizar su centro medico para continuar.');
    const dialogRef = this.dialog.open(DialogPacienteComponent);
    dialogRef.afterClosed().subscribe((paciente) => {
      if (!paciente) return;
      this.paciente = paciente;
      this.formulario.patchValue({
        asistencial_paciente_id:          paciente.id,
        nombre_paciente:                  `${paciente.primer_nombre} ${paciente.primer_apellido} ${paciente.segundo_apellido}`,
        numero_identificacion:            `${paciente.utilidad_tipo_identificacion_abreviatura} ${paciente.identificacion}`,
        fecha_nacimiento:                 paciente.fecha_nacimiento,
        residencia_actual:                paciente.direccion,
        telefono:                         paciente.contactos,
        sexo:                             (paciente.sexo == 'M' ? 'MASCULINO': 'FEMENINO'),
        edad:                             moment().diff(moment(paciente.fecha_nacimiento, "YYYY-MM-DD"), 'years')
      })
    } );
  }

  modalEvolucion(){
    if(!this.parametro_centro) return this._mensaje.mensajeInfo('Debe parametrizar su centro medico para continuar.');
    if(!this.formControl()['asistencial_paciente_id'].value) return this._mensaje.mensajeInfo('Debe seleccionar un paciente para continuar.');
    const dialogRef = this.dialog.open(DialogEvolucionComponent,{
      width: '100%', 
      data: this.id_historia
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.formulario.reset();
      }
    } );
  }

  postHistoriaClinica() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
    this.subscription.push(
      this._historiaClinicaService
        .postHistoriaClinica(this.dataHistoriaClinica())
        .subscribe(async (resp)=>{
          this.id_historia = resp.data;
          await this.putPacientes();
          this._mensaje.mensajeSuccess('Historia clinica creada exitosamente.');
        })
    )
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
