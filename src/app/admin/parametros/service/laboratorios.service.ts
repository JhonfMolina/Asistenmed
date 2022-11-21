import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Laboratorio } from 'src/app/models/parametros/laboratorio.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model'

@Injectable({
  providedIn: 'root'
})
export class LaboratoriosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoLaboratorios(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/laboratorios`;
    return this._http.get<Response>(URL)
  }

  getLaboratorio(identificador: string) {
    const URL = this.url + `asistencial/laboratorios/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postLaboratorio(dataLaboratorio:Laboratorio){
    const URL = this.url + `asistencial/laboratorios`;
    return this._http.post<Response>(URL, dataLaboratorio).pipe(
      tap(() => this._refresh.next())
    )
  }

  putLaboratorio(dataLaboratorio:Laboratorio, identificador: string){
    const URL = this.url + `asistencial/laboratorios/${identificador}`;
    return this._http.put<Response>(URL, dataLaboratorio).pipe(
      tap(() => this._refresh.next())
    )
  }

}
