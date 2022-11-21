import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class CiudadesService {
 
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  getListadoCiudadesPorDepartamento(idDepartamento: string) {
    const URL = this.url + `departamentos/${idDepartamento}/ciudades`;
    return this._http.get<any>(URL)
  }

  getCiudad(idCiudad: string) {
    const URL = this.url + `ciudades/${idCiudad}`;
    return this._http.get<any>(URL)
  }

}