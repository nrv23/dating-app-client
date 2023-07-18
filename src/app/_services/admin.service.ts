import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiUrl } from '../utils/Api';
import { Observable, map } from 'rxjs';
import { User } from '../interfaces/IUser';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = getApiUrl();
  
  constructor(private httpClient: HttpClient) {


  }
  
  getUsersWithRoles() : Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl.concat('/admin/users-with-roles'));
  }

  updateUserRoles(username: string, roles: string[]){
    // admin/edit-roles/
    return this.httpClient.post<string[]>(this.baseUrl.concat('/admin/edit-roles/'+username+'?roles='+roles),{});
  }

}
