import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class AntecedentesService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoAntecedentes(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/antecedentes`;
    return this._http.get<Response>(URL)
  }

  getAntecedentes(identificador: string) {
    const URL = this.url + `asistencial/antecedentes/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postAntecedentes(dataAntecedentes:any){
    const URL = this.url + `asistencial/antecedentes`;
    return this._http.post<Response>(URL, dataAntecedentes).pipe(
      tap(() => this._refresh.next())
    )
  }

  putAntecedentes(dataAntecedentes:any, identificador: string){
    const URL = this.url + `asistencial/antecedentes/${identificador}`;
    return this._http.put<Response>(URL, dataAntecedentes).pipe(
      tap(() => this._refresh.next())
    )
  }
}
