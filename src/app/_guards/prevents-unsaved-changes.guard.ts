import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventsUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {
  /*
    este guard lo que hace es decidir si se va pemitir que se navege de un componente a otro.
    En este caso navegar de MemberEditComponent a otro componente, validando que si tiene informacion sin guardar entonces pregunte antes de 
    navegar hacia otro componente 
  */
  canDeactivate(
    component: MemberEditComponent): boolean {
    
      if(component.editForm?.dirty){
        return confirm("Are you sure you want to continue? Any unsaved changes will be lost")
      }

      return true;
  }
  
}
