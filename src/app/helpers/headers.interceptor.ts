import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../client/auth/service/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  public authToken: any;
  constructor(private _auth: AuthService, private _router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const authToken = this._auth.getAuthorizationToken();

    let request = req;

    if (
      this._router.url.includes('login') ||
      this._router.url.includes('register')
    ) {
      return next.handle(req).pipe(catchError((error) =>  throwError(error)));
    }

    if (authToken) {
      request = req.clone({
        headers: req.headers
          .set('Authorization', `Bearer ${authToken}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json'),
      });
    }
    return next.handle(request);
  }
}
