import { Component, OnInit } from '@angular/core';
import { Login } from '../interfaces/ILogin';
import { AccountService } from '../_services/account.service';
import { IUserResponse } from '../interfaces/IUserResponse';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: Login = {
    username: "",
    password: ""
  };

  //loggedIn: boolean = false;
  currentUser$: Observable<IUserResponse | null> = of(null);

  constructor(private accountService: AccountService, private router: Router, private toastr: ToastrService) {

    this.currentUser$ = this.accountService.currentUserSource$;
   }

  ngOnInit(): void {

  }

  login(e: Event) {
    e.preventDefault();

    this.accountService.login(this.model)
    .subscribe({
      next: () => this.router.navigateByUrl("/members"),
      error: err => {
        console.log(err);
        const { error } = err;
        if(error.msg) {
          this.toastr.error(error.msg,"Ha ocurrido un error");
        }

        if(error.errors){
          const errors : string[] = [];  
          for (const key of Object.keys(error.errors)) {
            errors.push(error.errors[key]);
          }
          this.toastr.error(errors.toString().replace(',',''),"Ha ocurrido un error");
        }
          
      },
      complete: () => console.log("Completado")
    })
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }

}
