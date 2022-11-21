import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../client/auth/service/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class TokenizationGuard implements CanActivate {
  constructor(
    private _auth: AuthService, 
    private _router: Router,
    private _mensaje: NotificationService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this._auth.getAuthorizationToken()) {
        this._router.navigate(['/login']);
        this._mensaje.mensajeError('No estas autorizado para realizar esta acción.');
        return false;
      }
    return true;
  }
  
}
