import { Injectable } from '@angular/core';
import { getHubsUrl } from '../utils/Api';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {  ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/IUser';
import { IUserResponse } from '../interfaces/IUserResponse';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = getHubsUrl();

  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService) { }

  createHubConnection(user: IUserResponse){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl +'/presence',{
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build(); // si pierde la conexion intentara conectar nuevamente

      this.hubConnection.start().catch(console.log);

      this.hubConnection.on("UserIsOnline", username => { // el callback username es lo que recibe como payload cuando se conecta
        this.toastr.info(`${username} has connected`);
      })

      this.hubConnection.on("UserIsOffline", username => { // el callback username es lo que recibe como payload cuando se conecta
        this.toastr.warning(`${username} has disconnected`);
      });

      this.hubConnection.on("GetOnLineUsers",users => {
        console.log({users});
        this.onlineUsersSource.next(users)
      });
  }

  stopHubConnection(){
    this.hubConnection?.stop().catch(console.log);
  }
}
