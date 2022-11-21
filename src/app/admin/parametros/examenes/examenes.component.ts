import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { Examen } from 'src/app/models/parametros/examen.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ExamenesService } from '../service/examenes.service';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.scss']
})
export class ExamenesComponent implements OnInit, OnDestroy {

  public formulario:              FormGroup;
  public centrosMedicos:          Array<any> = [];
  public displayedColumns:        string[] = ['nombre', 'seleccionar'];
  public dataSource =             new MatTableDataSource();
  public subscription:            Subscription[] = [];
  public _botones:                Botones | any;
  public CENTRO_MEDICO =          this._auth.getCookieCentroMedico();

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    public _examenesService: ExamenesService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {
    this.formulario = this._formBuilder.group({
      _id:              [''],
      nombre:           ['', Validators.required],
      estado:           [false]
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }
  
  ngOnInit(): void {
   
    this.subscription.push(
      this._examenesService.refresh.subscribe(() => this.getListadoExamen())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataExamen = () => {
    return new Examen(
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

  setEditarExamen(elemento: Examen) {
    this.formulario.patchValue({
      _id:                elemento.id,
      nombre:             elemento.nombre,
      estado:             elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO
  getListadoExamen() {
    this.subscription.push(this._examenesService.getListadoExamenes(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postExamen() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._examenesService.postExamen(this.dataExamen()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Examen creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putExamen() {    
    if (this.formulario.valid) {
      this.subscription.push(this._examenesService.putExamen(this.dataExamen(), this.formControl()['_id'].value).subscribe((resp) => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Examen actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
