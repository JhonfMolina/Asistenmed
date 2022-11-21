import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Diagnostico } from 'src/app/models/parametros/diagnostico.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoDiagnosticos(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/diagnosticos`;
    return this._http.get<Response>(URL)
  }

  getDiagnostico(identificador: string) {
    const URL = this.url + `asistencial/diagnosticos/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postDiagnostico(dataDiagnostico:Diagnostico){
    const URL = this.url + `asistencial/diagnosticos`;
    return this._http.post<Response>(URL, dataDiagnostico).pipe(
      tap(() => this._refresh.next())
    )
  }

  putDiagnostico(dataDiagnostico:Diagnostico, identificador: string){
    const URL = this.url + `asistencial/diagnosticos/${identificador}`;
    return this._http.put<Response>(URL, dataDiagnostico).pipe(
      tap(() => this._refresh.next())
    )
  }
}
