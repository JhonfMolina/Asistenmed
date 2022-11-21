import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DialogMedicoComponent } from '../../dialog-content/dialog-medico/dialog-medico.component';

@Component({
  selector: 'app-agenda-medica',
  templateUrl: './agenda-medica.component.html',
  styleUrls: ['./agenda-medica.component.scss']
})
export class AgendaMedicaComponent implements OnInit {

  public formulario:               FormGroup;

  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _mensaje: NotificationService,
    public dialog: MatDialog,
    public _auth: AuthService,
  ) { 
    this.formulario = this._formBuilder.group({
      _id:                            [''],
      asistencial_medico_id:          ['', Validators.required],
      asistencial_medico:             ['', Validators.required],
      fecha:                          ['', Validators.required],
    });
  }

  ngOnInit(): void {
    
  }

  formControl = ()=> this.formulario.controls;

  limpiarVista() {
    this.formulario.reset();
  }

  modalMedico(){
    const dialogRef = this.dialog.open(DialogMedicoComponent);
    dialogRef.afterClosed().subscribe((paciente) => {
      if (!paciente) return;
      this.formulario.patchValue({
        asistencial_medico_id:          paciente.id,
        asistencial_medico:             `${paciente.utilidad_tipo_identificacion_abreviatura} ${paciente.identificacion} - ${paciente.primer_nombre} ${paciente.primer_apellido} ${paciente.segundo_apellido}`,
      })
    });
  }

}
