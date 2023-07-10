import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../interfaces/ILogin';
import { BehaviorSubject, map } from 'rxjs';
import { IUserResponse } from '../interfaces/IUserResponse';
import { save, remove } from '../utils/Storage';
import { IRegister } from '../interfaces/IRegister';
import { getApiUrl } from '../utils/Api';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private currentUserSource = new BehaviorSubject<IUserResponse | null>(null);

  currentUserSource$ = this.currentUserSource.asObservable(); // esta propiedad es a donde los comppnentes se suscriben
  apiUrl: string = getApiUrl();

  constructor(private http: HttpClient) { }


  login(login: Login) {
    return this.http.post<IUserResponse>(this.apiUrl.concat('/accounts/login'), login)
      .pipe(
        map(response => {

          const user = response
          if (user) {
            save("user", JSON.stringify(user));
            this.setCurrentUser(user);
          }
          return user;
        })
      );
  }

  register(register: IRegister) {
    return this.http.post<IUserResponse>(this.apiUrl.concat('/accounts/register'), register).pipe(
      map(response => {
        const user = response
        if (user) {
          save("user", JSON.stringify(user));
          this.setCurrentUser(user);
        }

        return user;
      })
    );
  }

  /*setCurrentUser(user: IUserResponse | null) {
    this.currentUserSource.next(user);
  } */

  setCurrentUser(user: IUserResponse | null) {

    if (user) {
      //user.roles = [];
      const roles = this.getDecodedToken(user.token).role;
      const rolesForUser = Array.isArray(roles) ? roles : [roles];
      user.roles = rolesForUser;
      this.currentUserSource.next(user);
    } else {
      this.currentUserSource.next(null);
    }

  }

  logout() {
    remove("user");
    this.setCurrentUser(null);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }


}