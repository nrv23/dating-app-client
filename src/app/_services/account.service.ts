import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Login } from '../interfaces/ILogin';
import { BehaviorSubject, map } from 'rxjs';
import { IUserResponse } from '../interfaces/IUserResponse';
import { save,remove } from '../utils/Storage';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private currentUserSource = new BehaviorSubject<IUserResponse | null>(null);
  currentUserSource$ = this.currentUserSource.asObservable(); // esta propiedad es a donde los comppnentes se suscriben
  constructor(private http: HttpClient) { }


  login(login: Login) {
    return this.http.post<IUserResponse>(environment.baseUrl.concat('/accounts/login'), login)
      .pipe(
        map(response => {

          const user = response
          if (user) {
            save("user", JSON.stringify(user));
            this.setCurrentUser(user);
          }
        })
      );
  }

  setCurrentUser(user: IUserResponse | null) {
    this.currentUserSource.next(user);
  }

  logout() {
    remove("user");
    this.setCurrentUser(null);
  }
}
