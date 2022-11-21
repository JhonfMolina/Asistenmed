import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Medico } from 'src/app/models/parametros/medico.model';
import { MedicosService } from '../../parametros/service/medicos.service';
import { DialogPacienteComponent } from '../dialog-paciente/dialog-paciente.component';

@Component({
  selector: 'app-dialog-medico',
  templateUrl: './dialog-medico.component.html',
  styleUrls: ['./dialog-medico.component.scss']
})
export class DialogMedicoComponent implements OnInit {

  public displayedColumns: string[] = [
    'documento',
    'nombre',
    'correo',
    'seleccionar',
  ];
  public dataSource = new MatTableDataSource();
  public subscription: Subscription[] = [];
  public CENTRO_MEDICO = this._auth.getCookieCentroMedico();

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DialogPacienteComponent>,
    public _medicosService: MedicosService,
    public _auth: AuthService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.getListadoMedicos();
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getMedico(medico: Medico) {
    this.dialogRef.close(medico);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getListadoMedicos() {
    this.subscription.push(
      this._medicosService.getListadoMedicos(this.CENTRO_MEDICO.id).subscribe((resp) => {
        this.dataSource.data = resp.data;
      })
    );
  }

}
