import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMember } from '../interfaces/IMember';
import { getApiUrl } from '../utils/Api';
import { map, of, take } from 'rxjs';
import { PaginatedResults } from '../interfaces/IPagination';
import { UserParams } from '../models/IUserParams';
import { AccountService } from './account.service';
import { IUserResponse } from '../interfaces/IUserResponse';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  apiUrl: string = getApiUrl();
  members: IMember[] = [];
  memberCache = new Map();
  userParams: UserParams | undefined;
  user: IUserResponse | undefined;

  constructor(private http: HttpClient, private accountService: AccountService) {

    this.accountService.currentUserSource$.pipe(take(1))
      .subscribe({
        next: user => {
          if (user) {
            this.userParams = new UserParams(user);
            this.user = user;
          }
        }
      })
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams(){
    if(this.user){
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }

    return;
  }

  getMembers(userParams: UserParams) {

    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);
    // if(this.members.length) return of(this.members); // el of es un metodo que retorna un observable con el valor que se le pasa como parametro
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append("minAge", userParams.minAge);
    params = params.append("maxAge", userParams.maxAge);
    params = params.append("gender", userParams.gender);
    params = params.append("orderBy", userParams.orderBy);

    const url = this.apiUrl.concat('/users');
    return this.getPaginatedResults<IMember[]>(url, params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMemberByUsername(username: string) {
    let member = [...this.memberCache.values()]
      .reduce((arr, element) => arr.concat(element.result), [])
      .find((member: IMember) => member.userName === username);

    if (member) return of(member);

    return this.http.get<IMember>(this.apiUrl.concat(`/users/${username}`))
      .pipe(
        map(response => {
          member = response;
          return member
        })
      );
  }

  updateUser(member: IMember) {
    return this.http.put(this.apiUrl.concat(`/users`), member)
      .pipe(
        map(response => {
          const index = this.members.indexOf(member);
          this.members[index] = { ...this.members[index], ...member };
        })
      );
  }

  setMainPhoto(id: number) {
    return this.http.put<string>(this.apiUrl.concat(`/users/set-main-photo/${id}`), {})
      .pipe(
        map(() => {
          return 'Se ha asignado como la foto de perfil';
        })
      );
  }

  deletePhoto(id: number) {
    //https://localhost:5001/api/users/lois
    return this.http.delete<string>(this.apiUrl.concat(`/users/delete-photo/${id}`), {})
      .pipe(
        map(() => {
          return 'Se ha eliminado la foto';
        })
      );
  }

  addLike(username: string) {
    return this.http.post(this.apiUrl + '/likes/' + username, {})
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {

    let params = this.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    const url = `${this.apiUrl}/likes?predicate=${predicate}`;
    return this.getPaginatedResults(url,params);
  }


  private getPaginatedResults<T>(url: string, params: HttpParams) {
    const pagintedResults: PaginatedResults<T> = new PaginatedResults<T>;
    return this.http.get<T>(url, {
      observe: 'response',
      params
    }).pipe(map(response => {
      if (response.body) {
        pagintedResults.result = response.body;
      }

      const pagination = response.headers.get("Pagination");
      if (pagination) {
        pagintedResults.pagination = JSON.parse(pagination);
      }

      return pagintedResults;
    }));
  }

  private getPaginationHeaders(page: number, itemsPerPage: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);

    return params;
  }

}
