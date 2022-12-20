import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CentrosMedicosParametrosService } from 'src/app/administracion-centro/service/centros-medicos-parametros.service';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { ConsultaMedica } from 'src/app/models/movimientos/consulta-medica.model';
import { CentroMedicoParametro } from 'src/app/models/parametros/centro-medico-parametro.model';
import { NotificationService } from 'src/app/services/notification.service';
import { DialogMedicoComponent } from '../../dialog-content/dialog-medico/dialog-medico.component';
import { DialogPacienteComponent } from '../../dialog-content/dialog-paciente/dialog-paciente.component';
import { ConsultaMedicaService } from '../service/consulta-medica.service';

@Component({
  selector: 'app-consulta-medica',
  templateUrl: './consulta-medica.component.html',
  styleUrls: ['./consulta-medica.component.scss']
})
export class ConsultaMedicaComponent {

  public formulario:               FormGroup;
  public parametro_centro:              CentroMedicoParametro | any;
  public CENTRO_MEDICO =                this._auth.getCookieCentroMedico();
 
  public subscription:                  Subscription[] =    [];

  constructor(
    public _formBuilder: FormBuilder,
    public _mensaje: NotificationService,
    public _centroMedicoParametroService: CentrosMedicosParametrosService,
    public _consultaMedicaService: ConsultaMedicaService,
    public dialog: MatDialog,
    public _auth: AuthService,
  ) { 
    this.formulario = this._formBuilder.group({
      _id:                            [''],
      asistencial_medico_id:          [''],
      asistencial_medico:             ['', Validators.required],
      asistencial_paciente_id:        [''],
      nombre_paciente:                ['', Validators.required],
      fecha:                          ['', Validators.required],
      hora:                           ['', Validators.required],
      valor:                          [''],
      observacion:                    [''],
    });
  }

  ngOnInit(): void {
    this.getCentroMedicoParametro();
  }

  formControl = ()=> this.formulario.controls;

  limpiarVista() {
    this.formulario.reset();
  }

  dataConsultaMedica = () => {
    return new ConsultaMedica (
      this.CENTRO_MEDICO.id,
      this.formControl()['asistencial_medico_id'].value,
      this.formControl()['asistencial_paciente_id'].value,
      moment(this.formControl()['fecha'].value).format('YYYY-MM-DD'),
      `${this.formControl()['hora'].value}:00`,
      this.formControl()['valor'].value,
      this.formControl()['observacion'].value,
    )
  };

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
    }));
  }

  postConsultaMedica() {
    console.log(this.dataConsultaMedica());
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
    this.subscription.push(
      this._consultaMedicaService
        .postConsultaMedica(this.dataConsultaMedica())
        .subscribe( ()=>{
          this._mensaje.mensajeSuccess('Consulta medica creada exitosamente.');
          this.formulario.reset();
        })
    )
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  modalMedico(){
    if(!this.parametro_centro) return this._mensaje.mensajeInfo('Debe parametrizar su centro medico para continuar.');
    const dialogRef = this.dialog.open(DialogMedicoComponent);
    dialogRef.afterClosed().subscribe((medico) => {
      if (!medico) return;
      this.formulario.patchValue({
        asistencial_medico_id:          medico.id,
        asistencial_medico:             `${medico.utilidad_tipo_identificacion_abreviatura}:${medico.identificacion} - ${medico.primer_nombre} ${medico.primer_apellido} ${medico.segundo_apellido}`,
      })
    });
  }

  modalPacientes(){
    if(!this.parametro_centro) return this._mensaje.mensajeInfo('Debe parametrizar su centro medico para continuar.');
    const dialogRef = this.dialog.open(DialogPacienteComponent);
    dialogRef.afterClosed().subscribe((paciente) => {
      if (!paciente) return;
      this.formulario.patchValue({
        asistencial_paciente_id:          paciente.id,
        nombre_paciente:                  `${paciente.utilidad_tipo_identificacion_abreviatura}:${paciente.identificacion} - ${paciente.primer_nombre} ${paciente.primer_apellido} ${paciente.segundo_apellido}`,
      })
    } );
  }
  
}
