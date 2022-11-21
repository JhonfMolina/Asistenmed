import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { format } from 'date-fns';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { Medico } from 'src/app/models/parametros/medico.model';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TipoIdentificacionService } from 'src/app/services/tipo-identificacion.service';
import { MedicosService } from '../service/medicos.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.scss'],
})
export class MedicosComponent implements OnInit, OnDestroy {
  
  public formulario: UntypedFormGroup;
  addOnBlur = true;
  public fecha_nacimiento = new Date();
  public listadoEspecialidades: Array<any> = [];
  public listadoCentrosMedicos: Array<any> = [];
  public listadoTiposIdentificaciones: Array<any> = [];
  public listadoDepartamentos: Array<any> = [];
  public listadoCiudades: Array<any> = [];
  public displayedColumns: string[] = [
    'documento',
    'nombre',
    'correo',
    'seleccionar',
  ];
  public dataSource = new MatTableDataSource();
  
  public subscription: Subscription[] = [];
  public _botones: Botones;
  public CENTRO_MEDICO = this._auth.getCookieCentroMedico();

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }
  
  constructor(
    public _tipoIdentificacionService: TipoIdentificacionService,
    public _medicoService: MedicosService,
    public _departamentoService: DepartamentosService,
    public _ciudadesService: CiudadesService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {}

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
    this.formulario = this._formBuilder.group({
      _id:                      [''],
      utilidad_tipo_identificacion_id:    ['', Validators.required],
      numero_identificacion:    ['', Validators.required],
      primer_nombre:            ['', Validators.required],
      segundo_nombre:           [''],
      primer_apellido:          ['', Validators.required],
      segundo_apellido:         [''],
      fecha_nacimiento:         ['', Validators.required],
      sexo:                     ['', Validators.required],
      departamento_id:          ['', Validators.required],
      ciudad_id:                ['', Validators.required],
      direccion:                [''],
      telefono:                 [''],
      correo:                   [''],
      rethus:                   ['', Validators.required],
      universidad:              [''],
      estado:                   [false],
    });
    this.subscription.push(
      this._medicoService.refresh.subscribe(() => this.getMedicos())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
    this.inicializador();
    this.formControl().departamento_id.valueChanges.subscribe((resp) => {
      if (resp) {
        this.getListadoCiudadesPorDepartamento(resp);
      }
    });
    
    
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataMedico = () => {
    return new Medico(
      this.CENTRO_MEDICO.id,
      this.formControl().utilidad_tipo_identificacion_id.value,
      this.formControl().numero_identificacion.value,
      this.formControl().rethus.value,
      this.listadoEspecialidades,
      this.formControl().primer_nombre.value,
      this.formControl().primer_apellido.value,
      this.formControl().sexo.value,
      this.formControl().departamento_id.value,
      this.formControl().ciudad_id.value,
      this.formControl().segundo_nombre.value,
      this.formControl().segundo_apellido.value,
      // format(new Date(this.formControl().fecha_nacimiento.value), 'yyyy/MM/dd'),
      moment(this.formControl().fecha_nacimiento.value, 'DD-MM-YYYY').add(1, 'days').format('yyyy/MM/DD'),
      this.formControl().direccion.value,
      this.formControl().telefono.value,
      this.formControl().correo.value,
      this.formControl().universidad.value,
      1, // user_id
      this.formControl().estado.value? Number(true): Number(false),
      this.formControl()._id.value
    )
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  limpiarVista() {
    this.dataSource.data = [];
    this.listadoEspecialidades=[];
    this.formulario.reset();
    this._botones.ctaInicial();
  }

  setEditarMedico(elemento: Medico) {
    this.listadoEspecialidades = [];
    this.formulario.patchValue({
      _id:                    elemento.id,
      utilidad_tipo_identificacion_id:    elemento.utilidad_tipo_identificacion_id,
      numero_identificacion:  elemento.identificacion,
      rethus:                 elemento.rethus,
      fecha_nacimiento:       elemento.fecha_nacimiento,
      sexo:                   elemento.sexo,
      primer_nombre:          elemento.primer_nombre,
      segundo_nombre:         elemento.segundo_nombre,
      primer_apellido:        elemento.primer_apellido,
      segundo_apellido:       elemento.segundo_apellido,
      telefono:               elemento.contactos,
      direccion:              elemento.direccion,
      departamento_id:        elemento.utilidad_departamento_id,
      ciudad_id:              elemento.utilidad_ciudad_id,
      universidad:            elemento.universidad,
      correo:                 elemento.correo,
      estado:                 elemento.estado,
    });
    elemento.tags!.forEach(element => {this.listadoEspecialidades.push(element.name.en)});
    this._botones.ctaActualizar();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) this.listadoEspecialidades.push(value);
    event.chipInput!.clear();
  }

  remove(especialidad: any): void {
    let esp = this.listadoEspecialidades.findIndex(element => element == especialidad)
    this.listadoEspecialidades.splice(esp, 1);
  }

  //SUBSCRIPCION A SERVICIO

  inicializador() {
    setTimeout(() => {
      this.getListadoTiposIdentificaciones();
      this.getListadoDepartamentos();
    }, 0);
  }

  getListadoDepartamentos() {
    this.subscription.push(this._departamentoService.getListadoDepartamentos().subscribe((resp) => {
      this.listadoDepartamentos = resp.data;
    }));
  }

  getListadoCiudadesPorDepartamento(departamento: string) {
    this.listadoCiudades = [];
    this.subscription.push(this._ciudadesService
      .getListadoCiudadesPorDepartamento(departamento)
      .subscribe((resp) => (this.listadoCiudades = resp.data)));
  }
  
  getMedicos() {
    this.subscription.push(this._medicoService.getListadoMedicos(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postMedico() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._medicoService.postMedico(this.dataMedico()).subscribe(() => {
        this.formulario.reset();
        this.listadoEspecialidades=[];
        this._mensaje.mensajeSuccess('Medico creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putMedico() {   
    if (this.formulario.valid) {
      this.subscription.push(this._medicoService.putMedico(this.dataMedico(), this.formControl()._id.value).subscribe(() => {
        this.formulario.reset();
        this.listadoEspecialidades=[];
        this._mensaje.mensajeSuccess('Medico actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }


  getListadoTiposIdentificaciones() {
    this.subscription.push(this._tipoIdentificacionService.getListadoTipoIdentificacion().subscribe((resp) => {
      this.listadoTiposIdentificaciones = resp.data;
    }));
  }

}


