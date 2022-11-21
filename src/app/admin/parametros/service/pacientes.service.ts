import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Paciente } from 'src/app/models/parametros/paciente.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoPacientes(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/pacientes`;
    return this._http.get<Response>(URL)
  }

  getPaciente(identificador: string) {
    const URL = this.url + `asistencial/pacientes/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postPaciente(dataPaciente:Paciente){
    const URL = this.url + `asistencial/pacientes`;
    return this._http.post<Response>(URL, dataPaciente).pipe(
      tap(() => this._refresh.next())
    )
  }

  putPaciente(dataPaciente:Paciente, identificador: string){
    const URL = this.url + `asistencial/pacientes/${identificador}`;
    return this._http.put<Response>(URL, dataPaciente).pipe(
      tap(() => this._refresh.next())
    )
  }
}
