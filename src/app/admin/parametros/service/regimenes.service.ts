import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Regimen } from 'src/app/models/parametros/regimenes.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class RegimenesService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoRegimenesConvenios(centro: any, convenio: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/convenios/${convenio}/regimenes`;
    return this._http.get<Response>(URL)
  }

  getRegimenes(identificador: string) {
    const URL = this.url + `asistencial/regimenes/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postRegimenes(dataRegimen:Regimen){
    const URL = this.url + `asistencial/regimenes`;
    return this._http.post<Response>(URL, dataRegimen).pipe(
      tap(() => this._refresh.next())
    )
  }

  putRegimenes(dataRegimen:Regimen, identificador: string){
    const URL = this.url + `asistencial/regimenes/${identificador}`;
    return this._http.put<Response>(URL, dataRegimen).pipe(
      tap(() => this._refresh.next())
    )
  }
}
