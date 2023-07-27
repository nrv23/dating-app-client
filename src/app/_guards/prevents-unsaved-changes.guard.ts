import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { ConfirmService } from '../_services/confirm.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreventsUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {
  /*
    este guard lo que hace es decidir si se va pemitir que se navege de un componente a otro.
    En este caso navegar de MemberEditComponent a otro componente, validando que si tiene informacion sin guardar entonces pregunte antes de 
    navegar hacia otro componente 
  */

  /**
   *
   */
  constructor(private confirmService: ConfirmService) {

  }
  canDeactivate(
    component: MemberEditComponent): Observable<boolean> {

    if (component.editForm?.dirty) {
      return this.confirmService.confirm();
    }

    return of(true);
  }

}
