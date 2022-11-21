import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { CategoriaDiagnostico } from 'src/app/models/parametros/categoria-diagnostico.model';
import { NotificationService } from 'src/app/services/notification.service';
import { CategoriaDiagnosticosService } from '../service/categoria-diagnosticos.service';

@Component({
  selector: 'app-categorias-diagnosticos',
  templateUrl: './categorias-diagnosticos.component.html',
  styleUrls: ['./categorias-diagnosticos.component.scss']
})
export class CategoriasDiagnosticosComponent implements OnInit, OnDestroy {

  public formulario:            FormGroup;
  public centrosMedicos:        Array<any> = [];
  public identificador:         any;
  public displayedColumns:      string[] = ['codigo', 'nombre', 'seleccionar'];
  public dataSource =           new MatTableDataSource();
  public subscription:          Subscription[] = [];
  public _botones:              Botones | any;
  public CENTRO_MEDICO =        this._auth.getCookieCentroMedico();

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    public _diagnosticoService: CategoriaDiagnosticosService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {
    this.formulario = this._formBuilder.group({
      _id:           [''],
      codigo:        ['', Validators.required],
      nombre:        ['', Validators.required],
      estado:        [false]
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }
  
  ngOnInit(): void {
   
    this.subscription.push(
      this._diagnosticoService.refresh.subscribe(() => this.getListadoCategoriaDiagnostico())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataCategoriaDiagnostico = () => {
    return new CategoriaDiagnostico(
    this.CENTRO_MEDICO.id,
    this.formControl()['codigo'].value,
    this.formControl()['nombre'].value,
    this.formControl()['estado'].value? Number(true): Number(false),
    this.formControl()['_id'].value
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

  setEditarCategoriaDiagnostico(elemento: CategoriaDiagnostico) {
    this.formulario.patchValue({
      _id:                elemento.id,
      codigo:             elemento.codigo,
      nombre:             elemento.nombre,
      estado:             elemento.estado,
    })
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO
  getListadoCategoriaDiagnostico() {
    this.subscription.push(this._diagnosticoService.getListadoCategoriaDiagnosticos(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }


  postCategoriaDiagnostico() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._diagnosticoService.postCategoriaDiagnostico(this.dataCategoriaDiagnostico()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Categoria diagnostico creada exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putCategoriaDiagnostico() {  
    if (this.formulario.valid) {
      this.subscription.push(this._diagnosticoService.putCategoriaDiagnostico(this.dataCategoriaDiagnostico(), this.formControl()['_id'].value).subscribe((resp) => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Categoria diagnostico actualizada exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }
}
