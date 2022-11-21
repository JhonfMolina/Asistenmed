import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { Paciente } from 'src/app/models/parametros/paciente.model';
import { PacientesService } from '../../parametros/service/pacientes.service';

@Component({
  selector: 'app-dialog-paciente',
  templateUrl: './dialog-paciente.component.html',
  styleUrls: ['./dialog-paciente.component.scss']
})
export class DialogPacienteComponent implements OnInit, OnDestroy {

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
    public _pacientesService: PacientesService,
    public _auth: AuthService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.getListadoPacientes();
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => element.unsubscribe());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getPaciente(paciente: Paciente) {
    this.dialogRef.close(paciente);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getListadoPacientes() {
    this.subscription.push(
      this._pacientesService.getListadoPacientes(this.CENTRO_MEDICO.id).subscribe((resp) => {
        this.dataSource.data = resp.data;
      })
    );
  }

}
