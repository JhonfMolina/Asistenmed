import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class DepartamentosService {
 
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  getListadoDepartamentos() {
    const URL = this.url + `departamentos`;
    return this._http.get<any>(URL)
  }

  getDepartamento(idDepartamento: string) {
    const URL = this.url + `departamentos/${idDepartamento}`;
    return this._http.get<any>(URL)
  }

}