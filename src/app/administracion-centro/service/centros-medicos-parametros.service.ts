import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CentroMedicoParametro } from 'src/app/models/parametros/centro-medico-parametro.model';
import { Response } from 'src/app/models/response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CentrosMedicosParametrosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getParametroCentroMedico(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/parametros`;
    return this._http.get<Response>(URL)
  }

  postParametroCentroMedico(dataParametro: CentroMedicoParametro){
    const URL = this.url + `asistencial/centros-medicos-parametros`;
    return this._http.post<Response>(URL, dataParametro).pipe(
      tap(() => this._refresh.next())
    )
  }

  putParametroCentroMedico(dataParametro: CentroMedicoParametro, identificador: string){
    const URL = this.url + `asistencial/centros-medicos-parametros/${identificador}`;
    return this._http.put<Response>(URL, dataParametro).pipe(
      tap(() => this._refresh.next())
    )
  }

}
