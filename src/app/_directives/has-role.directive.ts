import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { IUserResponse } from '../interfaces/IUserResponse';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]' // *appHasRole='["Admin","Thing"]'
})
export class HasRoleDirective implements OnInit {

  @Input() appHasRole : string[] = [];
  user: IUserResponse = {} as IUserResponse;

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private accountService: AccountService) {
    this.accountService.currentUserSource$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user = user;
      }
    })
   }
  ngOnInit(): void {
    // clear view if no roles
    if (!this.user?.roles || this.user == null) {
      this.viewContainerRef.clear();
      return;
    }

    if (this.user?.roles.some(r  => this.appHasRole.includes(r))) { // validar si tiene los permisos necesarios
      this.viewContainerRef.createEmbeddedView(this.templateRef); // carga el html
    } else {
      this.viewContainerRef.clear(); // limpia el html para que no sea visible
    }
  }

}
