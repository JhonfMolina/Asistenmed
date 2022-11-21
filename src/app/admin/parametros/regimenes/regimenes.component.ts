import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { Regimen } from 'src/app/models/parametros/regimenes.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ConveniosService } from '../service/convenios.service';
import { RegimenesService } from '../service/regimenes.service';

@Component({
  selector: 'app-regimenes',
  templateUrl: './regimenes.component.html',
  styleUrls: ['./regimenes.component.scss']
})
export class RegimenesComponent implements OnInit, OnDestroy {

  public formulario: UntypedFormGroup;
  public centrosMedicos: Array<any> = [];
  public listadoConvenios: Array<any> = [];
  public displayedColumns: string[] = ['convenio', 'nombre', 'seleccionar'];
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
    public _conveniosService: ConveniosService,
    public _regimenesService: RegimenesService,
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
      nombre:                   ['', Validators.required],
      asistencial_convenio_id:  ['', Validators.required],
      estado:                   [false]
    });
    this.subscription.push(
      this._regimenesService.refresh.subscribe(() => this.getListadoRegimen())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
    this.inicializador()
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataRegimen = () => {
    return new Regimen(
    this.CENTRO_MEDICO.id,
    this.formControl().asistencial_convenio_id.value,
    this.formControl().nombre.value,
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
    this.formulario.reset();
    this._botones.ctaInicial();
  }

  inicializador() {
    setTimeout(() => {
      this.getListadoConvenios()
    }, 0);
  }

  setEditarRegimen(elemento: Regimen) {
    this.formulario.patchValue({
      _id:                        elemento.id,
      nombre:                     elemento.nombre,
      asistencial_convenio_id:    elemento.asistencial_convenio_id,
      estado:                     elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO
  getListadoConvenios() {
    this.subscription.push(this._conveniosService.getListadoConvenios(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.listadoConvenios = resp.data;
    }));
  }

  getListadoRegimen() {
    if (!this.formControl().asistencial_convenio_id.value) return this._mensaje.mensajeInfo('Debe seleccionar un convenio.')
    this.subscription.push(this._regimenesService.getListadoRegimenesConvenios(this.CENTRO_MEDICO.id, this.formControl().asistencial_convenio_id.value).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postRegimen() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._regimenesService.postRegimenes(this.dataRegimen()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Regimen creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putRegimen() {    
    if (this.formulario.valid) {
      this.subscription.push(this._regimenesService.putRegimenes(this.dataRegimen(), this.formControl()._id.value).subscribe((resp) => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Regimen actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
