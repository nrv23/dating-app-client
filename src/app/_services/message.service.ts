import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiUrl } from '../utils/Api';
import { 
  getPaginatedResults,
  getPaginationHeaders
} from '../helpers/PaginationHelper';
import { IMessage } from '../interfaces/IMessage';

@Injectable({
  providedIn: 'root'
})
export class MessageService {


  baseUrl = getApiUrl();

  constructor(private http: HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    const url = getApiUrl()+'/messages/';
    return getPaginatedResults<IMessage[]>(url, params,this.http);
  }

  getMessageThread(username: string) { // conversacio entre dos personas
    return this.http.get<IMessage[]>(this.baseUrl + '/messages/thread/' + username);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<IMessage>(this.baseUrl + '/messages', {recipientUsername: username, content})
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + '/messages/' + id);
  }

}

