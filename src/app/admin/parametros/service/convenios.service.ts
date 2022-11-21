import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Convenio } from '../../../models/parametros/convenio.model';
import { Response } from 'src/app/models/response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConveniosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoConvenios(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/convenios`;
    return this._http.get<Response>(URL)
  }

  getConvenio(identificador: string) {
    const URL = this.url + `asistencial/convenios/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postConvenio(dataConvenio:Convenio){
    const URL = this.url + `asistencial/convenios`;
    return this._http.post<Response>(URL, dataConvenio).pipe(
      tap(() => this._refresh.next())
    )
  }

  putConvenio(dataConvenio:Convenio, identificador: string){
    const URL = this.url + `asistencial/convenios/${identificador}`;
    return this._http.put<Response>(URL, dataConvenio).pipe(
      tap(() => this._refresh.next())
    )
  }
}
