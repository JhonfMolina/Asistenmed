import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CentroMedicoHorario } from 'src/app/models/parametros/centro-medico-horario';
import { Response } from 'src/app/models/response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CentrosMedicosHorariosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoHorariosCentroMedico(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/horarios`;
    return this._http.get<Response>(URL)
  }

  getHorarioCentroMedico(identificador: string) {
    const URL = this.url + `asistencial/centros-medicos-horarios/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postHorarioCentroMedico(dataHorario: CentroMedicoHorario){
    const URL = this.url + `asistencial/centros-medicos-horarios`;
    return this._http.post<Response>(URL, dataHorario).pipe(
      tap(() => this._refresh.next())
    )
  }

  putHorarioCentroMedico(dataHorario: CentroMedicoHorario, identificador: string){
    const URL = this.url + `asistencial/centros-medicos-horarios/${identificador}`;
    return this._http.put<Response>(URL, dataHorario).pipe(
      tap(() => this._refresh.next())
    )
  }
}
