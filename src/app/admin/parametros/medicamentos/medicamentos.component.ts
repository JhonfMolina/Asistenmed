import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { Medicamento } from 'src/app/models/parametros/medicamento.model';
import { NotificationService } from 'src/app/services/notification.service';
import { MedicamentosService } from '../service/medicamentos.service';


@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.scss']
})
export class MedicamentosComponent implements OnInit, OnDestroy {

  public formulario: UntypedFormGroup;
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
    public _medicamentosService: MedicamentosService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {}

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  ngOnInit(): void {
    this.formulario = this._formBuilder.group({
      _id:                    [''],
      nombre:                 ['', Validators.required],
      estado:                 [false]
    });
    this.subscription.push(
      this._medicamentosService.refresh.subscribe(() => this.getListadoMedicamentos())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataMedicamento = () => {
    return new Medicamento(
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

  setEditarMedicamento(elemento: Medicamento) {
    this.formulario.patchValue({
      _id:                elemento.id,
      nombre:             elemento.nombre,
      estado:             elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO
  getListadoMedicamentos() {
    this.subscription.push(this._medicamentosService.getListadoMedicamentos(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postMedicamento() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._medicamentosService.postMedicamento(this.dataMedicamento()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Medicamento creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putMedicamento() {    
    if (this.formulario.valid) {
      this.subscription.push(this._medicamentosService.putMedicamento(this.dataMedicamento(), this.formControl()._id.value).subscribe((resp) => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Medicamento actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

}
