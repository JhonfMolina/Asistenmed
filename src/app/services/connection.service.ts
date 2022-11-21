import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  constructor(public _mensaje: NotificationService) {
   
    fromEvent(window, 'offline')
      .pipe(debounceTime(10))
      .subscribe(() => {
        this._mensaje.mensajeInfo(
          '¡Ups! Parece que hay un problema con su conexión de red.'
        );
      });

    fromEvent(window, 'online')
      .pipe(debounceTime(10))
      .subscribe(() => {
        this._mensaje.mensajeInfo(
          '¡Ok! problema con su conexión de red solucionado.'
        );
      });
  }
}
