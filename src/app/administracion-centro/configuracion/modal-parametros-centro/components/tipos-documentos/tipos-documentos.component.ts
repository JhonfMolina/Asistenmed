import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { TiposDocumentosService } from 'src/app/administracion-centro/service/tipos-documentos.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { CentroMedico } from 'src/app/models/parametros/centro-medico.model';
import { TipoDocumento } from 'src/app/models/parametros/tipo-documento.model';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-tipos-documentos',
  templateUrl: './tipos-documentos.component.html',
  styleUrls: ['./tipos-documentos.component.scss']
})
export class TiposDocumentosComponent implements OnInit, OnDestroy {

  public formulario:                      UntypedFormGroup;
  public displayedColumns:                string[] = ['nombre', 'consecutivo', 'seleccionar'];
  public dataSource =                     new MatTableDataSource();
  public subscription:                    Subscription[] = [];
  public _botones:                        Botones;
  @Input()                                centro_medico:CentroMedico;

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _tiposDocumentosService: TiposDocumentosService,
    public _mensaje: NotificationService,
  ) {}

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
    this.formulario = this._formBuilder.group({
      _id:                    [''],
      nombre:                 ['', Validators.required],
      consecutivo:            ['', Validators.required],
      estado:                 [false],
    });
    this.subscription.push(
      this._tiposDocumentosService.refresh.subscribe(() => this.getListadoTiposDocumentos())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

  formControl = ()=> this.formulario.controls;

  dataTipoDocumento = () => {
    return new TipoDocumento(
      this.centro_medico.id!,
      this.formControl().nombre.value,
      Number(this.formControl().consecutivo.value),
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

  setEditarTiposDocumento(elemento: TipoDocumento) {
    this.formulario.patchValue({
      _id:                elemento.id,
      nombre:             elemento.nombre,
      consecutivo:        elemento.consecutivo,
      estado:             elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  // SUSCRIPCION A SERVICIO
  getListadoTiposDocumentos() {
    this.subscription.push(this._tiposDocumentosService.getListadoTipoDocumentos(this.centro_medico.id!,[0,1]).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postTiposDocumento() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._tiposDocumentosService.postTipoDocumento(this.dataTipoDocumento()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Tipo documento creado exitosamente.');
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putTiposDocumento() {    
    if (this.formulario.valid) {
      this.subscription.push(this._tiposDocumentosService.putTipoDocumento(this.dataTipoDocumento(), this.formControl()._id.value).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Tipo documento actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
