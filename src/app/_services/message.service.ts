import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiUrl, getHubsUrl } from '../utils/Api';
import {
  getPaginatedResults,
  getPaginationHeaders
} from '../helpers/PaginationHelper';
import { IMessage } from '../interfaces/IMessage';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { IUserResponse } from '../interfaces/IUserResponse';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private hubsConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<IMessage[]>([]);

  baseUrl = getApiUrl();
  hubsUrl = getHubsUrl();
  messageThreadSource$ = this.messageThreadSource.asObservable();


  constructor(private http: HttpClient) { }


  createHubConnection(user: IUserResponse, otherUsername: string) {
    this.hubsConnection = new HubConnectionBuilder()
      .withUrl(this.hubsUrl + '/message?user=' + otherUsername, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubsConnection.start().catch(console.log);

    this.hubsConnection.on("ReceivedMessageThread", messages => { // el callback username es lo que recibe como payload cuando se conecta
      this.messageThreadSource.next(messages);
    });

    this.hubsConnection.on("NewMessage", message => { // el callback username es lo que recibe como payload cuando se conecta
      this.messageThreadSource$.pipe(take(1)).subscribe({
        next: messages => {
          this.messageThreadSource.next([...messages,message]);
        }
      });
    });
  }

  stopHubConnection() {
    if (this.hubsConnection) {
      this.messageThreadSource.next([]);
      this.hubsConnection.stop();
    }
  }
  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    const url = getApiUrl() + '/messages/';
    return getPaginatedResults<IMessage[]>(url, params, this.http);
  }

  getMessageThread(username: string) { // conversacio entre dos personas
    return this.http.get<IMessage[]>(this.baseUrl + '/messages/thread/' + username);
  }

  async sendMessage(username: string, content: string) {
    return this.hubsConnection?.invoke('SendMessage',{
      recipientUsername: username, content
    })
    .catch(console.log);
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + '/messages/' + id);
  }

}

