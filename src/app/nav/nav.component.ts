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
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: Login = {
    username: '',
    password: '',
  };

  //loggedIn: boolean = false;
  currentUser$: Observable<IUserResponse | null> = of(null);
  isAdmin: boolean = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.currentUser$ = this.accountService.currentUserSource$;
  }

  ngOnInit(): void {
  
    
  }

  login(e: Event) {
    e.preventDefault();

    this.accountService.login(this.model).subscribe({
      next: user => {
        this.router.navigateByUrl('/members');
        this.model = {
          username : '',
          password: ''
        };
      },
      error: (err) => {
        console.log(err);

      },
      complete: () => console.log('Completado'),
    });
  }

  setIsAdmin(user: IUserResponse) {
    if (user) {
      if (user.roles.includes("Admin") || user.roles.includes("Moderator")) this.isAdmin = true;
    }
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
