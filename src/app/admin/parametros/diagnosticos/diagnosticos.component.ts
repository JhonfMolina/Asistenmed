import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Botones } from 'src/app/helpers/btn-accion';
import { Diagnostico } from 'src/app/models/parametros/diagnostico.model';
import { NotificationService } from 'src/app/services/notification.service';
import { DialogCategoriaDiagnosticoComponent } from '../../dialog-content/dialog-categoria-diagnostico/dialog-categoria-diagnostico.component';
import { DiagnosticosService } from '../service/diagnosticos.service';

@Component({
  selector: 'app-diagnosticos',
  templateUrl: './diagnosticos.component.html',
  styleUrls: ['./diagnosticos.component.scss']
})
export class DiagnosticosComponent implements OnInit, OnDestroy {

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
    public _diagnosticoService: DiagnosticosService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public dialog: MatDialog,
    public _auth: AuthService,
  ) {
    this.formulario = this._formBuilder.group({
      _id:                                    [''],
      asistencial_categoria_diagnostico_id:   ['', Validators.required],
      asistencial_categoria_diagnostico:      ['', Validators.required],
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
      this._diagnosticoService.refresh.subscribe(() => this.getListadoDiagnostico())
    );
    this._botones = new Botones();
    this._botones.ctaInicial();
  }

  //METODOS Y MANIPULACION DE DATA

  formControl = ()=> this.formulario.controls;

  dataDiagnostico = () => {
    return new Diagnostico(
    this.CENTRO_MEDICO.id,
    this.formControl()['asistencial_categoria_diagnostico_id'].value,
    this.formControl()['codigo'].value,
    this.formControl()['nombre'].value,
    this.formControl()['asistencial_categoria_diagnostico'].value,
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

  setEditarDiagnostico(elemento: Diagnostico) {
    this.formulario.patchValue({
      _id:                elemento.id,
      asistencial_categoria_diagnostico_id:   elemento.asistencial_categoria_diagnostico_id,
      asistencial_categoria_diagnostico:      elemento.asistencial_categoria_diagnostico_nombre,
      codigo:             elemento.codigo,
      nombre:             elemento.nombre,
      estado:             elemento.estado,
    });
    this._botones.ctaActualizar();
  }

  //SUBSCRIPCION A SERVICIO
  getListadoDiagnostico() {
    this.subscription.push(this._diagnosticoService.getListadoDiagnosticos(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    }));
  }

  postDiagnostico() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {
      this.subscription.push(this._diagnosticoService.postDiagnostico(this.dataDiagnostico()).subscribe(() => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Diagnostico creado exitosamente.')
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  putDiagnostico() {    
    if (this.formulario.valid) {
      this.subscription.push(this._diagnosticoService.putDiagnostico(this.dataDiagnostico(), this.formControl()['_id'].value).subscribe((resp) => {
        this.formulario.reset();
        this._mensaje.mensajeSuccess('Diagnostico actualizado exitosamente.');
        this._botones.ctaInicial();
      }));
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
  }

  DialogCategoriaDiagnostico() {
    const dialogRef = this.dialog.open(DialogCategoriaDiagnosticoComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.formControl()['asistencial_categoria_diagnostico_id'].setValue(result.id);
        this.formControl()['asistencial_categoria_diagnostico'].setValue(result.nombre);
      }
    });
  }

}
