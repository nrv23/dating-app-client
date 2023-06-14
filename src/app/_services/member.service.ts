import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMember } from '../interfaces/IMember';
import { getApiUrl } from '../utils/Api';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  apiUrl: string = getApiUrl();
  members: IMember[] = [];

  constructor(private http: HttpClient) { 

  }

  getMembers() {
    if(this.members.length) return of(this.members); // el of es un metodo que retorna un observable con el valor que se le pasa como parametro
    return this.http.get<IMember[]>(this.apiUrl.concat('/users')).pipe(map(response => {
      this.members = response;
      return this.members;
    }));
    
  }

  getMemberByUsername(username: string){
    let member = this.members.find(x => x.userName === username);
    if(member) return of(member);
    return this.http.get<IMember>(this.apiUrl.concat(`/users/${username}`))
      .pipe(
        map(response => {
          member = response;
          return member
        })
      );
  }

  updateUser(member: IMember) {
    return this.http.put(this.apiUrl.concat(`/users`),member)
      .pipe(
        map(response => {
          const index = this.members.indexOf(member);
          this.members[index] = {...this.members[index], ...member };
        })
      );
  }
}
