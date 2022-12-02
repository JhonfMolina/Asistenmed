import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { CUPS } from 'src/app/models/parametros/CUPS.model';
import { NotificationService } from 'src/app/services/notification.service';
import { CodigosCUPSService } from '../service/codigos-cups.service';

@Component({
  selector: 'app-codigos-cups',
  templateUrl: './codigos-cups.component.html',
  styleUrls: ['./codigos-cups.component.scss']
})
export class CodigosCupsComponent {
  public formulario:            FormGroup;
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
    public _codigosCUPSService: CodigosCUPSService,
    public _formBuilder: FormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {
    this.formulario = this._formBuilder.group({
      _id:                                    [''],
      codigo:                                 ['', Validators.required],
      nombre:                                 ['', Validators.required],
      estado:                                 [false]
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }
  
  ngOnInit(): void {
   
    this.subscription.push(
      this._codigosCUPSService.refresh.subscribe(() => this.getListadoCups())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataCUPS = () => {
    return new CUPS(
    this.CENTRO_MEDICO.id,
    this.formControl()['nombre'].value,
    this.formControl()['codigo'].value,
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

  setEditarCUPS(elemento: CUPS) {
    this.formulario.patchValue({
      _id:                elemento.id,
      codigo:             elemento.codigo,
      nombre:             elemento.nombre,
      estado:             elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO
  getListadoCups() {
    this.subscription.push(this._codigosCUPSService.getListadoCups(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postCups() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._codigosCUPSService.postCups(this.dataCUPS()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Diagnostico creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putCups() {    
    if (this.formulario.valid) {
      this.subscription.push(this._codigosCUPSService.putCups(this.dataCUPS(), this.formControl()['_id'].value).subscribe((resp) => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Diagnostico actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
