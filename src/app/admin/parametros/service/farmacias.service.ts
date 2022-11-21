import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Farmacia } from 'src/app/models/parametros/farmacia.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model'

@Injectable({
  providedIn: 'root'
})
export class FarmaciasService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoFarmacias(centro: any) {
    const URL = this.url + `asistencial/centros-medicos/${centro}/farmacias`;
    return this._http.get<Response>(URL)
  }

  getFarmacia(identificador: string) {
    const URL = this.url + `asistencial/farmacias/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postFarmacia(dataFarmacia:Farmacia){
    const URL = this.url + `asistencial/farmacias`;
    return this._http.post<Response>(URL, dataFarmacia).pipe(
      tap(() => this._refresh.next())
    )
  }

  putFarmacia(dataFarmacia:Farmacia, identificador: string){
    const URL = this.url + `asistencial/farmacias/${identificador}`;
    return this._http.put<Response>(URL, dataFarmacia).pipe(
      tap(() => this._refresh.next())
    )
  }

}
