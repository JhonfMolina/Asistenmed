import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Examen } from 'src/app/models/parametros/examen.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ExamenesService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoExamenes(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/examenes`;
    return this._http.get<Response>(URL)
  }

  getExamen(identificador: string) {
    const URL = this.url + `asistencial/examenes/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postExamen(dataExamen:Examen){
    const URL = this.url + `asistencial/examenes`;
    return this._http.post<Response>(URL, dataExamen).pipe(
      tap(() => this._refresh.next())
    )
  }

  putExamen(dataExamen:Examen, identificador: string){
    const URL = this.url + `asistencial/examenes/${identificador}`;
    return this._http.put<Response>(URL, dataExamen).pipe(
      tap(() => this._refresh.next())
    )
  }
}
