import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { TipoDiagniostico } from 'src/app/models/parametros/tipo-diagnostico.model';
import { NotificationService } from 'src/app/services/notification.service';
import { TiposDiagnosticosService } from '../service/tipos-diagnosticos.service';

@Component({
  selector: 'app-tipos-diagnosticos',
  templateUrl: './tipos-diagnosticos.component.html',
  styleUrls: ['./tipos-diagnosticos.component.scss']
})
export class TiposDiagnosticosComponent implements OnInit, OnDestroy {

  public formulario: FormGroup;
  public centrosMedicos: Array<any> = [];
  public displayedColumns: string[] = ['nombre', 'seleccionar'];
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
    public _tiposDiagnosticosService: TiposDiagnosticosService,
    public _formBuilder: FormBuilder,
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
      estado:                   [false]
    });
    this.subscription.push(
      this._tiposDiagnosticosService.refresh.subscribe(() => this.getListadoTiposDiagniosticos())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

  formControl = ()=> this.formulario.controls;

  dataTipoDiagniostico = () => {
    return new TipoDiagniostico(
    this.CENTRO_MEDICO.id,
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

  setEditarTipoDiagniostico(elemento: TipoDiagniostico) {
    this.formulario.patchValue({
      _id:                elemento.id,
      nombre:             elemento.nombre,
      estado:             elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO
  getListadoTiposDiagniosticos() {
    this.subscription.push(this._tiposDiagnosticosService.getListadoTipoDiagnosticos(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postTipoDiagnostico() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._tiposDiagnosticosService.postTipoDiagnostico(this.dataTipoDiagniostico()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Tipo de diagnostico creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putTipoDiagnostico() {    
    if (this.formulario.valid) {
      this.subscription.push(this._tiposDiagnosticosService.putTipoDiagnostico(this.dataTipoDiagniostico(), this.formControl()._id.value).subscribe((resp) => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Tipo de diagnostico actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
