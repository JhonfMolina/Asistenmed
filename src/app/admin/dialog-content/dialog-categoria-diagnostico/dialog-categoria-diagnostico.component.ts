import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { CategoriaDiagnosticosService } from '../../parametros/service/categoria-diagnosticos.service';

@Component({
  selector: 'app-dialog-categoria-diagnostico',
  templateUrl: './dialog-categoria-diagnostico.component.html',
  styleUrls: ['./dialog-categoria-diagnostico.component.scss']
})
export class DialogCategoriaDiagnosticoComponent implements OnInit, OnDestroy {

  public subscription: Subscription[] = [];
  public displayedColumns: string[] = ['codigo', 'nombre', 'seleccionar'];
  public dataSource = new MatTableDataSource();
  public CENTRO_MEDICO = this._auth.getCookieCentroMedico();

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DialogCategoriaDiagnosticoComponent>,
    public _diagnosticoService: CategoriaDiagnosticosService,
    public _auth: AuthService,
    ) { }

    ngOnDestroy(): void {
      this.subscription.forEach((element) => element.unsubscribe());
    }
    
  ngOnInit(): void {
    setTimeout(() => {
      this.getListadoCategoriaDiagnostico();
    }, 0);
  }

  getListadoCategoriaDiagnostico() {
    this._diagnosticoService.getListadoCategoriaDiagnosticos(this.CENTRO_MEDICO.id).subscribe((resp) => {
      this.dataSource.data = resp.data;
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  rowSelect(elemento:any) {
    this.dialogRef.close(elemento);
  }

}
