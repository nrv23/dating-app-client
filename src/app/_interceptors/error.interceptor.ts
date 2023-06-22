import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(

      catchError((err: HttpErrorResponse) => {
        if (err) {
          console.log({err});
          switch (err.status) {
            case 400:
              if (err.error.errors) {
                const errors: string[] = [];
                for (const key of Object.keys(err.error.errors)) {
                  
                  errors.push(err.error.errors[key]);
                }
                throw errors.flat(); // esto es lo que devuelve el observable como error
                // this.toastr.error(errors.toString().replace(',',''),"Ha ocurrido un error");
              } else {
                this.toastr.error(err.error, '' + err.status);
              }
              break;

            case 401:
              this.toastr.error('Sin autorizacion', '' + err.status);
              break;

            case 404:
              this.router.navigateByUrl("/not-found");
              break;

            case 500:
              const navigationExtras: NavigationExtras = {
                state: {
                  error: err.error
                }
              }
              this.router.navigateByUrl("/server-error", navigationExtras);
              break;

            default:
              this.toastr.error("Ha habido un error inesperado");
              console.log(err);
              break;
          }
        }

        throw err;
      })
    );
  }
}
