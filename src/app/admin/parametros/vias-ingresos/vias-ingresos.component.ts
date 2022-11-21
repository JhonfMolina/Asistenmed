import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { ViaIngreso } from 'src/app/models/parametros/via-ingreso.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ViasIngresoService } from '../service/vias-ingreso.service';

@Component({
  selector: 'app-vias-ingresos',
  templateUrl: './vias-ingresos.component.html',
  styleUrls: ['./vias-ingresos.component.scss']
})
export class ViasIngresosComponent implements OnInit, OnDestroy {

  public formulario: UntypedFormGroup;
  public displayedColumns: string[] = ['nombre', 'seleccionar'];
  public dataSource = new MatTableDataSource();
  public listadoCentrosMedicos:Array<any> = [];
  public subscription: Subscription[] = [];
  public _botones: Botones;
  public CENTRO_MEDICO = this._auth.getCookieCentroMedico()

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }


  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _viasIngresoService: ViasIngresoService,
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
      estado:                   [false],
    });
    this.subscription.push(
      this._viasIngresoService.refresh.subscribe(() => this.getListadoViasIngreso())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

   //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataViasIngreso = () => {
    return new ViaIngreso(
      this.CENTRO_MEDICO.id,
      this.formControl().nombre.value,
      this.formControl().estado.value? Number(true): Number(false),
      this.formControl()._id.value
    )
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

  setEditarViasIngreso(elemento: ViaIngreso) {
    this.formulario.patchValue({
      _id:                elemento.id,
      nombre:             elemento.nombre,
      estado:             elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  // SUSCRIPCION A SERVICIO
  getListadoViasIngreso() {
    this.subscription.push(this._viasIngresoService.getListadoViasIngreso(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postViasIngreso() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._viasIngresoService.postViasIngreso(this.dataViasIngreso()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Via de ingreso creada exitosamente.');
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putViasIngreso() {    
    if (this.formulario.valid) {
      this.subscription.push(this._viasIngresoService.putViasIngreso(this.dataViasIngreso(), this.formControl()._id.value).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Via de ingreso actualizada exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
