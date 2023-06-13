import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMember } from '../interfaces/IMember';
import { getApiUrl } from '../utils/Api';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  apiUrl: string = getApiUrl();

  constructor(private http: HttpClient) { 

  }

  getMembers() {
    return this.http.get<IMember[]>(this.apiUrl.concat('/users'));
  }

  getMemberByUsername(username: string){
    return this.http.get<IMember>(this.apiUrl.concat(`/users/${username}`));
  }
}
