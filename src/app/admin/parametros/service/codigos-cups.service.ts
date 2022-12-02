import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CUPS } from 'src/app/models/parametros/CUPS.model';
import { Diagnostico } from 'src/app/models/parametros/diagnostico.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CodigosCUPSService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoCups(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/cups`;
    return this._http.get<Response>(URL)
  }

  getCups(identificador: string) {
    const URL = this.url + `asistencial/cups/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postCups(dataCups:CUPS){
    const URL = this.url + `asistencial/cups`;
    return this._http.post<Response>(URL, dataCups).pipe(
      tap(() => this._refresh.next())
    )
  }

  putCups(dataCups:CUPS, identificador: string){
    const URL = this.url + `asistencial/cups/${identificador}`;
    return this._http.put<Response>(URL, dataCups).pipe(
      tap(() => this._refresh.next())
    )
  }
}
