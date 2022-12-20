import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { ConsultaMedica } from 'src/app/models/movimientos/consulta-medica.model';
import { Convenio } from 'src/app/models/parametros/convenio.model';
import { Paciente } from 'src/app/models/parametros/paciente.model';
import { Regimen } from 'src/app/models/parametros/regimenes.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ConveniosService } from '../../parametros/service/convenios.service';
import { PacientesService } from '../../parametros/service/pacientes.service';
import { RegimenesService } from '../../parametros/service/regimenes.service';
import { ConsultaMedicaService } from '../service/consulta-medica.service';
import { HistoriaClinicaService } from '../service/historia-clinica.service';


@Component({
  selector: 'app-evolucion-medica',
  templateUrl: './evolucion-medica.component.html',
  styleUrls: ['./evolucion-medica.component.scss']
})
export class EvolucionMedicaComponent implements OnInit, OnDestroy {

  public formulario:                FormGroup;
  public listadoConvenios:          Array<Convenio> =   [];
  public listadoRegimenes:          Array<Regimen> =    [];
  public displayedColumns:          string[] = [
    'fecha',
    'nombre_paciente',
    'nombre_medico',
    'observacion',
    'seleccionar',
  ];
  public dataSource =               new MatTableDataSource();
  public subscription:              Subscription[] = [];
  public CENTRO_MEDICO =            this._auth.getCookieCentroMedico();

  
  constructor(
    public _formBuilder: FormBuilder,
    public _consultaMedicaService: ConsultaMedicaService,
    public _conveniosService:ConveniosService,
    public _regimenesService:RegimenesService,
    public _historiaClinicaService:HistoriaClinicaService,
    public _pacientesService: PacientesService,
    public _mensaje: NotificationService,
    public _auth: AuthService,
    public _router: Router,
    public dialog: MatDialog,
  ) { 
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

  formControl = ()=> this.formulario.controls;

  ngOnInit(): void {
    this.getListadoConsultaMedica();
    this.getListadoConvenios();
    this.formControl()['asistencial_convenio_id'].valueChanges.subscribe(convenio => {
      this.subscription.push(this._regimenesService.getListadoRegimenesConvenios(this.CENTRO_MEDICO.id, convenio).subscribe((resp) => {
        if (resp) {
          this.listadoRegimenes = resp.data;
        }
      }));
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getListadoConvenios() {
    this.subscription.push(this._conveniosService.getListadoConvenios(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoConvenios = resp.data;
    }));
  }

  getListadoConsultaMedica() {
    this.subscription.push(
      this._consultaMedicaService.getListadoConsultaMedica(this.CENTRO_MEDICO.id).subscribe((resp) => {
        this.dataSource.data = resp.data;
      })
    );
  }

  getConsultaMedica(element:ConsultaMedica) {
    this.subscription.push(this._historiaClinicaService.getListadoConsecutivosHistoria(element.asistencial_centro_medico_id,element.asistencial_paciente_id).subscribe( (resp) => {
      const historia = resp.data;
      historia.forEach((element:any) =>{
        if (element.estado == "activo") {
          this._pacientesService.getPaciente(element.asistencial_paciente_id).subscribe((resp) => {
            const paciente  = resp.data;
            this.formulario.patchValue({
              _id:                              element.id,
              asistencial_paciente_id:          element.asistencial_paciente_id,
              nombre_paciente:                  `${paciente.primer_nombre} ${paciente.primer_apellido} ${paciente.segundo_apellido}`,
              numero_identificacion:            `${paciente.utilidad_tipo_identificacion_abreviatura} ${paciente.identificacion}`,
              fecha_nacimiento:                 paciente.fecha_nacimiento,
              residencia_actual:                paciente.direccion,
              telefono:                         paciente.contactos,
              sexo:                             (paciente.sexo == 'M' ? 'MASCULINO': 'FEMENINO'),
              edad:                             moment().diff(moment(paciente.fecha_nacimiento, "YYYY-MM-DD"), 'years'),
              asistencial_convenio_id:          element.asistencial_convenio_id,
              asistencial_regimen_id:           element.asistencial_regimen_id,
              antecedentes_normales:            element.antecedentes_normales
            })
          })    
        }else {
          return this._mensaje.mensajeInfo('Paciente no cuenta con una historia clinica activa.');
        }
      })
    }));
  }

}
