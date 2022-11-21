import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CategoriaDiagnostico } from 'src/app/models/parametros/categoria-diagnostico.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaDiagnosticosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoCategoriaDiagnosticos(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/categoria-diagnosticos`;
    return this._http.get<Response>(URL)
  }

  getCategoriaDiagnostico(identificador: string) {
    const URL = this.url + `asistencial/categoria-diagnosticos/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postCategoriaDiagnostico(dataDiagnostico:CategoriaDiagnostico){
    const URL = this.url + `asistencial/categoria-diagnosticos`;
    return this._http.post<Response>(URL, dataDiagnostico).pipe(
      tap(() => this._refresh.next())
    )
  }

  putCategoriaDiagnostico(dataDiagnostico:CategoriaDiagnostico, identificador: string){
    const URL = this.url + `asistencial/categoria-diagnosticos/${identificador}`;
    return this._http.put<Response>(URL, dataDiagnostico).pipe(
      tap(() => this._refresh.next())
    )
  }
}
