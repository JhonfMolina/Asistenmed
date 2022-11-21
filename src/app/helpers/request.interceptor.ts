import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { ProgressBarService } from '../services/progress-bar.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  errorMessage: string = '';
  constructor(
    private _mensaje: NotificationService,
    private _progressBar: ProgressBarService,
    public _router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this._progressBar.activarLoader();

    return next.handle(req).pipe(
      map((respuesta: HttpEvent<any>) => {
        if (respuesta instanceof HttpResponse) {
          if (respuesta.status == 200 && respuesta.body) {
            !environment.production ? console.log(respuesta.body) : false;
            if (respuesta.body.data instanceof Array) {
              if (respuesta.body.data.length == 0) {
                this._mensaje.mensajeInfo(`No se encontraron registros, --${respuesta.body.message}--`);
              }
            }
            this._progressBar.desactivarLoader();
          }
        }
        return respuesta;
      }),
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            this.errorMessage = error.error.message;          
            break;
          case 401:
            this.errorMessage = 'No estas autorizado para realizar esta acción.';
            this._router.navigate(['/login']);
            break;
          case 404:
            this.errorMessage = 'El contenido que solicitas no se encuentra disponible.';
            break;
          case 500:
            this.errorMessage = 'La solicitud al servidor, no pudo ser completada.';
            break;
          default:
            break;
        }
        console.log(error);
        this._mensaje.mensajeError(this.errorMessage);
        this._progressBar.desactivarLoader();
        return throwError(`Estado: ${error.status}, Mensaje: ${this.errorMessage}, url: ${error.url}`);
        // return throwError(error);
      })
    );
  }
}
