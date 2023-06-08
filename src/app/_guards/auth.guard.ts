import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastService: ToastrService){

  }
  canActivate(): Observable<boolean> { // el guard se suscribe y desinscribe del observable automaticamente para comparar la respuesta
    return this.accountService.currentUserSource$.pipe(
      map(user => {
        if(user) return true;
        else {
          this.toastService.error("Debe iniciar sesion","Sesion finalizada");
          return false;
        }
      })
    )
  }
  
}
