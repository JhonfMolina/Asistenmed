import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { EstadoIngreso, ExamenFisico, Antecedentes } from 'src/app/models/parametros/parametros-historia';
import { NotificationService } from 'src/app/services/notification.service';
import { AntecedentesService } from '../service/antecedentes.service';
import { EstadoIngresosService } from '../service/estado-ingresos.service';
import { ExamenFisicoService } from '../service/examen-fisico.service';

@Component({
  selector: 'app-parametros-historia',
  templateUrl: './parametros-historia.component.html',
  styleUrls: ['./parametros-historia.component.scss']
})
export class ParametrosHistoriaComponent implements OnInit, OnDestroy {

  public formEstadoIngreso:                         UntypedFormGroup;
  public formExamenFisico:                          UntypedFormGroup;
  public formAntecedentes:                          UntypedFormGroup;
  public displayedColumns: string[] =               ['nombre', 'seleccionar'];
  public dataSourceEstadoIngreso =                  new MatTableDataSource();
  public dataSourceExamenFisico =                   new MatTableDataSource();
  public dataSourceAntecedentes =                   new MatTableDataSource();
  public subscription:                              Subscription[] = [];
  public _btn_ingreso:                              Botones;
  public _btn_fisico:                               Botones;
  public _btn_antecedente:                          Botones;
  public CENTRO_MEDICO =                            this._auth.getCookieCentroMedico();

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSourceEstadoIngreso) this.dataSourceEstadoIngreso.paginator = value;
    if (this.dataSourceExamenFisico) this.dataSourceExamenFisico.paginator = value;
    if (this.dataSourceAntecedentes) this.dataSourceAntecedentes.paginator = value;
  }

  constructor(
    public _estadoIngresoService: EstadoIngresosService,
    public _examenFisicoService: ExamenFisicoService,
    public _antecedentesService: AntecedentesService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {
    this.dataSourceEstadoIngreso.data =                  [];
    this.dataSourceExamenFisico.data =                   [];
    this.dataSourceAntecedentes.data =                   [];
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }
  
  ngOnInit(): void {
    this.formEstadoIngreso = this._formBuilder.group({
      _id:              [''],
      nombre:           ['', Validators.required],
      estado:           [false]
    });
    this.formExamenFisico = this._formBuilder.group({
      _id:              [''],
      nombre:           ['', Validators.required],
      estado:           [false]
    });
    this.formAntecedentes = this._formBuilder.group({
      _id:              [''],
      nombre:           ['', Validators.required],
      estado:           [false]
    });
    
    this.subscription.push(this._estadoIngresoService.refresh.subscribe(() => this.getListadoEstadoIngreso()));
    this.subscription.push(this._examenFisicoService.refresh.subscribe(() => this.getListadoExamenFisico()));
    this.subscription.push(this._antecedentesService.refresh.subscribe(() => this.getListadoAntecedentes()));

    this._btn_ingreso = new Botones();
    this._btn_fisico = new Botones();
    this._btn_antecedente = new Botones();

    this._btn_ingreso.ctaInicial();
    this._btn_fisico.ctaInicial();
    this._btn_antecedente.ctaInicial();
    // this.formControl().nombre.valueChanges.subscribe(resp => {
    //   if (resp) {
  
    //     if (resp == 'Antecedentes' )                this.listadoParametros = [{item:'Toxico-alérgicos'}, {item:'Familiares'}, {item:'Quirurgicos'}];
    //     if (resp == 'Antecedentes Patológicos' )    this.listadoParametros = [{item:'Hipertensión'}, {item:'Enfermedad Cardiaca'},{item:'Hipotiroidismo'}, {item:'Asma'}, {item:'Dislipidemia'}, {item:'Diabetes'}];
    //     if (resp == 'Signos Vitales Y Medidas Antropometricas' )   this.listadoParametros = [{item:'TA'}, {item:'FC'}, {item:'FR'}, {item:'Temperatura'}, {item:'Peso'}, {item:'Talla'}];
    //   }
    // })
  }

  //METODOS Y MANIPULACION DE DATA

  formControlEstadoIngreso = () => this.formEstadoIngreso.controls;
  formControlExamenFisico  = () => this.formExamenFisico.controls;
  formControlAntecedentes  = () => this.formAntecedentes.controls;

  limpiarVista(form: string) {
    if (form == 'estado-ingreso') { 
      this.dataSourceEstadoIngreso.data = []; this.formEstadoIngreso.reset();  this._btn_ingreso.ctaInicial();
    }
    if (form == 'examen-fisico') { 
      this.dataSourceExamenFisico.data = []; this.formExamenFisico.reset(); this._btn_fisico.ctaInicial();
    }
    if (form == 'antecedentes') { 
      this.dataSourceAntecedentes.data = []; this.formAntecedentes.reset(); this._btn_antecedente.ctaInicial();
    }
  }

  dataEstadoIngreso = ()=> {
   return new EstadoIngreso(
     this.CENTRO_MEDICO.id,
     this.formControlEstadoIngreso().nombre.value,
     this.formControlEstadoIngreso().estado.value,
     this.formControlEstadoIngreso()._id.value,
   )
  };

  dataExamenFisico = ()=> {
    return new ExamenFisico(
      this.CENTRO_MEDICO.id,
      this.formControlExamenFisico().nombre.value,
      this.formControlExamenFisico().estado.value,
      this.formControlExamenFisico()._id.value,
    )
  };

  dataAntecedentes = ()=> {
    return new Antecedentes(
      this.CENTRO_MEDICO.id,
      this.formControlAntecedentes().nombre.value,
      this.formControlAntecedentes().estado.value,
      this.formControlAntecedentes()._id.value,
    )
  }

  setEditarParametro(elemento: any, form: string) {

    if (form == 'estado-ingreso') {
      this.formEstadoIngreso.patchValue({
        _id:                        elemento.id,
        nombre:                     elemento.nombre,
        estado:                     elemento.estado,
      });
      this._btn_ingreso.ctaActualizar();
    };

    if (form == 'examen-fisico') {
      this.formExamenFisico.patchValue({
        _id:                        elemento.id,
        nombre:                     elemento.nombre,
        estado:                     elemento.estado,
      });
      this._btn_fisico.ctaActualizar();
    };
    
    if (form == 'antecedentes') {
      this.formAntecedentes.patchValue({
        _id:                        elemento.id,
        nombre:                     elemento.nombre,
        estado:                     elemento.estado,
      });
      this._btn_antecedente.ctaActualizar();
    };
    
  }

  //SUBSCRIPCION A SERVICIO

  getListadoEstadoIngreso() {
    this.subscription.push(this._estadoIngresoService.getListadoEstadoIngresos(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSourceEstadoIngreso.data = resp.data;
    }));
  }

  getListadoExamenFisico() {
    this.subscription.push(this._examenFisicoService.getListadoExamenFisico(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSourceExamenFisico.data = resp.data;
    }));
  }

  getListadoAntecedentes() {
    this.subscription.push(this._antecedentesService.getListadoAntecedentes(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSourceAntecedentes.data = resp.data;
    }));
  }

  postEstadoIngresos() {
    this.formEstadoIngreso.markAllAsTouched();
    this.formEstadoIngreso.updateValueAndValidity();
    if (this.formEstadoIngreso.valid) {
      this.subscription.push(this._estadoIngresoService.postEstadoIngresos(this.dataEstadoIngreso()).subscribe(() => {
        this.formEstadoIngreso.reset();
    
        this._mensaje.mensajeSuccess('Parametro estado de ingreso creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  postExamenFisico() {
    this.formExamenFisico.markAllAsTouched();
    this.formExamenFisico.updateValueAndValidity();
    if (this.formExamenFisico.valid) {
      this.subscription.push(this._examenFisicoService.postExamenFisico(this.dataExamenFisico()).subscribe(() => {
        this.formExamenFisico.reset();
        this._mensaje.mensajeSuccess('Parametro examen fisico creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  postAntecedentes() {
    this.formAntecedentes.markAllAsTouched();
    this.formAntecedentes.updateValueAndValidity();
    if (this.formAntecedentes.valid) {
      this.subscription.push(this._antecedentesService.postAntecedentes(this.dataAntecedentes()).subscribe(() => {
        this.formAntecedentes.reset();
    
        this._mensaje.mensajeSuccess('Parametro antecedentes creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putEstadoIngresos() {    
    if (this.formEstadoIngreso.valid) {
      this.subscription.push(this._estadoIngresoService.putEstadoIngresos(this.dataEstadoIngreso(), this.formControlEstadoIngreso()._id.value).subscribe((resp) => {
        this.formEstadoIngreso.reset();
        this._mensaje.mensajeSuccess('Parametro estado de ingreso actualizado exitosamente.');
        this._btn_ingreso.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putExamenFisico() {    
    if (this.formExamenFisico.valid) {
      this.subscription.push(this._examenFisicoService.putExamenFisico(this.dataExamenFisico(), this.formControlExamenFisico()._id.value).subscribe((resp) => {
        this.formExamenFisico.reset();
        this._mensaje.mensajeSuccess('Parametro examen fisico actualizado exitosamente.');
        this._btn_fisico.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putAntecedentes() {    
    if (this.formAntecedentes.valid) {
      this.subscription.push(this._antecedentesService.putAntecedentes(this.dataAntecedentes(), this.formControlAntecedentes()._id.value).subscribe((resp) => {
        this.formAntecedentes.reset();
        this._mensaje.mensajeSuccess('Parametro antecedentes actualizado exitosamente.');
        this._btn_antecedente.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
