import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CentroMedico } from 'src/app/models/parametros/centro-medico.model';

@Component({
  selector: 'app-configuracion-centro',
  templateUrl: './configuracion-centro.component.html'
})
export class ConfiguracionCentroComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfiguracionCentroComponent>,
    @Inject(MAT_DIALOG_DATA) public centro_medico: CentroMedico,
  ) {}

  ngOnInit(): void {
   
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
