import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Servicio } from 'src/app/models/parametros/servicio.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosMedicosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoServicios() {
    const URL = this.url + `asistencial/centros-medicos/1/servicios`;
    return this._http.get<Response>(URL)
  }

  getServicios(identificador:string) {
    const URL = this.url + `asistencial/servicios/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postServicios(dataServicios:Servicio){
    const URL = this.url + `asistencial/servicios`;
    return this._http.post<Response>(URL, dataServicios).pipe(
      tap(() => this._refresh.next())
    )
  }

  putServicios(dataServicios:Servicio, identificador: string){
    const URL = this.url + `asistencial/servicios/${identificador}`;
    return this._http.put<Response>(URL, dataServicios).pipe(
      tap(() => this._refresh.next())
    )
  }
}
