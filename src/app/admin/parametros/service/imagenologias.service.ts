import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Imagenologia } from 'src/app/models/parametros/imagenologia.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model'

@Injectable({
  providedIn: 'root'
})
export class ImagenologiasService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoImagenologias(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/imagenologias`;
    return this._http.get<Response>(URL)
  }

  getImagenologia(identificador: string) {
    const URL = this.url + `asistencial/imagenologias/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postImagenologia(dataImagenologia:Imagenologia){
    const URL = this.url + `asistencial/imagenologias`;
    return this._http.post<Response>(URL, dataImagenologia).pipe(
      tap(() => this._refresh.next())
    )
  }

  putImagenologia(dataImagenologia:Imagenologia, identificador: string){
    const URL = this.url + `asistencial/imagenologias/${identificador}`;
    return this._http.put<Response>(URL, dataImagenologia).pipe(
      tap(() => this._refresh.next())
    )
  }

}
