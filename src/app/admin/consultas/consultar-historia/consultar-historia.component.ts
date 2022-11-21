import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DialogPacienteComponent } from '../../dialog-content/dialog-paciente/dialog-paciente.component';
import { HistoriaClinicaService } from '../../movimientos/service/historia-clinica.service';

@Component({
  selector: 'app-consultar-historia',
  templateUrl: './consultar-historia.component.html',
  styleUrls: ['./consultar-historia.component.scss']
})
export class ConsultarHistoriaComponent implements OnInit, OnDestroy {

  public formulario:                    FormGroup;
  public listadoConsecutivosHistoria:   Array<any> = [];
  public subscription:                  Subscription[] = [];
  public CENTRO_MEDICO =                this._auth.getCookieCentroMedico();
  public pdfSrc:                        string = "";
  constructor(
    private _historiaClinicaService: HistoriaClinicaService,
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public _auth: AuthService,
    public dialog: MatDialog,
    ) { 
      this.formulario = this._formBuilder.group({
        asistencial_paciente_id:        ['', Validators.required],
        asistencial_paciente:           ['', Validators.required],
        consecutivo:       ['', Validators.required],
      });
    }

  ngOnInit(): void {
    this.formControl()['asistencial_paciente_id'].valueChanges.subscribe(resp => {
      if (resp) {
        this.getListadoConsecutivosHistoria();
      }
    });
    this.pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  formControl = ()=> this.formulario.controls;

  limpiarVista() {
    this.formulario.reset();
  }

  imprimirPdf() {
    window.open(this.pdfSrc)
  }

  modalPacientes(){
    this.listadoConsecutivosHistoria = [];
    const dialogRef = this.dialog.open(DialogPacienteComponent);
    dialogRef.afterClosed().subscribe((paciente) => {
      if (!paciente) return;
      this.formulario.patchValue({
        asistencial_paciente_id:          paciente.id,
        asistencial_paciente:             `${paciente.utilidad_tipo_identificacion_abreviatura} ${paciente.identificacion} - ${paciente.primer_nombre} ${paciente.primer_apellido} ${paciente.segundo_apellido}`,
      })
    } );
  }

  getListadoConsecutivosHistoria() {
    this.subscription.push(this._historiaClinicaService.getListadoConsecutivosHistoria(this.CENTRO_MEDICO.id, this.formControl()['asistencial_paciente_id'].value).subscribe((resp) => {
      this.listadoConsecutivosHistoria = resp.data;
    }));
  }

}
