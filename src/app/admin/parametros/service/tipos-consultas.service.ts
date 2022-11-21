import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TipoConsulta } from 'src/app/models/parametros/tipo-consulta.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class TipoConsultasService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoTipoConsultas(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/tipo-consultas`;
    return this._http.get<Response>(URL)
  }

  getTipoConsultas(identificador: string) {
    const URL = this.url + `asistencial/tipo-consultas/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postTipoConsultas(dataTipoConsultas:TipoConsulta){
    const URL = this.url + `asistencial/tipo-consultas`;
    return this._http.post<Response>(URL, dataTipoConsultas).pipe(
      tap(() => this._refresh.next())
    )
  }

  putTipoConsultas(dataTipoConsultas:TipoConsulta, identificador: string){
    const URL = this.url + `asistencial/tipo-consultas/${identificador}`;
    return this._http.put<Response>(URL, dataTipoConsultas).pipe(
      tap(() => this._refresh.next())
    )
  }
}
