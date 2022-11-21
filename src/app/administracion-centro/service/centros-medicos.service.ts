import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CentrosMedicosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoCentrosMedicos() {
    const URL = this.url + `asistencial/centros-medicos`;
    return this._http.get<Response>(URL)
  }

  getCentroMedico() {
    const URL = this.url + `asistencial/centros-medicos/1`;
    return this._http.get<Response>(URL)
  }

  postCentroMedico(dataCentroMedico:any){
    const URL = this.url + `asistencial/centros-medicos`;
    return this._http.post<Response>(URL, dataCentroMedico).pipe(
      tap(() => this._refresh.next())
    )
  }

  putCentroMedico(dataCentroMedico:any, identificador: string){
    const URL = this.url + `asistencial/centros-medicos/${identificador}`;
    return this._http.put<Response>(URL, dataCentroMedico).pipe(
      tap(() => this._refresh.next())
    )
  }
}
