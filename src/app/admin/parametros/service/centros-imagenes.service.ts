import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CentroImagen } from 'src/app/models/parametros/centro-imagen.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model'

@Injectable({
  providedIn: 'root'
})
export class CentrosImagenesService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoCentrosImagenes(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/centro-imagenes`;
    return this._http.get<Response>(URL)
  }

  getCentroImagen(identificador: string) {
    const URL = this.url + `asistencial/centro-imagenes/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postCentroImagen(dataCentroImagen: CentroImagen){
    const URL = this.url + `asistencial/centro-imagenes`;
    return this._http.post<Response>(URL, dataCentroImagen).pipe(
      tap(() => this._refresh.next())
    )
  }

  putCentroImagen(dataCentroImagen: CentroImagen, identificador: string){
    const URL = this.url + `asistencial/centro-imagenes/${identificador}`;
    return this._http.put<Response>(URL, dataCentroImagen).pipe(
      tap(() => this._refresh.next())
    )
  }

}
