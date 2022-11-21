import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { TipoCita } from 'src/app/models/parametros/tipo-cita';
import { NotificationService } from 'src/app/services/notification.service';
import { TipoCitasService } from '../service/tipo-citas.service';

@Component({
  selector: 'app-tipo-citas',
  templateUrl: './tipo-citas.component.html',
  styleUrls: ['./tipo-citas.component.scss']
})
export class TipoCitasComponent implements OnInit {

  public formulario: UntypedFormGroup;
  public centrosMedicos: Array<any> = [];
  public listadoTiposIdentificaciones: Array<any> = [];
  public listadoDepartamentos: Array<any> = [];
  public listadoCiudades: Array<any> = [];
  public displayedColumns: string[] = ['descripcion','resolucion', 'reasignacion', 'seleccionar'];
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
    public _tipoCitasService: TipoCitasService,
    public _auth: AuthService,
  ) {}

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
    this.formulario = this._formBuilder.group({
      _id:                        [''],
      nombre:                     ['', Validators.required],
      resolucion:                 ['', Validators.required],
      reasignacion:               [''],
      estado:                     [false],
    });
    this.subscription.push(
      this._tipoCitasService.refresh.subscribe(() => this.getListadoTipoCitas())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

  // METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataTipoCitas = () => {
    return new TipoCita(
    this.CENTRO_MEDICO.id,
    this.formControl().nombre.value,
    this.formControl().resolucion.value,
    this.formControl().reasignacion.value? Number(true): Number(false),
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

  setEditarTipoCitas(elemento: TipoCita) {
    this.formulario.patchValue({
      _id:                        elemento.id,
      nombre:                     elemento.nombre,
      resolucion:                 elemento.resolucion,
      reasignacion:               elemento.reasignacion,
      estado:                     elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO

  getListadoTipoCitas() {
    this.subscription.push(this._tipoCitasService.getListadoTipoCitas(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postTipoCitas() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._tipoCitasService.postTipoCitas(this.dataTipoCitas()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Tipo cita creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putTipoCitas() {    
    if (this.formulario.valid) {
      this.subscription.push(this._tipoCitasService.putTipoCitas(this.dataTipoCitas(), this.formControl()._id.value).subscribe((resp) => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Tipo cita actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }


}
