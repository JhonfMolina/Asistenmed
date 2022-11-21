import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Botones } from 'src/app/helpers/btn-accion';
import { Servicio } from 'src/app/models/parametros/servicio.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ServiciosMedicosService } from '../service/servicios-medicos.service';

@Component({
  selector: 'app-servicios-medicos',
  templateUrl: './servicios-medicos.component.html',
  styleUrls: ['./servicios-medicos.component.scss']
})
export class ServiciosMedicosComponent implements OnInit, OnDestroy {

  public formulario: FormGroup;
  public displayedColumns: string[] = ['nombre', 'seleccionar'];
  public dataSource = new MatTableDataSource();
  public listadoCentrosMedicos:Array<any> = [];
  public subscription: Subscription[] = [];
  public _botones: Botones;

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    public _formBuilder: FormBuilder,
    public _serviciosService: ServiciosMedicosService,
    public _mensaje: NotificationService
  ) {}

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
    this.formulario = this._formBuilder.group({
      _id:                  [''],
      nombre:               ['', Validators.required],
      estado:               [false],
    });
    this.subscription.push(
      this._serviciosService.refresh.subscribe(() => this.getListadoServicios())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

   //METODOS Y MANIPULACION DE DATA

   formControl = ()=> this.formulario.controls;

  
  dataServicios = () => {
    return new Servicio(
      1,
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

  setEditarServicio(elemento: Servicio) {
    this.formulario.patchValue({
      _id:                    elemento.id,
      nombre:                 elemento.nombre,
      estado:                 elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  // SUSCRIPCION A SERVICIO
  getListadoServicios() {
    this.subscription.push(this._serviciosService.getListadoServicios().subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postServicios() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._serviciosService.postServicios(this.dataServicios()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Servicio medico creado exitosamente.');
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putServicios() {    
    if (this.formulario.valid) {
      this.subscription.push(this._serviciosService.putServicios(this.dataServicios(), this.formControl()._id.value).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Servicio medico actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
