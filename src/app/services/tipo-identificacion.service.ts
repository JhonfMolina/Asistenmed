import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class TipoIdentificacionService {
 
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  getListadoTipoIdentificacion() {
    const URL = this.url + `tipo-identificaciones`;
    return this._http.get<any>(URL)
  }
  
}