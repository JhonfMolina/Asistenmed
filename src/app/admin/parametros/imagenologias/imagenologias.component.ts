import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { Imagenologia } from 'src/app/models/parametros/imagenologia.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ImagenologiasService } from '../service/imagenologias.service';


@Component({
  selector: 'app-imagenologias',
  templateUrl: './imagenologias.component.html',
  styleUrls: ['./imagenologias.component.scss']
})
export class ImagenologiasComponent implements OnInit, OnDestroy {

  public formulario:            FormGroup;
  public centrosMedicos:        Array<any> = [];
  public displayedColumns:      string[] = ['nombre', 'seleccionar'];
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
    public _imagenologiasService: ImagenologiasService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {
    this.formulario = this._formBuilder.group({
      _id:                  [''],
      nombre:               ['', Validators.required],
      estado:               [false]
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }
  
  ngOnInit(): void {
    
    this.subscription.push(
      this._imagenologiasService.refresh.subscribe(() => this.getListadoImagenologias())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataImagenologia = () => {
    return new Imagenologia(
    this.CENTRO_MEDICO.id,
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

  setEditarImagenologia(elemento: Imagenologia) {
    this.formulario.patchValue({
      _id:                elemento.id,
      nombre:             elemento.nombre,
      estado:             elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO
  getListadoImagenologias() {
    this.subscription.push(this._imagenologiasService.getListadoImagenologias(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postImagenologia() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._imagenologiasService.postImagenologia(this.dataImagenologia()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Ayuda diagnostica creada exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putImagenologia() {    
    if (this.formulario.valid) {
      this.subscription.push(this._imagenologiasService.putImagenologia(this.dataImagenologia(), this.formControl()['_id'].value).subscribe((resp) => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Ayuda diagnostica actualizada exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
