import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenesMedicasService {

  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  getOrdenMedica(centro_id: string) {
    const URL = this.url + `asistencial/centros-medicos/${centro_id}/ordenes-medicas`;
    return this._http.get<Response>(URL)
  }

  postOrdenMedica(dataOrden:any){
    const URL = this.url + `asistencial/ordenes-medicas`;
    return this._http.post<Response>(URL, dataOrden)
  }

}
