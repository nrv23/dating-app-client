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
    this.accountService.currentUserSource$.subscribe(user => {
        if(user) {
          console.log("existe usuario")
          this.user = user;
        };
    })
   }
  ngOnInit(): void {
    console.log(this.appHasRole)
    console.log(this.user.roles)
    // clear view if no roles
    if (!this.user == null || !this.user?.roles ) {
      this.viewContainerRef.clear();
      return;
    }


    if (this.user?.roles.some(r  => this.appHasRole.includes(r))) { // validar si tiene los permisos necesarios
      console.log("entro")
      this.viewContainerRef.createEmbeddedView(this.templateRef); // carga el html
    } else {
      console.log(" no entro")
      this.viewContainerRef.clear(); // limpia el html para que no sea visible
    }
  }

}
