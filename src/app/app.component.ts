
import { Component, OnInit } from '@angular/core';
import { User } from './interfaces/IUser';
import { AccountService } from './_services/account.service';
import { IUserResponse } from './interfaces/IUserResponse';
import { get } from './utils/Storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'client';
  user: User[] = [];

  constructor(private accountService: AccountService) {

  }

  ngOnInit(): void {

    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = get("user");
    if(!userString) return;
    const User : IUserResponse = JSON.parse(userString);
    this.accountService.setCurrentUser(User)
  }
}
