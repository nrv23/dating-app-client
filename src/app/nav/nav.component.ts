import { Component, OnInit } from '@angular/core';
import { Login } from '../interfaces/ILogin';
import { AccountService } from '../_services/account.service';
import { IUserResponse } from '../interfaces/IUserResponse';
import { Observable, of } from 'rxjs';

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

  constructor(private accountService: AccountService) {

    this.currentUser$ = this.accountService.currentUserSource$;
   }

  ngOnInit(): void {

  }

  login(e: Event) {
    e.preventDefault();

    this.accountService.login(this.model)
    .subscribe({
      next: response => {
      
      },
      error: err => {
        console.log(err);
      },
      complete: () => console.log("Completado")
    })
  }
  logout() {
    this.accountService.logout();
  }

}
