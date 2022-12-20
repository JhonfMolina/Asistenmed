import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConsultaMedica } from 'src/app/models/movimientos/consulta-medica.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaMedicaService {

  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  getConsultaMedica(identificador: string) {
    const URL = this.url + `asistencial/consulta-medicas${identificador}`;
    return this._http.get<Response>(URL)
  }

  getListadoConsultaMedica(id_centro: string) {
    const URL = this.url + `asistencial/centros-medicos/${id_centro}/consulta-medicas`;
    return this._http.get<Response>(URL)
  }

  postConsultaMedica(dataHistoriaClinica:ConsultaMedica){
    const URL = this.url + `asistencial/consulta-medicas`;
    return this._http.post<Response>(URL, dataHistoriaClinica)
  }

}