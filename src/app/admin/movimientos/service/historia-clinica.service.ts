import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HistoriaClinica } from 'src/app/models/movimientos/historia-clinica.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {

  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  getHistoriaClinica(identificador: string) {
    const URL = this.url + `asistencial/historia-clinicas/${identificador}`;
    return this._http.get<Response>(URL)
  }

  getListadoConsecutivosHistoria(id_centro: number, id_paciente: number) {
    const URL = this.url + `asistencial/historia-clinicas/pacientes?asistencial_centro_medico_id=${id_centro}&asistencial_paciente_id=${id_paciente}`;
    return this._http.get<Response>(URL)
  }

  postHistoriaClinica(dataHistoriaClinica:HistoriaClinica){
    const URL = this.url + `asistencial/historia-clinicas`;
    return this._http.post<Response>(URL, dataHistoriaClinica)
  }

}
