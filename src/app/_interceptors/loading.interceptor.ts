import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { BusyService } from '../_services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor { // controlar que se muestre el spinner cuando se hace una peticion http

  constructor(private spinner: BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinner.busy(); // activa el spinner

    return next.handle(request).pipe(
      delay(1000), // esperar un segundo
      finalize( () => { // cuando la peticion traiga la respuesta de vuelta
        this.spinner.idle(); // esconde el spinner
      })  
    );
  }
}
