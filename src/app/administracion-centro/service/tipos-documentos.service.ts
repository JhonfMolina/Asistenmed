import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TipoDocumento } from 'src/app/models/parametros/tipo-documento.model';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class TiposDocumentosService {

  private _refresh = new Subject<void>();
  public url: string = environment.URL_BASE;
  constructor(private _http: HttpClient) { }

  get refresh() {
    return this._refresh;
  }

  getListadoTipoDocumentos(centro: any, estado:Array<number>) {
    let param = new HttpParams({fromObject: {'estados[]': estado}});
    const URL = this.url + `asistencial/centros-medicos/${centro}/tipo-documentos`;
    return this._http.get<Response>(URL, {params: param})
  }

  getTipoDocumento(identificador:string) {
    const URL = this.url + `asistencial/tipo-documentos/${identificador}`;
    return this._http.get<Response>(URL)
  }

  postTipoDocumento(dataTipoDocumento:TipoDocumento){
    console.log(dataTipoDocumento);
    
    const URL = this.url + `asistencial/tipo-documentos`;
    return this._http.post<Response>(URL, dataTipoDocumento).pipe(
      tap(() => this._refresh.next())
    )
  }

  putTipoDocumento(dataTipoDocumento:TipoDocumento, identificador: string){
    const URL = this.url + `asistencial/tipo-documentos/${identificador}`;
    return this._http.put<Response>(URL, dataTipoDocumento).pipe(
      tap(() => this._refresh.next())
    )
  }
}
