import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Diagnostico } from 'src/app/models/parametros/diagnostico.model';
import { NotificationService } from 'src/app/services/notification.service';
import { DialogPacienteComponent } from '../../dialog-content/dialog-paciente/dialog-paciente.component';
import { AntecedentesService } from '../../parametros/service/antecedentes.service';
import { DiagnosticosService } from '../../parametros/service/diagnosticos.service';
import { EstadoIngresosService } from '../../parametros/service/estado-ingresos.service';
import { ExamenFisicoService } from '../../parametros/service/examen-fisico.service';
import { TipoConsultasService } from '../../parametros/service/tipos-consultas.service';
import { ViasIngresoService } from '../../parametros/service/vias-ingreso.service';
import { EvolucionesService } from '../service/evoluciones.service';
import { HistoriaClinicaService } from '../service/historia-clinica.service';

@Component({
  selector: 'app-evolucion-medica',
  templateUrl: './evolucion-medica.component.html',
  styleUrls: ['./evolucion-medica.component.scss']
})
export class EvolucionMedicaComponent implements OnInit, OnDestroy {

  public formulario_historia:           FormGroup;
  public formulario:                    FormGroup;
  public listadoDiagnostico:            Array<any> = [];
  public seleccionDiagnostico:          Array<any> = [];
  public listadoViaIngreso:             Array<any> = [];
  public listadoEstadoIngreso:          Array<any> = [];
  public listadoExamenFisico:           Array<any> = [];
  public listadoAntecedentes:           Array<any> = [];
  public listadoTipoConsulta:           Array<any> = [];
  public displayedColumns:              string[] = ['nombre', 'seleccionar'];
  public dataSource =                   new MatTableDataSource();
  public subscription:                  Subscription[] = [];
  public CENTRO_MEDICO =                this._auth.getCookieCentroMedico();
  public data_historia:                 any;
  public diagnostico_filtrado:          any;
  public listadoFiltrado:               Observable<any[]> | undefined;
  public dataFormEstado :               Array<any> = [];
  public dataFormAntecedentes :         Array<any> = [];
  public dataFormExamen :               Array<any> = [];
  public listadoConsecutivosHistoria:   Array<any> = [];
  
  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _historiaClinicaService: HistoriaClinicaService,
    public _diagnosticoService: DiagnosticosService,
    public _viasIngresoService: ViasIngresoService,
    public _estadoIngresoService: EstadoIngresosService,
    public _examenFisicoService: ExamenFisicoService,
    public _antecedentesService: AntecedentesService,
    public _tipoConsultasService: TipoConsultasService,
    public _evolucionService: EvolucionesService,
    public _mensaje: NotificationService,
    public _auth: AuthService,
    public _router: Router,
    public dialog: MatDialog,
  ) { 
    this.formulario_historia = this._formBuilder.group({
      asistencial_paciente_id:        ['', Validators.required],
      asistencial_paciente:           ['', Validators.required],
      consecutivo:       ['', Validators.required],
    });
    this.formulario = this._formBuilder.group({
      _id:                        [''],
      diagnostico:                [''],
      asistencial_tipo_consulta:  ['', Validators.required],
      asistencial_via_ingreso_id: ['', Validators.required],
      diagnostico_presuntivo:     ['', Validators.required],
      plan:                       ['', Validators.required],
      motivo_consulta:            ['', Validators.required],
      enfermedad_actual:          ['', Validators.required],
      inspeccion_general:         ['', Validators.required],
      estado:                     [false]
    });
  }

  ngOnInit(): void {
   
    setTimeout(() => {
      this.getHistoriaClinica();
      this.getListadoDiagnostico();
      this.getListadoTipoConsultas();
      this.getListadoViasIngreso();
      this.getListadoEstadoIngreso();
      this.getListadoExamenFisico();
      this.getListadoAntecedentes(); 
    });
    this.formControlHistoria()['asistencial_paciente_id'].valueChanges.subscribe(resp => {
      if (resp) {
        this.getListadoConsecutivosHistoria();
      }
    });
    this.listadoFiltrado = this.formControl()['diagnostico'].valueChanges.pipe( startWith(''), map(value => this._filter(value)));    
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  private _filter(value: string): Diagnostico[] {
    const filterValue = value.toUpperCase();
    this.diagnostico_filtrado = this.listadoDiagnostico.filter( diagnostico => diagnostico.nombre.toUpperCase().includes(filterValue));
    return this.diagnostico_filtrado;
  }

  formControl = ()=> this.formulario.controls;
  formControlHistoria = ()=> this.formulario_historia.controls;

  dataEvolucion = ()=> {
    return {
      asistencial_historia_clinica_id: this.data_historia.id,
      asistencial_tipo_documento_id: this.data_historia.asistencial_tipo_documento_id,
      consecutivo: this.data_historia.consecutivo,
      fecha_emision: moment().format("YYYY-MM-DD"),
      plan: this.formControl()['plan'].value,
      asistencial_centro_medico_id: this.CENTRO_MEDICO.id,
      asistencial_tipo_consulta: this.formControl()['asistencial_tipo_consulta'].value,
      asistencial_via_ingreso_id: this.formControl()['asistencial_via_ingreso_id'].value,
      diagnostico_presuntivo: this.formControl()['diagnostico_presuntivo'].value,
      motivo_consulta: this.formControl()['motivo_consulta'].value,
      enfermedad_actual: this.formControl()['enfermedad_actual'].value,
      inspeccion_general: this.formControl()['inspeccion_general'].value,
      diagnosticos: this.seleccionDiagnostico,
      estado_ingresos: this.dataFormEstado,
      examen_fisico: this.dataFormExamen,
      antecedentes_personales: this.dataFormAntecedentes
    }
  }

  formEstado = (form: NgForm) => {
    this.listadoEstadoIngreso.forEach(element => {
      [form.value].forEach(resp => {
        if (element.slug == resp) {
          element.valor == resp
        }
        this.dataFormEstado.push({
              asistencial_estado_ingreso_id: element.id,
              descripcion: element.valor
            })
      })
    })
  };

  formAntecedentes = (form: NgForm) => {
    this.listadoAntecedentes.forEach(element => {
      [form.value].forEach(resp => {
        if (element.slug == resp) {
          element.valor == resp
        }
        this.dataFormAntecedentes.push({
          asistencial_antecedente_id: element.id,
          descripcion: element.valor
        })
      })
    })
  };

  formExamen = (form: NgForm) => {
    this.listadoExamenFisico.forEach(element => {
      [form.value].forEach(resp => {
        if (element.slug == resp) {
          element.valor == resp
        }
        this.dataFormExamen.push({
          asistencial_examen_fisico_id: element.id,
          descripcion: element.valor
        })
      })
    })
  };

  addDiagnostico() {
    if (this.diagnostico_filtrado[0].nombre === this.formControl()['diagnostico'].value) {
      this.seleccionDiagnostico.push({
        asistencial_diagnostico_id: this.diagnostico_filtrado[0].id,
        descripcion: this.diagnostico_filtrado[0].nombre,
      });
      this.dataSource.data = this.seleccionDiagnostico;
      this.formControl()['diagnostico'].setValue('');
    }
  }

  getListadoDiagnostico() {
    this.subscription.push(this._diagnosticoService.getListadoDiagnosticos(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoDiagnostico = resp.data;
    }));
  }

  getListadoTipoConsultas() {
    this.subscription.push(this._tipoConsultasService.getListadoTipoConsultas(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoTipoConsulta = resp.data;
    }));
  }

  getListadoViasIngreso() {
    this.subscription.push(this._viasIngresoService.getListadoViasIngreso(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoViaIngreso = resp.data;
    }));
  }

  getHistoriaClinica() {
    this.subscription.push(this._historiaClinicaService.getHistoriaClinica('1').subscribe((resp) => {
      this.data_historia = resp.data;
    }));
  }

  getListadoEstadoIngreso() {
    this.subscription.push(this._estadoIngresoService
      .getListadoEstadoIngresos(this.CENTRO_MEDICO.id)
      .subscribe((resp) => {
        if(resp.data.length == 0) return;
        resp.data.forEach((item:any) => {
            this.listadoEstadoIngreso.push({
              id: item.id,
              asistencial_centro_medico_id: item.asistencial_centro_medico_id,
              nombre: item.nombre,
              slug: item.slug,
              valor: ''
            })
        });
      }));
  }

  getListadoExamenFisico() {
    this.subscription.push(this._examenFisicoService
      .getListadoExamenFisico(this.CENTRO_MEDICO.id)
      .subscribe((resp) => {
        if(resp.data.length == 0) return;
        resp.data.forEach((item:any) => {
            this.listadoExamenFisico.push({
              id: item.id,
              asistencial_centro_medico_id: item.asistencial_centro_medico_id,
              nombre: item.nombre,
              slug: item.slug,
              valor: ''
            })
        });
      }));
  }

  getListadoAntecedentes() {
    this.subscription.push(this._antecedentesService
      .getListadoAntecedentes(this.CENTRO_MEDICO.id)
      .subscribe((resp) => {
        if(resp.data.length == 0) return;
        resp.data.forEach((item:any) => {
            this.listadoAntecedentes.push({
              id: item.id,
              asistencial_centro_medico_id: item.asistencial_centro_medico_id,
              nombre: item.nombre,
              slug: item.slug,
              valor: ''
            })
        });
      }));
  }

  postEvolucion() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
    this.subscription.push(
      this._evolucionService
        .postEvolucion(this.dataEvolucion())
        .subscribe(async (resp)=>{
          this._mensaje.mensajeSuccess('Evolución medica creada exitosamente.');
          this._router.navigate(['/admin/movimientos/historia-clinica'])
        })
    )
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  modalPacientes(){
    this.listadoConsecutivosHistoria = [];
    const dialogRef = this.dialog.open(DialogPacienteComponent);
    dialogRef.afterClosed().subscribe((paciente) => {
      if (!paciente) return;
      this.formulario_historia.patchValue({
        asistencial_paciente_id:          paciente.id,
        asistencial_paciente:             `${paciente.utilidad_tipo_identificacion_abreviatura} ${paciente.identificacion} - ${paciente.primer_nombre} ${paciente.primer_apellido} ${paciente.segundo_apellido}`,
      })
    } );
  }

  getListadoConsecutivosHistoria() {
    this.subscription.push(this._historiaClinicaService.getListadoConsecutivosHistoria(this.CENTRO_MEDICO.id, this.formControlHistoria()['asistencial_paciente_id'].value).subscribe((resp) => {
      this.listadoConsecutivosHistoria = resp.data;
    }));
  }

}
