import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evolucion } from 'src/app/models/movimientos/historia-clinica.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class EvolucionesService {

  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  postEvolucion(dataEvolucion:Evolucion) {
    const URL = this.url + `asistencial/historia-clinicas/evoluciones`;
    return this._http.post<Response>(URL, dataEvolucion)
  }

  getListadoEvolucionMedica(id_historia: string, id_centro: string) {
    const URL = this.url + `asistencial/historia-clinicas/${id_historia}/evoluciones?asistencial_centro_medico_id=${id_centro}`;
    return this._http.get<Response>(URL)
  }

}
