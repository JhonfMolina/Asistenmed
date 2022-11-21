import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { tap } from "rxjs/operators";
import { NotificationService } from "src/app/services/notification.service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
 
  public url: string = environment.URL_BASE;
  constructor(
    private _http: HttpClient, 
    public _mensaje: NotificationService,
    private cookieService: CookieService) { }

  loginUsuario(email: string, password: string){
    const URL = this.url + `login`;
    return this._http.post<any>(URL, {email, password}).pipe(
      tap((resp:any) =>{
        this.setAuthorizationToken(resp.data);
        this._mensaje.mensajeInfo('Bienvenido a su Software de gestión AsistenMed.')
      }
       )
    )
  }

  setAuthorizationToken(token: string) {
    localStorage.setItem('_tokenizationASM', token)
  }

  getAuthorizationToken(){
    return localStorage.getItem('_tokenizationASM');
  }

  deleteAuthorizationToken() {
    localStorage.removeItem('_tokenizationASM');
  }


  setCookieCentroMedico(storeCenter: any) {
    this.cookieService.set('storeCenter', JSON.stringify(storeCenter))
  }

  getCookieCentroMedico(){
    return JSON.parse(this.cookieService.get('storeCenter'));
  }

  deleteCookieCentroMedico() {
    this.cookieService.deleteAll();
  }

}