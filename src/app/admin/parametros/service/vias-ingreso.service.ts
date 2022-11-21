import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ViaIngreso } from 'src/app/models/parametros/via-ingreso.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ViasIngresoService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoViasIngreso(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/via-ingresos`;
    return this._http.get<Response>(URL)
  }

  getViasIngreso(identificador: string) {
    const URL = this.url + `asistencial/via-ingresos/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postViasIngreso(dataViasIngreso:ViaIngreso){
    const URL = this.url + `asistencial/via-ingresos`;
    return this._http.post<Response>(URL, dataViasIngreso).pipe(
      tap(() => this._refresh.next())
    )
  }

  putViasIngreso(dataViasIngreso:ViaIngreso, identificador: string){
    const URL = this.url + `asistencial/via-ingresos/${identificador}`;
    return this._http.put<Response>(URL, dataViasIngreso).pipe(
      tap(() => this._refresh.next())
    )
  }
}
