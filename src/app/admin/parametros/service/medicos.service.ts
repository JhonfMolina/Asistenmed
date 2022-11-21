import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Medico } from 'src/app/models/parametros/medico.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoMedicos(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/medicos`;
    return this._http.get<Response>(URL)
  }

  getMedico(identificador: string) {
    const URL = this.url + `asistencial/medicos/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postMedico(dataMedico:Medico){
    const URL = this.url + `asistencial/medicos`;
    return this._http.post<Response>(URL, dataMedico).pipe(
      tap(() => this._refresh.next())
    )
  }

  putMedico(dataMedico:Medico, identificador: string){
    const URL = this.url + `asistencial/medicos/${identificador}`;
    return this._http.put<Response>(URL, dataMedico).pipe(
      tap(() => this._refresh.next())
    )
  }
}
