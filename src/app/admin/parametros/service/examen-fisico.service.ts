import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ExamenFisicoService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoExamenFisico(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/examen-fisico`;
    return this._http.get<Response>(URL)
  }

  getExamenFisico(identificador: string) {
    const URL = this.url + `asistencial/examen-fisico/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postExamenFisico(dataExamenFisico:any){
    const URL = this.url + `asistencial/examen-fisico`;
    return this._http.post<Response>(URL, dataExamenFisico).pipe(
      tap(() => this._refresh.next())
    )
  }

  putExamenFisico(dataExamenFisico:any, identificador: string){
    const URL = this.url + `asistencial/examen-fisico/${identificador}`;
    return this._http.put<Response>(URL, dataExamenFisico).pipe(
      tap(() => this._refresh.next())
    )
  }
}
