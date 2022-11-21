import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoIngresosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoEstadoIngresos(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/estado-ingresos`;
    return this._http.get<Response>(URL)
  }

  getEstadoIngresos(identificador: string) {
    const URL = this.url + `asistencial/estado-ingresos/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postEstadoIngresos(dataEstadoIngresos:any){
    const URL = this.url + `asistencial/estado-ingresos`;
    return this._http.post<Response>(URL, dataEstadoIngresos).pipe(
      tap(() => this._refresh.next())
    )
  }

  putEstadoIngresos(dataEstadoIngresos:any, identificador: string){
    const URL = this.url + `asistencial/estado-ingresos/${identificador}`;
    return this._http.put<Response>(URL, dataEstadoIngresos).pipe(
      tap(() => this._refresh.next())
    )
  }
}
