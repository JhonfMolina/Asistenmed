import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Medicamento } from 'src/app/models/parametros/medicamento.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model'

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoMedicamentos(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/medicamentos`;
    return this._http.get<Response>(URL)
  }

  getMedicamento(identificador: string) {
    const URL = this.url + `asistencial/medicamentos/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postMedicamento(dataMedicamento:Medicamento){
    const URL = this.url + `asistencial/medicamentos`;
    return this._http.post<Response>(URL, dataMedicamento).pipe(
      tap(() => this._refresh.next())
    )
  }

  putMedicamento(dataMedicamento:Medicamento, identificador: string){
    const URL = this.url + `asistencial/medicamentos/${identificador}`;
    return this._http.put<Response>(URL, dataMedicamento).pipe(
      tap(() => this._refresh.next())
    )
  }

}
