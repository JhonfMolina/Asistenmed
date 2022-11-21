import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Botones } from 'src/app/helpers/btn-accion';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TipoIdentificacionService } from 'src/app/services/tipo-identificacion.service';
import { PacientesService } from '../service/pacientes.service';
import { Paciente } from 'src/app/models/parametros/paciente.model';
import { AuthService } from 'src/app/client/auth/service/auth.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit, OnDestroy {

  public identificador: string = '';
  public formulario: UntypedFormGroup;
  public listadoTipoIdentificacion: Array<any> = [];
  public listadoDepartamentos: Array<any> = [];
  public listadoCiudades: Array<any> = [];
  public listadoConvenios: Array<any> = [];
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
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _pacientesService: PacientesService,
    public _tipoIdentificacion: TipoIdentificacionService,
    public _departamentoService: DepartamentosService,
    public _ciudadesService: CiudadesService,
    public _auth: AuthService,
  ) {}

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
    this.formulario = this._formBuilder.group({
      _id:                    [''],
      utilidad_tipo_identificacion_id:  ['', Validators.required],
      numero_identificacion:  ['', Validators.required],
      primer_nombre:          ['', Validators.required],
      segundo_nombre:         [''],
      primer_apellido:        ['', Validators.required],
      segundo_apellido:       [''],
      fecha_nacimiento:       ['', Validators.required],
      sexo:                   ['', Validators.required],
      departamento_id:        ['', Validators.required],
      ciudad_id:              ['', Validators.required],
      direccion:              ['', Validators.required],
      barrio:                 [''],
      telefono:               [''],
      correo:                 [''],
      estado_civil:           [''],
      grupo_sanguineo:        [''],
      factor_sanguineo:       [''],
      estado:                 [false],
    });
    this.subscription.push(
      this._pacientesService.refresh.subscribe(() => this.getListadoPacientes())
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

  formControl = () => this.formulario.controls;

  dataPaciente = () => {
    return new Paciente(
      this.CENTRO_MEDICO.id,
      this.formControl().utilidad_tipo_identificacion_id.value,
      this.formControl().numero_identificacion.value,
      this.formControl().primer_nombre.value,
      this.formControl().primer_apellido.value,
      this.formControl().fecha_nacimiento.value,
      this.formControl().sexo.value,
      this.formControl().departamento_id.value,
      this.formControl().ciudad_id.value,
      this.formControl().barrio.value,
      this.formControl().direccion.value,
      this.formControl().telefono.value,
      this.formControl().segundo_nombre.value,
      this.formControl().segundo_apellido.value,
      this.formControl().estado_civil.value,
      this.formControl().grupo_sanguineo.value,
      this.formControl().factor_sanguineo.value,
      this.formControl().correo.value,
      'activo', //this.formControl().estado.value ? Number(true) : Number(false),
      this.formControl()._id.value
    )
  };

  setEditarPaciente(elemento: Paciente) {
    this.formulario.patchValue({
      _id:                          elemento.id,
      utilidad_tipo_identificacion_id:      elemento.utilidad_tipo_identificacion_id,
      numero_identificacion:        elemento.identificacion,
      fecha_nacimiento:             elemento.fecha_nacimiento,
      sexo:                         elemento.sexo,
      primer_nombre:                elemento.primer_nombre,
      segundo_nombre:               elemento.segundo_nombre,
      primer_apellido:              elemento.primer_apellido,
      segundo_apellido:             elemento.segundo_apellido,
      telefono:                     elemento.contactos,
      direccion:                    elemento.direccion,
      departamento_id:              elemento.utilidad_departamento_id,
      ciudad_id:                    elemento.utilidad_ciudad_id,
      correo:                       elemento.correo,
      estado_civil:                 elemento.estado_civil,
      grupo_sanguineo:              elemento.grupo_sanguineo,
      factor_sanguineo:             elemento.factor_sanguineo,
      estado:                       elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  limpiarVista() {
    this.dataSource.data = [];
    this.formulario.reset();
    this._botones.ctaInicial();
  }

  // SUSCRIPCION A SERVICIO

  inicializador() {
    setTimeout(() => {
      this.getListadoTipoIdentificacion();
      this.getListadoDepartamentos();
    }, 0);
  }


  getListadoTipoIdentificacion() {
    this.subscription.push(this._tipoIdentificacion
      .getListadoTipoIdentificacion()
      .subscribe((resp) => {
        this.listadoTipoIdentificacion = resp.data;
      }));
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

  getListadoPacientes() {
    this.subscription.push(
      this._pacientesService.getListadoPacientes(this.CENTRO_MEDICO.id).subscribe((resp) => {
        this.dataSource.data = resp.data;
        console.log(this.dataSource.data);
      })
    );
  }

  postPacientes() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(
        this._pacientesService
          .postPaciente(this.dataPaciente())
          .subscribe(() => {
            this.formulario.reset();
            this._mensaje.mensajeSuccess('Paciente creada exitosamente.');
          })
      );
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putPacientes() {
    if (this.formulario.valid) {
      this.subscription.push(
        this._pacientesService
          .putPaciente(this.dataPaciente(), this.formControl()._id.value)
          .subscribe(() => {
            this.formulario.reset();
            this._mensaje.mensajeSuccess('Paciente actualizada exitosamente.'); 
            this._botones.ctaInicial();
          })
      );
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
