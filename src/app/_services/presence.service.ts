import { Injectable } from '@angular/core';
import { getHubsUrl } from '../utils/Api';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {  ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/IUser';
import { IUserResponse } from '../interfaces/IUserResponse';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = getHubsUrl();

  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: IUserResponse){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl +'/presence',{
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build(); // si pierde la conexion intentara conectar nuevamente

      this.hubConnection.start().catch(console.log);

      this.hubConnection.on("UserIsOnline", username => { // el callback username es lo que recibe como payload cuando se conecta
        this.onlineUsers$.pipe(take(1)).subscribe({
          next : usernames => {
            this.onlineUsersSource.next([...usernames,username]);
          } 
        })
      })

      this.hubConnection.on("UserIsOffline", username => { // el callback username es lo que recibe como payload cuando se conecta
        this.onlineUsers$.pipe(take(1)).subscribe({
          next : usernames => {
            this.onlineUsersSource.next(usernames.filter(u => u !== username));
          } 
        })
      });

      this.hubConnection.on("GetOnLineUsers",users => {
        this.onlineUsersSource.next(users)
      });

      this.hubConnection.on('NewMessageReceived', ({knownAs,username}) => {
        this.toastr.info(knownAs +' has send you a new Message! Click me to see it')
        .onTap // cuando se le da click al toast
        .pipe(take(1))
        .subscribe({
          next : () => this.router.navigateByUrl('/members/'+username+'?tab=Messages')
        })
      });
  }

  stopHubConnection(){
    this.hubConnection?.stop().catch(console.log);
  }
}
