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
export class TipoCitasService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoTipoCitas(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/tipo-citas`;
    return this._http.get<Response>(URL)
  }

  getTipoCitas(identificador: string) {
    const URL = this.url + `asistencial/tipo-citas/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postTipoCitas(dataTipoCitas:TipoConsulta){
    const URL = this.url + `asistencial/tipo-citas`;
    return this._http.post<Response>(URL, dataTipoCitas).pipe(
      tap(() => this._refresh.next())
    )
  }

  putTipoCitas(dataTipoCitas:TipoConsulta, identificador: string){
    const URL = this.url + `asistencial/tipo-citas/${identificador}`;
    return this._http.put<Response>(URL, dataTipoCitas).pipe(
      tap(() => this._refresh.next())
    )
  }
}
